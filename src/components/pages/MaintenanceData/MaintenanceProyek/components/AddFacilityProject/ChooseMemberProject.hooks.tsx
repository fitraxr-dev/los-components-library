import { useEffect, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import { projectMemberTableHeader } from '../../FormPage/ProjectInformation/ProjectInformation.constants';
import { useGetAllMember } from '../../hooks/useGetAllMember';
import { useGetProjectMember, useSaveProjectMember } from '../../hooks/useProjectMember';
import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface ChooseMemberProjectProps {
  id: string;
  listPayload: any;
  detailProyek?: any;
}

const useChooseMemberProject = (props: ChooseMemberProjectProps) => {
  const modalId = MODAL.ADD_CHOOSE_MEMBER_PROJECT_MODAL;
  const modal = useModal(modalId);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { id, listPayload, detailProyek } = props;
  const isApproval = id ? id?.includes('MNTP-') : false;
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);

  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomerList, setSelectedCustomerList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [projectMemberDataMapped, setProjectMemberDataMapped] = useState([]);

  const tableHeaderAddProjectMember: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedRequest?.customerId === data.customerId,
      key: 'checkbox',
      onSelectChange: (data) => handleSingleSelect(data),
      sx: { minWidth: '4%' },
      type: 'checkbox' as const,
    },
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'customerId',
      label: 'Customer ID',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'cif',
      label: 'CIF',
      render: (data) => data.cif || '-',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'institutionType',
      label: 'Institution Type',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'customerName',
      label: 'Nama Customer',
      sx: {
        minWidth: '10vw',
      },
    },
  ];

  // Single selection handler
  const handleSingleSelect = (data: any) => {
    // If clicking the same item, deselect it
    if (selectedRequest?.customerId === data.customerId) {
      setSelectedRequest(null);
    } else {
      setSelectedRequest(data);
    }
  };

  // ==== Project Member Table
  const [projectMemberPage, setProjectMemberPage] = useState(1);
  const [projectMemberPageSize, setProjectMemberPageSize] = useState(10);
  const [projectMemberFilter, setProjectMemberFilter] = useState({
    filter: {
      institutionTypes: [],
      projectCode: idConvert ?? null,
    },
    page: {
      itemPerPage: projectMemberPageSize,
      noPage: projectMemberPage,
    },
    searchDetail: {
      key: '',
      value: '',
    },
    sortList: {},
  });

  // API List
  const { data: projectMemberData, isFetching: isLoadingProjectMember } = useGetProjectMember({
    filter: {
      institutionTypes: projectMemberFilter?.filter?.institutionTypes?.length > 0
        ? projectMemberFilter.filter.institutionTypes.map((item) => {
          return typeof item === 'string' ? item : item?.value || item?.key;
        })
        : null,
      projectCode: idConvert ?? null,
    },
    page: {
      itemPerPage: projectMemberPageSize,
      noPage: projectMemberPage,
    },
    searchDetail: projectMemberFilter?.searchDetail ?? {
      key: '',
      value: '',
    },
    sortList: projectMemberFilter?.sortList ?? {},
  });

  // SearchBy data
  const { data: projectMemberSearchByOptions } = useGetParameterList('searchByMember', { label: 'value1', value: 'value2' });

  // SortBy data
  const { data: sortByProjectMemberOptions } = useGetParameterList('sortByMember', { label: 'value1', value: 'value2' });

  // institutionType data
  const { data: institutionTypeOptions } = useGetParameterList('institutionType', { label: 'value1', value: 'key' });

  const projectMemberFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectMemberOptions,
      type: 'sort',
    },
    {
      key: 'institutionTypes',
      label: 'Institution Type',
      options: institutionTypeOptions,
      type: 'multiple-autocomplete',
    },
  ];

  // API List All Members
  const [filter, setFilter] = useState({
    filter: {
      id: idConvert,
    },
    page: {
      itemPerPage: 20,
      noPage: 1,
    },
    searchDetail: {
      key: 'debtorName',
      value: '',
    },
  });

  // Fix the mapping logic
  useEffect(() => {
    if (projectMemberData?.data?.contents && institutionTypeOptions) {
      const projectMemberDataTemp = projectMemberData.data.contents.map((item) => {
        const foundInstitution = institutionTypeOptions.find(
          (institution) => institution.key === item.institutionType || institution.value === item.institutionType
        );

        return {
          ...item,
          institutionType: foundInstitution ? foundInstitution.label : item.institutionType,
        };
      });
      setProjectMemberDataMapped(projectMemberDataTemp);
    } else if (projectMemberData?.data?.contents) {
      // If institutionTypeOptions is not available, use raw data
      setProjectMemberDataMapped(projectMemberData.data.contents);
    }
  }, [projectMemberData, institutionTypeOptions]);

  // Update filter ketika searchValue berubah
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      filter: {
        id: idConvert,
      },
      searchDetail: {
        key: 'debtorName',
        value: searchValue,
      },
    }));
  }, [idConvert, searchValue]);

  const { data: members } = useGetAllMember(filter);

  const handleSelectCustomer = (value: any) => {
    if (value !== undefined && members?.data?.contents) {
      const memberData = members.data.contents.find((member) => member.debtorName === value);

      if (!memberData?.debtorId) {
        console.warn(`Customer "${value}" not found or missing debtorId`);
        return;
      }

      const customerAlreadyExist = selectedCustomerList.some((item) => item.name === value);

      if (!customerAlreadyExist) {
        const selectedCustomer = {
          debtorId: memberData.debtorId,
          name: value,
        };
        setSelectedCustomerList((prev) => [...prev, selectedCustomer]);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // API SAVE - Updated to handle selected members from API
  const { mutate: saveMember, isPending: isSaveLoading } = useSaveProjectMember({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (response, variable) => {
      queryClient.invalidateQueries({ queryKey: ['project-member-list', listPayload]});

      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modalId);

          // Cek jika URL mengandung PRJ dan update session storage
          const currentUrl = window.location.href;
          if (currentUrl.includes('PRJ-')) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('step', '1');

              // Update maintenance-proyek dengan bucketProcessId dari response
              const bucketProcessId = response?.data?.content?.bucketProcessId;
              if (bucketProcessId) {
                console.log('Setting bucketProcessId:', bucketProcessId);
                sessionStorage.setItem('maintenance-proyek', bucketProcessId);
              } else {
                console.log('bucketProcessId not found in response');
              }
            }
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleAdd = () => {
    if (!selectedRequest) {
      showNiceModalV2({
        title: 'Tidak ada member yang dipilih untuk disimpan',
        type: 'error',
      });
      return;
    }

    closeNiceModal(modalId);

    // Open AddFacilityProject modal with selected member data and detailProyek
    NiceModal.show(MODAL.ADD_FACILITY_PROJECT_MODAL, {
      detailProyek: detailProyek,
      id: id,
      listPayload: listPayload,
      selectedMember: selectedRequest,
    });
  };

  useEffect(() => {
    if (members?.data?.contents) {
      const customerListTemp = members.data.contents.map((member) => ({
        label: member.debtorName,
        value: member.debtorId,
      }));
      setCustomerList(customerListTemp);
    }
  }, [members]);

  const tableHeaderProjectMember: TableHeader[] = [
    ...projectMemberTableHeader,
  ];

  return {
    customerList,
    filter,
    handleAdd,
    handleSearchChange,
    handleSelectCustomer,
    isLoadingProjectMember,
    isSaveLoading,
    modal,
    modalId,
    projectMemberData,
    projectMemberDataMapped,
    projectMemberFilter,
    projectMemberFilterContentList,
    projectMemberPage,
    projectMemberPageSize,
    projectMemberSearchByOptions,
    searchValue,
    selectedCustomerList,
    selectedRequest,
    setFilter,
    setProjectMemberFilter,
    setProjectMemberPage,
    setProjectMemberPageSize,
    tableHeaderAddProjectMember,
    tableHeaderProjectMember,
    theme,
  };
};

export default useChooseMemberProject;

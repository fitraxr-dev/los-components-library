import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import { useGetAllMember } from '../../hooks/useGetAllMember';
import { useSaveProjectMember } from '../../hooks/useProjectMember';
import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface AddProjectMemberProps {
  id: string;
  listPayload: any;
}

const useAddProjectMember = (props: AddProjectMemberProps) => {
  const modalId = MODAL.ADD_PROJECT_MEMBER_MODAL;
  const modal = useModal(modalId);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { id, listPayload } = props;
  const isApproval = id ? id?.includes('MNTP-') : false;
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);

  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomerList, setSelectedCustomerList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { recordActivity } = useRecordLog();

  const tableHeaderAddProjectMember: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama Customer',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          onClick: (data) => {
            handleDeleteCustomer(data.name);
          },
        }
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
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
      value: '', // Start with empty
    },
  });

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
      // Find the member data immediately when selecting
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

  // API SAVE
  const { mutate: saveMember, isPending: isSaveLoading, data: submissionData } = useSaveProjectMember({
    onError: (error) => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (response, variables) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: response?.data?.content?.bucketProcessId || idConvert || '',
        changeAfter: JSON.stringify(variables),
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'successfully added project member',
      });

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

  const handleDeleteCustomer = (value: any) => {
    const updatedSelectedCustomerList = selectedCustomerList.filter((item) => item.name !== value);
    setSelectedCustomerList(updatedSelectedCustomerList);
  };

  const [payload, setPayload] = useState({
    data: [],
    projectCode: idConvert,
  });

  const handleAdd = () => {
    const validPayloadData = selectedCustomerList
      .filter((customer) => customer.debtorId)
      .map((customer) => ({ debtorId: customer.debtorId }));

    if (validPayloadData.length === 0) {
      showNiceModalV2({
        title: 'Tidak ada customer yang valid untuk disimpan',
        type: 'error',
      });
      return;
    }

    const finalPayload = {
      data: validPayloadData,
      projectCode: idConvert,
    };

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        saveMember(finalPayload);
      },
      submitText: 'Ya',
      title: 'Pastikan Data Sudah Sesuai',
      type: 'warning',
    });

    closeNiceModal(modalId);
  };

  useEffect(() => {
    const validPayloadData = selectedCustomerList
      .filter((customer) => customer.debtorId)
      .map((customer) => ({ debtorId: customer.debtorId }));

    setPayload((prev) => ({
      ...prev,
      data: validPayloadData,
    }));
  }, [selectedCustomerList]);

  useEffect(() => {
    if (members?.data?.contents) {
      const customerListTemp = members.data.contents.map((member) => ({
        label: member.debtorName,
        value: member.debtorId,
      }));
      setCustomerList(customerListTemp);
    }
  }, [members]);

  return {
    customerList,
    filter,
    handleAdd,
    handleSearchChange,
    handleSelectCustomer,
    isSaveLoading,
    modal,
    modalId,
    searchValue,
    selectedCustomerList,
    setFilter,
    tableHeaderAddProjectMember,
    theme,
  };
};

export default useAddProjectMember;

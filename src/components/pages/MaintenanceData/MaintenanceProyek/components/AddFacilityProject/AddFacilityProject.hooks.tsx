import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDataFacilityProject from '@/hooks/services/maintenance-proyek/facility-project/useAddDataFacilityProject';
import useGetDataFacilityProject from '@/hooks/services/maintenance-proyek/facility-project/useGetDataFacilityProject';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';

import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface AddFacilityProjectProps {
  id: string;
  listPayload: any;
  selectedMember?: any;
  detailProyek?: any;
}

const useAddFacilityProject = (props: AddFacilityProjectProps) => {
  const modalId = MODAL.ADD_FACILITY_PROJECT_MODAL;
  const modal = useModal(modalId);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { id, listPayload, selectedMember, detailProyek } = props;
  const isApproval = id ? id?.includes('MNTP-') : false;
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);
  const { recordActivity } = useRecordLog();

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [projectFacilityPage, setProjectFacilityPage] = useState(1);
  const [projectFacilityPageSize, setProjectFacilityPageSize] = useState(10);
  const [projectFacilityFilter, setProjectFacilityFilter] = useState({
    filter: {
      bucketProcessId: null,
      debtorId: null,
      products: null,
      projectCode: idConvert ?? null,
      status: null,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: {
      key: '',
      value: '',
    },
    sortList: {
      columnName: null,
      sortType: null,
    },
  });

  // API parameter lists
  const { data: projectFacilitySearchByOptions } = useGetParameterList('searchByFacilityProject', { label: 'value1', value: 'value2' });
  const { data: sortByProjectFacilityOptions } = useGetParameterList('sortByFacilityProject2', { label: 'value1', value: 'value2' });
  const { data: statusFacilityOptions } = useGetParameterList('statusFacility', { label: 'value1', value: 'key' });

  // Filter content list for search
  const projectFacilityFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectFacilityOptions,
      type: 'sort',
    },
    {
      key: 'status',
      label: 'Status Fasilitas',
      options: statusFacilityOptions,
      type: 'multiple-autocomplete',
    },
  ];

  // Table header with checkbox for selection
  const tableHeaderAddFacility: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedFacilities.some((facility) => facility.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => handleFacilitySelect(data),
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
      key: 'projectName',
      label: 'Project Name',
      sx: {
        minWidth: '15vw',
      },
    },
    {
      key: 'facilityId',
      label: 'Facility ID',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'facilityNo',
      label: 'Facility No',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'pic',
      label: 'PIC',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'produk',
      label: 'Produk',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'statusFasilitas',
      label: 'Status Fasilitas',
      render: (data) => {
        if (data.statusFasilitas === '') {
          return <span> </span>;
        }

        return (
          <Button
            variant="outlined"
            sx={{ px: 1, py: 0.5 }}
            textVariant="body4"
            noClick
          >
            {data.statusFasilitas}
          </Button>
        );
      },
      sx: {
        minWidth: '10vw',
      },
    }
  ];

  // Handle facility selection (multiple selection)
  const handleFacilitySelect = (data: any) => {
    const isAlreadySelected = selectedFacilities.some((facility) => facility.id === data.id);

    if (isAlreadySelected) {
      // Remove from selection
      setSelectedFacilities((prev) => prev.filter((facility) => facility.id !== data.id));
    } else {
      // Add to selection
      setSelectedFacilities((prev) => [...prev, data]);
    }
  };

  const facilityPayload = {
    filter: {
      bucketProcessId: null,
      debtorId: selectedMember?.customerId || null,
      products: projectFacilityFilter?.filter?.products && projectFacilityFilter.filter.products.length > 0
        ? projectFacilityFilter.filter.products
        : null,
      projectCode: idConvert ?? null,
      status: projectFacilityFilter?.filter?.status && projectFacilityFilter.filter.status.length > 0
        ? projectFacilityFilter.filter.status
        : null,
    },
    page: {
      itemPerPage: projectFacilityPageSize,
      noPage: projectFacilityPage,
    },
    searchDetail: {
      key: projectFacilityFilter?.searchDetail?.key || '',
      value: projectFacilityFilter?.searchDetail?.value || '',
    },
    sortList: {
      columnName: projectFacilityFilter?.sortList?.columnName || null,
      sortType: projectFacilityFilter?.sortList?.sortType || null,
    },
  };

  const { data: facilityProjectData,
    isFetching: isLoadingProjectFacility } = useGetDataFacilityProject(facilityPayload);

  const [facilityDataMapped, setFacilityDataMapped] = useState([]);

  useEffect(() => {
    if (facilityProjectData?.data?.contents) {
      const mappedData = facilityProjectData.data.contents.map((item) => ({
        facilityId: item.facilityId,
        facilityNo: item.facilityNo || '',
        id: item.id,
        pic: item.pic,
        produk: item.productType,
        projectName: item.name,
        statusFasilitas: item.facilityStatus || '',
      }));
      setFacilityDataMapped(mappedData);
    } else {
      setFacilityDataMapped([]);
    }
  }, [facilityProjectData]);

  // Record activity for facility project data
  useEffect(() => {
    if (facilityProjectData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: detailProyek?.data?.content?.bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek facility project data for adding facility',
      });
    }
  }, [facilityProjectData, recordActivity, detailProyek, idConvert]);

  // Add the mutation hook
  const addFacilityProjectMutation = useAddDataFacilityProject({
    onError: (error) => {
      showNiceModalV2({
        title: `Gagal menambahkan fasilitas: ${error.message || 'Terjadi kesalahan saat menambahkan fasilitas'}`,
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: data?.data?.content?.bucketProcessId || detailProyek?.data?.content?.bucketProcessId || idConvert || '',
        changeAfter: JSON.stringify(variables),
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'successfully added facility to project',
      });

      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modalId);

          // Update session storage step to 1 when facility project is successfully added
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('step', '1');

            // Update maintenance-proyek session storage if bucketProcessId is available
            if (data?.data?.content?.bucketProcessId) {
              sessionStorage.setItem('maintenance-proyek', data.data.content.bucketProcessId);
            }
          }

          queryClient.invalidateQueries({
            queryKey: ['project-facility-list'],
          });

          queryClient.invalidateQueries({
            queryKey: ['facility-project-customer-list'],
          });
        },
        title: 'Fasilitas berhasil ditambahkan',
        type: 'success',
      });
    },
  });

  const isSaveLoading = addFacilityProjectMutation.isPending;

  const handleAddFacilities = () => {
    if (selectedFacilities.length === 0) {
      showNiceModalV2({
        title: 'Tidak ada fasilitas yang dipilih untuk ditambahkan',
        type: 'error',
      });
      return;
    }

    // Function to extract MNTP ID from current URL
    const extractMNTPFromUrl = () => {
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.href;
        const mntpMatch = currentUrl.match(/MNTP-\d+/);
        return mntpMatch ? mntpMatch[0] : null;
      }
      return null;
    };

    const getProjectId = () => {
      const mntpIdFromUrl = extractMNTPFromUrl();
      if (mntpIdFromUrl) {
        return mntpIdFromUrl;
      }

      if (typeof window !== 'undefined') {
        const step = sessionStorage.getItem('step');
        if (step === '1') {
          const maintenanceProyekId = sessionStorage.getItem('maintenance-proyek');
          if (maintenanceProyekId) {
            return maintenanceProyekId;
          }
        }
      }

      return detailProyek?.data?.content?.id || idConvert;
    };

    const projectId = getProjectId();

    const finalPayload = {
      debtorId: selectedMember?.customerId || '',
      facilityId: selectedFacilities.map((facility) => facility.facilityId),
      projectId: projectId,
    };

    // console.log('Final payload:', finalPayload);

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        addFacilityProjectMutation.mutate(finalPayload);
      },
      submitText: 'Ya',
      title: 'Pastikan Data Sudah Sesuai',
      type: 'warning',
    });
  };

  // Update pagination when states change
  useEffect(() => {
    setProjectFacilityFilter((prev) => ({
      ...prev,
      page: {
        ...prev.page,
        itemPerPage: projectFacilityPageSize,
        noPage: projectFacilityPage,
      },
    }));
  }, [projectFacilityPage, projectFacilityPageSize]);

  const handleSearchChange = (filterValue: any) => {
    setProjectFacilityFilter((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        products: filterValue?.filter?.products?.length > 0 ? filterValue.filter.products : null,
        status: filterValue?.filter?.status?.length > 0 ? filterValue.filter.status : null,
      },
      searchDetail: {
        key: filterValue?.searchDetail?.key || '',
        value: filterValue?.searchDetail?.value || '',
      },
    }));
  };

  return {
    facilityDataMapped,
    handleAddFacilities,
    handleSearchChange,
    isLoadingProjectFacility,
    isSaveLoading,
    modal,
    modalId,
    projectFacilityFilter,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
    searchValue,
    selectedFacilities,
    selectedMember,
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    tableHeaderAddFacility,
    theme,
    totalPages: facilityProjectData?.data?.page?.totalPage || 1,
  };
};

export default useAddFacilityProject;

import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useGetUnmappedProjectList from '../../hooks/useGetUnmappedProjectList';
import useSaveProjectMapping from '../../hooks/useSaveProjectMapping';
import { modal } from '../../Project.constants';

import { TABLE_HEADER_LIST } from './ModalExistingProject.constants';

import type { IFilterContentItem } from '@/components/shared/Input/components/Search/components/types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalProjectExisting = () => {
  const { debtorId, processId } = useParams();
  const { recordActivity } = useRecordLog();
  const modalId = modal.PROJECT_EXISTING_PAGE;

  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState({
    city: '',
    district: '',
    province: '',
  });

  const { data: searchByOptions } = useGetParameterList('searchByProject', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByProject', { label: 'value1', value: 'value2' });
  const { data: financedSector } = useGetParameterList('sector');
  const { data: projectProvince } = useGetParameterList('province', { additionalValue: 'value2', label: 'value1', value: 'key' });
  const { data: projectCity } = useGetParameterList(selectedFilter.province, { additionalValue: 'value2', label: 'value1', value: 'key' });
  const { data: projectDistrict } = useGetParameterList(selectedFilter.city, { additionalValue: 'value2', label: 'value1', value: 'key' });

  const { data: projectData, isLoading: isProjectListLoading } = useGetUnmappedProjectList({
    filter: {
      bucketProcessId: String(processId),
      city: filter?.filter?.city?.value,
      debtorId: debtorId as string,
      district: filter?.filter?.district?.value,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      province: filter?.filter?.province?.value,
      sector: filter?.filter?.sector?.value,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  // Record activity when unmapped project list is loaded
  useEffect(() => {
    if (projectData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: String(processId) || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view unmapped project list in modal',
      });
    }
  }, [projectData, processId, recordActivity]);

  const projectList = projectData?.contents?.map((dt) => {

    let value = '';

    if (dt?.curValue === 'USD') {
      value = dt?.valueInIdr;
    } else {
      value = dt?.value;
    }

    return {
      ...dt,
      value: `IDR ${value}`,
    };
  }) || [];

  const projectPage = projectData?.page;

  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { mutate: saveProjectMapping, isPending: isSaveLoading } = useSaveProjectMapping({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Record activity for adding projects to mapping
      recordActivity({
        activity: ActivityType.ADD,
        bucketProcessId: String(processId) || '',
        changeAfter: JSON.stringify({
          projects: lastSavedPayload?.map((p: any) => ({
            debtorId: p.debtorId,
            projectCode: p.projectCode,
          })),
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully added projects to mapping',
      });

      setSelected([]);
      showNiceModalV2({
        onClose: () => closeNiceModal(modalId),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((item) => item.projectCode === data.projectCode),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((item) => item.projectCode === data.projectCode)) {
          setSelected(selected.filter((item) => item.projectCode !== data.projectCode));
        } else {
          setSelected([...selected, {
            projectCode: data.projectCode,
          }]);
        }
      },
      sx: { width: '4vw' },
      type: 'checkbox',
    },
    ...TABLE_HEADER_LIST,
  ];

  const handleAddProject = () => {
    const payload = selected?.map((res) => ({
      ...res,
      bucketProcessId: processId,
      debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    }));
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        setLastSavedPayload(payload);
        saveProjectMapping(payload);
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menambahkan Member ke proyek?',
      type: 'warning',
    });
  };
  const handleCreateNewProject = () => {
    // Record activity for viewing create new project form
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: String(processId) || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view create new project form from existing project modal',
    });

    closeNiceModal(modalId);
    NiceModal.show(modal.PROJECT_PAGE);
  };

  const filterDropdownList = searchByOptions;

  const filterContentList: IFilterContentItem[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'sector',
      label: 'Sektor yang dibiayai',
      options: financedSector || [],
      type: 'autocomplete',
    },
    {
      key: 'province',
      label: 'Lokasi Proyek (Provinsi)',
      options: projectProvince || [],
      resetTargetAutocompleteKeys: ['city', 'district'],
      type: 'autocomplete',
      watch: (val) => {
        setSelectedFilter((prev) => ({
          ...prev,
          province: val.additionalValue,
        }));
      },
    },
    {
      key: 'city',
      label: 'Lokasi Proyek (Kota - Kabupaten)',
      options: projectCity || [],
      resetTargetAutocompleteKeys: ['district'],
      type: 'autocomplete',
      watch: (val) => {
        setSelectedFilter((prev) => ({
          ...prev,
          city: val.additionalValue,
        }));
      },
    },
    {
      key: 'district',
      label: 'Lokasi Proyek (Kecamatan)',
      options: projectDistrict || [],
      type: 'autocomplete',
      watch: (val) => {
        setSelectedFilter((prev) => ({
          ...prev,
          district: val.additionalValue,
        }));
      },
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleAddProject,
    handleCreateNewProject,
    isProjectListLoading,
    isSaveLoading,
    itemPerPage,
    noPage,
    projectList,
    projectPage,
    selected,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useModalProjectExisting;

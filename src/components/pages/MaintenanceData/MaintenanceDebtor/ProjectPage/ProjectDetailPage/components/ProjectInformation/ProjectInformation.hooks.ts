import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRecordLog from '@/hooks/useRecordLog';

import useGetMaintenanceProyekDetail from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useGetMaintenanceProyekDetail';
import { useGetProjectMember } from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useProjectMember';
import { useGetProjectPhase } from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useProjectPhase';

import { modal } from './ProjectInformation.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProjectInformation = () => {
  const { control, watch, setValue } = useFormContext();
  const { projectId } = useParams();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project detail - project information page',
    });
  }, []);
  // const projectValue = watch('projectValue');
  // const projectValueExchangeRate = watch('projectValueExchangeRate');

  const [filter, setFilter] = useState<SearchValue>({});

  // API Detail Project
  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: projectId as string });

  const [dateAsOfAddressProject, setDateAsOfAddressProject] = useState('');

  const { data: sektorYangDibiayaiOptions } = useGetParameterList('sector', { label: 'value1', value: 'key' });

  const checkingTypeOfData = (data) => {
    const checkedData = data ? (typeof data === 'object' ? data?.value : data) : null;
    return checkedData;
  };

  const options = { label: 'value1', module: 'value2', value: 'key' };

  const { data: provinceDropdownList } = useGetParameterList('province', options);

  // onChange city by province
  const cityModule = useMemo(() => {
    const provinceValue =
    checkingTypeOfData(detailProyek?.data?.content?.projectInformation?.projectAddress?.province?.value);
    const cityData = provinceDropdownList?.find((item) => item.value === provinceValue)?.module;
    return cityData;
  }
  , [provinceDropdownList, detailProyek?.data?.content?.projectInformation?.projectAddress?.province?.value]);

  const { data: cityDropdownList } = useGetParameterList(cityModule, {
    ...options, config:
      { enabled: !!cityModule },
  });

  // onChange district by city
  const districtModule = useMemo(() => {
    const cityValue = checkingTypeOfData(detailProyek?.data?.content?.projectInformation?.projectAddress?.city?.value);
    const districtData = cityDropdownList?.find((item) => item.value === cityValue)?.module;
    return districtData;
  }, [cityDropdownList, detailProyek?.data?.content?.projectInformation?.projectAddress?.city?.value]);

  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  });

  // onChange subDistrict by district
  const subDistrictModule = useMemo(() => {
    const districtValue =
    checkingTypeOfData(detailProyek?.data?.content?.projectInformation?.projectAddress?.district?.value);
    const subDistrictData = districtDropdownList?.find((item) => item.value === districtValue)?.module;
    return subDistrictData;
  }, [districtDropdownList, detailProyek?.data?.content?.projectInformation?.projectAddress?.district?.value]);

  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, {
    ...options, config:
      { enabled: !!subDistrictModule },
  });

  useEffect(() => {
    let proyek = detailProyek?.data?.content;

    if (detailProyek) {
      setDateAsOfAddressProject(formatDateTime(proyek?.projectInformation?.projectAddress?.dataAsOf));
      setValue('projectInformation',
        {
          description: proyek?.projectInformation?.description,
          endDate: formatDateTime(proyek?.projectInformation?.endDate.value || proyek?.projectInformation?.endDate),
          exchangeRate: proyek?.projectInformation?.exchangeRate,
          lastModified: formatDateTime(proyek?.projectInformation?.modifiedDate) ?? '',
          modifiedBy: proyek?.projectInformation?.modifiedBy,
          name: proyek?.projectInformation?.name,
          sector: sektorYangDibiayaiOptions.find((item) =>
            item.value === proyek?.projectInformation?.sector?.value)?.label,
          startDate:
          formatDateTime(proyek?.projectInformation?.startDate.value || proyek?.projectInformation?.startDate),
          value: proyek?.projectInformation?.value,
          valueInIdr: proyek?.projectInformation?.valueInIdr,
        },
      );

      setValue('projectAddress',
        {
          ...proyek?.projectInformation?.projectAddress,
          city: {
            value: cityDropdownList?.find((item) =>
              item.value === proyek?.projectInformation?.projectAddress?.city?.value)?.label,
          },
          district: {
            value: districtDropdownList?.find((item) =>
              item.value === proyek?.projectInformation?.projectAddress?.district?.value)?.label,
          },
          province: {
            value: provinceDropdownList?.find((item) =>
              item.value === proyek?.projectInformation?.projectAddress?.province?.value)?.label,
          },
        }
      );
    }
  }, [detailProyek]);

  // Project Member Table
  const [projectMemberPage, setProjectMemberPage] = useState(1);
  const [projectMemberPageSize, setProjectMemberPageSize] = useState(10);
  const [projectMemberFilter, setProjectMemberFilter] = useState({
    filter: {
      institutionTypes: null,
      projectCode: projectId as string ?? null,
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

  const tableHeaderListMember: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'customerId',
      label: 'Customer ID',
    },
    {
      key: 'cif',
      label: 'CIF',
    },
    {
      key: 'institutionType',
      label: 'Institution Type',
    },
    {
      key: 'customerName',
      label: 'Customer Name',
    },
  ];

  // API List
  const { data: projectMemberData, isFetching: isLoadingProjectMember } = useGetProjectMember({
    filter: {
      projectCode: projectId as string ?? null,
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

  // Table Header Project Phase

  const [projectPhasePage, setProjectPhasePage] = useState(1);
  const [projectPhasePageSize, setProjectPhasePageSize] = useState(10);
  const [projectPhaseFilter, setProjectPhaseFilter] = useState<SearchValue>({});

  // Search By data
  const { data: projectPhaseSearchByOptions } = useGetParameterList('searchByProjectPhase', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByProjectPhaseOptions } = useGetParameterList('sortByProjectPhase', { label: 'value1', value: 'value2' });

  const projectPhaseFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectPhaseOptions,
      type: 'sort',
    },
    {
      endKey: 'to',
      label: 'Status as of',
      startKey: 'from',
      type: 'period',
    },
  ];

  const tableHeaderProjectPhase: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'name',
      label: 'Project Phase',
    },
    {
      key: 'statusAsOf',
      label: 'Status as Of',
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   options: [
    //     {
    //       iconName: 'detail', onClick: (data) => {},
    //     },
    //   ],
    //   type: 'action',
    // },
  ];

  // API List
  const { data: projectPhaseData, isFetching: isLoadingProjectPhase } = useGetProjectPhase({
    filter: {
      ...projectPhaseFilter?.filter,
      projectCode: projectId as string,
    },
    page: {
      itemPerPage: projectPhasePageSize,
      noPage: projectPhasePage,
    },
    searchDetail: projectPhaseFilter?.searchDetail ?? {},
    sortList: projectPhaseFilter?.sortList ?? {},
  });


  const handleOpenAssignModal = () => {
    NiceModal.show(modal.PROJECT_PHASE, {
    });
  };

  const popupGroupMemberHandler = () => {
    NiceModal.show(
      modal.FORM_MEMBER_PROJECT);
  };

  return {
    control,
    dateAsOfAddressProject,
    filter,
    handleOpenAssignModal,
    institutionTypeOptions,
    isLoadingProjectMember,
    isLoadingProjectPhase,
    popupGroupMemberHandler,
    projectMemberData,
    projectMemberFilterContentList,
    projectMemberPage,
    projectMemberPageSize,
    projectMemberSearchByOptions,
    projectPhaseData,
    projectPhaseFilter,
    projectPhaseFilterContentList,
    projectPhasePage,
    projectPhasePageSize,
    projectPhaseSearchByOptions,
    sektorYangDibiayaiOptions,
    setFilter,
    setProjectMemberFilter,
    setProjectMemberPage,
    setProjectMemberPageSize,
    setProjectPhaseFilter,
    setProjectPhasePage,
    setProjectPhasePageSize,
    setValue,
    tableHeaderListMember,
    tableHeaderProjectPhase,
    watch,
  };
};

export default useProjectInformation;

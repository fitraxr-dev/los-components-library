import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';
import useGetParameterList from '@/hooks/services/useGetParameterList';


import useGetMaintenanceProyekDetail from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useGetMaintenanceProyekDetail';
import {
  useGetProjectFacility,
  useGetProjectFacilityProduct,
} from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useProjectFacility';
import { useGetProjectMember } from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useProjectMember';
import { useGetProjectPhase } from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useProjectPhase';


import { TableHeaderList } from '../../ProjectDetail.constant';

import { modal } from './ProjectInformation.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProjectInformation = () => {
  const { control, watch, setValue } = useFormContext();
  const { projectId } = useParams();
  const [filter, setFilter] = useState<SearchValue>({});
  const options = { label: 'value1', module: 'value2', value: 'key' };
  const [dateAsOfAddressProject, setDateAsOfAddressProject] = useState('');
  const [productFacilityOptionsMapped, setProductFacilityOptionsMapped] = useState([]);

  // API Detail Project
  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: projectId as string });

  // parameter lov
  const { data: sektorYangDibiayaiOptions } = useGetParameterList('sector', { label: 'value1', value: 'key' });
  const { data: klasifikasiProyekOptions } = useGetParameterList('klasifikasiProyek', { label: 'value1', value: 'key' });
  const { data: kategoriProyekOptions } = useGetParameterList('kategoriProyek', { label: 'value1', value: 'key' });
  const { data: satuanOutputProyekOptions } = useGetParameterList('outputProyek', { label: 'value1', value: 'key' });
  const { data: provinceDropdownList } = useGetParameterList('province', options);
  const { data: projectMemberSearchByOptions } = useGetParameterList('searchByMember', { label: 'value1', value: 'value2' });
  const { data: sortByProjectMemberOptions } = useGetParameterList('sortByMember', { label: 'value1', value: 'value2' });
  const { data: institutionTypeOptions } = useGetParameterList('institutionType', { label: 'value1', value: 'key' });
  const { data: projectPhaseSearchByOptions } = useGetParameterList('searchByProjectPhase', { label: 'value1', value: 'value2' });
  const { data: sortByProjectPhaseOptions } = useGetParameterList('sortByProjectPhase', { label: 'value1', value: 'value2' });
  const { data: projectFacilitySearchByOptions } = useGetParameterList('searchByFacilityProject', { label: 'value1', value: 'value2' });
  const { data: sortByProjectFacilityOptions } = useGetParameterList('sortByFacilityProject', { label: 'value1', value: 'value2' });
  const { data: productFacilityOptions } = useGetProjectFacilityProduct();
  const { data: statusFacilityOptions } = useGetParameterList('statusFacility', { label: 'value1', value: 'key' });

  // ==== Project Member Table
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

  // ==== Project Phase Table
  const [projectPhasePage, setProjectPhasePage] = useState(1);
  const [projectPhasePageSize, setProjectPhasePageSize] = useState(10);
  const [projectPhaseFilter, setProjectPhaseFilter] = useState<SearchValue>({});

  // ==== Project Facility Table
  const [projectFacilityPage, setProjectFacilityPage] = useState(1);
  const [projectFacilityPageSize, setProjectFacilityPageSize] = useState(10);
  const [projectFacilityFilter, setProjectFacilityFilter] = useState<SearchValue>({});


  const checkingTypeOfData = (data) => {
    const checkedData = data ? (typeof data === 'object' ? data?.value : data) : null;
    return checkedData;
  };

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
          category: kategoriProyekOptions.find((item) =>
            item.value === proyek?.projectInformation?.category?.value)?.label,
          classification: klasifikasiProyekOptions.find((item) =>
            item.value === proyek?.projectInformation?.classification?.value)?.label,
          description: proyek?.projectInformation?.description,
          endDate: proyek?.projectInformation?.endDate ? formatDateTime(proyek?.projectInformation?.endDate.value) : '',
          exchangeRate: proyek?.projectInformation?.exchangeRate,
          lastModified: formatDateTime(proyek?.projectInformation?.modifiedDate) ?? '',
          modifiedBy: proyek?.projectInformation?.modifiedBy,
          name: proyek?.projectInformation?.name,
          outputUnit: satuanOutputProyekOptions.find((item) =>
            item.value === proyek?.projectInformation?.outputUnit?.value)?.label,
          sector: sektorYangDibiayaiOptions.find((item) =>
            item.value === proyek?.projectInformation?.sector?.value)?.label,
          startDate: proyek?.projectInformation?.startDate ?
            formatDateTime(proyek?.projectInformation?.startDate.value) : '',
          value: proyek?.projectInformation?.value,
          valueInIdr: proyek?.projectInformation?.valueInIdr,
          ...proyek,
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
      label: 'Nama Customer',
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


  useEffect(() => {
    const productFacilityOptionsTemp = productFacilityOptions?.data?.contents.map((item) => ({
      label: item.label,
      value: item.key,
    }));
    setProductFacilityOptionsMapped(productFacilityOptionsTemp);
  }, [productFacilityOptions]);

  const projectFacilityFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectFacilityOptions,
      type: 'sort',
    },
    {
      key: 'products',
      label: 'Produk',
      options: productFacilityOptionsMapped,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status Fasilitas',
      options: statusFacilityOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
  ];

  // API List
  const { data: projectFacilityData, isFetching: isLoadingProjectFacility } = useGetProjectFacility({
    filter: {
      ...projectFacilityFilter?.filter,
      projectCode: projectId as string ?? null,
    },
    page: {
      itemPerPage: projectFacilityPageSize,
      noPage: projectFacilityPage,
    },
    searchDetail: projectFacilityFilter?.searchDetail ?? {},
    sortList: projectFacilityFilter?.sortList ?? {},
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
    isLoadingProjectFacility,
    isLoadingProjectMember,
    isLoadingProjectPhase,
    popupGroupMemberHandler,
    projectFacilityData,
    projectFacilityFilter,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
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
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    setProjectMemberFilter,
    setProjectMemberPage,
    setProjectMemberPageSize,
    setProjectPhaseFilter,
    setProjectPhasePage,
    setProjectPhasePageSize,
    setValue,
    tableHeaderList,
    tableHeaderListMember,
    tableHeaderProjectPhase,
    watch,
  };
};

export default useProjectInformation;

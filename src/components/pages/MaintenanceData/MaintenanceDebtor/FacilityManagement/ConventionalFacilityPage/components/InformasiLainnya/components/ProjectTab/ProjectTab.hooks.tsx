import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, maintenanceProyek } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrency } from '@/helpers/formatCurrency';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';
import TextStyle from '@/components/shared/TextStyle';

import useGetFacilityInformation from '../../../../hooks/FacilityInformation/useGetFacilityInformation';
import useGetProjectInformationDetail from '../../../../hooks/Project/useGetProject';
import useSaveProject from '../../../../hooks/Project/useSaveProject';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useProjectTab = (fromSlik?: boolean) => {
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const pathname = usePathname();
  const modul = pathname.includes('master') ? 'master' : 'maintenance';
  const searchParams = useSearchParams();
  const isOrderType = searchParams.get('orderType');
  const isKonven = searchParams.get('isKonven') === 'true';
  const remarks = fromSlik ? 'view maintenance customer slik project information ' + (isKonven ? 'konven' : 'syariah') + ' page' : 'view detail manajemen fasilitas conventional informasi lainnya - tab project';


  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: remarks,
    });
  }, []);

  const { control, watch, reset, getValues } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const { data: projectInformation } = useGetProjectInformationDetail({
    filter: {
      ...payloadFilterList(processId as string, filter),
      facilityId: id as string,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  const { data: facilityInformation } = useGetFacilityInformation({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });

  useEffect(() => {
    if (projectInformation) {
      reset(projectInformation?.data?.content as any);
    }
  }, [projectInformation]);

  const { mutate: saveProjectInformation, isPending: savingProjectInformation } = useSaveProject({
    onError: (error) => {
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: error?.message,
      });
    },
    onSuccess: () => {
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        title: 'Project information berhasil disimpan',
      });
    },
  });

  const handleSaveProjectInformation = () => {
    const payload = {
      address: getValues('address'),
      bucketProcessId: processId.includes('MAI') ? processId : null,
      city: getValues('city'),
      debtorId: processId.includes('DEBT') ? processId : null,
      district: getValues('district'),
      facilityId: id,
      postalCode: getValues('postalCode'),
      projectDescription: getValues('projectDescription'),
      projectEndDate: getValues('projectEndDate'),
      projectName: getValues('projectName'),
      projectStartDate: getValues('projectStartDate'),
      projectValue: getValues('projectValue'),
      province: getValues('province'),
      statusProjectPhase: getValues('statusProjectPhase'),
      subDistrict: getValues('subDistrict'),
    };
    saveProjectInformation(payload);
  };

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchMaintenanceProject', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByOptions } = useGetParameterList('sortByProject2', { label: 'value1', value: 'value2' });

  // Currency List
  const { data: currencyOptions } = useGetParameterList('currency');

  // Currency List
  const { data: sectorOptions } = useGetParameterList('sector');

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'currencies',
      label: 'Currency',
      options: currencyOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'sectors',
      label: 'Sektor yang dibiayai',
      options: sectorOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'area', // tidak terpakai
      label: 'Area', // tidak terpakai
      type: 'area-proyek',
    },
  ];
  const filterDropdownList = searchByOptions;

  const tableHeaderProjectInformation: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama Proyek',
    },
    ...(fromSlik ? [
      {
        key: 'currency',
        label: 'Currency',
      },
    ] : []),
    {
      key: 'projectValue',
      label: 'Nilai Proyek',
      render: (value) => (
        <TextStyle> {value.projectValue ? formatCurrency(String(value.projectValue)) : '-'}</TextStyle>
      ),
    },
    {
      key: 'sector',
      label: 'Sektor yang dibiayai',
    },
    {
      key: 'district',
      label: 'Lokasi Proyek (Kecamatan)',
    },
    {
      key: 'city',
      label: 'Lokasi Proyek (Kota - Kabupaten)',
    },
    {
      key: 'province',
      label: 'Lokasi Proyek (Provinsi)',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            gotoDetailPage(data?.id);
          },
        },
      ],
      type: 'action',
    },
  ];


  const gotoDetailPage = (id: string) => {
    const url = replacePath(maintenanceProyek.DETAIL_PAGE, {
      id,
    });
    const finalUrl = `${url}?fromConventional=true`;
    window.open(finalUrl, '_blank');
  };

  return {
    control,
    facilityInformation,
    filter,
    filterContentList,
    filterDropdownList,
    handleSaveProjectInformation,
    isOrderType,
    page,
    pageSize,
    projectInformation,
    roleCanEdit,
    savingProjectInformation,
    setFilter,
    setPage,
    setPageSize,
    tableHeaderProjectInformation,
    theme,
    watch,
  };
};

import { useEffect, useState } from 'react';

import { siteVisit } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useGetAllGamByName from '@/hooks/services/useGetAllGamByName';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useStandaloneBucket from '@/hooks/services/useStandaloneBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


export const useAddSiteVisit = (modalId: string) => {
  const router = useCustomRouter();
  const [selected, setSelected] = useState([]);

  const [filter, setFilter] = useState({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- PARAMETER ---
  // Get Active Process search by options
  const { data: searchByOptions } = useGetParameterList('searchByBucketActive', { label: 'value1', value: 'value2' });
  // Get Division filter options
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  // Get all debtor data
  const { data, isLoading } = useGetAllDebtor({
    filter: {
      ...filter?.filter,
      isGovernance: false,
      status: ['APPROVED'],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: filter?.searchDetail?.value?.length >= 3,
    staleTime: 0,
  });

  const tablePage = data?.data?.page;
  const tableData = data?.data?.contents.map((item) => ({
    ...item,
    cif: item?.cif ?? '-',
    debtorId: item?.debtorId ?? '-',
  }));

  const { mutate: requestStandaloneSiteVisit } = useStandaloneBucket({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba kembali', type: 'error' });
    },
    onSuccess: (data) => {
      showNiceModalV2({ onClose: () => {
        setTimeout(() => {
          router.push(replacePath(
            siteVisit.DEBTOR_INFORMATION_PAGE,
            {
              processId: data.content.bucketProcessId,
            },
          ));
        }, 1000);
      }, title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const handleSubmit = () => {
    const payload: BucketCreateRequestDto = {
      debtorId: selected[0].debtorId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
    };
    requestStandaloneSiteVisit(payload);
  };

  // Map debtor data
  useEffect(() => {
    // Reset page to 1
    setPage(1);
    // Reset selected
    setSelected([]);
  }, [filter]);

  // Reset filter when modal opens
  useEffect(() => {
    setFilter({
      filter: {},
      searchDetail: { key: '', value: '' },
      sortList: undefined,
    });
    setPage(1);
    setSelected([]);
  }, []);

  // Get gam data
  const {
    data: gamListdata,
    isSuccess: isGetGamListData,
  } = useGetAllGamByName(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' });

  const gamList = gamListdata?.map((gam) => ({
    label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
    value: gam?.value,
  }));


  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.debtorId === data.debtorId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.debtorId === data.debtorId)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      sx: { minWidth: '3.6vw' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorId',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'institutionType',
      label: 'Tipe Institusi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Applicant',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'npwp',
      label: 'NPWP',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'divisionName',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
      sx: { minWidth: '10vw' },
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: searchByOptions,
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamList,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleSubmit,
    isLoading,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    tablePage,
  };
};

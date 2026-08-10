import { useEffect, useMemo, useState } from 'react';


import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { creditChecking } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';

import useGetBucketActive from '../../hooks/useGetBucketActive';
import useRequestCreditChecking from '../../hooks/useRequestCreditChecking';
import useValidateRequest from '../../hooks/useValidateRequest';
import { modal } from '../../Request.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


export type ActiveData = {
  bucketProcessId: string;
  cif: string;
  debtorId: string;
  debtorName: string;
  npwp: string;
  staffName: string;
  division: string;
  gamName: string;
  groupName: string;
  process: string;
  processLabel: string;
  id: string;
}


export const useModalDebtor = (modalId: string) => {
  const theme = useTheme();

  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState<ActiveData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);

  const router = useCustomRouter();

  // START PARAMETER LIST
  const { data: searchByOptions } = useGetParameterList('searchByBucketActive', {
    label: 'value1',
    value: 'value2',
  });

  const { data: filterByDivisionOptions } = useGetParameterList('filterDivisionCreditChecking', {
    label: 'value1',
    value: 'value2',
  });

  const {
    isPending: isValidateLoading,
    mutate: validateRequest,
    isSuccess,
    data: dataValidate,
  } = useValidateRequest({
    onError: (err) => {
      showNiceModalV2({
        cancelText: 'Close',
        submitText: 'OK',
        title: err?.response?.data?.errorDetail ?? 'Terjadi kesalahan, silahkan coba lagi',
        type: 'warning',
      });
    },
    onSuccess: () => {

      // showNiceModalV2({ title: 'Additional information berhasil disimpan', type: 'success' });
    },
  });


  const {
    isPending: isValidateCheckDkLoading,
    mutate: validateCheckDk,
    data: dataValidateCheckDk,
    isSuccess: isValidateCheckDkSucces,
  } = useValidateCheckDk({
    onError: (err) => {
      showNiceModalV2({
        cancelText: 'Close',
        submitText: 'OK',
        title: err?.response?.data?.errorDetail ?? 'Terjadi kesalahan, silahkan coba lagi',
        type: 'warning',
      });
    },
    onSuccess: (data) => {
      if (!data?.hasDuplicate) {
        validateRequest({
          debtorId: selected[0]?.debtorId,
          module: TypeModule.CREDIT_CHECKING,
          process: TypeProcess.CREDIT_CHECKING_DPOP,
        });
      }
    },
  });


  const onValidateRequest = (param) => {
    if (selected.some((item) => item.id === param.id)) {
      setSelected(selected.filter((item) => item.id !== param.id));
    } else {
      validateCheckDk({
        debtorId: param?.debtorId,
        debtorName: param?.debtorName,
        feature: 'DK',
      });
      setSelected([param]);
    }
  };

  useEffect(() => { setSelected([]); }, [filter]);


  // GET filter by options (GAM)
  const { data: filterByGamOptions } = useGetAllGam({ value: '' }, { division: 'divisionShort', label: 'fullName', value: 'userId' });
  const filterByGamOption = filterByGamOptions?.map((gam) => ({
    label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
    value: gam?.value,
  }));

  const { data: orderByOptions } = useGetParameterList('orderByBucketActive', {
    label: 'value1',
    value: 'value2',
  });

  const { data: filterActiveInOptions } = useGetParameterList('filterActiveInCreditChecking');
  //END PARAMETER LIST

  const isSearchDetailHasValues = Boolean(filter?.searchDetail?.value && filter?.searchDetail?.key);

  const { data, isFetching: isLoading } = useGetBucketActive({
    filter: {
      ...filter?.filter,
      status: ['APPROVED', 'APPROVED_PIPELINE'],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: filter?.searchDetail?.value?.length >= 3 || !!filter?.searchDetail?.value,
  });


  const debtorList = data?.contents.map((content) => ({
    ...content,
    id: `${content.debtorId} - ${content.bucketProcessId}`,
    npwp: content.npwp ?? '-',
  }));

  const { mutate: requestCreditChecking } = useRequestCreditChecking({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      router.push(replacePath(
        creditChecking.REQUEST_DEBTOR_INFORMATION_PAGE,
        {
          processId: data.content.bucketProcessId,
        },
      ));
      closeNiceModal(modalId);
    },
  });

  useEffect(() => {
    if (
      !hasSearched
      && filter?.searchDetail?.value !== undefined
      && filter?.searchDetail?.value !== null
      && filter?.searchDetail?.value !== ''
    ) {
      setHasSearched(true);
    }
    setPage(1);
    setSelected([]);
  }, [filter]);

  const handleSubmit = () => {
    const payload: BucketCreateRequestDto = {
      bucketProcessId: selected[0].bucketProcessId,
      debtorId: selected[0].debtorId,
      module: TypeModule.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING,
    };
    requestCreditChecking(payload);
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        onValidateRequest(data);
      },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4%' },
      type: 'index',
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'npwp',
      label: 'NPWP',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'division',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'processLabel',
      label: 'Active in',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.processLabel}
        </Button>
      ),
      sx: { minWidth: '10vw' },
    },
  ];

  const filterDropdownList = searchByOptions ?? [];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions ?? [],
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: filterByDivisionOptions ?? [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: filterByGamOption ?? [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'activeIn',
      label: 'Active In',
      options: filterActiveInOptions ?? [],
      type: 'multiple-autocomplete',
    }
  ];

  const openModalDk = () => {
    const dataTable = dataValidateCheckDk?.similarDebtorList;
    NiceModal.show(modal.MODAL_TABLE_DK, { dataTable });
  };

  const colorCheckDk = useMemo(() => {
    let color = '#fff';
    if (dataValidateCheckDk?.hasDuplicate) color = '#fce8e8';
    if (dataValidateCheckDk?.hasSimilar) color = '#fff9e5';
    return color;
  }, [dataValidateCheckDk]);

  const colorCheckDkIcon = useMemo(() => {
    let color = '#fff';
    if (dataValidateCheckDk?.hasDuplicate) color = theme.palette.custom.softRed;
    if (dataValidateCheckDk?.hasSimilar) color = theme.palette.custom.lightYellow;
    return color;
  }, [dataValidateCheckDk]);


  const labelCheckDk = useMemo(() => {
    let title = '';
    if (dataValidateCheckDk?.hasDuplicate) title = 'Terdaftar dalam database DK. Proses tidak dapat dilanjutkan.';
    if (dataValidateCheckDk?.hasSimilar) title = 'Terdapat kemiripan dengan database DK.';

    return title;
  }, [dataValidateCheckDk]);


  const isShowBtnAddnew = useMemo(() => {
    let isShow = false;
    if (selected?.length > 0 &&
      isSuccess &&
      dataValidate?.action.toUpperCase().includes('REGULAR_FORM') &&
      !dataValidateCheckDk?.hasDuplicate && (!isValidateLoading || !isValidateCheckDkLoading)) isShow = true;

    return isShow;

  }, [isSuccess, selected, dataValidate, dataValidateCheckDk, isValidateCheckDkLoading, isValidateLoading]);


  return {
    colorCheckDk,
    colorCheckDkIcon,
    data,
    dataValidateCheckDk,
    debtorList,
    filter,
    filterContentList,
    filterDropdownList,
    handleSubmit,
    hasSearched,
    isLoading,
    isShowBtnAddnew,
    isValidateCheckDkSucces,
    labelCheckDk,
    openModalDk,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    theme,
  };
};

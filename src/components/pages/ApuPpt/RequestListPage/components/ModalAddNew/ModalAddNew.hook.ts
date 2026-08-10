import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetBucketActiveList from '@/hooks/services/useGetBucketActiveList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';


import { modal } from '../../RequestList.constants';
import useRegisterDynamicStepper from '../hooks/useRegisterDynamicStepper';
import useValidateRequest from '../hooks/useValidateRequest';

import { tableHeaderList } from './ModalAddNew.constants';

import type { ActiveData } from './ModalAddNew.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


const useModalAddNew = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState(null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [checked, setChecked] = useState(false);

  const [selected, setSelected] = useState<ActiveData[]>([]);

  const router = useCustomRouter();

  const divisionOptions = useGetParameterList('division');

  const activeOptions = useGetParameterList('filterActiveInApuPpt');

  const searchByOptions = useGetParameterList('searchByAddNewApuPpt', {
    label: 'value1',
    value: 'value2',
  });

  const sortByOptions = useGetParameterList('orderByAddNewApuPpt', {
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
          module: TypeModule.APU_PPT,
          process: TypeProcess.APU_PPT_DPOP,
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

  useEffect(() => {setSelected([]);}, [filter]);


  // GET filter by options (GAM)
  const { data: filterByGamOptions } = useGetAllGam({ value: '' }, { division: 'divisionShort', label: 'fullName', value: 'userId' });
  const filterLength = filter?.searchDetail?.value?.length;
  const { data, isLoading } = useGetBucketActiveList({
    filter: {
      ...filter?.filter,
      status: 'APPROVED',
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail:
      filterLength >= 3
        ? filter?.searchDetail
        : {},
    sortList: filter?.sortList ?? {},
  },
  {
    enabled:
      filterLength >= 3 ||
      !!filterLength,
  }
  );

  const tableData = filterLength ? data?.data?.contents.map((item) => ({
    ...item,
    gamName: item?.gamName ? item?.gamName : '-',
    id: `${item.debtorId} - ${item.bucketProcessId}`,
  })) : [];

  const tablePage = data?.data.page.totalPage ?? 1;

  const { mutate, isPending: isCreateLoading } = useRegisterBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (res) => {
      closeNiceModal(modal.ADD_NEW_MODAL);
      showNiceModalV2({
        onClose: () => {
          router.replace(
            replacePath(apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE, { processId: res?.bucketProcessId })
          );
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: registerDynamicStep, isPending: isRegisDynamicLoading } = useRegisterDynamicStepper({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (res) => {
      closeNiceModal(modal.ADD_NEW_MODAL);
      showNiceModalV2({
        onClose: () => {
          router.replace(
            replacePath(apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE, { processId: res?.bucketProcessId })
          );
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnCreate = () => {
    const bucketProcessId = selected?.map((res) => res?.bucketProcessId)?.join();
    const debtorId = selected?.map((res) => res?.debtorId)?.join();
    const activeIn = selected[0]?.process === null ? true : false;

    const payload: BucketCreateRequestDto = {
      bucketProcessId: activeIn ? null : bucketProcessId,
      debtorId: activeIn ? debtorId : null,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT,
      syncWithLatestSubmission: false,
    };
    mutate(payload);
  };


  const handleOnRegisDynamicStep = (typeStep: string) => {
    const bucketProcessId = selected?.map((res) => res?.bucketProcessId)?.join();
    const activeIn = selected[0]?.process === null ? true : false;
    const debtorId = selected?.map((res) => res?.debtorId)?.join();
    const payload = {
      bucketProcessId: activeIn ? null : bucketProcessId,
      debtorId: activeIn ? debtorId : null,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT,
      syncWithLatestSubmission: true,
      typeStep,
    };

    registerDynamicStep(payload);
  };

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        onValidateRequest(data);
      },
      type: 'checkbox',
    },
    ...tableHeaderList
  ];

  const gamList = filterByGamOptions?.map((item) => ({
    label: `${item?.division ? item?.division : ''} - ${item?.label}`,
    value: item?.value,
  }));


  const filterDropdownList = searchByOptions.data;
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'activeIn',
      label: 'Active in',
      options: activeOptions.data,
      type: 'multiple-autocomplete',
    },
  ];

  const isNoSelected = !selected?.length;

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


  const isShowBtnReguler = useMemo(() => {
    let isShow = false;
    if (selected?.length > 0 &&
      isSuccess &&
       dataValidate?.action === 'REGULAR_FORM|SIMPLE_FORM' &&
        !dataValidateCheckDk?.hasDuplicate && (!isValidateLoading || !isValidateCheckDkLoading)) isShow = true;

    return isShow;

  }, [isSuccess, selected, dataValidate, dataValidateCheckDk, isValidateCheckDkLoading, isValidateLoading]);


  const isShowBtnAddnew = useMemo(() => {
    let isShow = false;
    if (selected?.length > 0 &&
      isSuccess &&
       dataValidate?.action === 'REGULAR_FORM' &&
        !dataValidateCheckDk?.hasDuplicate && (!isValidateLoading || !isValidateCheckDkLoading)) isShow = true;

    return isShow;

  }, [isSuccess, selected, dataValidate, dataValidateCheckDk, isValidateCheckDkLoading, isValidateLoading]);


  return {
    checked,
    colorCheckDk,
    colorCheckDkIcon,
    dataValidate,
    dataValidateCheckDk,
    filter,
    filterContentList,
    filterDropdownList,
    handleOnCreate,
    handleOnRegisDynamicStep,
    isCreateLoading,
    isLoading,
    isNoSelected,
    isRegisDynamicLoading,
    isShowBtnAddnew,
    isShowBtnReguler,
    isSuccess,
    isValidateCheckDkLoading,
    isValidateCheckDkSucces,
    isValidateLoading,
    labelCheckDk,
    noPage,
    openModalDk,
    selected,
    setChecked,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
    theme,
  };
};

export default useModalAddNew;

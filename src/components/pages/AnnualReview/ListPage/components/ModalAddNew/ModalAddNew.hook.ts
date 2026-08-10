import { useEffect, useMemo, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { annualReview } from '@/configs/constants/pathname';
import { TypeModule } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useGetAllGam from '@/hooks/services/useGetAllGam';
// import useGetBucketActiveList from '@/hooks/services/useGetBucketActiveList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import { modalAnnualReview } from '../../List.constants';

import { tableHeaderList } from './ModalAddNew.constants';

import type { ActiveData, BucketCreateRequestDto } from './ModalAddNew.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalAddNew = ({ typeProcess }: { typeProcess: string }) => {
  const theme = useTheme();
  const [filter, setFilter] = useState(null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [checked, setChecked] = useState(false);

  const [selected, setSelected] = useState<ActiveData[]>([]);

  const router = useCustomRouter();
  const { pageModule } = useParams();

  const modalId = modalAnnualReview.ADD_NEW;
  const { visible } = useModal(modalId);

  const divisionOptions = useGetParameterList('division');

  const { data: searchByOptions } = useGetParameterList('searchByBucketActive', {
    label: 'value1',
    value: 'value2',
  });

  const { data: sortByOptions } = useGetParameterList('sortByBucketActive', {
    label: 'value1',
    value: 'value2',
  });

  const {
    isPending: isValidateCheckDkLoading,
    mutate: validateCheckDk,
    data: dataValidateCheckDk,
  } = useValidateCheckDk({});

  const onValidateRequest = (param) => {
    if (selected.some((item) => item.id === param.id)) {
      setSelected(selected.filter((item) => item.id !== param.id));
    } else {
      validateCheckDk({
        debtorId: param.debtorId,
        debtorName: param.debtorName,
        feature: 'DK',
      });
      setSelected([param]);
    }
  };

  const handleViewData = () => {
    NiceModal.show(MODAL.CUSTOMER_DK_VALIDATION, { data: dataValidateCheckDk?.similarDebtorList });
  };

  const dkStatus: 'isDuplicated' | 'isSimilar' | undefined = dataValidateCheckDk?.hasDuplicate
    ? 'isDuplicated'
    : dataValidateCheckDk?.hasSimilar
      ? 'isSimilar'
      : undefined;

  useEffect(() => { setSelected([]); }, [filter]);

  // GET filter by options (GAM)
  const { data: filterByGamOptions } = useGetAllGam({ value: '' }, { division: 'divisionShort', label: 'fullName', value: 'userId' });

  const filterLength = filter?.searchDetail?.value?.length;

  const { data, isLoading } = useGetAllDebtor({
    filter: {
      ...filter?.filter,
      status: ['APPROVED'],
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filterLength >= 3 ? filter?.searchDetail : null,
    sortList: filter?.sortList ?? null,
  }, {
    enabled: filterLength >= 3 || !!filterLength,
  });

  const tableData = filterLength ? data?.data?.contents.map((item) => ({
    ...item,
    id: item.debtorId,
    institutionTypeLabel: item?.institutionType ?? '-',
  })) : [];

  const tablePage = data?.data?.page.totalPage ?? 1;

  const { mutate, isPending: isCreateLoading } = useRegisterBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (res) => {
      closeNiceModal(modalAnnualReview.ADD_NEW);
      showNiceModalV2({
        onClose: () => {
          router.replace(
            replacePath(annualReview.CUSTOMER_INFORMATION_PAGE, {
              pageModule: pageModule,
              processId: res?.bucketProcessId,
            })
          );
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnCreate = () => {
    const debtorId = selected?.map((res) => res?.debtorId)?.join();

    const payload: BucketCreateRequestDto = {
      bucketProcessId: null,
      debtorId,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
      syncWithLatestSubmission: false,
    };

    mutate(payload);
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

  const filterDropdownList = searchByOptions;
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
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
  ];

  const isNoSelected = !selected?.length;

  const isShowBtnAddnew = useMemo(() => {
    let isShow = false;
    if (selected?.length > 0) isShow = true;

    return isShow;

  }, [selected]);

  return {
    checked,
    dataValidateCheckDk,
    dkStatus,
    filter,
    filterContentList,
    filterDropdownList,
    handleOnCreate,
    handleViewData,
    isCreateLoading,
    isLoading,
    isNoSelected,
    isShowBtnAddnew,
    isValidateCheckDkLoading,
    modalId,
    noPage,
    selected,
    setChecked,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
    theme,
    visible,
  };
};
export default useModalAddNew;

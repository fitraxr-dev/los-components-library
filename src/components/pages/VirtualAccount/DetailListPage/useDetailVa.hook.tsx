'use client';

import { useState, useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Checkbox } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { virtualAccount, accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath, getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useVirtualAccountContext } from '@/components/layouts/VirtualAccountLayout/VirtualAccount.context';
import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import useGetBucketListStatus from '../../UserManagement/UserList/hooks/useGetBucketListStatus';
import { FILTER_DIVISION_OPTIONS, FILTER_GAM_OPTIONS, FILTER_OPTIONS, SORT_OPTIONS } from '../__mocks__/mockData';
import useActicvateVa from '../hooks/useActicvateVa';
import useCheckSubmission from '../hooks/useCheckSubmission';
import useCommentVa from '../hooks/useCommentVa';
import useDeleteVa from '../hooks/useDeleteVa';
import useGetBankList from '../hooks/useGetBankList';
import useGetCurrentVaList from '../hooks/useGetCurrentVaList';
import useGetParameterListVa from '../hooks/useGetParameterListVa';
import useGetPreviousVaList from '../hooks/useGetPreviousVaList';
import useGetRequestVaList from '../hooks/useGetRequestVaList';
import useGetVaPramList from '../hooks/useGetVaPramList';
import useStoreVa from '../hooks/useStoreVa';
import { modal } from '../ListPage/List.constants';

import { tableHeaderList } from './DetailList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailVa = () => {
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();
  const path = usePathname();
  // const isPathActivation = getLastPath(path) === ('activation');
  const [debtorIdFromProcess, bucketProcessId, isDetail, isPathActivation] = processId?.split('~') ?? [];
  const {
    isStaff,
    isSuperAdmin,
    isStaffDkhi,
    isTL,
    isKadiv,
    isMaker,
    isChecker,
    currentDivision,
    isTaskForce,
  } = useVirtualAccountContext();
  console.log('currentDivision', currentDivision);
  const canEditUser = useCheckAccess(accessid.VIRTUAL_ACCOUNT_UPDATE);
  const canDeleteUser = useCheckAccess(accessid.VIRTUAL_ACCOUNT_DELETE);
  const [viewOnly, setViewOnly] = useState(false);


  const [filterRequest, setFilterRequest] = useState(null);
  const [filterCurrent, setFilterCurrent] = useState(null);
  const [filterPrevious, setFilterPrevious] = useState(null);

  const [noPageRequest, setNoPageRequest] = useState(1);
  const [itemPerPageRequest, setItemPerPageRequest] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [isSelectAllRequest, setIsSelectAllRequest] = useState(false);

  const [noPageCurrent, setNoPageCurrent] = useState(1);
  const [itemPerPageCurrent, setItemPerPageCurrent] = useState(10);
  const [selectedCurrent, setSelectedCurrent] = useState([]);
  const [isSelectAllCurrent, setIsSelectAllCurrent] = useState(false);

  const [noPagePrevious, setNoPagePrevious] = useState(1);
  const [itemPerPagePrevious, setItemPerPagePrevious] = useState(10);
  const [selectedPrevious, setSelectedPrevious] = useState([]);
  const [isSelectAllPrevious, setIsSelectAllPrevious] = useState(false);

  const { data: checkSubmission } = useCheckSubmission({ id: debtorIdFromProcess });
  const check = checkSubmission?.content?.latestStatus;

  const isActivation = check === 'WAITING_VA_ACTIVATION';
  const isApproval = check === 'WAITING_APPROVAL_TL';
  const isApprovalChecker = check === 'WAITING_APPROVAL_CHECKER';
  const isCreation = check === 'VA_CREATION';
  const isReturnStaff = check === 'RETURN_TO_STAFF';
  const isReturnMaker = check === 'RETURN_TO_MAKER';

  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: sortByOptions } = useGetParameterListVa('sortByVAList');
  const { data: searchByOptions } = useGetParameterListVa('searchByVAList ');
  const { data: statusData } = useGetBucketListStatus({ module: TypeModule.VA_CREATION,
    process: TypeProcess.VA_CREATION });

  const statusByOptions = statusData?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];

  // Menentukan bank yang dipilih untuk setiap daftar
  const selectedBankKeyRequest = useMemo(() => {
    const val = filterRequest?.filter?.bank?.value;
    return val || null;
  }, [filterRequest?.filter?.bank?.value]);

  const selectedBankKeyCurrent = useMemo(() => {
    const val = filterCurrent?.filter?.bank?.value;
    return val || null;
  }, [filterCurrent?.filter?.bank?.value]);

  const selectedBankKeyPrevious = useMemo(() => {
    const val = filterPrevious?.filter?.bank?.value;
    return val || null;
  }, [filterPrevious?.filter?.bank?.value]);

  const { data: bankOptions } = useGetBankList();

  // Mendapatkan opsi filter dinamis untuk daftar Request
  const { data: currencyOptionsRequest } = useGetVaPramList(
    { key: 'currency', module: selectedBankKeyRequest },
  );
  const { data: vaTypeOptionsRequest } = useGetVaPramList(
    { key: 'vaType', module: selectedBankKeyRequest },
  );
  const { data: customerTypeOptionsRequest } = useGetVaPramList(
    { key: 'customerType', module: selectedBankKeyRequest },
  );

  // Mendapatkan opsi filter dinamis untuk daftar Current
  const { data: currencyOptionsCurrent } = useGetVaPramList(
    { key: 'currency', module: selectedBankKeyCurrent },
  );
  const { data: vaTypeOptionsCurrent } = useGetVaPramList(
    { key: 'vaType', module: selectedBankKeyCurrent },
  );
  const { data: customerTypeOptionsCurrent } = useGetVaPramList(
    { key: 'customerType', module: selectedBankKeyCurrent },
  );

  // Mendapatkan opsi filter dinamis untuk daftar Previous
  const { data: currencyOptionsPrevious } = useGetVaPramList(
    { key: 'currency', module: selectedBankKeyPrevious },
  );
  const { data: vaTypeOptionsPrevious } = useGetVaPramList(
    { key: 'vaType', module: selectedBankKeyPrevious },
  );
  const { data: customerTypeOptionsPrevious } = useGetVaPramList(
    { key: 'customerType', module: selectedBankKeyPrevious },
  );

  const BankOptionsMapped = useMemo(() => {
    return bankOptions?.map((item) => ({
      label: item.label,
      value: item.value,
    })) ?? [];
  }, [bankOptions]);

  // Logika useEffect untuk mereset filter saat bank dihapus
  const resetDependentFilters = (setFilterState, selectedBankKey) => {
    if (!selectedBankKey) {
      setFilterState((prev) => {
        if (prev?.filter?.currency || prev?.filter?.vaType || prev?.filter?.customerType) {
          const newFilter = { ...prev.filter };
          delete newFilter.currency;
          delete newFilter.vaType;
          delete newFilter.customerType;
          return { ...prev, filter: newFilter };
        }
        return prev;
      });
    }
  };

  useEffect(() => resetDependentFilters(setFilterRequest, selectedBankKeyRequest), [selectedBankKeyRequest]);
  useEffect(() => resetDependentFilters(setFilterCurrent, selectedBankKeyCurrent), [selectedBankKeyCurrent]);
  useEffect(() => resetDependentFilters(setFilterPrevious, selectedBankKeyPrevious), [selectedBankKeyPrevious]);

  const { data: vaListRequest, isFetching: isLoadingRequest } = useGetRequestVaList({
    filter: useMemo(() => {
      const newFilter = { ...filterRequest?.filter };
      if (newFilter?.bank?.value) newFilter.bank = [newFilter.bank.value];
      else delete newFilter.bank;
      if (newFilter?.currency?.value) newFilter.currency = [newFilter.currency.value];
      else delete newFilter.currency;
      if (newFilter?.vaType?.value) newFilter.vaType = [newFilter.vaType.value];
      else delete newFilter.vaType;
      if (newFilter?.customerType?.value) newFilter.customerType = [newFilter.customerType.value];
      else delete newFilter.customerType;
      newFilter.debtorId = bucketProcessId === 'VA-ID' ? debtorIdFromProcess : bucketProcessId;
      return newFilter;
    }, [filterRequest]),
    page: {
      itemPerPage: itemPerPageRequest,
      noPage: noPageRequest,
    },
    searchDetail: filterRequest?.searchDetail ?? { key: '', value: '' },
    sortList: filterRequest?.sortList ?? undefined,
  });

  const { data: vaListCurrent, isFetching: isLoadingCurrent } = useGetCurrentVaList({
    filter: useMemo(() => {
      const newFilter = { ...filterCurrent?.filter };
      if (newFilter?.bank?.value) newFilter.bank = [newFilter.bank.value];
      else delete newFilter.bank;
      if (newFilter?.currency?.value) newFilter.currency = [newFilter.currency.value];
      else delete newFilter.currency;
      if (newFilter?.vaType?.value) newFilter.vaType = [newFilter.vaType.value];
      else delete newFilter.vaType;
      if (newFilter?.customerType?.value) newFilter.customerType = [newFilter.customerType.value];
      else delete newFilter.customerType;
      newFilter.debtorId = debtorIdFromProcess;

      return newFilter;
    }, [filterCurrent]),
    page: {
      itemPerPage: itemPerPageCurrent,
      noPage: noPageCurrent,
    },
    searchDetail: filterCurrent?.searchDetail ?? { key: '', value: '' },
    sortList: filterCurrent?.sortList ?? undefined,
  });

  const { data: vaListPrevious, isFetching: isLoadingPrevious } = useGetPreviousVaList({
    filter: useMemo(() => {
      const newFilter = { ...filterPrevious?.filter };
      if (newFilter?.bank?.value) newFilter.bank = [newFilter.bank.value];
      else delete newFilter.bank;
      if (newFilter?.currency?.value) newFilter.currency = [newFilter.currency.value];
      else delete newFilter.currency;
      if (newFilter?.vaType?.value) newFilter.vaType = [newFilter.vaType.value];
      else delete newFilter.vaType;
      if (newFilter?.customerType?.value) newFilter.customerType = [newFilter.customerType.value];
      else delete newFilter.customerType;
      newFilter.debtorId = debtorIdFromProcess;

      return newFilter;
    }, [filterPrevious]),
    page: {
      itemPerPage: itemPerPagePrevious,
      noPage: noPagePrevious,
    },
    searchDetail: filterPrevious?.searchDetail ?? { key: '', value: '' },
    sortList: filterPrevious?.sortList ?? undefined,
  });

  useEffect(() => {
    if (vaListRequest && vaListCurrent && vaListPrevious) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.VA_CREATION,
        process: TypeProcess.VA_CREATION,
        remarks: 'view Virtual Account Detail',
      });
    }
  }, [vaListCurrent, vaListPrevious, vaListPrevious]);

  const tableDataRequest = vaListRequest?.contents.map((data) => ({
    ...data,
    bankName: data.bankName ?? '-',
    currency: data.currency ?? '-',
    customerType: data.customerType ?? '-',
    noVA: data.noVA ?? '-',
    status: data.status ?? '-',
    statusLabel: data.statusLabel ?? '-',
    vaType: data.vaType ?? '-',
  }));
  const tablePageRequest = vaListRequest?.page;

  const tableDataCurrent = vaListCurrent?.contents.map((data) => ({
    ...data,
    bankName: data.bankName ?? '-',
    currency: data.currency ?? '-',
    customerType: data.customerType ?? '-',
    noVA: data.noVA ?? '-',
    vaType: data.vaType ?? '-',
  }));
  const tablePageCurrent = vaListCurrent?.page;

  const tableDataPrevious = vaListPrevious?.contents.map((data) => ({
    ...data,
    bankName: data.bankName ?? '-',
    currency: data.currency ?? '-',
    customerType: data.customerType ?? '-',
    main: data.main ?? false,
    noVA: data.noVA ?? '-',
    vaType: data.vaType ?? '-',
  }));
  const tablePagePrevious = vaListPrevious?.page;

  const handleSelectAll = (checked: boolean,
    tableData: any[], setSelected: (data: any[]) => void, setIsSelectAll: (value: boolean) => void) => {
    setIsSelectAll(checked);
    if (checked) {
      setSelected(tableData);
    } else {
      setSelected([]);
    }
  };

  const handleSingleSelect = (data: any,
    selected: any[], setSelected: (data: any[]) => void,
    setIsSelectAll: (value: boolean) => void, tableData: any[]) => {
    const exists = selected.some((el) => el.id === data.id);
    let newSelected;
    if (exists) {
      newSelected = selected.filter((el) => el.id !== data.id);
    } else {
      newSelected = [...selected, data];
    }

    setSelected(newSelected);
    setIsSelectAll(newSelected.length === tableData.length);
  };

  const { mutate: deleteVa } = useDeleteVa({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || 'Data gagal dihapus';
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (response) => {
      showNiceModalV2({
        onClose() {
          // const nextPath = replacePath(virtualAccount.VA_LIST);

          // router.push(virtualAccount.VA_LIST);
          window.location.reload();
        },
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  function handleDeleteVa(id: any) {

    const payload = {
      id: id,
    };

    deleteVa(payload as any);
  }

  const handleDelete = (id: any) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Delete',
      cancelText: 'Close',
      onSubmit: () => handleDeleteVa(id),
      title: 'Apakah anda yakin untuk Delete virtual account?',
    });
  };


  const tableHeaderRequest: TableHeader[] = [
    ...(isPathActivation && (isMaker || isChecker || isStaff && isStaffDkhi)
      ? [{
        isDisabled: () => false,
        isSelected: (data) => selectedRequest.some((el) => el.id === data.id),
        key: 'checkbox',
        label: (
          <Checkbox
            checked={isSelectAllRequest}
            onChange={(e) =>
              handleSelectAll(
                e.target.checked,
                tableDataRequest,
                setSelectedRequest,
                setIsSelectAllRequest
              )
            }
            indeterminate={
              selectedRequest.length > 0 &&
              selectedRequest.length < tableDataRequest.length
            }
          />
        ) as any,
        onSelectChange: (data) =>
          handleSingleSelect(
            data,
            selectedRequest,
            setSelectedRequest,
            setIsSelectAllRequest,
            tableDataRequest
          ),
        sx: { minWidth: '4%' },
        type: 'checkbox' as const,
      }]
      : []),
    ...tableHeaderList,
    {
      key: 'statusLabel',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.statusLabel}
        </Button>
      ),
    },
    ...(isStaff && !isStaffDkhi || isTL || isMaker || isTaskForce ? [{
      key: 'action',
      label: 'Action',
      options: [
        ...(canEditUser ? [{
          iconName: 'edit',
          isDisabled: (data) => {
            const allowedStatuses = ['VA_CREATION', 'RETURN_TO_STAFF', 'RETURN_TO_MAKER'];
            if (isTL) {
              allowedStatuses.push('WAITING_APPROVAL_TL');
            }
            if (isChecker) {
              allowedStatuses.push('WAITING_APPROVAL_TL', 'WAITING_APPROVAL_CHECKER');
            }
            return !allowedStatuses.includes(data.status) || currentDivision !== data.division;
          },
          onClick: (data) => {
            NiceModal.show(modal.ADD_EDIT_VA, {
              action: 'Edit',
              data: {
                bank: data.bankName,
                currency: data.currency,
                customerType: data.customerType,
                id: data.id,
                vaType: data.vaType,
              },
            });
          },
        }] : []),
        ...(canDeleteUser ? [{
          iconName: 'delete',
          isDisabled: (data) => {
            const allowedStatuses = ['VA_CREATION', 'RETURN_TO_STAFF', 'RETURN_TO_MAKER'];
            if (isTL) {
              allowedStatuses.push('WAITING_APPROVAL_TL');
            }
            if (isChecker) {
              allowedStatuses.push('WAITING_APPROVAL_TL', 'WAITING_APPROVAL_CHECKER');
            }
            setViewOnly(currentDivision !== data.division ? true : false);
            return !allowedStatuses.includes(data.status) || currentDivision !== data.division;
          },
          onClick: (data) => {
            handleDelete(data?.id);
          },
        }] : []),
      ],
      sx: { minWidth: '4vw' },
      type: 'action',
    }] : []),
  ];

  const tableHeaderCurrent: TableHeader[] = [
    ...(isPathActivation && (isMaker && !isActivation || isChecker && !isActivation
      || isStaff && isStaffDkhi && !isActivation)
      ? [
        {
          isDisabled: () => false,
          isSelected: (data) => selectedCurrent.some((el) => el.id === data.id),
          key: 'checkbox',
          label: (
            <Checkbox
              checked={isSelectAllCurrent}
              onChange={(e) => handleSelectAll(e.target.checked,
                tableDataCurrent, setSelectedCurrent, setIsSelectAllCurrent)}
              indeterminate={selectedCurrent.length > 0 && selectedCurrent.length < tableDataCurrent.length}
            />
          ) as any,
          onSelectChange: (data) => handleSingleSelect(data,
            selectedCurrent, setSelectedCurrent, setIsSelectAllCurrent, tableDataCurrent),
          sx: { minWidth: '4%' },
          type: 'checkbox' as const,
        }] : []),
    ...tableHeaderList,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
          color="primary"
        >
          {row.status}
        </Button>
      ),
    },

  ];

  const tableHeaderPrevious: TableHeader[] = [
    ...(isPathActivation && (isMaker && !isActivation || isChecker && !isActivation
      || isStaff && isStaffDkhi && !isActivation) ? [{
        isDisabled: () => false,
        isSelected: (data) => selectedPrevious.some((el) => el.id === data.id),
        key: 'checkbox',
        label: (
          <Checkbox
            checked={isSelectAllPrevious}
            onChange={(e) => handleSelectAll(e.target.checked,
              tableDataPrevious, setSelectedPrevious, setIsSelectAllPrevious)}
            indeterminate={selectedPrevious.length > 0 && selectedPrevious.length < tableDataPrevious.length}
          />
        ) as any,
        onSelectChange: (data) => handleSingleSelect(data,
          selectedPrevious, setSelectedPrevious, setIsSelectAllPrevious, tableDataPrevious),
        sx: { minWidth: '4%' },
        type: 'checkbox' as const,
      }]
      : []),
    ...tableHeaderList,
    {
      key: '',
      label: 'Remarks',
      render: (row) => (
        (row.facilityNo || row.facilityProduct) ? (
          <TextStyle variant="body4">
            {row.facilityNo} - {row.facilityProduct}
          </TextStyle>
        ) : (
          '-'
        )
      ),
      sx: {
        minWidth: '8vw',
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.status}
        </Button>
      ), sx: {
        minWidth: '9vw',
      },
    },
    {
      key: 'main',
      label: 'Main',
      render: (row) => (
        (row.main) ? (
          <TextStyle variant="body4">
            {row.main ? 'Yes' : 'No'}
          </TextStyle>
        ) : (
          '-'
        )
      ),
    },
  ];

  const filterDropdownList = searchByOptions;

  // Filter content list untuk setiap daftar
  const filterContentListRequest = useMemo(() => ([
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      label: 'Virtual Account',
      type: 'virtual-account',
    },
    { key: 'status', label: 'Status', options: statusByOptions, type: 'multiple-autocomplete' },
  ]), [sortByOptions,
    BankOptionsMapped,
    currencyOptionsRequest,
    vaTypeOptionsRequest,
    customerTypeOptionsRequest,
    statusByOptions]);

  const filterContentListCurrent = useMemo(() => ([
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      label: 'Virtual Account',
      type: 'virtual-account',
    },
    { key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Non Active', value: 'non-active' }], type: 'multiple-autocomplete' },
  ]), [sortByOptions,
    BankOptionsMapped,
    currencyOptionsCurrent,
    vaTypeOptionsCurrent,
    customerTypeOptionsCurrent,
    statusByOptions]);

  const filterContentListPrevious = useMemo(() => ([
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      label: 'Virtual Account',
      type: 'virtual-account',
    },
    { key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Non Active', value: 'non-active' }], type: 'multiple-autocomplete' },
  ]), [sortByOptions,
    BankOptionsMapped,
    currencyOptionsPrevious,
    vaTypeOptionsPrevious,
    customerTypeOptionsPrevious,
    statusByOptions]);

  const { mutate: submitBucket } = useSubmitBucket({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || error?.message || 'Data gagal disimpan';
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      // data is the response with submitRequestDto attached (from useSubmitBucket)
      // variables is the original payload
      const action = data?.submitRequestDto?.action || variables?.submitRequestDto?.action;
      let activityType = ActivityType.SUBMIT;
      let remarks;

      if (action === 'APPROVE' || action.includes('APPROVE')) {
        activityType = ActivityType.APPROVE;
        remarks = 'approve virtual account data';
      } else if (action.includes('RETURN_TO')) {
        activityType = ActivityType.RETURN_TO_MAKER;
        remarks = `reject and return virtual account data (${action})`;
      } else if (action.includes('CANCEL')) {
        activityType = ActivityType.CANCEL;
        remarks = 'cancel virtual account data ';
      } else if (action.includes('REJECT')) {
        activityType = ActivityType.REJECT;
        remarks = 'reject virtual account data ';
      } else if (action === 'SUBMIT') {
        activityType = ActivityType.SUBMIT;
        remarks = 'submit virtual account data ';
      }

      recordActivity({
        activity: activityType,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(data || variables),
        module: TypeModule.VA_CREATION,
        process: TypeProcess.VA_CREATION,
        remarks: remarks,
      });
      queryClient.invalidateQueries({ queryKey: ['va-submission-list']});
      showNiceModalV2({
        onClose: () => {
          router.push(virtualAccount.VA_LIST);
          localStorage.removeItem('bucketProcessIdVA');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: bucketProcessId as any,
            comment,
            module: TypeModule.VA_CREATION,
            process: TypeProcess.VA_CREATION,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };
  const { mutate: commenctVa } = useCommentVa({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || error?.message || 'Data gagal disimpan';
      showNiceModalV2({ title: errorMessage, type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['va-submission-list']});
      showNiceModalV2({
        onClose: () => router.push(virtualAccount.VA_LIST),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleCommenctVa = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        commenctVa({
          bucketProcessId: bucketProcessId as any,
          comment,
          module: TypeModule.VA_CREATION,
          process: TypeProcess.VA_CREATION,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const { mutate: declineBucket } = useSubmitBucket({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || error?.message || 'Data gagal disimpan';
      showNiceModalV2({ title: errorMessage, type: 'error' });
    },
    onSuccess: (data, variables) => {
      // data is the response with submitRequestDto attached (from useSubmitBucket)
      // variables is the original payload
      const action = data?.submitRequestDto?.action || variables?.submitRequestDto?.action;
      let activityType;
      let remarks;

      if (action.includes('CANCEL')) {
        activityType = ActivityType.CANCEL;
        remarks = 'cancel virtual account data ';
      } else if (action.includes('REJECT')) {
        activityType = ActivityType.REJECT;
        remarks = 'reject virtual account data ';
      }

      recordActivity({
        activity: activityType,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(data || variables),
        module: TypeModule.VA_CREATION,
        process: TypeProcess.VA_CREATION,
        remarks: remarks,
      });
      queryClient.invalidateQueries({ queryKey: ['va-submission-list']});
      showNiceModalV2({
        onClose: () => router.push(virtualAccount.VA_LIST),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleDecline = () => {
    NiceModal.show(modal.DECLINE, {
      onCancel: ({ comment }) => {
        declineBucket({
          submitRequestDto: {
            action: 'CANCELED',
            bucketProcessId: bucketProcessId as any,
            comment,
            module: TypeModule.VA_CREATION,
            process: TypeProcess.VA_CREATION,
          },
        });
        closeNiceModal(modal.DECLINE);
      },
      onReject: ({ comment }) => {
        declineBucket({
          submitRequestDto: {
            action: 'REJECTED',
            bucketProcessId: bucketProcessId as any,
            comment,
            module: TypeModule.VA_CREATION,
            process: TypeProcess.VA_CREATION,
          },
        });
        closeNiceModal(modal.DECLINE);
      },
    });
  };

  const handleCancel = () => {
    router.push(virtualAccount.VA_LIST);
  };

  function handleOnCancelProcess() {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        declineBucket({
          submitRequestDto: {
            action: 'CANCELED',
            bucketProcessId: bucketProcessId,
            comment,
            module: TypeModule.VA_CREATION,
            process: TypeProcess.VA_CREATION,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },

    });
  }

  const { mutate: saveVa } = useStoreVa({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || error?.message || 'Data gagal disimpan';
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (response) => {
      showNiceModalV2({
        onClose() {
          const nextPath = replacePath(virtualAccount.VA_DETAIL,
            { processId: `${debtorIdFromProcess}~${response?.id}` });

          router.push(nextPath);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  function handleOnSave() {
    const payload = {
      bucketProcessId: bucketProcessId === 'VA-ID' ? null : bucketProcessId,
      debtorId: debtorIdFromProcess,
    };
    saveVa(payload as any);
  }
  const { mutate: activateVa } = useActicvateVa({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || 'Data gagal activated/deactivated data';
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (response) => {
      showNiceModalV2({
        onClose() {
          // const nextPath = replacePath(virtualAccount.VA_LIST);

          router.push(virtualAccount.VA_ACTIVATIN_LIST);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  function handleActivateDeactivate(activate: boolean) {
    const requestVaIds = selectedRequest.map((item) => item.id);
    const currentVaIds = selectedCurrent.map((item) => item.id);
    const previousVaIds = selectedPrevious.map((item) => item.id);

    const payload = {
      activate: activate,
      bucketProcessId: bucketProcessId === 'VA-ID' ? null : bucketProcessId,
      currentVa: currentVaIds,
      debtorId: debtorIdFromProcess,
      previousVa: previousVaIds,
      requestVa: requestVaIds, // Menambahkan properti 'activate' ke payload
    };

    activateVa(payload as any);
  }

  // Handler untuk tombol "Active"
  const handleActive = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Active',
      cancelText: 'Close',
      onSubmit: () => handleActivateDeactivate(true), // Panggil dengan `true`
      title: 'Apakah anda yakin untuk Activate virtual account?',
    });
  };

  // Handler untuk tombol "Non Active"
  const handleNonActive = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Non Active',
      cancelText: 'Close',
      onSubmit: () => handleActivateDeactivate(false), // Panggil dengan `false`
      title: 'Apakah anda yakin untuk Deactivate virtual account?',
    });
  };

  const handleNext = useGoToNextStep();

  const isAnyItemSelected = useMemo(() => {
    return selectedRequest.length > 0 || selectedCurrent.length > 0 || selectedPrevious.length > 0;
  }, [selectedRequest, selectedCurrent, selectedPrevious]);


  return {
    bucketProcessId,
    filterContentListCurrent,
    filterContentListPrevious,
    filterContentListRequest,
    filterCurrent,
    filterDropdownList,
    filterPrevious,
    filterRequest,
    handleActive,
    handleCancel,
    handleCommenctVa,
    handleDecline,
    handleNext,
    handleNonActive,
    handleOnCancelProcess,
    handleOnSave,
    handleSubmit,
    isActivation,
    isAnyItemSelected,
    isApproval,
    isApprovalChecker,
    isChecker,
    isCreation,
    isDetail,
    isKadiv,
    isLoadingCurrent,
    isLoadingPrevious,
    isLoadingRequest,
    isMaker,
    isPathActivation,
    isReturnMaker,
    isReturnStaff,
    isStaff,
    isStaffDkhi,
    isSuperAdmin,
    isTL,
    itemPerPageCurrent,
    itemPerPagePrevious,
    itemPerPageRequest,
    noPageCurrent,
    noPagePrevious,
    noPageRequest,
    setFilterCurrent,
    setFilterPrevious,
    setFilterRequest,
    setItemPerPageCurrent,
    setItemPerPagePrevious,
    setItemPerPageRequest,
    setNoPageCurrent,
    setNoPagePrevious,
    setNoPageRequest,
    tableDataCurrent,
    tableDataPrevious,
    tableDataRequest,
    tableHeaderCurrent,
    tableHeaderPrevious,
    tableHeaderRequest,
    tablePageCurrent,
    tablePagePrevious,
    tablePageRequest,
    viewOnly,
  };
};

export default useDetailVa;

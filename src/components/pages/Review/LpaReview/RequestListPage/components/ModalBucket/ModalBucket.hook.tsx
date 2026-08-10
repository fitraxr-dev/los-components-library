import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { lpaRequestReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';

import { MODAL_ID } from '../../RequestList.constant';
import useCheckBucketStatus from '../hooks/useCheckBucketStatus';
import useGetBucketActive from '../hooks/useGetBucketActive';
import useRequestModalBucket from '../hooks/useRequestBucket';
import useValidateDebtor from '../hooks/useValidateDebtor';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


export const useModalBucket = () => {
  const { recordActivity } = useRecordLog();
  const [selected, setSelected] = useState([]);
  const [debtorValidation, setDebtorValidation] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [currentValidatingDebtorId, setCurrentValidatingDebtorId] = useState<string | null>(null);
  const [shouldCallValidation, setShouldCallValidation] = useState(false);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<any>(null);
  const router = useCustomRouter();
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);


  // --- PARAMETER ---
  const { data: divisionOptions } = useGetParameterList('division');
  const { data: activeInOptions } = useGetParameterList('filterProcessLPAStandalone');
  const { data: searchByOptions } = useGetParameterList('searchByLPAListStandalone', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByLPAListStandalone', {
    label: 'value1',
    value: 'value2',
  });
  // --- END OF PARAMETER ---
  // Get debtor data
  const mathcModule = useMemo(() => {
    let moduleFilter = '';
    let process = '';

    if (filter?.filter?.status) {
      moduleFilter = filter?.filter?.status.map((data: string) => data.split('|')[0]).join('|');
      process = filter?.filter?.status.map((data: string) => data.split('|')[1]).join('|');
    } else {
      moduleFilter = activeInOptions.map((data: { value: string }) => data.value.split('|')[0]).join('|');
      process = activeInOptions.map((data: { value: string }) => data.value.split('|')[1]).join('|');
    }

    return {
      module: moduleFilter,
      process,
    };
  }, [filter, activeInOptions]);

  // Normalize filter so division/gam/status are sent inside `filter` payload
  const normalizedFilter = useMemo(() => {
    const cloned = structuredClone(filter?.filter ?? {}) as Record<string, any>;

    // Ensure `gam` is array of ids/values
    if (cloned.gam !== undefined && cloned.gam !== null) {
      const rawGam = cloned.gam;
      const array = Array.isArray(rawGam) ? rawGam : [rawGam];
      cloned.gam = array
        .filter((v) => v !== undefined && v !== null && v !== '')
        .map((v) => (typeof v === 'object' ? (v.value ?? v.id ?? v) : v));
    }

    return cloned;
  }, [filter?.filter]);

  const defaultStatus = useMemo(() => {
    return ['APPROVED', 'APPROVED_PIPELINE'];
  }, []);

  const { data, isFetching: isLoading } = useGetBucketActive({
    filter: ({
      ...normalizedFilter,
      status: defaultStatus,
    } as any),
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail?.value?.length >= 3 ? filter?.searchDetail : {},
    sortList: filter?.sortList ?? {},
  },
  {
    enabled: filter?.searchDetail?.value?.length >= 3 || !!filter?.searchDetail?.value,
  });

  // Record activity when bucket active list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA,
        remarks: 'view active debtor list in lpa request modal',
      });
    }
  }, [data, recordActivity]);

  const listMasterDebtor = data?.contents.map((debtor) => ({
    ...debtor,
    cif: debtor.cif ?? '-',
    groupName: debtor.groupName || '-',
    npwp: debtor.npwp ?? '-',
  }));

  const totalPage = data?.page.totalPage ?? 1;

  const { mutate: validateDebtor } = useValidateDebtor({
    onError: (error: any) => {
      console.error('Validate debtor error:', error);
    },
    onSuccess: (data) => {
      setDebtorValidation(data);
    },
  });

  const { mutate: checkBucketStatus } = useCheckBucketStatus({
    onError: (error: any) => {
      setIsCheckingStatus(false);
      const errorMessage = 'Gagal mengecek status debitur';
      showNiceModal('error', errorMessage);
    },
    onSuccess: (data) => {
      setIsCheckingStatus(false);
      const statusData = data.data?.content;
      setBucketStatus(statusData);

      // Always trigger validation result API
      setShouldCallValidation(true);
      refetchValidateResult();
    },
  });

  // Validation result hook - only enabled after bucket status is checked
  const {
    data: validateResultData,
    isSuccess: isValidateResultSuccess,
    isFetching: isValidateResultFetching,
    refetch: refetchValidateResult,
  } = useGetValidateResult({
    debtorId: selected.length > 0 ? selected[0]?.debtorId : null,
  }, {
    enabled: selected.length > 0
      && selected[0]?.debtorId !== null
      && selected[0]?.debtorId !== undefined
      && bucketStatus !== null,
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
    if (filter?.searchDetail?.value !== undefined) {
      setSelected([]);
      setBucketStatus(null);
      setDebtorValidation(null);
      setValidationResult(null);
      setCurrentValidatingDebtorId(null);
      setShouldCallValidation(false);
    }
  }, [filter?.searchDetail?.value, filter?.searchDetail?.key]);

  // Check bucket status and validate debtor when a debtor is selected
  useEffect(() => {
    if (selected.length > 0) {
      const selectedRow = selected[0] as any;
      setIsCheckingStatus(true);
      setBucketStatus(null);
      setDebtorValidation(null);
      setValidationResult(null);
      setCurrentValidatingDebtorId(selectedRow.debtorId);
      setShouldCallValidation(false);

      // Validate debtor first
      validateDebtor({
        debtorId: selectedRow.debtorId,
        debtorName: selectedRow.debtorName,
        feature: 'DK',
      });

      // Then check bucket status
      checkBucketStatus({
        debtorId: selectedRow.debtorId,
        module: TypeModule.LPA,
        process: TypeProcess.LPA,
      });
    } else {
      setBucketStatus(null);
      setDebtorValidation(null);
      setValidationResult(null);
      setCurrentValidatingDebtorId(null);
      setShouldCallValidation(false);
    }
  }, [selected]);

  // Handle validation result
  useEffect(() => {
    if (isValidateResultSuccess
      && validateResultData?.content
      && selected.length > 0
      && currentValidatingDebtorId
      && shouldCallValidation
      && !isValidateResultFetching) {
      const result = validateResultData.content;

      // Only process if this validation result belongs to the currently selected customer
      const currentDebtorId = selected[0]?.debtorId;
      if (currentDebtorId === currentValidatingDebtorId) {
        setValidationResult(result);

        const messages: string[] = [];

        const nonBlockingStatuses = ['COMPLETED', 'REJECTED', 'CANCELED'];
        const hasBlockingRequest = bucketStatus?.status && !nonBlockingStatuses.includes(bucketStatus.status);

        if (hasBlockingRequest) {
          messages.push('<li>Debitur memiliki request yang masih aktif. Tidak dapat membuat request baru.</li>');
        }

        if (result.invalid && result.result) {
          const resultWithoutTags = result.result.replace(/<\/?ul>/g, '');
          messages.push(resultWithoutTags);
        }

        if (messages.length > 0) {
          const combinedMessage = `<ul>${messages.join('')}</ul>`;
          NiceModal.show(MODAL.GLOBAL.WARNING, {
            parseHtml: true,
            textAlign: 'left',
            title: combinedMessage,
          });
        }
      }
    }
  }, [
    isValidateResultSuccess,
    validateResultData,
    selected,
    currentValidatingDebtorId,
    shouldCallValidation,
    isValidateResultFetching,
    bucketStatus,
  ]);

  // Get gam data
  const {
    data: gamListdata,
    isSuccess: isGetGamListData,
  } = useGetAllGam(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' },
  );


  const gamList = gamListdata?.map((gam) => ({
    label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
    value: gam?.value,
  }));


  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((item) =>
        item.debtorId === data.debtorId && item.bucketProcessId === data.bucketProcessId
      ),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((item) =>
          item.debtorId === data.debtorId && item.bucketProcessId === data.bucketProcessId
        )) {
          setSelected(selected.filter((item) =>
            !(item.debtorId === data.debtorId && item.bucketProcessId === data.bucketProcessId)
          ));
        } else {
          setSelected([data]);
        }
      },
      sx: { minWidth: '2.6vw' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '2.6vw' },
      type: 'index',
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'npwp',
      label: 'NPWP',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'division',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
      sx: { minWidth: '12vw' },
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
          {row.processLabel ?? 'N/A'}
        </Button>
      ),
      sx: { minWidth: '10vw' },
    },
  ];

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
      options: divisionOptions,
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
      label: 'Active In',
      options: activeInOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const { mutate: createNewBucket } = useRequestModalBucket({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: ({ content }) => {
      // Record activity for creating new bucket request
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: content?.bucketProcessId || '',
        changeAfter: JSON.stringify({
          bucketProcessId: lastRequestPayload?.bucketProcessId,
          module: lastRequestPayload?.module,
          process: lastRequestPayload?.process,
        }),
        changeBefore: '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA,
        remarks: 'successfully created new lpa request',
      });

      showNiceModalV2({
        onClose: () => {
          router.push(replacePath(
            lpaRequestReview.DEBTOR_INFORMATION,
            {
              module: 'bucket-list',
              processId: content?.bucketProcessId,
            },
          ));
          closeNiceModal(MODAL_ID.MODAL_REQUEST);
        }, type: 'success',
      });
    },
  });

  // Check if create button should be disabled
  const isCreateButtonDisabled = useMemo(() => {
    if (!selected?.length || isCheckingStatus) return true;

    if (debtorValidation?.hasDuplicate) {
      return true;
    }

    const nonBlockingStatuses = ['COMPLETED', 'REJECTED', 'CANCELED'];
    const hasBlockingRequest = bucketStatus?.status && !nonBlockingStatuses.includes(bucketStatus.status);

    if (hasBlockingRequest) {
      return true;
    }

    // if (validationResult?.invalid && validationResult?.result) {
    //   const resultText = validationResult.result.toLowerCase();
    //   if (resultText.includes('high risk') || resultText.includes('pelanggaran bmpp')) {
    //     return true;
    //   }
    // }
    // dimatikan dulu karena belum diimplemen di modul lain

    return false;
  }, [selected, isCheckingStatus, debtorValidation, bucketStatus, validationResult]);


  const handleSubmit = () => {
    if (!selected?.length) return;

    const selectedRow = selected[0] as any;
    const payload: BucketCreateRequestDto = {
      bucketProcessId: selectedRow?.bucketProcessId,
      module: TypeModule.LPA,
      process: TypeProcess.LPA,
    };
    setLastRequestPayload(payload);
    createNewBucket(payload);
  };

  return {
    bucketStatus,
    debtorValidation,
    filter,
    filterContentList,
    filterDropdownList,
    handleSubmit,
    hasSearched,
    isCheckingStatus,
    isCreateButtonDisabled,
    isLoading,
    listMasterDebtor,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
    validationResult,
  };
};

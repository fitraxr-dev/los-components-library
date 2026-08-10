import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { technicalStudyReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';

import { FILTER_DIVISION_OPTIONS, FILTER_GAM_OPTIONS, SORT_OPTIONS } from '../../../mockData/mockData';
import useCheckBucketStatus from '../../hooks/useCheckBucketStatus';
import useCreateLatestRequest from '../../hooks/useCreateLatestRequest';
import useGetBucketActive from '../../hooks/useGetBucketActive';
import useRequestTechnicalReview from '../../hooks/useRequestTechnicalReview';
import useValidateDebtor from '../../hooks/useValidateDebtor';
import { modal } from '../../Request.constants';
import { ModalSimilarDebtor } from '../ModalSimilarDebtor';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


export const useModalDebtor = (modalId: string) => {
  const [selected, setSelected] = useState([]);
  const path = usePathname();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<any>(null);
  const [retrieveFromLatest, setRetrieveFromLatest] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [debtorValidation, setDebtorValidation] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [currentValidatingDebtorId, setCurrentValidatingDebtorId] = useState<string | null>(null);
  const [shouldCallValidation, setShouldCallValidation] = useState(false);

  const router = useCustomRouter();
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);

  // --- PARAMETER ---
  // GET search by options
  const { data: searchByOptions } = useGetParameterList(
    'searchByBucketActive',
    { label: 'value1', value: 'value2' }
  );

  // GET filter by options (divison)
  const { data: filterByDivisionOptions } = useGetParameterList('division');

  // GET filter by options (GAM)
  const { data: filterByGamOptions } = useGetAllGam(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' }
  );

  //GET order by options
  const { data: orderByOptions } = useGetParameterList('orderByBucketActive', {
    label: 'value1',
    value: 'value2',
  });
  // --- END OF PARAMETER ---

  const normalizedFilter = useMemo(() => {
    const cloned = structuredClone(filter?.filter ?? {}) as Record<string, any>;

    // Normalize GAM values to array of IDs (strings)
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

  const { data, isFetching: isLoading } = useGetBucketActive(
    {
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
    }
  );

  // Record activity when active bucket/debtor list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW,
        remarks: 'view active debtor list in modal debtor',
      });
    }
  }, [data, recordActivity]);

  const debtorList = data?.contents.map((content) => ({
    ...content,
    npwp: content.npwp ?? '-',
  }));

  const gamList = filterByGamOptions?.map((gam) => ({
    label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
    value: gam?.value,
  }));

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

  const [lastRetrievePayload, setLastRetrievePayload] = useState<any>(null);

  const { mutateAsync: createLatestRequest } = useCreateLatestRequest({
    onError: () => {
      showNiceModal('error', 'Gagal mengambil data dari request terakhir');
    },
    onSuccess: () => {
      // Record activity for retrieving from latest
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: lastRetrievePayload?.newBucketProcessId || '',
        changeAfter: JSON.stringify({
          latestBucketProcessId: lastRetrievePayload?.latestBucketProcessId,
          newBucketProcessId: lastRetrievePayload?.newBucketProcessId,
        }),
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW,
        remarks: 'successfully retrieved data from latest request',
      });
    },
  });

  const { mutate: requestTechnicalReview } = useRequestTechnicalReview({
    onError: () => {
      showNiceModal('error', 'Something is wrong, please try again later');
    },
    onSuccess: async (data) => {
      const newBucketProcessId = data.content.bucketProcessId;

      // Record activity for creating technical review request
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: newBucketProcessId || '',
        changeAfter: JSON.stringify({
          bucketProcessId: newBucketProcessId,
          debtorId: lastRequestPayload?.debtorId,
        }),
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW,
        remarks: 'successfully created technical review request',
      });

      // If retrieve from latest is checked, call createLatestRequest sequentially
      if (retrieveFromLatest && bucketStatus?.bucketProcessId) {
        try {
          const retrievePayload = {
            latestBucketProcessId: bucketStatus.bucketProcessId,
            module: TypeModule.TECHNICAL_REVIEW,
            newBucketProcessId: newBucketProcessId,
            process: TypeProcess.TECHNICAL_REVIEW,
            status: bucketStatus.status,
          };
          setLastRetrievePayload(retrievePayload);
          await createLatestRequest(retrievePayload);

          // Navigate to detail page after successful retrieval
          router.push(
            replacePath(technicalStudyReview.DEBTOR_INFORMATION_PAGE, {
              module: getLastPath(path),
              processId: newBucketProcessId,
            })
          );
          closeNiceModal(modalId);
        } catch (error) {
        }
      } else {
        // Navigate directly to detail page
        router.push(
          replacePath(technicalStudyReview.DEBTOR_INFORMATION_PAGE, {
            module: getLastPath(path),
            processId: newBucketProcessId,
          })
        );
        closeNiceModal(modalId);
      }
    },
  });

  const getRowId = (row: any) =>
    row?.bucketProcessId ?? row?.processId ?? row?.id ?? row?.cif ?? row?.debtorId ?? `${row?.debtorName ?? ''}-${row?.npwp ?? ''}`;

  useEffect(() => {
    if (
      !hasSearched &&
      filter?.searchDetail?.value !== undefined &&
      filter?.searchDetail?.value !== null &&
      filter?.searchDetail?.value !== ''
    ) {
      setHasSearched(true);
    }
    setPage(1);
    if (filter?.searchDetail?.value !== undefined) {
      setSelected([]);
      setBucketStatus(null);
      setRetrieveFromLatest(false);
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
      setRetrieveFromLatest(false);
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
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW,
      });
    } else {
      setBucketStatus(null);
      setRetrieveFromLatest(false);
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

  const handleSubmit = () => {
    if (!selected?.length) return;


    const selectedRow = selected[0] as any;
    const payload: BucketCreateRequestDto = {
      bucketProcessId: selectedRow?.bucketProcessId,
      debtorId: selectedRow?.debtorId,
      module: TypeModule.TECHNICAL_REVIEW,
      process: TypeProcess.TECHNICAL_REVIEW,
    } as unknown as BucketCreateRequestDto;
    setLastRequestPayload(payload);
    requestTechnicalReview(payload);
  };

  // Check if New Request button should be disabled
  const isNewRequestDisabled = () => {
    if (!selected?.length || isCheckingStatus) return true;

    // If debtor has duplicate, disable button
    if (debtorValidation?.hasDuplicate) {
      return true;
    }

    const nonBlockingStatuses = ['COMPLETED', 'REJECTED', 'CANCELED'];
    const hasBlockingRequest = bucketStatus?.status && !nonBlockingStatuses.includes(bucketStatus.status);

    if (hasBlockingRequest) {
      return true;
    }

    // Check if create button should be disabled due to validation result
    // if (validationResult?.invalid && validationResult?.result) {
    //   const resultText = validationResult.result.toLowerCase();
    //   if (resultText.includes('high risk') || resultText.includes('pelanggaran bmpp')) {
    //     return true;
    //   }
    // }
    // dimatikan dulu karena belum diimplemen di modul lain

    return false;
  };

  // Check if retrieve checkbox should be shown
  const shouldShowRetrieveCheckbox = () => {
    return bucketStatus?.hasPreviousData === true;
  };

  // Open modal for similar debtor list
  const openModalSimilarDebtor = () => {
    const dataTable = debtorValidation?.similarDebtorList;

    // Record activity for viewing similar debtor modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'technical-study-review',
      module: TypeModule.TECHNICAL_REVIEW,
      process: TypeProcess.TECHNICAL_REVIEW,
      remarks: 'view similar debtor list in modal debtor',
    });

    NiceModal.show(modal.SIMILAR_DEBTOR, { dataTable });
  };

  // Computed properties for debtor validation UI
  const validationColor = useMemo(() => {
    let color = '#fff';
    if (debtorValidation?.hasDuplicate) color = '#fce8e8';
    if (debtorValidation?.hasSimilar) color = '#fff9e5';
    return color;
  }, [debtorValidation]);

  const validationIconColor = useMemo(() => {
    let color = '#fff';
    if (debtorValidation?.hasDuplicate) color = theme.palette.custom.softRed;
    if (debtorValidation?.hasSimilar) color = theme.palette.custom.lightYellow;
    return color;
  }, [debtorValidation]);

  const validationLabel = useMemo(() => {
    let title = '';
    if (debtorValidation?.hasDuplicate) title = 'Terdaftar dalam database DK. Proses tidak dapat dilanjutkan.';
    if (debtorValidation?.hasSimilar) title = 'Terdapat kemiripan dengan database DK.';
    return title;
  }, [debtorValidation]);

  const shouldShowValidationMessage = useMemo(() => {
    return debtorValidation && (debtorValidation.hasDuplicate || debtorValidation.hasSimilar);
  }, [debtorValidation]);

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => {
        const rowId = getRowId(data);
        return selected.some((el) => getRowId(el) === rowId);
      },
      key: 'checkbox',
      onSelectChange: (data) => {
        const rowId = getRowId(data);
        if (!rowId) {
          return;
        }
        const isCurrentlySelected = selected.some((el) => getRowId(el) === rowId);
        if (isCurrentlySelected) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      sx: { minWidth: '4%' },
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
      key: 'process',
      label: 'Active in',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.processLabel || '-'}
        </Button>
      ),
      sx: { minWidth: '10vw' },
    },
  ];

  const filterDropdownList = searchByOptions ?? SORT_OPTIONS;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions ?? SORT_OPTIONS,
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: filterByDivisionOptions ?? FILTER_DIVISION_OPTIONS,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamList ?? FILTER_GAM_OPTIONS,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    bucketStatus,
    data,
    debtorList,
    debtorValidation,
    filter,
    filterContentList,
    filterDropdownList,
    handleSubmit,
    hasSearched,
    isCheckingStatus,
    isLoading,
    isNewRequestDisabled: isNewRequestDisabled(),
    openModalSimilarDebtor,
    page,
    pageSize,
    retrieveFromLatest,
    selected,
    setFilter,
    setPage,
    setPageSize,
    setRetrieveFromLatest,
    shouldShowRetrieveCheckbox: shouldShowRetrieveCheckbox(),
    shouldShowValidationMessage,
    tableHeader,
    theme,
    validationColor,
    validationIconColor,
    validationLabel,
    validationResult,
  };
};

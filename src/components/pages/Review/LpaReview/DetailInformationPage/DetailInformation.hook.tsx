import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { lpaReview } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { formatDate, toJSDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import useConfirmationLatest from './components/ConfirmationLatest.hook';
import { modal } from './DetailInformation.constants';
import useDeleteCollateral from './hooks/useDeleteCollateral';
import useGetCollateralList from './hooks/useGetCollateralList';
import useGetCollateralListSearch from './hooks/useGetCollateralListSearch';
import useGetLPADetail from './hooks/useGetLPADetail';
import useUpdateLPADetail from './hooks/useUpdateLPADetail';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailInformation = () => {
  const [appState] = useApp();
  const { processId, parentId }: { processId: string; parentId: string } = useParams();
  const { recordActivity } = useRecordLog();
  const [container, setContainer] = useState(null);
  const [approachMethodology, setApproachMethodology] = useState([]);
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const { module, process } = useGetCurrentModule();
  const [filter, setFilter] = useState<SearchValue>({});
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);
  const [lastDeletedCollateral, setLastDeletedCollateral] = useState<any>(null);

  const { differencesData } = useConfirmationLatest();

  const steps = appState.stepper.steps;
  const viewOnly = !steps.find((step) => step.urlPath === 'review-kjpp')?.enable;

  const { data: searchByOptions } = useGetParameterList('searchByLpaInformationCollateral', { label: 'value1', value: 'value2' });
  const { data: typeCollateralOptions } = useGetParameterList('typeCollateralLPA');
  const { data: sortByOptions } = useGetParameterList('sortByCollateralDetail', { label: 'value1', value: 'value2' });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      approachInformation: null,
      assessmentDate: null,
      assessmentPurpose: null,
      bucketProcessId: null,
      costApproach: true,
      costWeight: null,
      earningApproach: true,
      earningWeight: null,
      id: parentId,
      isIncludedInKjppPartner: true,
      kjpp: null,
      marketApproach: true,
      marketWeight: null,
      module: null,
      process: null,
      readonly: viewOnly,
      reconciliation: null,
      remark: '',
      remarkIncludedInKjppPartner: null,
      remarkReconciliation: null,
      reportDate: null,
      reportNo: null,
      roundedLiquidation: null,
      roundedMarketValue: null,
      siteVisitDate: null,
      summaryLiquidation: null,
      summaryMarketValue: null,
    },
  });

  const watchFields = watch();

  // Set dirty message when form has unsaved changes
  useEffect(() => {
    if (!viewOnly && isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, viewOnly, setDirtyMsg]);

  // Clear dirty message on unmount
  useEffect(() => {
    return () => {
      setDirtyMsg(undefined);
    };
  }, [setDirtyMsg]);

  // Determine if we should use search or regular list based on filter
  const hasActiveFilters = filter && (
    (filter.searchDetail?.value && filter.searchDetail.value.length >= 3) ||
    (filter.filter?.jenisAgunan && Array.isArray(filter.filter.jenisAgunan) && filter.filter.jenisAgunan.length > 0) ||
    (filter.sortList && Object.keys(filter.sortList).length > 0)
  );

  const { data: getCollateralData, isLoading: collateralDataIsLoading } = useGetCollateralList({
    bucketProcessId: processId,
    id: parentId,
    module,
    process,
  }, {
    enabled: !hasActiveFilters,
  });

  const { data: searchCollateralData, isLoading: searchCollateralDataIsLoading } = useGetCollateralListSearch({
    bucketProcessId: processId,
    id: parentId,
    module,
    process,
    requestSearch: {
      filter: {},
      searchDetail: {},
      sortList: undefined,
    },
  }, {
    enabled: hasActiveFilters,
  });

  // Use search data when filters are active, otherwise use regular data
  const collateralData = hasActiveFilters ? searchCollateralData : getCollateralData;
  const isLoadingCollateral = hasActiveFilters ? searchCollateralDataIsLoading : collateralDataIsLoading;

  const { data, isLoading } = useGetLPADetail({
    bucketProcessId: processId,
    id: parentId,
    module,
    process,
  });

  // Record activity when LPA detail is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review detail information page',
      });
    }
  }, [data, processId, module, process, recordActivity]);

  const { mutate, isPending } = useUpdateLPADetail({
    onSuccess: () => {
      // Record activity for updating LPA detail
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          approachInformation: 'updated',
          assessmentDate: lastSavedPayload?.assessmentDate,
          kjpp: lastSavedPayload?.kjpp,
          reportNo: lastSavedPayload?.reportNo,
        }),
        changeBefore: JSON.stringify({
          assessmentDate: data?.assessmentDate,
          kjpp: data?.kjpp,
          reportNo: data?.reportNo,
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully saved lpa review detail information',
      });

      reset(getValues());
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => { }, type: 'success' });
    },
  });

  const { mutate: deleteCollateral } = useDeleteCollateral({
    onSuccess: () => {
      // Record activity for deleting collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletedCollateral?.id,
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted collateral from lpa review',
      });

      showNiceModalV2({ onClose: () => { }, type: 'success' });
    },
  });

  // Function to round decimal values
  const roundValue = (value: string | number | null): string => {
    if (!value) return '';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    if (isNaN(numValue)) return '';
    return Math.round(numValue).toLocaleString('en-US');
  };

  useEffect(() => {
    reset(data);

    // Format rounded values from API response
    if ((data as any)?.roundedMarketValue) {
      setValue('roundedMarketValue', (data as any).roundedMarketValue.toLocaleString('en-US'));
    }
    if ((data as any)?.roundedLiquidation) {
      setValue('roundedLiquidation', (data as any).roundedLiquidation.toLocaleString('en-US'));
    }

    let approachMethodologyData = [];
    if (data?.earningApproach === true) approachMethodologyData.push('PENDEKATAN_PENDAPATAN');
    if (data?.marketApproach === true) approachMethodologyData.push('PENDEKATAN_PASAR');
    if (data?.costApproach === true) approachMethodologyData.push('PENDEKATAN_BIAYA');
    setApproachMethodology(approachMethodologyData);
    setReconciliationInput({
      costWeight: data?.costWeight,
      earningWeight: data?.earningWeight,
      marketWeight: data?.marketWeight,
    });

    // Set default values from collateral data if summary values are null
    if (data && collateralData) {
      const currentValues = watch();
      if (!currentValues.summaryMarketValue && collateralData.totalMarketValue) {
        setValue('summaryMarketValue', collateralData.totalMarketValue);
      }
      if (!currentValues.summaryLiquidation && collateralData.totalIndicationLiquidationValue) {
        setValue('summaryLiquidation', collateralData.totalIndicationLiquidationValue);
      }
      // Only set rounded values from collateral data if they don't exist in API response
      if (!(data as any)?.roundedMarketValue && !currentValues.roundedMarketValue &&
        collateralData.totalMarketValue) {
        setValue('roundedMarketValue', roundValue(collateralData.totalMarketValue));
      }
      if (!(data as any)?.roundedLiquidation && !currentValues.roundedLiquidation &&
        collateralData.totalIndicationLiquidationValue) {
        setValue('roundedLiquidation', roundValue(collateralData.totalIndicationLiquidationValue));
      }
    }
  }, [data, isLoading, collateralData]);

  // Auto-round when summary values change (only if rounded values are not manually set)
  useEffect(() => {
    if (watchFields.summaryMarketValue && !(data as any)?.roundedMarketValue) {
      setValue('roundedMarketValue', roundValue(watchFields.summaryMarketValue));
    }
  }, [watchFields.summaryMarketValue, (data as any)?.roundedMarketValue]);

  useEffect(() => {
    if (watchFields.summaryLiquidation && !(data as any)?.roundedLiquidation) {
      setValue('roundedLiquidation', roundValue(watchFields.summaryLiquidation));
    }
  }, [watchFields.summaryLiquidation, (data as any)?.roundedLiquidation]);

  const totalApproachValueData = [
    {
      approachMethodology: 'PENDEKATAN_PENDAPATAN',
      key: 'earningWeight',
      title: 'Pendekatan Pendapatan',
      totalLiquidationValue: approachMethodology.includes('PENDEKATAN_PENDAPATAN') ? parseFloat(collateralData?.totalIndicationLiquidationValue.replace(/,/g, '')) : 0,
      totalMarketValue: approachMethodology.includes('PENDEKATAN_PENDAPATAN') ? parseFloat(collateralData?.totalMarketValue.replace(/,/g, '')) : 0,
    },
    {
      approachMethodology: 'PENDEKATAN_BIAYA',
      key: 'costWeight',
      title: 'Pendekatan Biaya',
      totalLiquidationValue: approachMethodology.includes('PENDEKATAN_BIAYA') ? parseFloat(collateralData?.totalIndicationLiquidationValue.replace(/,/g, '')) : 0,
      totalMarketValue: approachMethodology.includes('PENDEKATAN_BIAYA') ? parseFloat(collateralData?.totalMarketValue.replace(/,/g, '')) : 0,
    },
    {
      approachMethodology: 'PENDEKATAN_PASAR',
      key: 'marketWeight',
      title: 'Pendekatan Pasar',
      totalLiquidationValue: approachMethodology.includes('PENDEKATAN_PASAR') ? parseFloat(collateralData?.totalIndicationLiquidationValue.replace(/,/g, '')) : 0,
      totalMarketValue: approachMethodology.includes('PENDEKATAN_PASAR') ? parseFloat(collateralData?.totalMarketValue.replace(/,/g, '')) : 0,
    }
  ];

  const [reconciliationInput, setReconciliationInput] = useState({
    costWeight: 0,
    earningWeight: 0,
    marketWeight: 0,
  });

  const [totalMaxReconciliationInput, setTotalMaxReconciliationInput] = useState(0);

  const [reconciliationCalculated, setReconciliationCalculated] = useState({
    costWeight: { liquidationValue: 0, marketValue: 0 },
    earningWeight: { liquidationValue: 0, marketValue: 0 },
    marketWeight: { liquidationValue: 0, marketValue: 0 },
  });

  useEffect(() => {
    Object.keys(reconciliationInput).forEach((key) => {
      setReconciliationCalculated((prev) => {
        const approachData = totalApproachValueData.find((data) => data.key === key);

        const newData = { ...prev };
        newData[key] = {
          liquidationValue: reconciliationInput[key] * approachData.totalLiquidationValue / 100,
          marketValue: reconciliationInput[key] * approachData.totalMarketValue / 100,
        };

        return newData;
      });
    });

  }, [reconciliationInput, collateralData]);

  const handleRerouteDetailCollateral = (id: number) => {
    // Record activity for viewing collateral detail
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view collateral detail (collateralId: ${id})`,
    });

    router.push(replacePath(lpaReview.COLLATERAL_DETAIL, {
      id,
      module: moduleIndex,
      parentId,
      processId,
    }));
  };
  useEffect(() => {
    let res;
    res = parseFloat(getValues('costWeight')) + parseFloat(getValues('marketWeight')) + parseFloat(getValues('earningWeight'));
    setTotalMaxReconciliationInput(res);

  }, [watch('costWeight'), watch('marketWeight'), watch('earningWeight')]);

  const handleCheckApproachMethodology = (data) => {
    setApproachMethodology(data);

    // if (data.length > 1 && data.includes('PENDEKATAN_PENDAPATAN')) {
    //   setValue('reconciliation', true);
    // }

    if (!data.includes('PENDEKATAN_PENDAPATAN')) {
      setReconciliationInput((prev) => {
        const newData = { ...prev };
        newData['earningWeight'] = 0;
        return newData;
      });
      setValue('earningWeight', 0, { shouldDirty: true });
    }

    if (!data.includes('PENDEKATAN_BIAYA')) {
      setReconciliationInput((prev) => {
        const newData = { ...prev };
        newData['costWeight'] = 0;
        return newData;
      });
      setValue('costWeight', 0, { shouldDirty: true });
    }

    if (!data.includes('PENDEKATAN_PASAR')) {
      setReconciliationInput((prev) => {
        const newData = { ...prev };
        newData['marketWeight'] = 0;
        return newData;
      });
      setValue('marketWeight', 0, { shouldDirty: true });
    }
  };
  const handleDeleteCollateral = (id: string) => {
    // Check if form has unsaved changes
    if (isDirty) {
      NiceModal.show(MODAL.IS_DIRTY, {
        onSubmit: () => {
          // User confirmed to discard changes, reset form and proceed with delete
          reset(getValues());
          setDirtyMsg(undefined);
          NiceModal.show(MODAL.GLOBAL.CONFIRM, {
            agreeText: 'Ya',
            cancelText: 'Tidak',
            onSubmit: () => {
              const payload = {
                bucketProcessId: processId,
                id,
                module,
                process,
              };
              setLastDeletedCollateral(payload);
              deleteCollateral(payload);
            },
            title: 'Apakah anda yakin untuk menghapus data Agunan?',
          });
        },
        title: 'Apakah Anda yakin ingin menghapus data? Perubahan yang Anda buat tidak akan disimpan.',
      });
    } else {
      // No unsaved changes, proceed directly with delete confirmation
      NiceModal.show(MODAL.GLOBAL.CONFIRM, {
        agreeText: 'Ya',
        cancelText: 'Tidak',
        onSubmit: () => {
          const payload = {
            bucketProcessId: processId,
            id,
            module,
            process,
          };
          setLastDeletedCollateral(payload);
          deleteCollateral(payload);
        },
        title: 'Apakah anda yakin untuk menghapus data Agunan?',
      });
    }
  };

  const collateralDetailTableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'typeLabel',
      label: 'Jenis Agunan',
      sx: { width: '8vw' },
    },
    {
      key: 'indicationLiquidationValue',
      label: 'Total Indikasi nilai Likuidasi',
      sx: { width: '10vw' },
    },
    {
      key: 'marketValue',
      label: 'TotalNilai Pasar',
      sx: { width: '10vw' },
    },
    {
      key: 'total',
      label: 'Total Luas Tanah/Jumlah/Unit/Lot',
      sx: { width: '10w' },
    },
    {
      key: 'objectLocation',
      label: 'Lokasi Objek',
      sx: { width: '8vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (data) => handleRerouteDetailCollateral(data.id),
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (data) => handleRerouteDetailCollateral(data.id),
        },
        {
          iconName: 'delete',
          onClick: (data) => handleDeleteCollateral(data.id),
        },
      ],
      type: 'action',
    },
  ];

  const totalApproachValueTableHeader: TableHeader[] = [
    {
      key: 'title',
      label: 'Uraian',
    },
    {
      key: 'totalMarketValue',
      label: 'Total Nilai Pasar',
      render: (row) => <TextStyle variant="body4">{approachMethodology.includes(row.approachMethodology) ? collateralData?.totalMarketValue : 0}</TextStyle>,
    },
    {
      key: 'totalLiquidationValue',
      label: 'Total Indikasi Nilai Likuidasi',
      render: (row) => <TextStyle variant="body4">{approachMethodology.includes(row.approachMethodology) ? collateralData?.totalIndicationLiquidationValue : 0}</TextStyle>,
    },
  ];

  const reconciliationTableHeader: TableHeader[] = [
    {
      key: 'title',
      label: 'Uraian',
    },
    {
      key: 'weight',
      label: 'Bobot',
      render: (row) => (
        <Controller
          name={row.key}
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              value={watchFields?.[row.key]}
              disabled={!approachMethodology.includes(row.approachMethodology) || viewOnly}
              error={totalMaxReconciliationInput > 100}
              onValueChange={(values) => {
                let value = 0;

                if (value < 0) {
                  value = 0;
                } else if (value > 100) {
                  value = 100;
                } else {
                  value = values.floatValue;
                };
                field.onChange(value);
                setReconciliationInput((prev) => {
                  const newData = { ...prev };
                  newData[row.key] = value;
                  return newData;
                });
              }}
            />
          )}
        />
      ),
      sx: { width: '7.5vw' },
    },
    {
      key: 'marketValue',
      label: 'Nilai Pasar',
      render: (row) => (
        <TextStyle>{formatCurrency(reconciliationCalculated[row.key].marketValue.toFixed(2))}</TextStyle>
      ),
    },
    {
      key: 'liquidationValue',
      label: 'Indikasi Nilai Likuidasi',
      render: (row) => (
        <TextStyle>{formatCurrency(reconciliationCalculated[row.key].liquidationValue.toFixed(2))}</TextStyle>
      ),
    },
  ];

  const handleSubmitData = async (data: any) => {
    const document = await convertToDocx(container);
    const costApproach = approachMethodology.includes('PENDEKATAN_BIAYA');
    const earningApproach = approachMethodology.includes('PENDEKATAN_PENDAPATAN');
    const marketApproach = approachMethodology.includes('PENDEKATAN_PASAR');

    const {
      assessmentDate,
      assessmentPurpose,
      costWeight,
      earningWeight,
      id,
      isIncludedInKjppPartner,
      kjpp,
      marketWeight,
      reportDate,
      reportNo,
      roundedLiquidation,
      roundedMarketValue,
      siteVisitDate,
      reconciliation,
      remarkIncludedInKjppPartner,
      remarkReconciliation,
      summaryLiquidation,
      summaryMarketValue,
    } = data;


    function removeNullProperties(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key];
        }
      }
      return obj;
    }

    const setDateOnly = (value: string) => {
      console.log(value, 'value');
      let dataTemp = formatDate(new Date(value), 'YYYY-MM-DD');

      return dataTemp?.split('T')[0];
    };

    const payload = removeNullProperties({
      approachInformation: document,
      assessmentDate: assessmentDate ? setDateOnly(assessmentDate) : undefined,
      assessmentPurpose,
      bucketProcessId: processId,
      costApproach,
      costWeight,
      earningApproach: earningApproach,
      earningWeight,
      id,
      isIncludedInKjppPartner,
      kjpp,
      marketApproach: marketApproach,
      marketWeight,
      module,
      process,
      reconciliation,
      remarkIncludedInKjppPartner,
      remarkReconciliation,
      reportDate: reportDate ? setDateOnly(reportDate) : undefined,
      reportNo,
      roundedLiquidation: roundedLiquidation ? parseFloat(roundedLiquidation.replace(/,/g, '')) : undefined,
      roundedMarketValue: roundedMarketValue ? parseFloat(roundedMarketValue.replace(/,/g, '')) : undefined,
      siteVisitDate: siteVisitDate ? setDateOnly(siteVisitDate) : undefined,
      summaryLiquidation,
      summaryMarketValue,
    });

    setLastSavedPayload(payload);
    mutate(payload);
  };

  const handleCloseButton = () => {
    router.push(replacePath(lpaReview.REVIEW_KJPP, {
      module: moduleIndex, processId,
    }));
  };

  // Handler for rounded market value - format with thousand separators while typing (no rounding)
  const handleRoundedMarketValueChange = (value: string) => {
    if (!value) {
      setValue('roundedMarketValue', '', { shouldDirty: true });
      return;
    }

    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');

    if (!numericValue) {
      setValue('roundedMarketValue', '', { shouldDirty: true });
      return;
    }

    // Format with thousand separators using commas
    const formattedValue = parseInt(numericValue, 10).toLocaleString('en-US');

    setValue('roundedMarketValue', formattedValue, { shouldDirty: true });
  };

  // Handler for rounded liquidation value - format with thousand separators while typing (no rounding)
  const handleRoundedLiquidationChange = (value: string) => {
    if (!value) {
      setValue('roundedLiquidation', '', { shouldDirty: true });
      return;
    }

    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');

    if (!numericValue) {
      setValue('roundedLiquidation', '', { shouldDirty: true });
      return;
    }

    // Format with thousand separators using commas
    const formattedValue = parseInt(numericValue, 10).toLocaleString('en-US');

    setValue('roundedLiquidation', formattedValue, { shouldDirty: true });
  };

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'jenisAgunan',
      label: 'Jenis Agunan',
      options: typeCollateralOptions,
      type: 'multiple-autocomplete',
    }
  ];

  const changeBgInput = (inputKey: string) => {
    let color = '#FFFFFF';
    if (differencesData?.[inputKey]) {
      color = '#FCE6E8';
    }
    return color;
  };

  const findDataMaster = (inputKey: string) => {
    let label: any = '';
    if (differencesData?.[inputKey]?.business !== undefined) {
      label = differencesData[inputKey].business as any;
    }
    if (['reportDate', 'assessmentDate'].includes(inputKey)) {
      // Format array [YYYY, M, D] => DD/MM/YYYY
      if (Array.isArray(label) && label.length === 3) {
        const [year, month, day] = label;

        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      }

      // Format timestamp
      if (typeof label === 'number') {
        try {
          return new Date(label).toLocaleDateString('id-ID');
        } catch {
          return label;
        }
      }
      return label;
    }

    return label;
  };

  const getDataLabel = () => {
    return 'Data Sebelumnya';
  };

  const needCheckMaster = Boolean(differencesData && Object.keys(differencesData).length > 0);

  const handleAddNewCollateral = () => {
    // Check if form has unsaved changes
    if (isDirty) {
      NiceModal.show(MODAL.IS_DIRTY, {
        onSubmit: () => {
          // User confirmed to discard changes, reset form and proceed with add new
          reset(getValues());
          setDirtyMsg(undefined);
          NiceModal.show(modal.ADD_NEW_COLLATERAL);
        },
        title: 'Apakah Anda yakin ingin menambah agunan baru? Perubahan yang Anda buat tidak akan disimpan.',
      });
    } else {
      // No unsaved changes, proceed directly with add new
      NiceModal.show(modal.ADD_NEW_COLLATERAL);
    }
  };

  return {
    approachMethodology,
    changeBgInput,
    collateralDataIsLoading: isLoadingCollateral,
    collateralDetailTableHeader,
    container,
    data,
    filter,
    filterContentList,
    filterDropdownList,
    findDataMaster,
    getCollateralData: collateralData,
    getDataLabel,
    handleAddNewCollateral,
    handleCheckApproachMethodology,
    handleCloseButton,
    handleRoundedLiquidationChange,
    handleRoundedMarketValueChange,
    handleSubmit,
    handleSubmitData,
    isDirty,
    isLoading,
    isPending,
    needCheckMaster,
    reconciliationCalculated,
    reconciliationInput,
    reconciliationTableHeader,
    register,
    roundValue,
    setApproachMethodology,
    setContainer,
    setFilter,
    setValue,
    totalApproachValueData,
    totalApproachValueTableHeader,
    totalMaxReconciliationInput,
    viewOnly,
    watchFields,
  };
};

export default useDetailInformation;

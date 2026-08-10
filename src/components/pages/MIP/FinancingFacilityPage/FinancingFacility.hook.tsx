import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Checkbox } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from './FinancingFacility.constants';
import useGetFinancingFacilityExistingList from './hooks/useGetFinancingFacilityExistingList';
import useGetFinancingFacilityMipDetail from './hooks/useGetFinancingFacilityMipDetail';
import useSaveFinancingFacility from './hooks/useSaveFinancingFacilityDescription';
import useSetAnnualReviewExisting from './hooks/useSetAnualReviewExisting';


import type { TableHeader } from '@/components/shared/Table/Table.types';


export const detailSchema = yup.object({
  remarkExisting: yup.string().required('Required'),
  remarkOtherBank: yup.string().required('Required'),
});

export const useFinancingFacility = () => {
  const [state] = useApp();
  const { processId } = useIdentity();
  const { goToNextStep } = useContext(MIPContext);
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const form = useForm({
    defaultValues: {
      remarkExisting: '',
      remarkOtherBank: '',
    },
    mode: 'onChange',
  });

  const { formState: { isDirty }, watch } = form;

  const watchedValues = watch();

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, setDirtyMsg]);

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const typeFinancing = debtorInfo?.typeFinancing;

  const isPemda = typeFinancing === 'MUNICIPAL_FINANCING';

  const debtorId = debtorInfo?.debtorId ?? '';

  const facilityExistingPayload = useMemo(() => ({
    filter: {
      debtorId,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }), [debtorId, itemPerPage, noPage]);

  const {
    data: facilityExistingData,
    isFetching: isFetchFacilityExistingLoading,
  } = useGetFinancingFacilityExistingList(
    facilityExistingPayload,
    {
      enabled: !!debtorInfo?.debtorId,
    }
  );

  const { data: facilityDescription, isSuccess: isGetDetailSuccess } = useGetFinancingFacilityMipDetail({
    bucketProcessId: processId as string, module: state.pages.mipModule, process: state.pages.mipProcess,
  }, {
    enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess,
  });

  useEffect(() => {
    if (facilityDescription && isGetDetailSuccess) {
      form.reset({
        remarkExisting: facilityDescription.remarkExisting || '',
        remarkOtherBank: facilityDescription.remarkOtherBank || '',
      });
    }
  }, [facilityDescription, isGetDetailSuccess]);

  const { isPending: isSaveLoading, mutate: saveFinancingFacility } = useSaveFinancingFacility({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({
        type: 'success',
      });
      setDirtyMsg(undefined);
      shouldGoNext ? goToNextStep() : null;
    },
  });

  const { isPending: isSetAnnualReviewLoading, mutate: setAnnualReview } = useSetAnnualReviewExisting({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
    },
  });

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bucketProcessId: String(processId),
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
      remarkExisting: watchedValues.remarkExisting || '',
      remarkOtherBank: watchedValues.remarkOtherBank || '',
    });
  }, [
    processId,
    watchedValues.remarkExisting,
    watchedValues.remarkOtherBank,
    state.pages.mipModule,
    state.pages.mipProcess,
  ]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !!facilityDescription,
    payload: autoSavePayload,
    url: 'mip.financingFacilityOtherBank.save',
  });

  const parseDataPerToIsoFormat = (dateString?: string | null) => {
    if (!dateString) return undefined;

    const [day, month, year] = dateString.split('-');

    if (!day || !month || !year) return undefined;

    return `${year}-${month}-${day}`;
  };

  const tableData = facilityExistingData?.contents.map((item) => {
    const plafond = item.orderValueAfterExchangeRate ?? item.orderValue ?? '';
    const currencyPlafond = item.currencyOrderValueAfterExchangeRate ?? item.currencyOrderValue ?? '';

    return {
      ...item,
      annualReview: item.annualReview ?? false,
      collectability: item.collectability ?? '-',
      currencyOrderValue: item.currencyOrderValue ?? '-',
      currencyOutstanding: item.currencyOutstanding ?? '-',
      currencyPlafond,
      dataPer: parseDataPerToIsoFormat(item.dataPer as string) ?? '-',
      facilityId: item.facilityId ?? '-',
      financingSegment: item.financingSegmentLabel ?? '-',
      orderValue: item.orderValue ?? '-',
      outstanding: item.outstanding,
      plafond,
      product: item.productLabel ?? '-',
      rate: item.rates ?? '-',
    };
  });

  const tablePage = facilityExistingData?.page;

  const handleOnSave = (data) => {
    if (viewOnly) {
      return goToNextStep();
    }

    saveFinancingFacility({
      bucketProcessId: processId,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
      remarkExisting: data.remarkExisting,
      remarkOtherBank: data.remarkOtherBank,
    });

  };

  const tableHeaderExisting: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',

    },
    {
      key: 'facilityId',
      label: 'ID Fasilitas',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'financingSegment',
      label: 'Segmen Pembiayaan',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'product',
      label: 'Produk',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'plafond',
      label: 'Plafond',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.plafond ? `${row?.currencyPlafond ?? ''} ${formatCurrency(String(row?.plafond))}`.trim() : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'outstanding',
      label: 'O/S',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.outstanding ? `IDR ${formatCurrency(String(row?.outstanding))}`.trim() : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'rates',
      label: 'Rate',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'callType',
      label: 'CL/NCL',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'isSyndication',
      label: 'Sindikasi',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'annualReview',
      label: 'Annual Review',
      render: (row) => (
        <Checkbox
          disabled={row?.disabledAnnualReview || isSetAnnualReviewLoading}
          checked={row?.annualReview}
          onChange={(e) => {
            setAnnualReview({
              annualReview: e.target.checked,
              bucketProcessId: processId,
              facilityId: row?.facilityId,
              id: row?.id,
              module: state.pages.mipModule,
              process: state.pages.mipProcess,
            });
          }}
        />
      ),
      sx: { minWidth: '10vw', textAlign: 'center' },
    },
    {
      key: 'collectability',
      label: 'Kolektibilitas',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'dataPer',
      label: 'Data Per',
      render: (row: any) => (
        <TextStyle variant="body4">
          {row?.dataPer ? formatDate(row.dataPer) : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => {
            NiceModal.show(
              modal.DETAIL_FACILITY_EXISTING,
              { id: row?.facilityId }
            );
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  return {
    bucketMasterId: debtorInfo?.bucketMasterId,
    form,
    handleOnSave,
    isAutoSaveFetching,
    isFetchFacilityExistingLoading,
    isPemda,
    isSaveLoading,
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    setShouldGoNext,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    tableData,
    tableHeaderExisting,
    tablePage,
  };
};

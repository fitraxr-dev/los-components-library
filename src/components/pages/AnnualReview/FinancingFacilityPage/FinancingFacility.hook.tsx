import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Checkbox } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { formatCurrency } from '@/helpers/formatCurrency';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from './FinancingFacility.constants';
import useGetFinancingFacilityExistingList from './hooks/useGetFinancingFacilityExistingList';
import useGetFinancingFacilityMipDetail from './hooks/useGetFinancingFacilityMipDetail';
import useSaveFinancingFacility from './hooks/useSaveFinancingFacilityDescription';
import useSetAnnualReview from './hooks/useSetAnualReview';


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
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const form = useForm({
    defaultValues: {
      remarkExisting: '',
      remarkOtherBank: '',
    },
    mode: 'onChange',
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [router]);

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

  const { mutate: updateMipr } = useUpdateMipr({
    onError: () => {
      console.error('Failed to update MIPR stepper');
    },
    onSuccess: () => {
      console.log('MIPR stepper updated successfully');
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
    },
  });

  useEffect(() => {
    if (!stepperData?.steps || !processId) return;

    const requiredKeys = [
      'identify-legal-risks',
      'environmental-and-social-safeguard-issue',
      'sharia-compliance-aspect',
      'risk-profile',
    ];

    const requiredSteps = stepperData.steps.filter((step) =>
      requiredKeys.includes(step.key ?? '')
    );

    const shouldUpdate =
      stepperData.from === 'MIP_REVIEW' &&
      (requiredSteps.length < 4 ||
        requiredSteps.some((step) => step.enable === false));

    if (shouldUpdate) {
      updateMipr({ bucketParent: String(processId) });
    }
  }, [stepperData, processId]);

  const typeFinancing = debtorInfo?.typeFinancing;

  const isPemda = typeFinancing === 'MUNICIPAL_FINANCING';

  const {
    data: facilityExistingData,
    isFetching: isFetchFacilityExistingLoading,
  } = useGetFinancingFacilityExistingList({
    filter: {
      bucketProcessId: processId as string,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  }, {
    enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess,
  });

  const { data: facilityDescription, isSuccess: isGetDetailSuccess } = useGetFinancingFacilityMipDetail({
    bucketProcessId: processId as string, module: state.pages.mipModule, process: state.pages.mipProcess,
  }, {
    enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess,
  });

  useEffect(() => {
    if (facilityDescription && isGetDetailSuccess) {
      form.reset({
        remarkExisting: facilityDescription.remarkExisting,
        remarkOtherBank: facilityDescription.remarkOtherBank,
      });
    }
  }, [facilityDescription]);

  const { isPending: isSaveLoading, mutate: saveFinancingFacility } = useSaveFinancingFacility({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({
        type: 'success',
      });
      setDirtyMsg(undefined);
    },
  });

  const { isPending: isSetAnnualReviewLoading, mutate: setAnnualReview } = useSetAnnualReview({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
    },
  });

  const tableData = facilityExistingData?.contents.map((item) => ({
    ...item,
    annualReview: item.annualReview ?? '-',
    collectability: item.collectabilityLabel ?? '-',
    dataPer: item.dataPer ?? '-',
    facilityId: item.facilityId ?? '-',
    financingSegment: item.financingSegmentLabel ?? '-',
    outstanding: item.outstanding,
    product: item.productLabel ?? '-',
  }));

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
          {`${row?.currencyPlafond} ${formatCurrency(row?.plafond)}`}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'outstanding',
      label: 'O/S',
      render: (row) => (
        <TextStyle variant="body4">
          {`${row?.currencyOutstanding} ${formatCurrency(row?.outstanding)}`}
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
              id: row?.id,
            });
          }}
          sx={{ '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' } }}
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
      render: (row) => (
        <TextStyle variant="body4">
          {dayjs(row?.dataPer).format('DD MMMM YYYY')}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
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
              { id: row?.id }
            );
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  return {
    form,
    handleOnSave,
    isFetchFacilityExistingLoading,
    isPemda,
    isSaveLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeaderExisting,
    tablePage,
  };
};

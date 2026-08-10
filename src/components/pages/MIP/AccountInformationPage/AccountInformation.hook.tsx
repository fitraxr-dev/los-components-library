import { useContext, useEffect, useState, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { LEAVE_PAGE_CONFIRMATION } from '@/configs/constants/modal';
import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, formatNumberToNominal } from '@/helpers/utils';
import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetDetailExtraInformation from '../../MUP/ExtraInformationPage/hooks/useGetDetailExtraInformation';
import useSaveExtraInformation from '../../MUP/ExtraInformationPage/hooks/useSaveExtraInformation';

import { modal } from './AccountInformation.constants';
import useDeleteAccountInformation from './hooks/useDeleteAccountInformation';
import useGetAccountInformationList from './hooks/useGetAccountInformationList';


import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAccountInformation = () => {
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { processId }: {processId: string} = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [desc, setDesc] = useState('');
  const [initialDesc, setInitialDesc] = useState<string | undefined>(undefined);

  const { data: detailExtraInformation, isSuccess } = useGetDetailExtraInformation({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  }, { enabled: !!processId && !!state.pages.mipModule && !!state.pages.mipProcess });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  useEffect(() => {
    // Only check for dirty state after initial data has been loaded
    if (initialDesc !== undefined) {
      if (desc !== initialDesc) {
        setDirtyMsg(LEAVE_PAGE_CONFIRMATION);
      } else {
        setDirtyMsg(undefined);
      }
    }
  }, [desc, initialDesc, setDirtyMsg]);

  const {
    data: accountInfoList,
    isLoading: isAccountInfoListLoading,
  } = useGetAccountInformationList({
    filter: {
      bucketProcessId: processId,
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

  const { mutate: deleteAccountInfo } = useDeleteAccountInformation({
    onSuccess: () => showNiceModal('success', 'Data berhasil dihapus'),
  });

  const { mutate: saveExtraInformation, isPending: isSaveLoading } = useSaveExtraInformation({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      setInitialDesc(desc); // Update initial value after successful save
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: processId,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      }]});
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      shouldGoNext ? goToNextStep() : null;
    },
  });

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const formData = new FormData();
    formData.append('bucketProcessId', String(processId));
    formData.append('disclaimer', desc || '');
    formData.append('module', state.pages.mipModule);
    formData.append('process', state.pages.mipProcess);

    return Promise.resolve(formData);
  }, [processId, desc, state.pages.mipModule, state.pages.mipProcess]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !viewOnly && initialDesc !== undefined,
    payload: autoSavePayload,
    url: 'mip.extraInformation.save',
  });

  const getNominalIdr = (nominal, excRate) => {
    const nominalIdrOnExchange = nominal * excRate;

    if (nominal) {
      if (excRate) {
        return `IDR ${formatNumberToNominal(String(nominalIdrOnExchange)) }`;
      } else {
        return nominal ? `IDR  ${formatNumberToNominal(String(nominal))}` : '-';
      }
    } else {
      return '-';
    }
  };

  const tableData = accountInfoList?.data?.contents?.map((item) => ({
    ...item,
    bank: item.bankLabel || '-',
    debtorCode: item.debtorCode || '-',
    nominal: item.nominal ? `${item.nominalCurrency} ${formatNumberToNominal(String(item.nominal))}` : '-',
    nominalIdr: getNominalIdr(item.nominal, item.excRate),
    product: item.product || '-',
    rate: item.rate || '-',
    reference: item.reference || '-',
  }));

  const tablePage = accountInfoList?.data?.page;

  useEffect(() => {
    if (detailExtraInformation && isSuccess) {
      // description should be from detailExtraInformation.description, not from .disclaimer
      // this approach is only for temporary case due to pending on the backend side
      // will be update further after the backend is ready - Albert - 28/02/25
      const initialValue = detailExtraInformation?.disclaimer || '';
      setDesc(initialValue);
      setInitialDesc(initialValue);
    }
  }, [detailExtraInformation, isSuccess]);

  const handleSave = () => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveExtraInformation({
        bucketProcessId: String(processId),
        disclaimer: desc || '',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const handleDeleteAccountInformation = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteAccountInfo({ id }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const tableHeaderAccountInfo: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',

    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'bank',
      label: 'Bank',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'product',
      label: 'Produk',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'rate',
      label: 'Rate',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'nominal',
      label: 'Nominal',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'nominalIdr',
      label: 'Nominal (Dalam IDR)',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'reference',
      label: 'Reference',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isDisabled: viewOnly,
          onClick: (row) => {
            NiceModal.show(modal.FORM_ACCOUNT_INFORMATION, { id: row?.id });
          },
        },
        {
          iconName: 'delete',
          isDisabled: viewOnly,
          onClick: (row) => handleDeleteAccountInformation(row?.id),
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const handleOpenAddModal = () => {
    NiceModal.show(modal.FORM_ACCOUNT_INFORMATION);
  };

  return {
    bucketMasterId: debtorInfoData?.bucketMasterId,
    desc,
    handleOpenAddModal,
    handleSave,
    isAccountInfoListLoading,
    isAutoSaveFetching,
    isSaveLoading,
    itemPerPage,
    noPage,
    setDesc,
    setItemPerPage,
    setNoPage,
    setShouldGoNext,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    tableData,
    tableHeaderAccountInfo,
    tablePage,
  };
};

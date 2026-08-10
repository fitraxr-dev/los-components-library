import { useEffect, useMemo, useRef } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { virtualAccount } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetBankList from '../../hooks/useGetBankList';
import useGetVaPramList from '../../hooks/useGetVaPramList';
import useSaveVa from '../../hooks/useSaveVa';
import { modal } from '../../ListPage/List.constants';

import { addEditVaSchema } from './AddEditVA.schema';


interface Data {
  id?: number;
  bank?: string;
  currency?: string;
  customerType?: string;
  vaType?: string;
}

interface AddEditVaProps {
  action: 'Add' | 'Edit';
  data?: Data;
}

const useAddEditVa = (props: AddEditVaProps) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { action, data } = props;
  const router = useRouter();
  const { processId } = useIdentity();
  const [debtorIdFromProcess, bucketProcessId] = processId?.split('~') ?? [];
  const { recordActivity } = useRecordLog();

  const { control, watch, setValue, formState: { isValid }, handleSubmit, reset } = useForm({
    defaultValues: {
      bank: data?.bank || '',
      currency: data?.currency || '',
      customerType: data?.customerType || '',
      vaType: data?.vaType || '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(addEditVaSchema),
  });

  const form = watch();
  const selectedBank = watch('bank');
  const selectedVaType = watch('vaType');
  const selectedCurrency = watch('currency');

  const watchedValues = watch();

  const isCurrencyEnabled = !!selectedBank;
  const isVaTypeEnabled = !!(selectedBank && selectedCurrency);
  const isCustomerTypeEnabled = !!(selectedBank && selectedCurrency && selectedVaType);
  const isFirstMount = useRef(true);
  const prevBankRef = useRef<string | undefined>(undefined);
  const prevCurrencyRef = useRef<string | undefined>(undefined);
  const prevVaTypeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevBankRef.current = selectedBank;
      prevCurrencyRef.current = selectedCurrency;
      prevVaTypeRef.current = selectedVaType;
      return;
    }
    if (prevBankRef.current !== selectedBank) {
      setValue('currency', '');
      setValue('vaType', '');
      setValue('customerType', '');
    }
    if (prevCurrencyRef.current !== selectedCurrency) {
      setValue('vaType', '');
      setValue('customerType', '');
    }
    if (prevVaTypeRef.current !== selectedVaType) {
      setValue('customerType', '');
    }
    prevBankRef.current = selectedBank;
    prevCurrencyRef.current = selectedCurrency;
    prevVaTypeRef.current = selectedVaType;
  }, [selectedBank, selectedCurrency, selectedVaType, setValue]);

  useEffect(() => {
    if (action === 'Edit' && data) {
      reset({
        bank: data.bank,
        currency: data.currency,
        customerType: data.customerType,
        vaType: data.vaType,
      });
    }
  }, [action, data, reset]);

  const { data: bankOptions } = useGetBankList();
  const { data: currencyOptions } = useGetVaPramList(
    { bankName: selectedBank, key: 'currency' },
    { label: 'key', value: 'key' },
    { enabled: isCurrencyEnabled },
  );
  const { data: vaTypeOptions } = useGetVaPramList(
    { bankName: selectedBank, currency: selectedCurrency, key: 'vaType' },
    { label: 'key', value: 'key' },
    {
      enabled: isVaTypeEnabled,
      queryKey: ['param-list-va', { bankName: selectedBank, currency: selectedCurrency, key: 'vaType' }],
    },
  );
  const { data: customerTypeOptions } = useGetVaPramList(
    { bankName: selectedBank, currency: selectedCurrency, key: 'customerType', vaType: selectedVaType },
    { label: 'key', value: 'key' },
    {
      enabled: isCustomerTypeEnabled,
      queryKey: ['param-list-va', { bankName: selectedBank, currency: selectedCurrency, key: 'customerType', vaType: selectedVaType }],
    },
  );

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bankPrefix: watchedValues.bank || '',
      bucketProcessId: bucketProcessId === 'VA-ID' ? null : bucketProcessId,
      currency: watchedValues.currency || '',
      customerType: watchedValues.customerType || '',
      debtorId: debtorIdFromProcess,
      id: data?.id,
      vaType: watchedValues.vaType || '',
    };

    return Promise.resolve(payload);
  }, [
    watchedValues.bank,
    watchedValues.currency,
    watchedValues.customerType,
    watchedValues.vaType,
    bucketProcessId,
    debtorIdFromProcess,
    data?.id,
  ]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: action === 'Edit' && !!data,
    payload: autoSavePayload,
    url: 'master.virtualAccount.save',
  });

  const { mutate: saveVirtualAccount, isPending: isSaveLoading } = useSaveVa({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || 'Terjadi kesalahan, silahkan coba lagi';
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (response) => {
      recordActivity({
        activity: action === 'Edit' ? ActivityType.EDIT : ActivityType.ADD,
        bucketProcessId: response?.data?.content?.bucketProcessId || bucketProcessId,
        changeAfter: JSON.stringify(form),
        changeBefore: action === 'Edit' ? JSON.stringify(data) : '',
        module: TypeModule.VA_CREATION,
        process: TypeProcess.VA_CREATION,
        remarks: `${action} Virtual Account for Debtor ${debtorIdFromProcess}`,
      });
      queryClient.invalidateQueries({ queryKey: ['va-list']});
      queryClient.invalidateQueries({ queryKey: ['va-list-request']});
      localStorage.setItem('bucketProcessIdVA', response?.data?.content?.bucketProcessId || '');
      closeNiceModal(modal.ADD_EDIT_VA);
      showNiceModalV2({
        onClose: () => {
          // window.location.reload();
          const nextPath = replacePath(virtualAccount.VA_DETAIL,
            { processId: `${debtorIdFromProcess}~${response?.data?.content?.bucketProcessId}` });

          router.push(nextPath);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    const payload = {
      bankPrefix: form.bank,
      bucketProcessId: bucketProcessId === 'VA-ID' ? null : bucketProcessId,
      currency: form.currency,
      customerType: form.customerType,
      debtorId: debtorIdFromProcess,
      id: action === 'Edit' ? data?.id : undefined,
      vaType: form.vaType,
    };

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        saveVirtualAccount(payload as any);
      },
      submitText: 'Ya',
      title: 'Pastikan Data Sudah Sesuai',
      type: 'warning',
    });
  };

  return {
    action,
    bankOptions,
    control,
    currencyOptions,
    customerTypeOptions,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isCurrencyEnabled,
    isCustomerTypeEnabled,
    isSaveLoading,
    isVaTypeEnabled,
    isValid,
    selectedBank,
    theme,
    vaTypeOptions,
  };
};

export default useAddEditVa;

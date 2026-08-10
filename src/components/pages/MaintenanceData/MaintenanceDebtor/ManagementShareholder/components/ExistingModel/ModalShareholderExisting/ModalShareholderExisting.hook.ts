import { useEffect, useMemo } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, parseNumber } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';


import useGetShareholderById from '../../../hooks/useGetShareholderById';
import useSaveShareholder from '../../../hooks/useSaveShareholder';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalShareholderExisting.constants';

import type { ModalShareholderExistingProps } from './ModalShareholderExisting.type';
import type { ShareholderSaveRequestDto } from '@/services/openapi/master-service';


const useModalShareholderExisting = (props: ModalShareholderExistingProps) => {
  const { debtorId } = useIdentity();
  const theme = useTheme();
  const modalId = modalData.MODAL_SHAREHOLDER_EXISTING;
  const modal = useModal(modalId);

  const { isPending: isSaveLoading, mutate } = useSaveShareholder({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Shareholder', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Shareholder', type: 'success' });
      });
    },
  });

  const { data } = useGetShareholderById({
    id: props.id,
  });

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);

  const { getValues, setValue, watch, formState: { isValid }, reset, handleSubmit, control } = useForm({
    defaultValues: {
      exchangeRate: {
        currency: 'IDR',
        value: '',
      },
      jobPosition: null,
      name: '',
      nik: '',
      nikFile: {
        extension: '',
        file: null,
        name: '',
        url: '',
      },
      nominal: {
        currency: 'IDR',
        value: '',
      },
      npwp: '',
      npwpFile: {
        extension: '',
        file: null,
        name: '',
        url: '',
      },
      percentage: '',
      shares: '',
      type: '',
      valuePerShares: {
        currency: 'IDR',
        value: '',
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      setValue('name', data.name);
      setValue('npwp', data.npwp);
      setValue('nik', data.nik);
      setValue('shares', data.shares);
      setValue('type', data.ownershipType);
      setValue('valuePerShares', {
        currency: data.curValuePerShare,
        value: data.valuePerShare,
      });
      setValue('percentage', data.percentage.toString());
      setValue('nominal', {
        currency: 'IDR',
        value: data.value,
      });
      setValue('exchangeRate', {
        currency: 'IDR',
        value: data.exchangeRate,
      });
      setValue('jobPosition', data.jobPosition);

      if (data.listDocuments.length > 0) {
        const npwpDoc = data.listDocuments?.find((item) => item.documentType === 'NPWP_SHAREHOLDER');
        const nikDoc = data.listDocuments?.find((item) => item.documentType === 'NIK_SHAREHOLDER');

        const npwpFile = npwpDoc ? {
          extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
          name: npwpDoc.documentName,
          url: npwpDoc.document,
        } : null;

        const nikFile = nikDoc ? {
          extension: nikDoc.documentExtension ? `.${nikDoc.documentExtension}` : null,
          name: nikDoc.documentName,
          url: nikDoc.document,
        } : null;

        setValue('npwpFile', npwpFile);
        setValue('nikFile', nikFile);
      }
    }
  }, [data, setValue]);


  const getValuesNominal = useMemo(() => {
    const { valuePerShares, shares, exchangeRate } = watch();

    const sharesValue = parseNumber(shares);
    const valuePerShare = parseNumber(valuePerShares.value);
    const exchangeRateValue = parseNumber(exchangeRate.value);

    switch (valuePerShares.currency) {
      case 'USD':
        return {
          currency: 'IDR',
          value: formatNumber((sharesValue * valuePerShare * exchangeRateValue).toString()),
        };

      default:
        return {
          currency: 'IDR',
          value: formatNumber((sharesValue * valuePerShare).toString()),
        };
    }
  }, [watch('valuePerShares'), watch('shares'), watch('exchangeRate')]);

  const mutateShareholder = () => {
    const formValues = getValues();
    const { npwpFile, nikFile, valuePerShares, nominal, type, exchangeRate } = formValues;

    let listDocuments = [];

    if (npwpFile?.file) {
      listDocuments.push({
        base64: npwpFile.file,
        documentType: 'NPWP',
        fileExt: npwpFile.extension,
        fileName: npwpFile.name,
      });
    }

    if (nikFile?.file) {
      listDocuments.push({
        base64: nikFile.file,
        documentType: 'NIK',
        fileExt: nikFile.extension,
        fileName: nikFile.name,
      });
    }

    const updatedShareholder: ShareholderSaveRequestDto = {
      ...formValues,
      curValuePerShare: valuePerShares.currency,
      debtorId,
      exchangeRate: exchangeRate.value,
      id: props.id,
      listDocuments,
      ownershipType: type,
      percentage: parseNumber(formValues.percentage),
      value: nominal.value,
      valuePerShare: valuePerShares.value,
    };

    mutate(updatedShareholder);
  };

  return {
    control,
    getValues,
    getValuesNominal,
    handleSubmit,
    institutiontypeData,
    isSaveLoading,
    isValid,
    jobPositionData,
    modal,
    modalId,
    mutateShareholder,
    reset,
    setValue,
    theme,
    watch,
  };


};

export default useModalShareholderExisting;

import { useEffect, useRef } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadBinaryPdf } from '@/helpers/utils';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';

import { SITEVISIT_VALIDATION_SCHEMA } from '../constants/schema';

import useGenerateSiteVisitMemo from './useGenerateSiteVisitMemo';
import useGetVisitLocationDetail from './useGetVisitLocationDetail';
import useSaveSiteVisitLocation from './useSaveSiteVisitLocation';
import useSiteVisitContext from './useSiteVisitContext';

import type { InferType } from 'yup';


const useSiteVisitForm = ({
  onSuccessSave,
  visibleAdd,
  visitCode,
  setIsValidForm,
  isPemda,
}: {
  onSuccessSave: (data: any, variables: any) => void;
  visibleAdd?: boolean;
  visitCode: any;
  setIsValidForm?: (value: boolean) => void;
  isPemda?: boolean;
}) => {

  const { siteVisitDetail } = useSiteVisitContext();
  const { processId } = useIdentity();
  const queryClient = useQueryClient();


  const visibleAddRef = useRef(visibleAdd);
  const visitCodeRef = useRef(visitCode);
  const onSuccessSaveRef = useRef(onSuccessSave);

  visibleAddRef.current = visibleAdd;
  visitCodeRef.current = visitCode;
  onSuccessSaveRef.current = onSuccessSave;

  const { data, isFetching: isFetchingDebtor } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
  }, { refetchOnWindowFocus: false });

  const bucketMasterId = data?.bucketMasterId;

  const {
    data: siteVisitData,
    refetch: refetchSiteVisitData,
    isFetching: isFetchingSiteVisitData,
  } = useGetVisitLocationDetail(
    {
      bucketMasterId: bucketMasterId,
      bucketProcessId: siteVisitDetail?.bucketId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      visitCode: visibleAddRef.current ? visitCodeRef.current?.visitCode : siteVisitDetail?.visitCode,
    }, !!bucketMasterId && !!siteVisitDetail);

  const { mutate: generateSiteVisitMemo } = useGenerateSiteVisitMemo({
    onError: () => {
      showNiceModalV2({
        title: 'Draft gagal digenerate',
        type: 'error',
      });
    },
    onSuccess: async (res) => {
      const fileName = `${processId}-draft-laporan-site-visit`;
      await downloadBinaryPdf(res, fileName);
    },
  });


  const isLoadingData = isFetchingDebtor || isFetchingSiteVisitData;

  type Form = InferType<ReturnType<typeof SITEVISIT_VALIDATION_SCHEMA>>;

  const form = useForm<Form>({
    defaultValues: {
      bucketMasterId: bucketMasterId,
      bucketProcessId: processId,
      clientNote: '',
      clientParty: [],
      debtorAddress: {
        address: '',
        city: '',
        description: '',
        district: '',
        postalCode: '',
        province: '',
        subDistrict: '',
      },
      debtorId: data?.debtorId,
      debtorName: '',
      deletedPartyId: [],
      endDate: '',
      evidence: '',
      externalNote: '',
      externalParty: [],
      id: null,
      institutionType: '',
      internalParty: [],
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      remarks: '',
      reportDate: '',
      startDate: '',
      surveyorNote: '',
      visitAddress: {
        address: '',
        city: '',
        description: '',
        district: '',
        postalCode: '',
        province: '',
        subDistrict: '',
      },
      visitCode: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(SITEVISIT_VALIDATION_SCHEMA(isPemda)),
    // shouldUseNativeValidation: true,
  });

  const { setValue, getValues, watch, trigger, formState } = form;

  const { mutate: saveSiteVisitLocation, isPending: isSavePending } = useSaveSiteVisitLocation({
    onError() {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess(data, variables) {
      if (onSuccessSaveRef.current) {
        onSuccessSaveRef.current(data, variables);
      }
      queryClient.invalidateQueries({
        queryKey: ['bucket-stepper', {
          bucketProcessId: variables.bucketProcessId,
          module: variables.module,
          process: variables.process,
        }],
      });

      // Hanya tampilkan modal success jika tidak ada error validasi
      const hasValidationErrors = Object.keys(formState.errors).length > 0;
      if (!hasValidationErrors) {
        showNiceModalV2({
          onClose: () => {
            window.scrollTo({
              behavior: 'smooth',
              top: document.documentElement.scrollHeight,
            });
          },
          type: 'success',
        });
      }
    },
  });

  //Set Customer Information
  useEffect(() => {
    if (data && !isFetchingDebtor) {
      setValue('bucketProcessId', siteVisitDetail?.bucketId || processId);
      setValue('debtorName', data?.debtorName);
      setValue('debtorId', data?.debtorId);
      setValue('institutionType', data?.institutionType);
    }
  }, [data, processId, isFetchingDebtor, visibleAdd]);

  //Set Site Visit Detail
  useEffect(() => {
    if (siteVisitDetail?.id && siteVisitData && !isFetchingSiteVisitData) {
      // Clear semua error sebelum set data baru
      form.clearErrors();
      setValue('id', siteVisitData?.id);
      setValue('debtorAddress.address', siteVisitData?.debtorAddress?.address || '');
      setValue('debtorAddress.city', convertStringToAddressObject(siteVisitData?.debtorAddress?.city));
      setValue('debtorAddress.district', convertStringToAddressObject(siteVisitData?.debtorAddress?.district));
      setValue('debtorAddress.postalCode', siteVisitData?.debtorAddress?.postalCode || '');
      setValue('debtorAddress.province', convertStringToAddressObject(siteVisitData?.debtorAddress?.province));
      setValue('debtorAddress.subDistrict', convertStringToAddressObject(siteVisitData?.debtorAddress?.subDistrict));
      setValue('evidence', siteVisitData?.evidence);
      setValue('visitAddress.address', siteVisitData?.visitAddress?.address || '');
      setValue('visitAddress.city', convertStringToAddressObject(siteVisitData?.visitAddress?.city));
      setValue('visitAddress.district', convertStringToAddressObject(siteVisitData?.visitAddress?.district));
      setValue('visitAddress.postalCode', siteVisitData?.visitAddress?.postalCode || '');
      setValue('visitAddress.province', convertStringToAddressObject(siteVisitData?.visitAddress?.province));
      setValue('visitAddress.subDistrict', convertStringToAddressObject(siteVisitData?.visitAddress?.subDistrict));
      // setValue('id', siteVisitData?.id);
      setValue('endDate', siteVisitData?.endDate);
      setValue('startDate', siteVisitData?.startDate);
      setValue('reportDate', siteVisitData?.reportDate);
      setValue('remarks', siteVisitData?.remarks);
    }
  }, [isFetchingSiteVisitData]);

  //Set Owner Parties
  useEffect(() => {
    if (siteVisitDetail?.id && siteVisitData && !isFetchingSiteVisitData) {
      // Clear error untuk internalParty
      form.clearErrors('internalParty');
      setValue('surveyorNote', siteVisitData?.surveyorNote);
      if (siteVisitData?.internalParty?.length) {
        setValue('internalParty', siteVisitData?.internalParty.map((d) => ({
          division: d?.instance,
          id: d?.id,
          name: d?.name,
          position: d?.position,
          staffId: d?.staffId,
          type: d?.type,
        })));
      }
    }
  }, [isFetchingSiteVisitData]);

  //Set Client Parties
  useEffect(() => {
    if (siteVisitDetail?.id && siteVisitData && !isFetchingSiteVisitData) {
      // Clear error untuk clientParty
      form.clearErrors('clientParty');
      setValue('clientNote', siteVisitData?.clientNote);
      if (siteVisitData?.clientParty?.length) {
        setValue('clientParty', siteVisitData?.clientParty.map((d) => ({
          id: d?.id,
          instance: d?.instance,
          name: d?.name,
          position: d?.position,
          type: d?.type,
        })));
      }
    }
  }, [isFetchingSiteVisitData]);

  //Set Other Parties
  useEffect(() => {
    if (siteVisitDetail?.id && siteVisitData && !isFetchingSiteVisitData) {
      setValue('externalNote', siteVisitData?.externalNote);
      if (siteVisitData?.externalParty?.length) {
        setValue('externalParty', siteVisitData?.externalParty.map((d) => ({
          id: d?.id,
          instance: d?.instance,
          name: d?.name,
          position: d?.position,
          type: d?.type,
        })));
      }
    }
  }, [isFetchingSiteVisitData]);

  useEffect(() => {
    if (siteVisitDetail?.id) {
      refetchSiteVisitData();
      // Reset deletedPartyId saat load data baru
      setValue('deletedPartyId', []);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-visit-detail']});
      // Reset deletedPartyId saat add baru
      setValue('deletedPartyId', []);
    }

    setValue('debtorName', data.debtorName);
    setValue('debtorId', data?.debtorId);
  }, [siteVisitDetail?.id]);


  const extractAddressFieldValue = (fieldPath: string): string => {
    const value = getValues(fieldPath);
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value || '';
    }
    return value || '';
  };

  const isMandatoryEmpty = isPemda
    ? // For PEMDA, all fields are optional - form is always valid
    false
    : // For non-PEMDA, check all mandatory fields
    !watch('debtorAddress.address') ||
      !extractAddressFieldValue('debtorAddress.province') ||
      !extractAddressFieldValue('debtorAddress.city') ||
      !extractAddressFieldValue('debtorAddress.district') ||
      !extractAddressFieldValue('debtorAddress.subDistrict') ||
      !watch('debtorAddress.postalCode') ||
      !watch('internalParty')?.length ||
      !watch('clientParty')?.length ||
      !watch('startDate') ||
      !watch('endDate') ||
      !watch('reportDate');

  useEffect(() => {
    // Jika data dari history dan bukan isPemda, selalu valid
    if (siteVisitDetail?.isFromHistory && !isPemda) {// Untuk semua kasus lain (termasuk isPemda), cek mandatory fields
      setIsValidForm(true);
    } else {
      // Untuk semua kasus lain (termasuk isPemda), cek mandatory fields
      setIsValidForm(!isMandatoryEmpty);
    }
  }, [siteVisitDetail, isMandatoryEmpty, setIsValidForm, isPemda]);

  const onSave = async () => {
    const isValid = await trigger();

    const currentVisibleAdd = visibleAddRef.current;
    const currentVisitCode = visitCodeRef.current;

    const allValue = getValues();

    const payload = {
      ...allValue,
      bucketMasterId: bucketMasterId,
      clientParty: allValue?.clientParty,
      debtorAddress: {
        address: allValue?.debtorAddress?.address || '',
        city: extractAddressFieldValue('debtorAddress.city'),
        district: extractAddressFieldValue('debtorAddress.district'),
        postalCode: allValue?.debtorAddress?.postalCode || '',
        province: extractAddressFieldValue('debtorAddress.province'),
        subDistrict: extractAddressFieldValue('debtorAddress.subDistrict'),
      },
      deletedPartyId: allValue?.deletedPartyId || [],
      externalParty: allValue?.externalParty,
      internalParty: allValue?.internalParty,
      visitAddress: {
        address: allValue?.visitAddress?.address || '',
        city: extractAddressFieldValue('visitAddress.city'),
        district: extractAddressFieldValue('visitAddress.district'),
        postalCode: allValue?.visitAddress?.postalCode || '',
        province: extractAddressFieldValue('visitAddress.province'),
        subDistrict: extractAddressFieldValue('visitAddress.subDistrict'),
      },
      visitCode: currentVisibleAdd ? currentVisitCode?.visitCode : siteVisitDetail?.visitCode,
    };

    // Cek apakah ada error validasi
    const hasValidationErrors = Object.keys(formState.errors).length > 0;
    const isMandatoryFilled = !isMandatoryEmpty;

    // Jika validasi schema berhasil dan mandatory terisi
    if (isValid && isMandatoryFilled && !hasValidationErrors) {
      saveSiteVisitLocation(payload);
      window.location.reload();
    } else {
      // Jika ada error validasi atau mandatory kosong, tidak save dan tidak tampilkan modal success
      const title = hasValidationErrors
        ? 'Data tidak valid, simpan perubahan?'
        : 'DATA MANDATORY belum terisi, simpan perubahan?';

      showNiceModalV2({
        cancelText: 'Batal',
        onSubmit: () => saveSiteVisitLocation(payload),
        submitText: 'Simpan',
        title,
        type: 'warning',
      });
    }
  };

  const getLabelTypeObject = (fieldPath: string): string => {
    const value = getValues(fieldPath);
    if (value && typeof value === 'object' && 'label' in value) {
      return value.label || '';
    }
    return value || '';
  };

  const handleGenerateDraft = () => {
    const allValue = getValues();

    NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        { key: 'pdf', label: 'PDF' },
        { key: 'docx', label: 'WORD' },
      ],
      onSubmit: (file: string) => {
        const formatDebtorAddress =
          `${allValue?.debtorAddress?.address}, ${getLabelTypeObject('debtorAddress.province')},` +
          `${getLabelTypeObject('debtorAddress.city')}, ${getLabelTypeObject('debtorAddress.district')},` +
          `${getLabelTypeObject('debtorAddress.subDistrict')}, ${allValue?.debtorAddress?.postalCode}`;
        const address = allValue?.visitAddress?.address || '';
        const province = getLabelTypeObject('visitAddress.province') || '';
        const city = getLabelTypeObject('visitAddress.city') || '';
        const district = getLabelTypeObject('visitAddress.district') || '';
        const subDistrict = getLabelTypeObject('visitAddress.subDistrict') || '';
        const postalCode = allValue?.visitAddress?.postalCode || '';
        const formatSiteVisitAddress = [address, province, city, district, subDistrict, postalCode]
          .filter((item) => item !== '')
          .join(', ');
        const client = allValue?.clientParty;
        const others = allValue?.externalParty;
        const owners = allValue?.internalParty;

        generateSiteVisitMemo({
          clientPeople: formatClientPeople(client),
          debiturAddress: formatPayloadAdress(formatDebtorAddress),
          debiturName: data.debtorName,
          fileExtension: file,
          locationAddress: formatPayloadAdress(formatSiteVisitAddress),
          otherPeople: formatOtherPeople(others),
          smiPeople: formatSmiPeople(owners),
          visitDate: `${toDateString(allValue?.startDate)} s/d ${toDateString(allValue?.endDate)}`,
        });
      },
      submitText: 'Generate',
      title: 'Generate draft laporan',
    });
  };

  const formatSmiPeople = (data) => {
    if (data?.length >= 1) {
      return data.map((item) => `${item.name}, ${item.position}, ${item.division}`).join(' | ');
    }
    return '';
  };

  const formatClientPeople = (data) => {
    if (data?.length >= 1) {
      return data.map((item) => `${item.name}, ${item.position}`).join(' | ');
    }
    return '';
  };

  const formatOtherPeople = (data) => {
    if (data?.length) {
      return data.map((item) => `${item.name}, ${item.position}, ${item.instance}`).join(' | ');
    }
    return '';
  };

  const formatPayloadAdress = (payload) => {
    return payload?.toLowerCase()?.split(',')
      .map((item) => item?.trim().charAt(0)?.toUpperCase() + item?.trim().slice(1))
      .join(', ')
      .replace(/_/g, ' ') || '';
  };

  const convertStringToAddressObject = (value) => {
    if (!value || typeof value !== 'string') return null;
    return {
      id: value,
      label: value.toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      module: value,
      value: value,
    };
  };


  // Reset form dengan data customer yang sudah diisi
  const resetForm = () => {
    // Reset form ke default values yang sudah include data customer
    form.reset({
      bucketMasterId: bucketMasterId,
      bucketProcessId: processId,
      clientNote: '',
      clientParty: [],
      debtorAddress: {
        address: '',
        city: '',
        description: '',
        district: '',
        postalCode: '',
        province: '',
        subDistrict: '',
      },
      debtorId: data?.debtorId || '',
      debtorName: data?.debtorName || '',
      deletedPartyId: [],
      endDate: '',
      evidence: '',
      externalNote: '',
      externalParty: [],
      id: null,
      institutionType: data?.institutionType || '',
      internalParty: [],
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      remarks: '',
      reportDate: '',
      startDate: '',
      surveyorNote: '',
      visitAddress: {
        address: '',
        city: '',
        description: '',
        district: '',
        postalCode: '',
        province: '',
        subDistrict: '',
      },
      visitCode: '',
    });
  };

  return { form, handleGenerateDraft, isLoadingData, isSavePending, onSave, resetForm };
};

export default useSiteVisitForm;

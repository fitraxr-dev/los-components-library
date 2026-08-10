/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor, accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useRecordLog from '@/hooks/useRecordLog';

import useGetParentLimit from '../../../../hooks/useGetParentLimit';
import useGetSyariahDataDeltaParent from '../../../../hooks/useGetSyariahDataDeltaParent';
import useSaveParentLimitSyariah from '../../../../hooks/useSaveParentLimitSyariah';
import useProposedFacilityTab from '../../../ProposedFacilityTab/ProposedFacilityTab.hook';
import useTableDebtorInformationLocal from '../../../TableDebtorInformationLocal/TableDebtorInformationLocal.hook';

import { formData, validation } from './ParentLimitForm.form';

import type { UseParentLimitFormProps } from './ParentLimitForm.constants';


export const useParentLimitForm = ({
  onSuccessCallback,
}: UseParentLimitFormProps = {}) => {
  const { processId } = useIdentity();
  const router = useRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const idFacilitySyariah = pathArray[7];
  const modul = path.split('/')[3];
  const isDetail = pathArray[8]?.includes('detail');
  const isEdit = pathArray[8]?.includes('edit');
  const isHidden: boolean = processId?.includes('DEBT');
  const syariahLimitId = sessionStorage.getItem('currentSyariahLimitId');
  const { recordActivity } = useRecordLog();
  const { clearSessionStorage } = useProposedFacilityTab();
  const canCreateParentLimit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_CREATE);
  const canUpdateParentLimit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const [currentFacilityId, setCurrentFacilityId] = useState<string | null>(
    () => {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('currentSyariahFacilityId');
      }
      return null;
    }
  );

  const checkParentLimitValidation = (data: any, formValidation: any) => {
    return Object.keys(formValidation).some((key) => {
      const rules = formValidation[key];
      const rawValue = data[key]?.value;
      let value = rawValue;

      if (typeof rawValue === 'object' && rawValue !== null) {
        if ('value' in rawValue) {
          value = rawValue.value;
        } else if ('id' in rawValue) {
          value = rawValue.id;
        }
      }

      return rules.some((rule: any) => {
        const stringValue = value === null || value === undefined ? '' : String(value);
        return !rule.rule.test(stringValue);
      });
    });
  };

  const effectiveFacilityId = idFacilitySyariah === 'add'
    ? currentFacilityId
    : idFacilitySyariah;


  const queryClient = useQueryClient();
  const {
    masintonForm: parentLimitData,
    masintonChange: setParentLimitDataField,
    masintonMultiChange: setParentLimitDataMulti,
    masintonSubmit,
    masintonReplace,
    masintonValidation,
    masintonReset,
  } = useMasintonForm(formData, validation);

  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useGetParentLimit({
    facilityId: String(effectiveFacilityId),
    ...(isHidden
      ? { debtorId: String(processId) }
      : { bucketProcessId: String(processId) }
    ),
  });

  const { debtorData } = useTableDebtorInformationLocal();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });
  const debtorId = isHidden ? debtorData?.debtorId : debtorInfoData?.debtorId;

  const { mutate: saveMutate, isPending: isSaving } = useSaveParentLimitSyariah();

  const isWaiting = debtorInfoData?.status?.toLowerCase()?.includes('waiting');
  const isEnabledDataDelta = useMemo(() => Boolean(isWaiting), [isWaiting]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetSyariahDataDeltaParent({
    bucketProcessId: processId,
    facilityId: detailData?.idFacility,
  }, {
    enabled: isEnabledDataDelta,
  });


  const { data: countryOptions = [], isLoading: isLoadingCountry } = useGetParameterList(Modules.COUNTRY);
  const { data: sifatOptions = [], isLoading: isLoadingSifat } = useGetParameterList(Modules.LOAN_TYPE);
  const { data: useTypeOptions = [], isLoading: isLoadingType } = useGetParameterList(Modules.TYPE_OF_USE);
  const { data: districtOptions = [], isLoading: isLoadingDistrict } = useGetParameterList(Modules.DISTRICT);
  const { data: golonganOptions = [], isLoading: isLoadingGolongan } = useGetParameterList(
    Modules.GOLONGAN_KREDIT
  );
  const { data: orientasiOptions = [], isLoading: isLoadingOrientasi } = useGetParameterList(
    Modules.ORIENTASI_PENGGUNAAN
  );
  const { data: intervalFrequencyOptions = []} = useGetParameterList('intervalFrekuensiReview');
  const companyOptions = [
    { label: 'Head Office', value: 'ID0010001' },
    { label: 'Head Office SMI', value: 'ID0010002' },
  ];
  const currencyOptions = [
    { label: 'IDR', value: 'IDR' },
    { label: 'USD', value: 'USD' },
  ];

  const handleCancel = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'cancel and close parent limit form',
    });

    clearSessionStorage();
    router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, { module: modul, processId: processId }));
  };

  useEffect(() => {
    if (detailData && !isFetchingDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'view parent limit detail page',
      });
    }
  }, [detailData, isFetchingDetail, processId, recordActivity]);

  useEffect(() => {
    if (detailData) {
      const data = detailData;
      const countryOption = countryOptions.find((option) => option.value === data.countryOfRisk);
      const districtOption = districtOptions.find((option) => option.value === data.datiIILokasiProyek);
      const golonganOption = golonganOptions.find((option) => option.value === data.creditClassification);
      const useTypeOption = useTypeOptions.find((option) => option.value === data.usageType);
      const orientasiOption = orientasiOptions.find((option) => option.value === data.usageOrientation);
      const sifatOption = sifatOptions.find((option) => option.value === data.receivableNature);

      setParentLimitDataMulti({
        tracerId: data.tracerIdNewLOS || '',
        idLimit: data.limitId || '',
        availableMarker: data.availableMarker === 'Y',
        baruPerpanjang: !!data.newExtend,
        cabangPembukaan: {
          label: data?.limitBookingBranch?.split('-')[1] || data?.limitBookingBranch || '',
          value: data?.limitBookingBranch?.split('-')[0] || data?.limitBookingBranch || '',
        },
        catatan: data.notesI || '',
        cifKelompok: data.groupCIF || '',
        countryOfRisk: countryOption || (data.countryOfRisk
          ? { value: data.countryOfRisk, label: data.countryOfRisk }
          : { value: '', label: '' }),
        countryPercent: data.countryPercent || 100,
        datiLokasiProyek: districtOption || (data.datiIILokasiProyek
          ? { label: data.datiIILokasiProyek, value: data.datiIILokasiProyek }
          : null),
        frekuensiReview: data.reviewFrequency || '',
        golonganKredit: golonganOption || (data.creditClassification
          ? { label: data.creditClassification, value: data.creditClassification }
          : { label: '', value: '' }),
        idPipeline: data.pipelineId || '',
        jenisPenggunaan: useTypeOption || (data.usageType
          ? { label: data.usageType, value: data.usageType }
          : { label: '', value: '' }),
        keteranganBMPK: data.bmppDescription || '',
        cifParent: data.cif || '',
        maksimalPenggunaan: data.maxUsage || 0,
        mataUang: { label: data.currency || '', value: data.currency || '' },
        nilaiFasilitasOnline: data.onlineFacilityValue || 0,
        nilaiKelonggaranTarik: data.availableDrawdown || 0,
        nominalFasilitasLimit: data.limitAmount || 0,
        nominalFasilitasLimitInIDR: data.limitAmountInIDR || 0,
        onlineUpdate: data.onlineUpdateDate === 'Y',
        orientasiPenggunaan: orientasiOption || (data.usageOrientation
          ? { label: data.usageOrientation, value: data.usageOrientation }
          : { label: '', value: '' }),
        penandaBMPK: data.bmpkMarker === 'Y',
        sebelumRestrukturisasi: data.preRestructuringPlafond || 0,
        sifatPiutang: sifatOption || (data.receivableNature
          ? { label: data.receivableNature, value: data.receivableNature }
          : { label: '', value: '' }),
        tanggalBerakhir: data.expiryDate ? parseISO(data.expiryDate) : '',
        tanggalBerlaku: data.effectiveDate ? parseISO(data.effectiveDate) : '',
        tanggalInputLimit: data.limitInputDate ? parseISO(data.limitInputDate) : '',
        totalOutstanding: data.totalOutstanding || 0,
        liabilityNumber: data.liabilityNumber || '',
        ...(data.reviewFrequency ? formatFrequencyReview(data.reviewFrequency) : {
          dateFrekuensiReview: '',
          intervalFrekuensiReview: '',
          frekuensiReview: '',
          onlyDateFrekuensiReview: '',
        }),
      });
    }
  }, [detailData, countryOptions, districtOptions, golonganOptions, useTypeOptions, orientasiOptions, sifatOptions]);

  const handleChange = (field: string, value: any) => {
    if (field === 'intervalFrekuensiReview') {
      masintonReplace({
        ...parentLimitData,
        intervalFrekuensiReview: { value: value, error: false, errorMessage: '' },
        frekuensiReview: { value: '', error: false, errorMessage: '' },
        onlyDateFrekuensiReview: { value: '', error: false, errorMessage: '' },
        dateFrekuensiReview: { value: '', error: false, errorMessage: '' },
      });
    }

    if (field === 'nominalFasilitasLimit') {
      const isIDR = parentLimitData.mataUang.value?.value === 'IDR';
      if (isIDR) {
        return setParentLimitDataMulti({
          nominalFasilitasLimit: value,
          nominalFasilitasLimitInIDR: value,
        });
      }
    }
    setParentLimitDataField(field, value);
  };

  const getDropdownValue = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.id || field.value || '';
  };

  const formatFrequencyReview = (value: string) => {
    const splitValue = value.split('');
    type FrequencyReviewFormat = {
      dateFrekuensiReview?: string;
      intervalFrekuensiReview?: string;
      frekuensiReview?: string;
      onlyDateFrekuensiReview?: string;
    };

    let newFormattedValue: FrequencyReviewFormat = {
      dateFrekuensiReview: '',
      intervalFrekuensiReview: '',
      frekuensiReview: '',
      onlyDateFrekuensiReview: '',
    };

    for (let i = 0; i < splitValue.length; i++) {
      if (splitValue[i] !== undefined) {
        if (i <= 7) {
          newFormattedValue.dateFrekuensiReview += splitValue[i];
        } else if (Number.isNaN(Number(splitValue[i]))) {
          newFormattedValue.intervalFrekuensiReview += splitValue[i];
        } else if (value.includes('M') && i >= splitValue.length - 2) {
          newFormattedValue.onlyDateFrekuensiReview += splitValue[i];
        } else {
          newFormattedValue.frekuensiReview += splitValue[i];
        }
      }
    }
    return {
      ...newFormattedValue,
      intervalFrekuensiReview: intervalFrequencyOptions.find((option: any) =>
        option.value === newFormattedValue.intervalFrekuensiReview),
      frekuensiReview: newFormattedValue.frekuensiReview,
      onlyDateFrekuensiReview: newFormattedValue.onlyDateFrekuensiReview ? {
        label: newFormattedValue.onlyDateFrekuensiReview.startsWith('0') ?
          newFormattedValue.onlyDateFrekuensiReview.slice(1) : newFormattedValue.onlyDateFrekuensiReview,
        value: newFormattedValue.onlyDateFrekuensiReview.startsWith('0') ?
          newFormattedValue.onlyDateFrekuensiReview.slice(1) : newFormattedValue.onlyDateFrekuensiReview,
      } : '',
    };
  };

  const joinFrequencyReview = () => {
    const onlydate = parentLimitData.onlyDateFrekuensiReview.value?.value?.toString().length === 1 ?
      '0' + parentLimitData.onlyDateFrekuensiReview.value?.value?.toString() : parentLimitData.onlyDateFrekuensiReview.value?.value?.toString();
    const frekuensi = parentLimitData.intervalFrekuensiReview?.value?.value === 'M'
      && parentLimitData.frekuensiReview.value.toString().length === 1 ?
      '0' + parentLimitData.frekuensiReview.value : parentLimitData.frekuensiReview.value;
    const interval = parentLimitData.intervalFrekuensiReview?.value?.value;
    const date = parentLimitData.dateFrekuensiReview.value;

    return `${date || ''}${interval || ''}${frekuensi || ''}${onlydate || ''}`;
  };

  const checkValueEmpty = (value: any) => {
    return value === '' || value === null || value === undefined;
  };

  const checkValidationFrekuensiReview = (value: string) => {
    if (value === 'DAILY' || value === 'BSNSS') {
      return checkValueEmpty(parentLimitData.dateFrekuensiReview.value);
    } else if (value === 'WEEK') {
      return checkValueEmpty(parentLimitData.frekuensiReview.value)
        || checkValueEmpty(parentLimitData.dateFrekuensiReview.value);
    } else if (value === 'M') {
      return checkValueEmpty(parentLimitData.onlyDateFrekuensiReview.value?.value)
        || checkValueEmpty(parentLimitData.frekuensiReview.value)
        || checkValueEmpty(parentLimitData.dateFrekuensiReview.value);
    } else {
      return false;
    }
  };

  const checkIsMandatory = () => {
    return (
      parentLimitData.tanggalBerakhir?.value === null ||
      parentLimitData.tanggalInputLimit?.value === null ||
      parentLimitData.maksimalPenggunaan?.value === '' ||
      parentLimitData.tanggalBerlaku?.value === null ||
      parentLimitData.nominalFasilitasLimit?.value === '' ||
      parentLimitData.idPipeline?.value === '' ||
      parentLimitData.cabangPembukaan?.value?.value === undefined ||
      parentLimitData.mataUang?.value?.value === undefined ||
      checkValidationFrekuensiReview(parentLimitData.intervalFrekuensiReview?.value?.value)
    );
  };

  const mapFormToPayload = () => {
    const formValues = masintonSubmit() as any;

    const payload: any = {
      bucketProcessId: processId,
      debtorId: debtorId || '',
      pipelineId: formValues.idPipeline || '',
      facilityAmount: Number(formValues.nominalFasilitasLimit) || 0,
      maxUtilization: Number(formValues.maksimalPenggunaan) || 0,
      totalOutstanding: Number(formValues.totalOutstanding) || 0,
      onlineFacilityValue: Number(formValues.nilaiFasilitasOnline) || 0,
      withdrawalToleranceValue: Number(formValues.nilaiKelonggaranTarik) || 0,
      limitAmountInIDR: Number(formValues.nominalFasilitasLimitInIDR) || 0,
      currency: getDropdownValue(formValues.mataUang),
      effectiveDate: formValues.tanggalBerlaku
        ? formatDate(formValues.tanggalBerlaku, 'YYYY-MM-DD')
        : '',
      limitInputDate: formValues.tanggalInputLimit
        ? formatDate(formValues.tanggalInputLimit, 'YYYY-MM-DD')
        : '',
      endDate: formValues.tanggalBerakhir
        ? formatDate(formValues.tanggalBerakhir, 'YYYY-MM-DD')
        : '',
      reviewFrequency: joinFrequencyReview(),
      groupCif: formValues.cifKelompok || '',
      countryOfRisk: getDropdownValue(formValues.countryOfRisk),
      countryPercent: Number(formValues.countryPercent || 100),
      openingBranch: formValues.cabangPembukaan?.label || getDropdownValue(formValues.cabangPembukaan),
      projectLocationCode: getDropdownValue(formValues.datiLokasiProyek),
      notes: formValues.catatan || '',
      bmpkDescription: formValues.keteranganBMPK || '',
      creditGroup: getDropdownValue(formValues.golonganKredit),
      usageOrientation: getDropdownValue(formValues.orientasiPenggunaan),
      usageType: getDropdownValue(formValues.jenisPenggunaan),
      receivableCharacteristics: getDropdownValue(formValues.sifatPiutang),
      onlineUpdate: formValues.onlineUpdate ? 'Y' : null,
      liabilityNumber: formValues.liabilityNumber || '',
      preRestructuringPlafond: Number(formValues.sebelumRestrukturisasi) || 0,
      // isRenewal: Number(formValues.baruPerpanjang) || 0,
      newExtend: formValues.baruPerpanjang ? 1 : 0,
      bmpkFlag: formValues.penandaBMPK ? 'Y' : 'N',
      availableMarker: formValues.availableMarker ? 'Y' : 'N',
      ...(detailData?.data?.syariahLimitId && { syariahLimitId: detailData.data.syariahLimitId }),
      ...(formValues.tracerId && { tracerId: formValues.tracerId }),
    };

    if (syariahLimitId) {
      payload.syariahLimitId = Number(syariahLimitId);
    }

    return payload;
  };

  const handleSave = (shouldNextStep: boolean = true) => {
    if (!masintonValidation()) return;
    const activityType = detailData ? ActivityType.EDIT : ActivityType.ADD;
    const remarks = detailData ? 'edit parent limit' : 'add parent limit';

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'initiate save parent limit',
    });

    const payload = mapFormToPayload();
    saveMutate(payload, {
      onSuccess: (response) => {

        recordActivity({
          activity: activityType,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(response),
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: remarks,
        });

        showNiceModalV2({
          onClose: () => {
            router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, { module: modul, processId: processId }));
          },
          title: 'Data Parent Limit berhasil disimpan',
          type: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['child-limit-syariah-list']});
        if (response?.data) {
          const newFacilityId = String(response.data?.facilityId);
          const newSyariahLimitId = String(response.data?.syariahLimitId);

          setCurrentFacilityId(newFacilityId);
          sessionStorage.setItem('currentSyariahFacilityId', newFacilityId);
          sessionStorage.setItem('currentSyariahLimitId', newSyariahLimitId);
        }

        queryClient.invalidateQueries({ queryKey: ['syariah-parent-limit']});
        if (shouldNextStep && onSuccessCallback) {
          onSuccessCallback();
          queryClient.invalidateQueries({ queryKey: ['syariah-parent-limit']});
        }
      },
      onError: (error: any) => {
        recordActivity({
          activity: activityType,
          bucketProcessId: processId,
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: `save parent limit failed: ${error.message || 'Unknown error'}`,
        });

        showNiceModalV2({
          title: error.message || 'Gagal menyimpan data',
          type: 'error',
        });


      },
    });
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const formValues = parentLimitData as any;

    const payload: any = {
      bucketProcessId: processId,
      debtorId: debtorId || '',
      pipelineId: formValues.idPipeline?.value || '',
      facilityAmount: Number(formValues.nominalFasilitasLimit?.value) || 0,
      maxUtilization: Number(formValues.maksimalPenggunaan?.value) || 0,
      totalOutstanding: Number(formValues.totalOutstanding?.value) || 0,
      onlineFacilityValue: Number(formValues.nilaiFasilitasOnline?.value) || 0,
      withdrawalToleranceValue: Number(formValues.nilaiKelonggaranTarik?.value) || 0,
      limitAmountInIDR: Number(formValues.nominalFasilitasLimitInIDR?.value) || 0,
      currency: getDropdownValue(formValues.mataUang?.value),
      effectiveDate: formValues.tanggalBerlaku?.value
        ? formatDate(formValues.tanggalBerlaku.value, 'YYYY-MM-DD')
        : '',
      limitInputDate: formValues.tanggalInputLimit?.value
        ? formatDate(formValues.tanggalInputLimit.value, 'YYYY-MM-DD')
        : '',
      endDate: formValues.tanggalBerakhir?.value
        ? formatDate(formValues.tanggalBerakhir.value, 'YYYY-MM-DD')
        : '',
      reviewFrequency: joinFrequencyReview(),
      groupCif: formValues.cifKelompok?.value || '',
      countryOfRisk: getDropdownValue(formValues.countryOfRisk?.value),
      countryPercent: Number(formValues.countryPercent?.value || 100),
      openingBranch: formValues.cabangPembukaan?.value?.label || getDropdownValue(formValues.cabangPembukaan?.value),
      projectLocationCode: getDropdownValue(formValues.datiLokasiProyek?.value),
      notes: formValues.catatan?.value || '',
      bmpkDescription: formValues.keteranganBMPK?.value || '',
      creditGroup: getDropdownValue(formValues.golonganKredit?.value),
      usageOrientation: getDropdownValue(formValues.orientasiPenggunaan?.value),
      usageType: getDropdownValue(formValues.jenisPenggunaan?.value),
      receivableCharacteristics: getDropdownValue(formValues.sifatPiutang?.value),
      onlineUpdate: formValues.onlineUpdate?.value ? 'Y' : null,
      liabilityNumber: formValues.liabilityNumber?.value || '',
      preRestructuringPlafond: Number(formValues.sebelumRestrukturisasi?.value) || 0,
      newExtend: formValues.baruPerpanjang?.value ? 1 : 0,
      bmpkFlag: formValues.penandaBMPK?.value ? 'Y' : 'N',
      availableMarker: formValues.availableMarker?.value ? 'Y' : 'N',
      ...(detailData?.data?.syariahLimitId && { syariahLimitId: detailData.data.syariahLimitId }),
      ...(formValues.tracerId?.value && { tracerId: formValues.tracerId.value }),
    };

    if (syariahLimitId && idFacilitySyariah) {
      payload.syariahLimitId = Number(syariahLimitId);
    }

    return Promise.resolve(payload);
  }, [parentLimitData, processId, debtorId, detailData, syariahLimitId, idFacilitySyariah]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: isEdit,
    payload: autoSavePayload,
    url: 'master.facilityManagementSyariahProposed.saveParentLimit',
  });


  const findDataDelta = (inputKey: string, dropdownInputList?: { label: string; value: string }[]) => {
    let previousValue = null;
    const differencesData = (dataDelta as any)?.differencesData;
    if (differencesData?.some((el: any) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = differencesData?.find((el: any) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null || findPrevValues === undefined) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          previousValue = dropdownInputList?.find((item) => {
            if (typeof findPrevValues === 'boolean') {
              return item?.value === findPrevValues.toString();
            } else {
              return item?.value === String(findPrevValues);
            }
          })?.label || String(findPrevValues);
        } else {
          if (['effectiveDate', 'expiryDate', 'limitInputDate'].includes(inputKey)) {
            previousValue = formatDate(new Date(findPrevValues), 'DD/MM/YYYY');
          } else if (['limitAmount'].includes(inputKey)) {
            previousValue = new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(findPrevValues));
          } else if (inputKey === 'newExtend') {
            previousValue = findPrevValues ? 'Ya' : 'Tidak';
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };

  return {
    handleSave,
    isSaving,
    isAutoSaveFetching,
    parentLimitData,
    isLoadingDetail,
    setParentLimitData: setParentLimitDataMulti,
    handleChange,
    masintonReset,
    isHidden,
    isDetail,
    countryOptions,
    isLoadingCountry,
    sifatOptions,
    isLoadingSifat,
    useTypeOptions,
    isLoadingType,
    districtOptions,
    isLoadingDistrict,
    golonganOptions,
    isLoadingGolongan,
    orientasiOptions,
    isLoadingOrientasi,
    companyOptions,
    currencyOptions,
    handleCancel,
    effectiveFacilityId,
    recordActivity,
    canCreateParentLimit,
    canUpdateParentLimit,
    findDataDelta,
    intervalFrequencyOptions,
    isSaveDisabled: useMemo(
      () => checkIsMandatory() || checkParentLimitValidation(parentLimitData, validation),
      [parentLimitData]
    ),
  };
};

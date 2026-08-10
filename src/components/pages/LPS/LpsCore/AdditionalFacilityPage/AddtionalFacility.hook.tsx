'use client';
import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';


import { loanProcessingSummary } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { INTIIAL_VALUES_ADDITIONAL_FACILITY } from './AdditonalFacility.form';
import useGetDetailAdditionalFacility from './hooks/useGetDetailAdditionalFacility';
import useSaveAdditionalFacility from './hooks/useSaveAdditionalFacility';


const useAdditonalFacility = () => {
  const params = useParams();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { processId, facilityId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const {
    data: financingFacilityData,
    isSuccess,
    isError,
  } = useGetDetailAdditionalFacility({ id: Number(params?.id) });
  const isSyariah = isSuccess && financingFacilityData?.additionalType === 'SYARIAH';
  const { mutate: saveAdditonalFacility, isPending: isSaveLoading } = useSaveAdditionalFacility({
    onError: (error: any) => {
      showNiceModalV2({
        title: error?.message,
        type: 'error',
      });
    },

    onSuccess: () => {
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
        remarks: 'save additional facility data',
      });
      showNiceModalV2({
        onClose: () => {
          queryClient.invalidateQueries({ queryKey: ['detail-additional', { id: params?.id }]});
          handleBack();
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });

    },
  });


  const validationSchema = Yup.object().shape({
    additionalType: Yup.string(),
    address: Yup.string(),
    fullName: Yup.string(),
    identityNumber: Yup.string(),
    name: Yup.string(),
    percentageOfFacilities: Yup.string(),
    projectPhaseStatus: Yup.string(),
    provisionFinancing: Yup.string(),
    remarks: Yup.string(),
    remarksInterestDate: Yup.string(),
    remarksProfitSharing: Yup.string(),
    remarksSourceOfFund: Yup.string(),
    sectorName: isSyariah ? Yup.string().required('Sektor Name tidak Kosong') : Yup.string(),
    skim: isSyariah ? Yup.string().required('Skim tidak Kosong') : Yup.string(),
    sourceOfFund: Yup.string(),
    sourceOfFundProgram: Yup.string(),
  });

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: INTIIAL_VALUES_ADDITIONAL_FACILITY,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });


  useEffect(() => {
    if (isSuccess && financingFacilityData) {
      onUpdateState(INTIIAL_VALUES_ADDITIONAL_FACILITY, financingFacilityData);

      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
        remarks: 'view additional facility page',
      });
    }

  }, [isSuccess, financingFacilityData, processId, recordActivity]);

  const onUpdateState = (initialValue, detailValue) => {
    const updateVal = { ...initialValue };
    Object.keys(detailValue).forEach((key) => {
      if (detailValue[key] !== null) {
        updateVal[key] = detailValue[key];
      }
    });
    reset(updateVal);
  };

  const formatPayload = (payload) => {
    const updatePayload = { ...payload };
    Object.keys(payload).forEach((key) => {
      updatePayload[key] = String(payload[key])?.length ? payload[key] : null;
    });
    return updatePayload;
  };

  const handleOnSave = (data) => {
    const payload = {
      facilityId,
      financingFacilityId: params?.id,
      mappingFinancingSegment: data?.additionalType,
      ...data,
    };
    const newPayload = formatPayload(payload);
    saveAdditonalFacility(newPayload);
  };
  const handleBack = () => {
    const pathName = loanProcessingSummary.FINANCING_FACILITY.replace('[processId]', processId);
    router.replace(pathName);
  };

  const title = isSyariah ? 'Syariah' : 'Konvensional';
  const modifiedByDate = financingFacilityData?.modifiedBy ? financingFacilityData?.modifiedBy : '-';
  const lastModifiedDate = financingFacilityData?.lastModifiedDate ? toDateString(financingFacilityData?.lastModifiedDate) : '-';

  return {
    control,
    handleBack,
    handleOnSave,
    handleSubmit,
    isError,
    isSaveLoading,
    isSuccess,
    isSyariah,
    lastModifiedDate,
    modifiedByDate,
    title,
  };

};

export default useAdditonalFacility;

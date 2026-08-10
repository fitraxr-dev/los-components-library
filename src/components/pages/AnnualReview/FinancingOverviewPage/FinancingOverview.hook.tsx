import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailNotes from '@/hooks/services/mip/apuppt/useGetDetailNotes';
import useGetDetailFinancingOverview from '@/hooks/services/mip/financing-facility/useGetDetailFinancingOverview';
//import useSaveFinancingOverview from '@/hooks/services/mip/financing-facility/useSaveFinancingOverview';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';


import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';

import useSaveFinancingOverview from './hooks/useSaveFinancingOverview';


export const useFinancingOverview = () => {
  const { isAnalyst } = useAnnualReviewContext();
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { goToNextStep, typeProcess } = useAnnualReviewContext();
  const isDepiDivision = typeProcess === TypeProcess.ANNUAL_REVIEW_DEPI;
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const [remark, setRemark] = useState('');
  const isPreview = Boolean(useSearchParams().get('isPreview'));
  const [container, setContainer] = useState(null);
  const [selected, setSelected] = useState([]);

  const validationScheme = useMemo(() => Yup.object({
    typePermohonan: isDepiDivision
      ? Yup.string().required('Tipe Permohonan tidak boleh kosong')
      : Yup.string().nullable(),
    typePermohonanRemark: Yup.string().nullable(),
  }), [isDepiDivision]);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: { typePermohonan: '', typePermohonanRemark: '' },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const {
    data: financingOverviewDetail,
    isLoading: isFinancingDetailLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: String(processId),
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const { data: requestTypeData } = useGetParameterList(Modules.TYPE_SUBMISSION);

  useEffect(() => {
    if (financingOverviewDetail) {
      setRemark(financingOverviewDetail?.remark);

    }

    if (debtorInfoData) {
      reset({
        typePermohonan: debtorInfoData?.typeSubmission ?? '',
        typePermohonanRemark: debtorInfoData?.description ?? '',
      });
    }
  }, [financingOverviewDetail, debtorInfoData]);

  useEffect(() => {
    if (remark !== financingOverviewDetail?.remark) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [router]);

  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { data: detailNotesData, isLoading: isDetailNotesLoading } = useGetDetailNotes({
    bucketProcessId: String(processId),
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const handleSave = async (
    isSaveAndNext: boolean,
    formData?: { typePermohonan?: string; typePermohonanRemark?: string },
  ) => {
    if (viewOnly || isAnalyst || isPreview) {
      goToNextStep();
    } else {
      const depiPayload = isDepiDivision ? {
        remarks: formData?.typePermohonanRemark ?? '',
        typeFinancing: debtorInfoData?.typeFinancing,
        typeProcess: debtorInfoData?.typeProcess,
        typeSubmission: formData?.typePermohonan ?? '',
      } : {};

      const doSave = async (remarkValue: string) => {
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: String(processId),
          changeAfter: JSON.stringify(remarkValue),
          changeBefore: JSON.stringify(financingOverviewDetail),
          menuCode: 'annual-review',
          module: TypeModule.ANNUAL_REVIEW,
          process: typeProcess,
          remarks: `save detail financing overview from module ${TypeModule.ANNUAL_REVIEW}`,
        });
        const blob = !!container ? await convertToDocx(container) : undefined;

        saveFinancingOverview({
          bucketProcessId: String(processId),
          description: blob || undefined,
          id: undefined,
          module: TypeModule.ANNUAL_REVIEW,
          process: typeProcess,
          remark: remarkValue,
          selected: selected,
          ...depiPayload,
        }, {
          onSuccess() {
            setDirtyMsg(undefined);
            showNiceModalV2({
              onClose() {
                if (isSaveAndNext) goToNextStep();
              },
              title: 'Data berhasil disimpan',
              type: 'success',
            });
          },
        });
      };

      if (!!remark) {
        await doSave(remark);
      } else {
        showNiceModalV2({
          cancelText: 'Tidak',
          onSubmit: () => doSave(''),
          submitText: 'Ya',
          title: 'Data mandatory belum terisi, simpan perubahan?',
          type: 'warning',
        });
      }
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = !!container ? await convertToDocx(container) : undefined;

    return {
      bucketProcessId: String(processId),
      description: blob,
      id: undefined,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
      remark: remark,
      selected: selected,
    };
  }, [container, processId, typeProcess, remark, selected]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !isAnalyst && !isPreview,
    payload: autoSavePayload,
    url: 'mip.financingFacility.save',
  });

  const canUpdateFinancingOverview = typeProcess !== TypeProcess.ANNUAL_REVIEW_DEPI;

  return {
    canUpdateFinancingOverview,
    container,
    control,
    detailNotesData,
    financingOverviewDetail,
    goToNextStep,
    handleSave,
    handleSubmit,
    isAnalyst,
    isAutoSaveFetching,
    isDepiDivision,
    isDetailNotesLoading,
    isFinancingDetailLoading,
    isPreview,
    isSaveLoading,
    remark,
    requestTypeData,
    selected,
    setContainer,
    setRemark,
    setSelected,
    theme,
    typeProcess,
  };
};

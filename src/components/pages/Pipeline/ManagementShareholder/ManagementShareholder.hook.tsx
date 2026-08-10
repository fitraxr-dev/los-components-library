import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { roles } from '@/configs/constants';
import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { usePipelineContext } from '@/components/layouts/PipelineLayout/Pipeline.context';

import useSaveDebitorRemark from './hooks/useSaveDebitorRemark';
import useSaveDebtor from './hooks/useSaveDebtor';
import useSaveManagementRemark from './hooks/useSaveManagementRemark';
import useSaveShareholderRemark from './hooks/useSaveShareholderRemark';


const validationSchema = Yup.object().shape({
  remark: Yup.string(),
});

const useManagementShareholderHook = () => {
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const path = usePathname();
  const router = useCustomRouter();
  const theme = useTheme();
  const { setDirtyMsg } = useContext(DirtyContext);
  const {
    activeTab,
    setActiveTab,
  } = usePipelineContext();
  const params = useSearchParams();

  const isHaveFrom = params.get('from');

  const isStaff = currentRole.includes(roles.RM);
  const bucketProcessId = processId;
  let shouldViewOnly = viewOnly;
  let shouldRenderForm = !viewOnly;

  const { data } = useGetDetailBucketDebtor({
    bucketProcessId,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(data?.institutionType);


  const [remark, setRemark] = useState({
    debtorRemark: '',
    managementRemark: '',
    shareholderRemark: '',
  });

  if (currentRole.includes(roles.RM) || currentRole.includes(roles.TL) || currentRole.includes(roles.MAKER)) {
    shouldRenderForm = !viewOnly;
    shouldViewOnly = viewOnly;
  } else {
    shouldRenderForm = false;
    shouldViewOnly = false;
  }

  const { control, reset, setValue, getValues, watch } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

  const watchedRemark = watch('remark');

  const handleRemark = () => {
    switch (activeTab) {
      case 0:
        return remark.debtorRemark ?? '';
      case 1:
        return remark.shareholderRemark ?? '';
      default:
        return remark.managementRemark ?? '';
    }
  };

  useEffect(() => {
    setRemark({
      debtorRemark: data?.debtorRemark,
      managementRemark: data?.managementRemark,
      shareholderRemark: data?.shareholderRemark,
    });
  }, [data]);

  useEffect(() => {
    setValue('remark', handleRemark());
  }, [handleRemark()]);

  const handleCloseButton = () => {
    router.back();
  };

  useEffect(() => {
    if (JSON.stringify(watch().remark) !== JSON.stringify(handleRemark())) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [watch(), remark]);

  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bucketProcessId,
      debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remark: watchedRemark || '',
    });
  }, [bucketProcessId, debtorId, watchedRemark]);

  const autoSaveUrl = useMemo(() => {
    switch (activeTab) {
      case 0:
        return 'bucket.manage.saveDebtor';
      case 1:
        return 'bucket.manage.saveShareholder';
      default:
        return 'bucket.manage.saveManagement';
    }
  }, [activeTab]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: shouldRenderForm && !!data,
    payload: autoSavePayload,
    url: autoSaveUrl,
  });

  const { isPending: saveManagementPending, mutate: saveManagementRemark } = useSaveManagementRemark({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ managementRemark: getValues('remark') }),
        changeBefore: JSON.stringify({ managementRemark: remark.managementRemark }),
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully saved management remark',
      });

      showNiceModalV2({ type: 'success' });
      setRemark({
        ...remark,
        managementRemark: getValues('remark'),
      });
      setDirtyMsg(undefined);
    },
  });

  const { isPending: saveDebiturPending, mutate: saveDebiturRemark } = useSaveDebitorRemark({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ debtorRemark: getValues('remark') }),
        changeBefore: JSON.stringify({ debtorRemark: remark.debtorRemark }),
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully saved debtor remark',
      });

      showNiceModalV2({ type: 'success' });
      setRemark({
        ...remark,
        debtorRemark: getValues('remark'),
      });
      setDirtyMsg(undefined);
    },
  });

  const { isPending: saveShareholderPending, mutate: saveShareholderRemark } = useSaveShareholderRemark({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ shareholderRemark: getValues('remark') }),
        changeBefore: JSON.stringify({ shareholderRemark: remark.shareholderRemark }),
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully saved shareholder remark',
      });

      showNiceModalV2({ type: 'success' });
      setRemark({
        ...remark,
        shareholderRemark: getValues('remark'),
      });
      setDirtyMsg(undefined);
    },
  });

  useEffect(() => {
    reset({
      remark: handleRemark() ?? '',
    });
  }, [activeTab]);

  const onSaveHandler = () => {
    const dataRemark = getValues();

    switch (activeTab) {
      case 0:
        saveDebiturRemark({
          bucketProcessId,
          debtorId,
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remark: dataRemark.remark,
        });
        break;
      case 1:
        saveShareholderRemark({
          bucketProcessId,
          debtorId,
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remark: dataRemark.remark,
        });
        break;
      default:
        saveManagementRemark({
          bucketProcessId,
          debtorId,
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remark: dataRemark.remark,
        });
        break;
    }
  };

  const handleChangeTab = (val: number) => {
    if (JSON.stringify(watch().remark) !== JSON.stringify(handleRemark())) {
      NiceModal.show(MODAL.IS_DIRTY, {
        onSubmit: () => {
          setActiveTab(val);
        },
        title: 'Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.',
      });
    } else {
      setActiveTab(val);
    }
  };

  return {
    activeTab,
    control,
    debtorId,
    handleChangeTab,
    handleCloseButton,
    isAutoSaveFetching,
    isHaveFrom,
    isPemda,
    isStaff,
    onSaveHandler,
    saveDebiturPending,
    saveManagementPending,
    saveShareholderPending,
    shouldRenderForm,
    shouldViewOnly,
    theme,
  };
};
export default useManagementShareholderHook;

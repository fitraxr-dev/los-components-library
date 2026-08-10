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
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { modal } from '../components/ActionFooterDetail/ActionFooterDetail.constant';

import useGetDebtorRemark from './hooks/useGetDebtorRemark';
import useGetManagementRemark from './hooks/useGetManagementRemark';
import useGetShareholderRemark from './hooks/useGetShareholderRemark';
import useSaveDebitorRemark from './hooks/useSaveDebitorRemark';
import useSaveManagementRemark from './hooks/useSaveManagementRemark';
import useSaveShareholderRemark from './hooks/useSaveShareholderRemark';


const validationSchema = Yup.object().shape({
  remark: Yup.string(),
});

const useManagementShareholderHook = () => {
  const [{ currentRole }] = useApp();
  const { debtorId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const path = usePathname();
  const router = useCustomRouter();
  const theme = useTheme();
  const { setDirtyMsg } = useContext(DirtyContext);
  const {
    activeTab,
    setActiveTab,
  } = useMaintenanceDataContext();
  const params = useSearchParams();

  const isHaveFrom = params.get('from');

  const isStaff = currentRole.includes(roles.RM);
  const bucketProcessId = processId;
  let shouldRenderForm = !viewOnly;
  let shouldViewOnly = viewOnly;
  let shouldViewOnlyTable = viewOnly;
  const { data: debtorInfoDataMaster } = useGetDetailMasterDebtor(
    { debtorId }
  );
  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoDataMaster?.type);

  let debtorModule;
  if (matchesPathname(path, maintenanceDebtor.MAINTENANCE_DETAIL_PAGE)) {
    debtorModule = MAINTENANCE_MODULE.MAINTENANCE_DEBTOR;
  } else {
    debtorModule = MAINTENANCE_MODULE.MASTER_DATA;
  }

  const [remark, setRemark] = useState({
    debtorRemark: '',
    managementRemark: '',
    shareholderRemark: '',
  });

  const { data } = useGetDetailBucketDebtor({
    bucketProcessId,
    module: TypeModule.MAINTENANCE_DEBTOR,
    process: TypeProcess.MAINTENANCE_DEBTOR,
  }, { enabled: matchesPathname(path, maintenanceDebtor.MAINTENANCE_DETAIL_PAGE) });

  const debtor = data ?? {};

  if (currentRole.includes(roles.KADIV) || currentRole.includes(roles.TL)) {
    if (matchesPathname(path, maintenanceDebtor.MASTER_DETAIL_PAGE)) {
      shouldRenderForm = false;
      shouldViewOnly = true;
      shouldViewOnlyTable = true;
    } else {
      shouldRenderForm = false;
      shouldViewOnly = true;
      shouldViewOnlyTable = true;
    }
  } else {
    if (matchesPathname(path, maintenanceDebtor.MASTER_DETAIL_PAGE)) {
      shouldRenderForm = false;
      shouldViewOnly = true;
      shouldViewOnlyTable = false;
    }
  }

  const { data: debtorRemark } = useGetDebtorRemark({ bucketProcessId, debtorId });

  const { data: managementRemark } = useGetManagementRemark({ bucketProcessId, debtorId });

  const { data: shareholderRemark } = useGetShareholderRemark({ bucketProcessId, debtorId });

  const { control, reset, setValue, getValues, watch } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

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
      debtorRemark: debtorRemark?.description,
      managementRemark: managementRemark?.description,
      shareholderRemark: shareholderRemark?.description,
    });
  }, [debtorRemark, managementRemark, shareholderRemark]);

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

  const { mutate: saveProcess } = useSubmitBucket({
    onError: (error: any) => {
      if (error?.message.includes('BCM')) {
        NiceModal.show(modal.PLAFON_VALIDATION, { errorMessage: error?.message });
      } else {
        showNiceModalV2({
          title: error?.message ? error?.message : 'Data gagal disimpan',
          type: 'error',
        });
      }
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      router.push(maintenanceDebtor.LIST_PAGE);
    },
  });

  const { isPending: saveManagementPending, mutate: saveManagementRemark } = useSaveManagementRemark({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
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
      showNiceModalV2({ type: 'success' });
      setRemark({
        ...remark,
        shareholderRemark: getValues('remark'),
      });
      setDirtyMsg(undefined);
    },
  });

  useMemo(() => {
    reset({
      remark: handleRemark() ?? '',
    });
  }, [activeTab]);

  const onSaveHandler = () => {
    const dataRemark = getValues();

    if (!currentRole.includes(roles.RM)) {
      saveProcess({
        submitRequestDto: {
          action: 'RETURN_TO_STAFF',
          bucketProcessId,
          module: 'MAINTENANCE_DEBTOR',
          process: 'MAINTENANCE_DEBTOR',
        },
      });
    } else {
      switch (activeTab) {
        case 0:
          saveDebiturRemark({ debtorId, description: dataRemark.remark });
          break;
        case 1:
          saveShareholderRemark({ debtorId, description: dataRemark.remark });
          break;
        default:
          saveManagementRemark({ debtorId, description: dataRemark.remark });
          break;
      }
    }
  };

  const onSubmitHandler = () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          saveProcess({
            submitRequestDto: {
              action: 'SUBMIT',
              bucketProcessId,
              comment,
              module: 'MAINTENANCE_DEBTOR',
              process: 'MAINTENANCE_DEBTOR',
            },
          });
        },
      },
    );
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
    debtorModule,
    handleChangeTab,
    handleCloseButton,
    isHaveFrom,
    isPemda,
    isStaff,
    onSaveHandler,
    onSubmitHandler,
    saveDebiturPending,
    saveManagementPending,
    saveShareholderPending,
    shouldRenderForm,
    shouldViewOnly,
    shouldViewOnlyTable,
    theme,
  };
};
export default useManagementShareholderHook;

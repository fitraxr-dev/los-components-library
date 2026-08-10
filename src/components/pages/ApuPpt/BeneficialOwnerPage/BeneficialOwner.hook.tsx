import { useContext, useEffect, useMemo } from 'react';

import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { apuPpt } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useGetSimiliarProcess from '../DebtorProfileInformationPage/hooks/useGetSimiliarProcess';

import { tableHeaderChild, tableHeaderGrandChild, tableHeaderParent } from './BeneficialOwner.constants';
import useGetBeneficialOwnerDataDelta from './hooks/useGetBeneficialOwnerDataDelta';
import useGetBeneficialOwnerListChild from './hooks/useGetBeneficialOwnerListChild';
import useGetBeneficialOwnerRemark from './hooks/useGetBeneficialOwnerRemark';
import useSaveBeneficialOwnerRemark from './hooks/useSaveBeneficialOwnerRemark';

import type { TableHeaderVerification } from '../components/TableDocumentVerification/TableDocumentVerification.types';


const useBeneficialOwner = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { goToNextStep, actions } = useApuPptContext();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { process } = useApuPpt();
  const { setDirtyMsg } = useContext(DirtyContext);
  const isDpopDivision = process === TypeProcess.APU_PPT_DPOP;

  const currentProcess = pathname.split('/')[3];
  const dynamicPathEditPage = `/loan-processing/apu-ppt/${currentProcess}/[processId]/beneficial-owner/edit/[id]`;
  const needCheckMaster = useMemo(() => {
    let checkMaster = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('NEED_CHECK_MASTER')) {
      checkMaster = true;
    }
    return checkMaster;
  }, [actions]);


  const { control, watch, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      remark: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, pathname]);

  const {
    data: bucketDetail,
    isLoading: isLoadingBucket,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });


  const {
    data: similiarProcessData,
    isLoading: isLoadingSimiliar,
    isSuccess: isSuccessSimiliar,
  } = useGetSimiliarProcess({
    bucketProcessId: processId,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.APU_PPT,
    process: process,
  }, {
    enabled: bucketDetail?.debtorId !== null && needCheckMaster,
  });


  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    if (viewOnly) {
      enabled = true;
    }
    if (bucketId === 'APDP' && isSuccessSimiliar) {
      enabled = true;
    } else if (bucketId === 'AP') {
      enabled = true;
    }
    return enabled;
  }, [isSuccessSimiliar, processId, viewOnly]);


  const { data: dataDelta } = useGetBeneficialOwnerDataDelta({
    bucketProcessId: bucketDetail?.bucketParentId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT,
  }, {
    enabled: !!bucketDetail?.bucketParentId && isDpopDivision && needCheckMaster,
  });

  const listDiff = dataDelta?.differencesData?.length > 0 ?
    dataDelta?.differencesData?.map((item) => item?.docId) : [];


  const { data, isLoading } = useGetBeneficialOwnerListChild({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const { data: beneficialRemarkData, isLoading: isBeneficialRemarkLoading } = useGetBeneficialOwnerRemark({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });


  const tableData = data?.map((item) => ({
    ...item,
    document: item.document ?? '-',
    id: item.id ?? '-',
  }));


  const { mutate: saveBeneficialOwnerRemark, isPending: isSaveBeneficialRemarkLoading } = useSaveBeneficialOwnerRemark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });


  useEffect(() => {
    if (!isBeneficialRemarkLoading) {
      setValue('remark', beneficialRemarkData?.remark ?? '');
    }
  }, [beneficialRemarkData]);

  const hasInvalidAssessmentOrVerif = (data, key) => {
    let result = false;
    for (const item of data) {
      if (item.isEditable === true && item[key] === null) {
        result = false;
      } else {
        result = true;
      }

      if (item.childList && item.childList.length > 0) {
        hasInvalidAssessmentOrVerif(item.childList, key);
      }
    }
    return result;
  };


  const handleOnSave = ({ resultVal, goToNext }: { resultVal?: boolean; goToNext?: boolean }) => {
    const isResult = resultVal ? resultVal : isDpopDivision ?
      hasInvalidAssessmentOrVerif(data, 'verificationResult')
      :
      hasInvalidAssessmentOrVerif(data, 'assessmentResult');
    const message = isDpopDivision ? 'VERIFICATION RESULT' : 'ASSESSMENT RESULT';

    if (isResult) {
      saveBeneficialOwnerRemark({
        bucketProcessId: processId,
        debtorId: '',
        module: TypeModule.APU_PPT,
        process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
        remark: watch('remark'),
      }, {
        onSuccess: () => {
          showNiceModalV2({
            onClose: goToNext ? goToNextStep : undefined,
            title: 'Data berhasil disimpan',
            type: 'success',
          });
        },
      });
    } else {
      showNiceModalV2({
        cancelText: 'Batal',
        onSubmit: () => handleOnSave({ goToNext, resultVal: true }),
        submitText: 'Simpan',
        title: `${message} ada yang belum terisi, tetap simpan perubahan?`,
        type: 'warning',
      });
    }
  };

  const generateTableHeader = useMemo(() => {
    const tableArray = [];
    const isApdb = processId?.split('-')[0] === 'APDP';
    if (isApdb) {
      tableArray?.push({
        key: 'businessCheck',
        label: 'Check Bisnis',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.isBusinessCheck ? 'Ya' : row.isBusinessCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '10%' },
      },
      {
        key: 'isDpopCheck',
        label: 'Check DPOP',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.isDpopCheck ? 'Ya' : row.isDpopCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '10%' },
      },
      {
        key: 'isCopy',
        label: 'Copy / Asli',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.isCopy ? 'Copy' : row.isCopy === null ? '-' : 'Asli'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '13%' },
      },
      {
        key: 'statusLabel',
        label: 'Status',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.statusLabel}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '13%' },
      });
    } else {
      tableArray.push({
        key: 'businessCheck',
        label: 'Check Bisnis',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.isBusinessCheck ? 'Ya' : row.isBusinessCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '10%' },
      });
    }
    return tableArray;
  }, [processId]);

  const gotoEdit = (row) => {
    const editPath = replacePath(dynamicPathEditPage, { id: row.id, processId });
    router.push(`${editPath}?ownerId=${row?.docId}`);
  };

  const gotoDetail = (row) => {
    const detailPath = replacePath(apuPpt.BENEFICIAL_OWNER_DETAIL, { id: row.id, module: currentProcess, processId });
    router.push(setPreviewPage(`${detailPath}?ownerId=${row?.docId}`));
  };

  const actionTable = useMemo(() => {
    const actArr = [];
    if (viewOnly) {
      actArr.push({
        iconName: 'detail',
        onClick: (row) => {
          gotoDetail(row);
        },
      });
    } else {
      actArr.push({
        iconName: 'edit',
        isDisabled: (data) => !data?.isEditable || viewOnly,
        onClick: (row) => {
          gotoEdit(row);
        },
      },
      );
    }
    return actArr;

  }, [viewOnly]);


  const tableHeader: Array<TableHeaderVerification> = [
    ...tableHeaderParent,
    ...generateTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: actionTable,
      sx: { width: '5.5vw' },
      type: 'action',
    }
  ];

  const tablerHeadChildVerif: Array<TableHeaderVerification> = [
    ...tableHeaderChild,
    ...generateTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: actionTable,
      sx: { width: '4vw' },
      type: 'action',
    }
  ];
  const tablerHeadGrandChildVerif: Array<TableHeaderVerification> = [
    ...tableHeaderGrandChild,
    ...generateTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: actionTable,
      sx: { width: '4vw' },
      type: 'action',
    }
  ];

  const watchedRemark = watch('remark');

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      debtorId: '',
      module: TypeModule.APU_PPT,
      process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      remark: watchedRemark,
    };

    return Promise.resolve(payload);
  }, [processId, isDpopDivision, watchedRemark]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveBoRemark',
  });

  return {
    control,
    handleOnSave,
    isAutoSaveFetching,
    isLoading,
    isLoadingBucket,
    isLoadingSimiliar,
    isSaveBeneficialRemarkLoading,
    listDiff,
    process,
    tableData,
    tableHeader,
    tablerHeadChildVerif,
    tablerHeadGrandChildVerif,
  };
};

export default useBeneficialOwner;

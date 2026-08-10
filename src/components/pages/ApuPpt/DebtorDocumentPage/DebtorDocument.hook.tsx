import { useContext, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { apuPpt, maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useGetDebtorProfileInformation from '../DebtorProfileInformationPage/hooks/useGetDebtorProfileInformation';

import { tableHeaderChild, tableHeaderGrandChild, tableHeaderParent } from './DebtorDocument.constants';
import useGetDebtorDocumentDataDelta from './hooks/useGetDebtorDocumentDataDelta';
import useGetDebtorDocumentListWithChild from './hooks/useGetDebtorDocumentListWithChild';
import useGetDetailDebtorDocumentRemark from './hooks/useGetDetailDebtorDocumentRemark';
import useSaveDebtorDocumentRemark from './hooks/useSaveDebtorDocumentRemark';

import type { TableHeaderVerification } from '../components/TableDocumentVerification/TableDocumentVerification.types';


const useDebtorDocument = () => {
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { viewOnly } = useViewOnly();
  const { process } = useApuPpt();
  const { processId } = useIdentity();
  const {
    goToNextStep,
    actions,
  } = useApuPptContext();
  const isDpopDivision = process === TypeProcess.APU_PPT_DPOP;
  const { setDirtyMsg } = useContext(DirtyContext);
  const [selectedDebtorDocument, setSelectedDebtorDocument] = useState('');
  const [valDebtorDocument, setValDebtorDocument] = useState('');

  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);

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

  const needCheckMaster = useMemo(() => {
    let checkMaster = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('NEED_CHECK_MASTER')) {
      checkMaster = true;
    }
    return checkMaster;
  }, [actions]);

  const currentProcess = pathname.split('/')[3];
  const dynamicPathEditPage = `/loan-processing/apu-ppt/${currentProcess}/[processId]/debtor-document/edit/[id]`;

  const {
    data: bucketDetail,
    isLoading: isLoadingBucket,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });

  const { data: debtorProfileInfoData, isSuccess: isDebtorProfileSucces } = useGetDebtorProfileInformation({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const moduleParamterByCategory = useMemo(() => {
    let moduleParam = '';
    if (debtorProfileInfoData?.content?.applicationCategory === 'APU_PPT') moduleParam = 'apDebtorDocument';
    if (debtorProfileInfoData?.content?.applicationCategory === 'DATA_UPDATES') moduleParam = 'apDebtorDocumentDataUpdates';

    return moduleParam;
  }, [isDebtorProfileSucces]);

  const { data: debtorDocumentOptions } = useGetParameterList(moduleParamterByCategory, {
    label: 'value1',
    value: 'key',
  }, {
    enabled: !!moduleParamterByCategory?.length,
  });

  const isEnabledRemark = useMemo(() => {
    const bucketId = processId?.split('-')[0];
    let enabled = false;
    if (viewOnly) {
      enabled = true;
    } else if (!viewOnly) {
      enabled = true;
    }
    if (bucketId === 'APDP') {
      enabled = true;
    }
    if (bucketId === 'APDP' && viewOnly) {
      enabled = true;
    } else if (bucketId === 'AP') {
      enabled = true;
    }
    return enabled;
  }, [processId, viewOnly]);

  const {
    data: documentRemarkData,
    isLoading: isDocumentRemarkLoading,
    isSuccess: isDocRemarkSuccess,
  } = useGetDetailDebtorDocumentRemark({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  }, {
    enabled: isEnabledRemark,
  });

  useEffect(() => {
    if (isDocRemarkSuccess && documentRemarkData) {
      setValue('remark', documentRemarkData?.data?.remark || '');
      setValDebtorDocument(documentRemarkData?.data?.documentDebtorType);
      setSelectedDebtorDocument(documentRemarkData?.data?.documentDebtorType);
    }
  }, [documentRemarkData, isDocRemarkSuccess]);

  const { mutate: saveDocumentRemark, isPending: isSaveDocumentRemarkLoading } = useSaveDebtorDocumentRemark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      setSelectedDebtorDocument(valDebtorDocument);
      if (showModalSuccess) {
        queryClient.invalidateQueries({ queryKey: ['debtor-document-remark']});
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      }
    },
  });

  const { data: dataDelta } = useGetDebtorDocumentDataDelta({
    bucketProcessId: bucketDetail?.bucketParentId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT,
  }, {
    enabled: !!bucketDetail?.bucketParentId && isDpopDivision && needCheckMaster,
  });

  const listDiff = dataDelta?.differencesData?.length > 0 ?
    dataDelta?.differencesData?.map((item) => item?.docId) : [];

  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    if (viewOnly && !!selectedDebtorDocument) {
      enabled = true;
    }
    if (bucketId === 'APDP' && !!selectedDebtorDocument) {
      enabled = true;
    } else if (bucketId === 'AP' && !!selectedDebtorDocument) {
      enabled = true;
    } else if (bucketId === 'AP' && !selectedDebtorDocument?.length) {
      enabled = true;
    }
    return enabled;
  }, [selectedDebtorDocument, processId, viewOnly]);

  const {
    data: listDataTableDebtor,
    isLoading: isDebtorLoading,
  } = useGetDebtorDocumentListWithChild({
    bucketProcessId: processId,
    documentDebtorType: selectedDebtorDocument,
    module: TypeModule.APU_PPT,
    process: process,
  }, {
    enabled: isEnabled,
  });

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

  const handleOnSave = ({ mandatoryVal, resultVal, goToNext }: {
    mandatoryVal?: boolean; resultVal?: boolean; goToNext?: boolean;
  }) => {
    const isResult = resultVal ? resultVal : isDpopDivision ?
      hasInvalidAssessmentOrVerif(listDataTableDebtor, 'verificationResult')
      :
      hasInvalidAssessmentOrVerif(listDataTableDebtor, 'assessmentResult');
    const message = isMandatoryEmpty ? 'DATA MANDATORY' : isDpopDivision ? 'VERIFICATION RESULT' : 'ASSESSMENT RESULT';
    const mandatoryValidation = mandatoryVal ? !mandatoryVal : isMandatoryEmpty;

    if (mandatoryValidation || isResult) {
      setShowModalSuccess(true);
      saveDocumentRemark({
        bucketProcessId: processId,
        documentDebtorType: selectedDebtorDocument,
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
        onSubmit: () => handleOnSave({ goToNext, mandatoryVal: true, resultVal: true }),
        submitText: 'Simpan',
        title: `${message} ada yang belum terisi, tetap simpan perubahan?`,
        type: 'warning',
      });
    }
  };

  const handleChangeDebtorDocument = (value: string) => {
    const debtorDocumentType = debtorDocumentOptions.find((item) => item.value === value)?.value || '';
    if (selectedDebtorDocument && selectedDebtorDocument !== debtorDocumentType) {

      showNiceModalV2({
        cancelText: 'Tidak',
        onCancel: () => closeNiceModal(MODAL.GLOBAL.CONFIRM),
        onSubmit: () => {
          saveDocumentRemark({
            bucketProcessId: processId,
            documentDebtorType: debtorDocumentType,
            module: TypeModule.APU_PPT,
            process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
            remark: watch('remark'),
          });
          setValDebtorDocument(debtorDocumentType);
        },
        submitText: 'Ya',
        title: 'Apakah anda yakin ingin mengubah data? Perubahan data akan menghapus data yang telah di isi!',
        type: 'warning',
      });

    } else {
      setValDebtorDocument(debtorDocumentType);
      saveDocumentRemark({
        bucketProcessId: processId,
        documentDebtorType: debtorDocumentType,
        module: TypeModule.APU_PPT,
        process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
        remark: watch('remark'),
      });
    }
  };

  const generateTableHeader = useMemo(() => {
    const tableArray = [];
    const isApdb = processId?.split('-')[0] === 'APDP';
    if (isApdb) {
      tableArray.push({
        key: 'businessCheck',
        label: 'Check Bisnis',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center" >
              {!row?.isEditable ? '' : row.isBusinessCheck ? 'Ya' : row.isBusinessCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '5vw' },
      },
      {
        key: 'dpopCheck',
        label: 'Check DPOP',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.isDpopCheck ? 'Ya' : row.isDpopCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>

        ),
        sx: { width: '5vw' },
      },
      {
        key: 'isCopy',
        label: 'Copy / Asli',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center" >
              { !row?.isEditable ? '' : row.isCopy ? 'Copy' : row.isCopy === null ? '-' : 'Asli'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '5vw' },
      },
      {
        key: 'statusLabel',
        label: 'Status',
        render: (row) => (
          <ColumnWrapper >
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.statusLabel}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '5vw' },
      });
    } else {
      tableArray.push({
        key: 'businessCheck',
        label: 'Check Bisnis',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center" >
              {!row?.isEditable ? '' : row.isBusinessCheck ? 'Ya' : row.isBusinessCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: { width: '5vw' },
      });
    }
    return tableArray;
  }, [processId]);

  const gotoEdit = (row) => {
    const typeCus = debtorDocumentOptions?.find((item) => item?.value === selectedDebtorDocument)?.label;
    const editPath = replacePath(dynamicPathEditPage, { id: row.id, processId });
    router.push(`${editPath}?ownerId=${row?.docId}&type=${typeCus}`);
  };

  const gotoMaintenanceCustomer = () => {
    const path = replacePath(
      maintenanceDebtor.LIST_PAGE,
      {
        debtorId: bucketDetail?.debtorId,
        from: 'apu-ppt',
        module: 'maintenance',
      });
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  const gotoDetail = (row) => {
    const typeCus = debtorDocumentOptions?.find((item) => item?.value === selectedDebtorDocument)?.label;
    const detailPath = replacePath(
      apuPpt.DEBTOR_DOCUMENT_DETAIL, { id: row?.id, module: currentProcess, processId }
    );
    router.push(setPreviewPage(`${detailPath}?ownerId=${row?.docId}&type=${typeCus}`));
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
      {
        iconName: '',
        isDisabled: (data) => data?.additionalAction === null || viewOnly,
        onClick: () => {
          gotoMaintenanceCustomer();
        },
      },
      );
    }
    return actArr;

  }, [viewOnly, debtorDocumentOptions, selectedDebtorDocument]);

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

  const tablerHeadChildCus: Array<TableHeaderVerification> = [
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
  const tablerHeadGrandChildCus: Array<TableHeaderVerification> = [
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

  const isMandatoryEmpty = !selectedDebtorDocument;

  const watchedRemark = watch('remark');
  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      documentDebtorType: selectedDebtorDocument,
      module: TypeModule.APU_PPT,
      process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      remark: watchedRemark,
    };

    return Promise.resolve(payload);
  }, [processId, selectedDebtorDocument, isDpopDivision, watchedRemark]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveDocRemark',
  });


  return {
    control,
    debtorDocumentOptions,
    handleChangeDebtorDocument,
    handleOnSave,
    isAutoSaveFetching,
    isDebtorLoading,
    isDocumentRemarkLoading,
    isDpopDivision,
    isLoadingBucket,
    isSaveDocumentRemarkLoading,
    listDataTableDebtor,
    listDiff,
    process,
    tableHeader,
    tablerHeadChildCus,
    tablerHeadGrandChildCus,
    valDebtorDocument,
  };
};

export default useDebtorDocument;

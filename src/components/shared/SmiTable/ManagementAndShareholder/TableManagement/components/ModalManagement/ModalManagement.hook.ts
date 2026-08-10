import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetManagement from '../../hooks/useGetManagement';
import useSaveManagement from '../../hooks/useSaveManagement';

import { validationSchema } from './ModalManagement.schema';


const useModalManagement = (id: number, module: string) => {
  const { processId, debtorId } = useIdentity();
  const modalId = MODAL.MASTER.MANAGEMENT;
  const theme = useTheme();
  const modal = useModal(modalId);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  let payload;
  if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      managementId: id,
      module: 'MAINTENANCE_DEBTOR',
      process: 'MAINTENANCE_DEBTOR',
    };
  } else {
    payload = { id };
  }

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);

  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  const { formState, control, reset, handleSubmit } = useForm({
    defaultValues: {
      collectability: '',
      dob: '',
      googleResult: '',
      jobPosition: '',
      name: '',
      nik: '',
      nikFile: {
        extension: '',
        name: '',
        url: '',
      },
      note: '',
      npwp: '',
      npwpFile: {
        extension: '',
        name: '',
        url: '',
      },
      resultReporting: '',
      type: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const {
    data: {
      managementList,
    } } = useGetManagement(payload, module);

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.MANAGEMENTDOCRESULT,
      module: TypeModule.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const documentContents = documentData?.contents;
  const documentPage = documentData?.page;

  const { isPending: isSaveLoading, mutate } = useSaveManagement({
    onSuccess: () => {closeNiceModal(MODAL.MASTER.MANAGEMENT).then(() => showNiceModalV2({ type: 'success' }));},
  });

  useEffect(() => {
    if (managementList) {
      const {
        type,
        dob,
        name,
        jobPosition,
        nik,
        npwp,
        listDocuments,
        collectability,
        googleResult,
        note,
        resultReporting,
      } = managementList;

      const npwpDoc = listDocuments?.find((item) => item.documentType === 'NPWP_MANAGEMENT');
      const nikDoc = listDocuments?.find((item) => item.documentType === 'NIK_MANAGEMENT');

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

      const initialPayload = {
        collectability,
        dob,
        googleResult,
        jobPosition,
        listDocuments,
        name,
        nik,
        nikFile,
        note,
        npwp,
        npwpFile,
        resultReporting,
        type,
      };

      reset(initialPayload);
    }
  }, [managementList]);


  function handleOnSubmit(data) {
    const {
      collectability,
      dob,
      googleResult,
      jobPosition,
      name,
      nik,
      nikFile,
      note,
      npwp,
      npwpFile,
      resultReporting,
      type,
    } = data;

    const listDocuments = [];

    if (nikFile) {
      listDocuments.push({
        base64: nikFile.file,
        documentType: 'NIK',
        fileExt: nikFile.extension,
        fileName: nikFile.name,
      });
    }

    if (npwpFile) {
      listDocuments.push({
        base64: npwpFile.file,
        documentType: 'NPWP',
        fileExt: npwpFile.extension,
        fileName: npwpFile.name,
      });
    }

    let payload;

    if (module?.includes('CREDIT_CHECKING')) {
      payload = {
        bucketProcessId: processId,
        collectability: collectability,
        debtorId,
        dob: dob,
        googleResult: googleResult,
        id,
        jobPosition,
        listDocuments,
        module: 'CREDIT_CHECKING',
        name,
        nik,
        note: note,
        npwp,
        process: 'CREDIT_CHECKING_RESULT',
        resultReporting: resultReporting,
        type,
      };
    } else {
      payload = {
        bucketProcessId: processId,
        debtorId,
        dob: dob,
        jobPosition,
        listDocuments,
        managementId: id,
        module: 'MAINTENANCE_DEBTOR',
        name,
        nik,
        npwp,
        process: 'MAINTENANCE_DEBTOR',
        type,
      };
    }

    mutate({ module, payload });
  };

  return {
    collectibilityOptions,
    control,
    documentContents,
    documentPage,
    formState,
    handleOnSubmit,
    handleSubmit,
    isSaveLoading,
    jobPositionData,
    modal,
    modalId,
    setItemPerPage,
    setNoPage,
    theme,
  };
};

export default useModalManagement;

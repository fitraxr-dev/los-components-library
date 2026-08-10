import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModal from '@/helpers/showNiceModal';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetDebtor from '../../hooks/useGetDebtor';
import useSaveDebtor from '../../hooks/useSaveDebtor';

import { validationSchema } from './ModalDebtor.schema';


const useModalDebtor = (id: number, module: string) => {
  const { debtorId, processId } = useIdentity();
  const modalId = MODAL.MASTER.MANAGEMENT_DEBTOR;
  const theme = useTheme();
  const modal = useModal(modalId);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  const { handleSubmit, reset, formState, watch, setValue, control } = useForm({
    defaultValues: {
      collectability: '',
      googleResult: '',
      name: '',
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

  let payload;
  if (module === MAINTENANCE_MODULE.CREDIT_CHECKING_RESULT) {
    payload = {
      bucketProcessId: processId,
      id,
      module: 'CREDIT_CHECKING',
    };
  } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      module: 'MAINTENANCE_DEBTOR',
      process: 'MAINTENANCE_DEBTOR',
    };
  } else {
    payload = {
      id,
    };
  }

  const { data: {
    debtorDataList,
  } } = useGetDebtor(payload, module);

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DEBTORDOCRESULT,
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

  const { isPending: isSaveLoading, mutate: saveDebtorData } = useSaveDebtor({
    onSuccess: () => {
      showNiceModal('success', 'Data berhasil disimpan');
      closeNiceModal(MODAL.MASTER.MANAGEMENT_DEBTOR);
    },
  });

  useEffect(() => {
    if (debtorDataList) {
      const {
        debtorName,
        name,
        npwp,
        type,
        collectabilityLabel,
        googleResult,
        note,
        resultReporting,
        listDocuments,
      } = debtorDataList;

      const npwpDoc = listDocuments?.find((item) => item.documentType === 'NPWP');

      const npwpFile = npwpDoc ? {
        extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
        name: npwpDoc.documentName,
        url: npwpDoc.document,
      } : null;

      const initialPayload = {
        collectability: collectabilityLabel,
        googleResult,
        name: name || debtorName,
        note,
        npwp,
        npwpFile,
        resultReporting,
        type,
      };

      reset(initialPayload);
    }
  }, [debtorDataList]);


  function handleOnSubmit(data) {
    const {
      type,
      name,
      npwp,
      npwpFile,
      collectability,
      googleResult,
      note,
      resultReporting,
    } = data;

    const listDocuments = [];

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
        collectability,
        debtorId,
        googleResult: googleResult,
        id,
        listDocuments,
        name,
        note: note,
        npwp,
        resultReporting,
        type,
      };
    } else {
      payload = {
        bucketProcessId: processId,
        debtorId,
        id,
        listDocuments,
        name,
        npwp,
        type,
      };
    }

    saveDebtorData({ module, payload });
  };

  return {
    collectibilityOptions,
    control,
    documentContents,
    documentPage,
    formState,
    handleOnSubmit,
    handleSubmit,
    institutiontypeData,
    isSaveLoading,
    modal,
    modalId,
    setItemPerPage,
    setNoPage,
    theme,
  };
};

export default useModalDebtor;

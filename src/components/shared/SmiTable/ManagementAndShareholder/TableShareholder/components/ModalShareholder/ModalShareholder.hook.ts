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
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useStyle from '../../../../../../pages/MaintenanceData/MaintenanceDebtor/hooks/useStyle';
import useGetShareholder from '../../hooks/useGetShareholder';
import useSaveShareholder from '../../hooks/useSaveShareholder';

import { validationSchema } from './ModalShareholder.schema';


const modalId = MODAL.MASTER.SHAREHOLDER;

const useModalShareholder = (id: number, module: string) => {
  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { styDropdown } = useStyle();
  const modal = useModal(modalId);
  const theme = useTheme();

  const { watch, formState, setValue, control, handleSubmit, reset } = useForm({
    defaultValues: {
      collectability: '',
      currency: '',
      googleResult: '',
      name: '',
      nik: '',
      note: '',
      npwp: '',
      ownershipType: '',
      percentage: '',
      position: {
        id: '',
        label: '',
      },
      resultReporting: '',
      shareValue: '',
      shares: '',
      type: '',
      uploadNik: {
        extension: '',
        name: '',
        url: '',
      },
      uploadNpwp: {
        extension: '',
        name: '',
        url: '',
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const {
    data: jobPositionData,
    isLoading: isLoadingJob,
    isSuccess: isSuccesJob,
  } = useGetParameterList(Modules.JOB_POSITION);
  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  let payload;
  if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      module: 'MAINTENANCE_DEBTOR',
      process: 'MAINTENANCE_DEBTOR',
      shareholderId: id,
    };
  } else {
    payload = { id };
  }
  const { data: {
    shareholderList },
  isSuccess: isShareholderListSuccess,
  } = useGetShareholder({ module, payload }, { enabled: id !== undefined && id !== null });

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SHAREHOLDERDOCRESULT,
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

  const { isPending: isSaveLoading, mutate } = useSaveShareholder({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Shareholder', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(MODAL.MASTER.SHAREHOLDER).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Shareholder', type: 'success' });
      });
    },
  });

  const {
    shareValue,
    shares: sharesValue,
  } = watch();

  const [nominal, setNominal] = useState('');

  useEffect(() => {
    setNominal(multiplyNominalValues(sharesValue, shareValue));
  }, [sharesValue, shareValue]);

  useEffect(() => {
    if (isShareholderListSuccess && Object.keys(shareholderList).length > 0) {
      const {
        type,
        name,
        jobPosition,
        ownershipType,
        nik,
        npwp,
        shares,
        valuePerShare,
        percentage,
        listDocuments,
        curValuePerShare,
        collectability,
        googleResult,
        note,
        resultReporting,
        jobPositionLabel,
      } = shareholderList;

      const npwpDoc = listDocuments?.find((item) => item.documentType === 'NPWP_SHAREHOLDER');
      const nikDoc = listDocuments?.find((item) => item.documentType === 'NIK_SHAREHOLDER');

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

      const payload = {
        collectability: collectability,
        currency: curValuePerShare,
        googleResult: googleResult,
        name: name,
        nik: nik,
        note: note,
        npwp: npwp,
        ownershipType: ownershipType,
        percentage: percentage,
        position: { id: jobPosition, label: jobPositionLabel },
        resultReporting: resultReporting,
        shareValue: valuePerShare || '',
        shares: formatNumber(shares) || '',
        type: type,
        uploadNik: nikFile,
        uploadNpwp: npwpFile,
      };

      reset(payload);

      setNominal(multiplyNominalValues(shares, valuePerShare));
    }
  }, [shareholderList]);


  function handleOnSubmit(data) {
    try {
      const {
        type,
        name,
        nik,
        npwp,
        uploadNik,
        uploadNpwp,
        currency,
        shares,
        shareValue,
        percentage,
        position,
        ownershipType,
        collectability,
        googleResult,
        note,
        resultReporting,
      } = data;
      const ignoreValidation = [];
      if (!npwp) ignoreValidation.push('npwp');
      if (!percentage) ignoreValidation.push('percentage');
      if (type !== 'OTHERS') ignoreValidation.push('ownershipType');
      if (type !== 'INDIVIDUAL') ignoreValidation.push('nik');

      const listDocuments = [];
      // if (!masintonValidation({ ignoreValidation })) return;
      if (uploadNik) {
        listDocuments.push({
          base64: uploadNik.file,
          documentType: 'NIK',
          fileExt: uploadNik.extension,
          fileName: uploadNik.name,
        });
      }

      if (uploadNpwp) {
        listDocuments.push({
          base64: uploadNpwp.file,
          documentType: 'NPWP',
          fileExt: uploadNpwp.extension,
          fileName: uploadNpwp.name,
        });
      }

      let payload;

      if (module?.includes('CREDIT_CHECKING')) {
        payload = {
          bucketProcessId: processId,
          collectability: collectability,
          curValuePerShare: currency,
          debtorId,
          googleResult: googleResult,
          id: id,
          jobPosition: position.id,
          listDocuments,
          module: 'CREDIT_CHECKING',
          name: name,
          nik: nik,
          note: note,
          npwp: npwp,
          ownershipType: ownershipType,
          percentage: percentage,
          process: 'CREDIT_CHECKING_RESULT',
          resultReporting: resultReporting,
          shareholderId: id,
          shares: formatNumber(shares),
          type: type,
          valuePerShare: formatNumber(shareValue),
        };
      } else {
        payload = {
          bucketProcessId: processId,
          curValuePerShare: currency,
          debtorId,
          jobPosition: position?.id,
          listDocuments,
          module: 'MAINTENANCE_DEBTOR',
          name: name,
          nik: nik,
          npwp: npwp,
          ownershipType: ownershipType,
          percentage: percentage,
          process: 'MAINTENANCE_DEBTOR',
          shareholderId: id,
          shares: formatNumber(shares),
          type: type,
          valuePerShare: formatNumber(shareValue),
        };
      }

      mutate({ module, payload });
    } catch (error) {
      console.log('catch', error);
    }

  };

  function handleCloseModalWarning() {
    if (formState.isDirty) {
      const isConfirmed = window.confirm('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
      if (isConfirmed) {
        closeNiceModal(modalId);
      }
    } else {
      closeNiceModal(modalId);
    }
  };

  const jobPositionList = isSuccesJob &&
    jobPositionData?.map((res) => ({ id: res.value, label: res.label })) || [];


  return {
    collectibilityOptions,
    control,
    documentContents,
    documentPage,
    formState,
    handleCloseModalWarning,
    handleOnSubmit,
    handleSubmit,
    institutiontypeData,
    isLoadingJob,
    isSaveLoading,
    jobPositionData,
    jobPositionList,
    modal,
    modalId,
    nominal,
    setItemPerPage,
    setNoPage,
    setValue,
    styDropdown,
    theme,
    watch,
  };
};

export default useModalShareholder;

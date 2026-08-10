import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import useIdentity from '@/hooks/useIdentity';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetDebtor from '../../hooks/useGetDebtor';


export const useModalDebtorDetail = (id: string, module: string, isRequestMode: boolean) => {
  const { processId, debtorId } = useIdentity();
  const [itemPerPage, setItemPerPage] = useState(5);
  const [noPage, setNoPage] = useState(1);

  const [cellDataWithDetail, setCellDataWithDetail] = useState([
    { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'NPWP', value: null },
    { label: 'NPWP Document', url: null, value: null }
  ]);

  const [cellDataCreditChecking, setCellDataCreditChecking] = useState([
    { label: 'Kolektibilitas', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Hasil laporan', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: null }
  ]);


  let payload;
  if (module?.includes('CREDIT_CHECKING')) {
    payload = {
      bucketProcessId: processId,
      id,
    };
  } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      module: 'MAINTENANCE_DEBTOR',
      process: 'MAINTENANCE_DEBTOR',
    };
  } else {
    payload = {
      debtorId,
    };
  }

  const { data: {
    debtorDataList,
  }, isSuccess } = useGetDebtor(payload, module);

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

  useEffect(() => {
    if (isSuccess && debtorDataList) {

      const {
        debtorName,
        name,
        npwp,
        npwpUrl,
        npwpFileName,
        collectabilityLabel,
        googleResult,
        note,
        resultReporting,
        typeLabel,
        listDocuments,
      } = debtorDataList;

      const npwpFile = () => {
        if (!listDocuments) return;
        if (listDocuments) {
          const document = listDocuments.find((el) => el.documentType.includes('NPWP'));

          return {
            data: document,
            documentExtension: document?.documentExtension,
            extension: ' ',
            fileName: document?.documentName,
            id: document?.id,
            url: document?.document,
            value: document?.document ? document?.fileName : '-',
          };
        }
      };

      const data = !module?.includes('CREDIT_CHECKING') ? [
        { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: name },
        { label: 'NPWP', value: npwp },
        { label: 'NPWP Document', url: npwpUrl, value: npwpFileName }
      ] : [
        { label: 'Nama', value: debtorName },
        { label: 'Tipe', value: typeLabel },
        { label: 'NPWP', value: npwp },
        { documentExtension: npwpFile()?.documentExtension,
          documentId: npwpFile()?.id, fileName: npwpFile()?.fileName, label: 'NPWP Document', url: npwpFile()?.url, value: npwpFile()?.value }
      ];
      setCellDataWithDetail(data);

      setCellDataCreditChecking([
        { label: 'Kolektibilitas', sx: { gridColumn: '1 / span 2' }, value: collectabilityLabel },
        { label: 'Hasil laporan', sx: { gridColumn: '1 / span 2' }, value: resultReporting },
        { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: note },
        { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: googleResult }
      ]);
    }
  }, [debtorDataList, isSuccess]);

  const { mutate: setWatermark, isPending: isSetWatermarkLoading } = usePreviewWatermark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: downloadWatermark, isPending: isDownloadWatermarkLoading } = useDownloadWatermark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    }, onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_self');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOpenWatermarkModal = (data, action) => {
    const email = JSON.parse(localStorage.getItem('app-context-persist')).userData.user.email;
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: ({ watermark }) => {
        if (watermark) {
          watermark = encodeURI(watermark);
        }
        if (action === 'download') {
          downloadWatermark({
            ...data,
            watermark: watermark,
          });
        } else {
          setWatermark({
            ...data,
            watermark: watermark,
          });
        }
      },
    });
  };

  return {
    cellDataCreditChecking,
    cellDataWithDetail,
    documentContents,
    documentPage,
    handleOpenWatermarkModal,
    setItemPerPage,
    setNoPage,
  };
};

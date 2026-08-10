import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { DPOP_DIVISION, roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDivision from '@/hooks/useDivision';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import useIdentity from '@/hooks/useIdentity';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetDebtorDetail from '../../hooks/useGetDebtor';


export const useModalDebtorDetail = (id: number | null) => {
  const { processId, debtorId } = useIdentity();
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [noPage, setNoPage] = React.useState(1);
  const [{ currentRole, stepper }] = useApp();
  const { divisionCode } = useDivision();

  const isDpopProcessId = processId?.includes('CCD');
  const isSuperAdmin = (currentRole.includes(roles.MAKER) || currentRole.includes(roles.CHECKER)) && isDpopProcessId;

  const isCompleted = Boolean(stepper?.from === 'CC_COMPLETED');
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const showDetailCondition = (isSuperAdmin || isDpop) && isCompleted;

  const [cellDataWithDetail, setCellDataWithDetail] = React.useState([
    { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'NPWP', value: null },
    { label: 'NPWP Document', url: null, value: null }
  ]);

  const [cellDataFastTrack, setCellDataFastTrack] = React.useState([
    { label: 'Kolektibilitas', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Hasil laporan', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: null }
  ]);

  const { data: debtorDataList, isSuccess } = useGetDebtorDetail({
    bucketProcessId: processId,
    referenceCode: debtorId,
    summaryId: id,
  }, {
    enabled: !!processId && !!debtorId,
  });

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DEBTORDOCRESULT,
      module: TypeModule.FAST_TRACK,
      ownerId: debtorId,
      process: TypeProcess.FAST_TRACK,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const documentContents = documentData?.contents;
  const documentPage = documentData?.page;

  React.useEffect(() => {
    if (!isSuccess || !debtorDataList) return;

    const {
      debtorName,
      npwp,
      collectabilityLabel,
      googleResult,
      note,
      resultReporting,
      listDocuments,
      ref,
    } = debtorDataList;

    const getFileListDocuments = (param: string = 'NPWP') => {
      if (!listDocuments) return;
      if (listDocuments) {
        const document = listDocuments.find((el) => el.documentType.includes(param));

        return {
          ...document,
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

    const npwpFile = getFileListDocuments('NPWP');
    const ktpFile = getFileListDocuments('KTP');

    let data: any[] = [
      { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: debtorName || '-' },
      // { label: 'Tipe', value: typeLabel },
    ];

    if (npwpFile) {
      data.push({ label: 'NPWP', value: npwp || '-' });
      data.push({
        documentExtension: npwpFile?.documentExtension,
        documentId: npwpFile?.id,
        fileName: npwpFile?.fileName,
        label: 'NPWP Document',
        npwpFile: npwpFile?.url,
        npwpFileName: npwpFile?.fileName,
        url: npwpFile?.url,
        value: npwpFile?.value || '-',
      });
    }

    // if (ktpFile?.url) {
    //   data.push({ label: 'NIK', value: ktpFile?.value || '-' });
    //   data.push({
    //     documentExtension: ktpFile?.documentExtension,
    //     documentId: ktpFile?.id,
    //     fileName: ktpFile?.fileName,
    //     identityDocUrl: ktpFile?.url,
    //     ktpFileName: ktpFile?.fileName,
    //     label: 'NIK Document',
    //     url: ktpFile?.url,
    //     value: ktpFile?.value || '-',
    //   });
    // }

    setCellDataWithDetail(data);

    setCellDataFastTrack([
      { label: 'Kolektibilitas', sx: { gridColumn: '1 / span 2' }, value: collectabilityLabel || '-' },
      { label: 'Ref', sx: { gridColumn: '1 / span 2' }, value: ref || '-' },
      { label: 'Hasil laporan', sx: { gridColumn: '1 / span 2' }, value: resultReporting || '-' },
      { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: note || '-' },
      { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: googleResult || '-' }
    ]);
  }, [debtorDataList, isSuccess]);

  const { mutate: setWatermark } = usePreviewWatermark({
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

  const { mutate: downloadWatermark } = useDownloadWatermark({
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
    cellDataFastTrack,
    cellDataWithDetail,
    documentContents,
    documentPage,
    handleOpenWatermarkModal,
    setItemPerPage,
    setNoPage,
    showDetailCondition,
  };
};

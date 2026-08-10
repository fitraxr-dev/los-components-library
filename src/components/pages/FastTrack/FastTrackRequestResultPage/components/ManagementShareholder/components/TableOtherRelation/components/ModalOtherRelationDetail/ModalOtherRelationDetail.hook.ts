import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { DPOP_DIVISION, roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDivision from '@/hooks/useDivision';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import useIdentity from '@/hooks/useIdentity';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetOtherRelationDetail from '../../hooks/useGetOtherRelationDetail';


const useModalOtherRelationDetail = (id: number | null) => {
  const { processId } = useIdentity();
  const [{ currentRole, stepper }] = useApp();
  const { divisionCode } = useDivision();

  const isDpopProcessId = processId?.includes('CCD');
  const isSuperAdmin = (currentRole.includes(roles.MAKER) || currentRole.includes(roles.CHECKER)) && isDpopProcessId;

  const isCompleted = Boolean(stepper?.from === 'CC_COMPLETED');
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const showDetailCondition = (isSuperAdmin || isDpop) && isCompleted;

  const [noPage, setNoPage] = React.useState(1);
  const [itemPerPage, setItemPerPage] = React.useState(5);

  const [cellDataWithDetail, setCellDataWithDetail] = React.useState([
    { label: 'Tipe', value: null },
    { label: 'Nama', value: null },
    { label: 'NPWP', value: null },
    { label: 'NPWP Document', url: null, value: null }
  ]);

  const [cellDataFastTrack, setCellDataFastTrack] = React.useState([
    { label: 'Kolektibilitas', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Hasil laporan', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: null }
  ]);

  const otherRelatedCode = sessionStorage.getItem('otherRelatedCode');
  const { data: otherRelationDetailData, isSuccess } = useGetOtherRelationDetail({
    bucketProcessId: processId,
    referenceCode: otherRelatedCode,
    summaryId: id,
  }, {
    enabled: !!processId && !!otherRelatedCode,
  });

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.OTHERRELATEDDOCRESULT,
      module: TypeModule.FAST_TRACK,
      ownerId: otherRelatedCode,
      process: TypeProcess.FAST_TRACK,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  React.useEffect(() => {
    if (!isSuccess || !otherRelationDetailData) return;

    const {
      name,
      npwp,
      nik,
      collectabilityLabel,
      googleResult,
      note,
      resultReporting,
      typeLabel,
      type,
      listDocuments,
      jobPositionLabel,
      identityTypeLabel,
      identityNo,
      modifiedDate,
      modifiedBy,
      ref,
    } = otherRelationDetailData;

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
    const nikFile = getFileListDocuments('KTP');
    const lastModifiedDate = toDateString(modifiedDate);

    let data: any[] = [
      { label: 'Tipe', value: typeLabel || '-' },
      { label: 'Nama', value: name || '-' },
    ];

    data.push(
      { label: 'Jabatan', value: jobPositionLabel || '-' },
      { label: 'ID Type', value: identityTypeLabel || '-' },
      { label: 'ID No', value: identityNo || '-' }
    );

    if (nikFile?.url) {
      data.push({
        documentExtension: nikFile?.documentExtension,
        documentId: nikFile?.id,
        fileName: nikFile?.fileName,
        identityDocUrl: nikFile?.url,
        label: 'ID Document',
        url: nikFile?.url,
        value: nikFile?.value || '-',
      });
    } else {
      data.push({
        label: 'ID Document',
        url: null,
        value: '-',
      });
    }

    data.push(
      { label: 'NPWP', value: npwp || '-' }
    );

    if (npwpFile) {
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
    } else {
      data.push({
        label: 'NPWP Document',
        url: null,
        value: '-',
      });
    }

    data.push(
      { label: 'Last Modified', value: lastModifiedDate || '-' },
      { label: 'Modified By', value: modifiedBy || '-' }
    );

    setCellDataWithDetail(data);

    setCellDataFastTrack([
      { label: 'Kolektibilitas', sx: { gridColumn: '1 / span 2' }, value: collectabilityLabel || '-' },
      { label: 'Ref', sx: { gridColumn: '1 / span 2' }, value: ref || '-' },
      { label: 'Hasil laporan', sx: { gridColumn: '1 / span 2' }, value: resultReporting || '-' },
      { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: note || '-' },
      { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: googleResult || '-' }
    ]);
  }, [otherRelationDetailData, isSuccess]);

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
    documentContents: documentData?.contents,
    documentPage: documentData?.page,
    handleOpenWatermarkModal,
    setItemPerPage,
    setNoPage,
    showDetailCondition,
  };
};

export default useModalOtherRelationDetail;

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { toDateString, toHourMinuteSecond } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


interface ModalDetailFinalDocumentProps {
  id: number;
}

const ModalDetailFinalDocument = NiceModal.create(({ id }: ModalDetailFinalDocumentProps) => {
  const theme = useTheme();

  const modalId = MODAL.RISALAH_RAPAT.DETAIL_FINAL_DOCUMENT;
  const { visible } = useModal(modalId);

  const { data: documentDetailData } = useGetDocumentById({ id });

  const { mutate: downloadWatermark } = useDownloadWatermark({
    onError: () => {
      showNiceModalV2({
        title: 'Download gagal',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_self');
        },
        title: 'Download berhasil',
        type: 'success',
      });
    },
  });

  const handleDocumentDownload = (data) => {
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: ({ watermark }) => {
        if (watermark) {
          watermark = encodeURI(watermark);
        }

        downloadWatermark({
          ...data,
          watermark: watermark,
        });
      },
    });
  };

  return (
    <SectionModal
      title="Detail Dokumen Risalah Rapat"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell
            title="Upload By"
            value={documentDetailData?.createdBy ?? '-'}
          />
          <Cell
            title="Upload Date"
            value={documentDetailData?.createdDate ? toDateString(documentDetailData?.createdDate) : '-'}
          />
        </Box>
        <Cell
          title="Upload Document"
          value={documentDetailData?.fileName ?? '-'}
          buttons={[{
            action: () => handleDocumentDownload(documentDetailData),
            iconName: 'download',
            label: 'Download',
          }]}
        />
        <Cell
          title="Nama Dokumen"
          value={documentDetailData?.documentName ?? '-'}
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell
            title="Nomor Dokumen"
            value={documentDetailData?.documentNumber}
          />
          <Cell
            title="Tanggal Dokumen"
            value={documentDetailData?.documentDate ? toDateString(documentDetailData?.documentDate) : '-'}
          />
        </Box>
        <Cell
          title="Waktu Dokumen"
          value={documentDetailData?.documentDate ? toHourMinuteSecond(documentDetailData?.documentDate) : '-'}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalDetailFinalDocument;

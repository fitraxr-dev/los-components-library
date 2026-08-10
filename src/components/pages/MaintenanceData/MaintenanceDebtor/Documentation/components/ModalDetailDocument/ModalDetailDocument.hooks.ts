import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';

import { modal } from '../../Documentation.constants';


export const useModalDetailDocument = () => {

  const { mutate: setWatermark, isPending: isSetWatermarkLoading } = usePreviewWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      closeNiceModal(modal.DETAIL_DOCUMENT);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
          closeNiceModal(MODAL.GLOBAL.WATERMARK);
          closeNiceModal(modal.DETAIL_DOCUMENT);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: downloadWatermark, isPending: isDownloadWatermarkLoading } = useDownloadWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      closeNiceModal(modal.DETAIL_DOCUMENT);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      closeNiceModal(modal.DETAIL_DOCUMENT);
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
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
    handleOpenWatermarkModal,
  };
};

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
// Old approach - using downloadFileV2 and useDownloadGeneral hook (commented out)
// import { downloadFile, downloadFileV2 } from '@/helpers/utils';
// import useDownloadGeneral from '@/hooks/useDownloadGeneral';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalData } from '../../../ManagementShareholder.constants';

import useModalDebtorDetailNew from './ModalDebtorDetailNew.hook';


const ModalDebtorDetailNew = NiceModal.create(({ id }: { id: string }) => {
  const modalId = modalData.MODAL_DEBTOR_DETAIL_NEW;
  const theme = useTheme();
  const { visible } = useModal(modalId);

  const {
    cellDataWithDetail,
    debtorData,
  } = useModalDebtorDetailNew({ id });

  // Watermark hooks for preview
  const { mutate: setWatermark } = usePreviewWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
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
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  // Watermark hooks for download
  const { mutate: downloadWatermark } = useDownloadWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
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

  // Handle opening watermark modal
  const handleOpenWatermarkModal = (data: any, action: 'preview' | 'download') => {
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: ({ watermark }: { watermark: string }) => {
        let encodedWatermark = watermark;
        if (watermark) {
          encodedWatermark = encodeURI(watermark);
        }
        if (action === 'download') {
          downloadWatermark({
            ...data,
            watermark: encodedWatermark,
          });
        } else {
          setWatermark({
            ...data,
            watermark: encodedWatermark,
          });
        }
      },
    });
  };

  // Old approach - using useDownloadGeneral hook (commented out)
  // const downloadMutation = useDownloadGeneral({
  //   onError: (error) => {
  //     showNiceModalV2({
  //       title: 'Download gagal',
  //       type: 'error',
  //     });
  //   },
  //   onSuccess: () => {
  //     showNiceModalV2({
  //       title: 'Download berhasil',
  //       type: 'success',
  //     });
  //   },
  // });

  return (
    <SectionModal
      title="Detail Customer"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {cellDataWithDetail.map((item, index) => {
          // Tentukan document object untuk watermark
          const derivedExtension = 'extension' in item && item.extension
            ? item.extension
            : (typeof item.value === 'string' && item.value.includes('.')
              ? item.value.split('.').pop()
              : undefined);

          const derivedFileName = 'fileName' in item && item.fileName
            ? item.fileName
            : (typeof item.value === 'string' && derivedExtension
              ? item.value.replace(new RegExp(`\.${derivedExtension}$`, 'i'), '')
              : typeof item.value === 'string' ? item.value : undefined);

          let documentObject = null;
          if (item.url && debtorData) {
            documentObject = {
              ...debtorData,
              document: item.url,
              documentExtension: derivedExtension,
              fileName: derivedFileName,
            };
          }

          return (
            <Cell
              title={item.label}
              value={item.value}
              buttons={item.url && documentObject ? [
                {
                  action: async () => {
                    handleOpenWatermarkModal(documentObject, 'preview');
                  },
                  iconName: 'preview-document',
                  label: '',
                },
                {
                  action: async () => {
                    handleOpenWatermarkModal(documentObject, 'download');

                    // Old approach - using downloadFileV2 (commented out)
                    // downloadFileV2(item.url, item.value);

                    // Old approach - using useDownloadGeneral hook (commented out)
                    // downloadMutation.mutate({
                    //   fileName: item.value,
                    //   id: debtorData?.id,
                    // });
                  },
                  iconName: 'download',
                  label: '',
                },
              ] : []}
              options={item.sx}
              key={index}
            />
          );
        })}
      </Box>
      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default ModalDebtorDetailNew;

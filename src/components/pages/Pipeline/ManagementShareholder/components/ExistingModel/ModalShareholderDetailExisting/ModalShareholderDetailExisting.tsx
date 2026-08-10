import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
// Old approach - using downloadFileV2 and useDownloadGeneral hook (commented out)
// import { downloadFile, downloadFileV2 } from '@/helpers/utils';
// import useDownloadGeneral from '@/hooks/useDownloadGeneral';

import Cell from '@/components/shared/Cell';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalData } from '../../../ManagementShareholder.constants';

import useModalShareholderDetailExisting from './ModalShareholderDetailExisting.hook';

import type { ModalShareholderDetailExistingProps } from './ModalShareholderExisting.types';


const ModalShareholderDetailExisting = NiceModal.create(({
  shareholderCode,
  module,
  isRequestMode,
}: ModalShareholderDetailExistingProps) => {
  const theme = useTheme();
  console.log(shareholderCode);
  const modalId = modalData.MODAL_SHAREHOLDER_DETAIL_EXISTING;;
  const modal = useModal(modalId);

  const {
    detailShareholderData,
    shareholderList,
  } = useModalShareholderDetailExisting(shareholderCode, module, isRequestMode);

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
      title="Detail Shareholder"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '60vw',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {detailShareholderData.map((item, index) => {
          // Tentukan document object berdasarkan key
          const derivedExtension = 'extension' in item && item.extension
            ? item.extension
            : (typeof item.value === 'string' && item.value?.includes('.')
              ? item.value.split('.').pop()
              : undefined);

          const derivedFileName = 'fileName' in item && item.fileName
            ? item.fileName
            : (typeof item.value === 'string' && derivedExtension
              ? item.value.replace(new RegExp(`\.${derivedExtension}$`, 'i'), '')
              : typeof item.value === 'string' ? item.value : undefined);

          let documentObject = null;
          if (item.key === 'npwpFile' && shareholderList?.npwpFile) {
            documentObject = {
              ...shareholderList,
              document: item.url ?? shareholderList.npwpFile,
              documentExtension: derivedExtension,
              fileName: derivedFileName,
              identityDocUrl: null,
            };
          } else if (item.key === 'identityDocFile' && shareholderList?.identityDocUrl) {
            documentObject = {
              ...shareholderList,
              document: item.url ?? shareholderList.identityDocUrl,
              documentExtension: derivedExtension,
              fileName: derivedFileName,
              npwpFile: null,
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
                    //   id: shareholderList?.id,
                    // });
                  },
                  iconName: 'download',
                  label: '',
                },
              ] : []}
              key={index}
            />
          );
        })}
      </Box>

    </SectionModal >
  );
});


export default ModalShareholderDetailExisting;

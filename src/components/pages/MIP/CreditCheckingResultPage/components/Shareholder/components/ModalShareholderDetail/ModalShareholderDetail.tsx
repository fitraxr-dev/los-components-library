import React from 'react';

import NiceModal, { create, useModal } from '@ebay/nice-modal-react';
import { Box, Typography, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../Shareholder.constants';

import useModalShareholderDetail from './ModalShareholderDetail.hook';

import type { ModalShareholderDetailProps } from './ModalShareholderDetail.types';


const ModalShareholderDetail = create((props: ModalShareholderDetailProps) => {
  const modalId = modal.MODAL_SHAREHOLDER_DETAIL;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    cellsDataTop,
    cellsDataBottom,
    documentContents,
    documentPage,
    memoDocumentContents,
    memoDocumentPage,
    setItemPerPage,
    setNoPage,
    shareholderData,
  } = useModalShareholderDetail(props);

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

  return (
    <SectionModal
      title="Detail Shareholder"
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
        {cellsDataTop.length > 0 && cellsDataTop.map((item) => {
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

          const documentObject = item.url && shareholderData ? {
            ...shareholderData,
            document: item.url,
            documentExtension: derivedExtension,
            fileName: derivedFileName,
          } : null;

          return (
            <Cell
              key={item.label}
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
                  },
                  iconName: 'download',
                  label: '',
                },
              ] : []}
              options={'sx' in item ? item.sx : undefined}
            />
          );
        })}
      </Box>

      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          mt: theme.spacing(2),
        }}
      >
        Credit Checking Result
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
        }}
      >
        <ModalTable
          data={documentContents}
          page={documentPage}
          setItemPerPage={setItemPerPage}
          setNoPage={setNoPage}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
          mb: theme.spacing(2),
        }}
      >
        {cellsDataBottom.length > 0 && cellsDataBottom.map((item) =>
          <Cell
            title={item.label}
            value={item.value}
            options={item.sx}
            key={item.label}
          />,
        )}
      </Box>

      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          mt: theme.spacing(2),
        }}
      >
        Memo Hasil Credit Checking
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
        }}
      >
        <ModalTable
          data={memoDocumentContents}
          page={memoDocumentPage}
          setItemPerPage={setItemPerPage}
          setNoPage={setNoPage}
        />
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

export default ModalShareholderDetail;

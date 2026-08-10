'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import useGetRefinaDetail from '@/hooks/useGetRefinaDetail';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL_REFINA_DETAIL } from './ModalRefina.constants';

import type { RefinaDetailProps } from './ModalRefinaDetail.props';


const ModalRefinaDetail = NiceModal.create((props: RefinaDetailProps) => {
  const { refinaId } = props;
  const theme = useTheme();
  const modalId = MODAL_REFINA_DETAIL;
  const { visible } = useModal(modalId);

  const { data: refinaDetail, isLoading } = useGetRefinaDetail({
    requestDetailSubmissionId: refinaId,
  });

  const productData = [
    {
      isBold: true,
      label: 'Nama Produk',
      noBorder: true,
      value: refinaDetail?.content?.productName && refinaDetail?.content?.productName !== 'null' ? refinaDetail.content.productName : '-',
    },
    {
      label: '',
      value: refinaDetail?.content?.productDescription && refinaDetail?.content?.productDescription !== 'null' ? refinaDetail.content.productDescription : '-',
    },
    {
      label: 'Status',
      value: refinaDetail?.content?.productStatus && refinaDetail?.content?.productStatus !== 'null' ? refinaDetail.content.productStatus : '-',
    },
  ];

  const projectData = [
    {
      isBold: true,
      label: 'Nama Proyek',
      noBorder: true,
      value: refinaDetail?.content?.projectName && refinaDetail?.content?.projectName !== 'null' ? refinaDetail.content.projectName : '-',
    },
    {
      label: '',
      value: refinaDetail?.content?.projectDescription && refinaDetail?.content?.projectDescription !== 'null' ? refinaDetail.content.projectDescription : '-',
    },
    {
      label: 'Lokasi Proyek',
      value: refinaDetail?.content?.projectLocationName && refinaDetail?.content?.projectLocationName !== 'null' ? refinaDetail.content.projectLocationName : '-',
    },
    {
      label: 'Alamat',
      value: refinaDetail?.content?.projectAddress && refinaDetail?.content?.projectAddress !== 'null' ? refinaDetail.content.projectAddress : '-',
    },
  ];

  return (
    <SectionModal
      title="Detail Data Sync Refina"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        maxWidth: '70vw',
        minWidth: '60vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 4 }}>
        {/* Informasi Produk */}
        <ColumnWrapper sx={{ gap: 2 }}>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Produk :
          </TextStyle>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
            }}
          >
            {productData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  alignItems: 'flex-start',
                  borderBottom: item.noBorder ? 'none' : (index < productData.length - 1 ? '1px dotted #ccc' : 'none'),
                  display: 'flex',
                  minHeight: '24px',
                  pb: item.noBorder ? 0 : (index < productData.length - 1 ? 2 : 0),
                }}
              >
                {item.label ? (
                  <Box sx={{ minWidth: '120px', pt: '2px' }}>
                    <TextStyle variant="body4" weight={500} color={theme.palette.custom.text}>
                      {item.label} :
                    </TextStyle>
                  </Box>
                ) : (
                  <Box sx={{ minWidth: '120px' }} />
                )}
                <Box sx={{ flex: 1, pt: '2px' }}>
                  <TextStyle
                    variant="body4"
                    weight={item.isBold ? 600 : 400}
                    color={theme.palette.custom.text}
                  >
                    {item.value}
                  </TextStyle>
                </Box>
              </Box>
            ))}
          </Box>
        </ColumnWrapper>

        {/* Informasi Proyek */}
        <ColumnWrapper sx={{ gap: 2 }}>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Proyek :
          </TextStyle>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
            }}
          >
            {projectData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  alignItems: 'flex-start',
                  borderBottom: item.noBorder ? 'none' : (index < projectData.length - 1 ? '1px dotted #ccc' : 'none'),
                  display: 'flex',
                  minHeight: '24px',
                  pb: item.noBorder ? 0 : (index < projectData.length - 1 ? 2 : 0),
                }}
              >
                {item.label ? (
                  <Box sx={{ minWidth: '120px', pt: '2px' }}>
                    <TextStyle variant="body4" weight={500} color={theme.palette.custom.text}>
                      {item.label} :
                    </TextStyle>
                  </Box>
                ) : (
                  <Box sx={{ minWidth: '120px' }} />
                )}
                <Box sx={{ flex: 1, pt: '2px' }}>
                  <TextStyle
                    variant="body4"
                    weight={item.isBold ? 600 : 400}
                    color={theme.palette.custom.text}
                  >
                    {item.value}
                  </TextStyle>
                </Box>
              </Box>
            ))}
          </Box>
        </ColumnWrapper>

        {/* Close Button */}
        <RowWrapper sx={{ justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
            sx={{
              minWidth: '100px',
            }}
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalRefinaDetail;

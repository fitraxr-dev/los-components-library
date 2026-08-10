import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal as modalMip } from '../../FinancingOverview.constants';

import useDetailFacility from './ModalDetailFacility.hook';


const ModalDetailFacility = NiceModal.create(() => {
  const theme = useTheme();
  const modal = useModal();
  const modalId = modalMip.DETAIL_FACILITY;

  const {
    facilityData,
    financingData,
    financingSegment,
    projectData,
  } = useDetailFacility();

  return (
    <SectionModal
      title="Detail Ringkasan Pembiayaan"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '65vw',
      }}
    >
      <ColumnWrapper display="flex" flexDirection="column" gap={3}>
        <ColumnWrapper>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Fasilitas:
          </TextStyle>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {facilityData?.map((item, index) =>
              <Cell key={index} title={item.label} value={item.value} />,
            )}
          </Box>
        </ColumnWrapper>

        { financingSegment === 'SYARIAH' &&
          <ColumnWrapper>
            <TextStyle
              variant="body3"
              weight={600}
              color={theme.palette.primary.main}
              sx={{ py: theme.spacing(1) }}
            >
              Nominal Pembiayaan:
            </TextStyle>

            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {financingData?.map((item, index) =>
                <Cell key={index} title={item.label} value={item.value} />,
              )}
            </Box>
          </ColumnWrapper>
        }

        <ColumnWrapper>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Proyek:
          </TextStyle>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {projectData?.map((item, index) =>
              <Cell key={index} title={item.label} value={item.value} />,
            )}
          </Box>
        </ColumnWrapper>
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal >
  );
});

export default ModalDetailFacility;

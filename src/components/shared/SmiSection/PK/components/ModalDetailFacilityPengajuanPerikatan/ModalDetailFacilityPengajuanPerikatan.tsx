import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Grid, Paper, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


import { MODALPK } from '../../PK.constants';

import { fullWidthCellKonven, fullWidthCellSyariah } from './ModalDetailFacilityPengajuanPerikatan.constants';
import useDetailFacilityPengajuanPerikatan from './ModalDetailFacilityPengajuanPerikatan.hook';


const ModalDetailFacility = NiceModal.create(({ id }: any) => {
  const theme = useTheme();
  const modal = useModal();
  const modalId = MODALPK.DETAIL_FACILITY_PENGAJUAN_PERIKATAN;

  const {
    facilityData,
    projectData,
    pk,
    isSyariah,
  } = useDetailFacilityPengajuanPerikatan(id);

  return (
    <SectionModal
      title="Detail Fasilitas Pembiayaan"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '65vw',
      }}
    >
      <ColumnWrapper display="flex" flexDirection="column" gap={3}>
        {/* Informasi Fasilitas */}
        <ColumnWrapper>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi Fasilitas:
          </TextStyle>

          <Grid container spacing={2}>
            {facilityData.map((item, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={(isSyariah && fullWidthCellSyariah.some((res) => res === item.label))
                  || (!isSyariah && fullWidthCellKonven.some((res) => res === item.label)) ? 0 : 6}
                  key={index}
                >
                  <Paper elevation={3} sx={{ boxShadow: 'none' }}>
                    <Cell key={index} title={item.label} value={item.value} />
                  </Paper>
                </Grid>
              );
            }
            )}
          </Grid>
        </ColumnWrapper>

        {/* Informasi Proyek */}
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
            {projectData.map((item, index) =>
              <Cell key={index} title={item.label} value={item.value} />,
            )}
          </Box>
        </ColumnWrapper>

        {/* Informasi PK */}
        <ColumnWrapper>
          <TextStyle
            variant="body3"
            weight={600}
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            Informasi PK:
          </TextStyle>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {pk.map((item, index) =>
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

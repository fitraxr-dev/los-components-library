import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


import { MODALPK } from '../../PK.constants';

import { fullWidthCellKonven, fullWidthCellSyariah } from './ModalDetailFacilityPk.constants';
import useDetailFacility from './ModalDetailFacilityPk.hook';


const ModalDetailFacilityPk = NiceModal.create(({ facilityId, id, processId, hidePK, isLps }: any) => {
  const theme = useTheme();
  const modal = useModal();
  const modalId = MODALPK.DETAIL_FACILITY_PK;

  const {
    facilityData,
    nominalData,
    projectData,
    pkData,
    isSyariah,
  } = useDetailFacility(id, facilityId, processId, isLps);


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

        {/* Nominal Pembiayaan Syariah */}
        {isSyariah && nominalData && nominalData.length > 0 && (
          <ColumnWrapper>
            <TextStyle
              variant="body3"
              weight={600}
              color={theme.palette.primary.main}
              sx={{ py: theme.spacing(1) }}
            >
              Nominal Pembiayaan:
            </TextStyle>

            <Grid container spacing={2}>
              {nominalData.map((item, index) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={fullWidthCellSyariah.some((res) => res === item.label) ? 12 : 6}
                    key={index}
                  >
                    <Paper elevation={3} sx={{ boxShadow: 'none' }}>
                      <Cell key={index} title={item.label} value={item.value} />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </ColumnWrapper>
        )}

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

        {!hidePK && (
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
              {pkData.map((item, index) =>
                <Cell key={index} title={item.label} value={item.value} />,
              )}
            </Box>
          </ColumnWrapper>
        )}
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

export default ModalDetailFacilityPk;

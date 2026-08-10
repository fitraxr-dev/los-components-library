'use client';


import { Box, Tooltip, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationInfo from '../../components/ConfirmationInfo';

import TableFinancingFacilitySubmit from './components/TableFinancingFacilitySubmit';
import TableShariaLimit from './components/TableShariaLimit';
import useFaciltyOverview from './FacilityOverview.hook';


const FacilityOverview = (props: SmiComponentProps) => {
  const {
    handleButton,
    handleEdit,
    handleFacilityManagement,
    isBeingProcessed,
    isEdit,
    isNominalMismatch,
    isShowFacilityManagement,
    sortedObject,
  } = useFaciltyOverview();
  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };

  const theme = useTheme();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>

      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <RowWrapper gap={2}>
          <Title title="Ringkasan Fasilitas Pembiayaan" />
          {isEdit && (
            <IconButton iconName="edit-2" onClick={handleEdit} />
          )}
          {isBeingProcessed && (
            <Tooltip
              title={
                <Box>
                  <TextStyle variant="body6">
                    Sedang berada dalam pengajuan
                  </TextStyle>
                </Box>
              }
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                  },
                },
              }}
            >
              <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                <Icon iconName="new-info" />
              </Box>
            </Tooltip>
          )}
        </RowWrapper>
        {isShowFacilityManagement && (
          <Button
            startIcon="mouse"
            onClick={handleFacilityManagement}
            disabled={isBeingProcessed}
          >
            Go To Facility Management
          </Button>
        )}
      </RowWrapper>
      {isNominalMismatch && <ConfirmationInfo notice="Nominal tidak sesuai" />}
      <TableDebtorInformation
        module={TypeModule.LPS}
        process={TypeProcess.LPS_CORE}
      />
      <TableFinancingFacilitySubmit
        module={TypeModule.LPS}
        process={TypeProcess.LPS_CORE}
      />
      <TableShariaLimit
        module={TypeModule.LPS}
        process={TypeProcess.LPS_CORE}
        isLps
      />
      <RowWrapper sx={{ gap: 1, justifyContent: 'end', py: 3 }}>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FacilityOverview;

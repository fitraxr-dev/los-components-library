'use client';

import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useHighRiskContext } from '@/components/layouts/HighRiskLayout/HighRisk.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import DebtorDetailSectionV2 from '@/components/shared/SmiSection/DebtorDetailSectionV2';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const theme = useTheme();
  const { goToNextStep } = useHighRiskContext();

  const {
    debtorInfoData,
    handleViewApuPpt,
    isBucketIsLoading,
    isValidateSuccess,
    validateResult,
  } = useDebtorInformation();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper justifyContent="space-between" alignItems="center" marginBottom={theme.spacing(3)}>
        <RowWrapper gap={2}>
          <Title title="Informasi Customer" />
          {isValidateSuccess && validateResult?.content.invalid && (
            <Tooltip
              title={
                <Box sx={{ margin: '-10px 0 -10px -10px' }}>
                  <TextStyle variant="body6">
                    {parse(validateResult?.content?.result)}
                  </TextStyle>
                </Box>
              }
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: 'primary.main',
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

        <Button
          startIcon="monitor"
          onClick={handleViewApuPpt}
          isLoading={isBucketIsLoading}
        >
          View the Latest APU PPT / Pengkinian Data
        </Button>
      </RowWrapper>

      {isValidateSuccess && validateResult?.content.invalid && (
        <RowWrapper alignItems="center" gap={1}>
          <Icon iconName="information-shape" />
          <TextStyle variant="body7" color={theme.palette.primary.main}>
            Untuk mengubah Data Customer silahkan ke Maintenance Data
          </TextStyle>
        </RowWrapper>
      )}

      <TableDebtorInformation
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />

      <DebtorDetailSectionV2 debtorInfoData={debtorInfoData} />

      {debtorInfoData?.isGroup && (
        <TableBusinessGroup
          module={TypeModule.HIGH_RISK}
          process={TypeProcess.HIGH_RISK_DK}
        />
      )}

      <RowWrapper
        justifyContent="end"
        gap={theme.spacing(3)}
        marginY={theme.spacing(3)}
      >
        <Button onClick={goToNextStep}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};


export default DebtorInformationPage;

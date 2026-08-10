'use client';
import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import DetailDebtorSection from './components/DetailDebtorSection';
import useDetailDebtorSection from './components/DetailDebtorSection/DetailDebtorSection.hook';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const theme = useTheme();

  const {
    bucketDetail,
    handleClickViewRequest,
    handleNext,
    isDpop,
    bucketDetailIsLoading,
    isRequestModule,
    validateResult,
    isValidateSuccess,
    checkBtn,
    similiarProcessData,
    isGroup,
  } = useDebtorInformation();

  const { isPemda } = useDetailDebtorSection();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <RowWrapper justifyContent="space-between">

        <RowWrapper gap={2}>
          <Title title="Informasi Customer" />
          {isValidateSuccess && validateResult?.content.invalid &&
            <Tooltip
              title={
                <Box
                  sx={{
                    margin: '-10px 0 -10px -10px',
                  }}
                >
                  <TextStyle
                    variant="body6"
                  >
                    {parse(validateResult?.content?.result)}
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
            </Tooltip>}
        </RowWrapper>

        <RowWrapper>
          {(isDpop && !isRequestModule) && (
            <Button
              startIcon="monitor"
              onClick={handleClickViewRequest}
              isLoading={bucketDetailIsLoading}
              disabled={isRequestModule}
            >
              View Request
            </Button>
          )}

          {checkBtn(similiarProcessData)?.length > 0 && checkBtn(similiarProcessData).map((el) => (

            <Button
              key={el.label}
              sx={{ ml: 2, px: 4, py: 1.5 }}
              startIcon={el?.iconName}
              onClick={el.onClick ?? null}
              isLoading={el.isLoading}
              {...(el.disabled && { disabled: true })}
              color={el.color}
            >
              {el.label}
            </Button>

          ))}
        </RowWrapper>
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
        module={TypeModule.CREDIT_CHECKING}
        process={
          isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP
        }
      />
      <DetailDebtorSection />
      {(!isPemda && isGroup) && <TableBusinessGroup
        module={TypeModule.CREDIT_CHECKING}
        process={
          isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP
        }
      />}
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default DebtorInformationPage;

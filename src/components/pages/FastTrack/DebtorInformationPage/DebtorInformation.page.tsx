'use client';
import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ExposureDebtorSection from '@/components/shared/SmiSection/DebtorInformation/ExposureDebtorSection';
import ExposureGroupSection from '@/components/shared/SmiSection/DebtorInformation/ExposureGroupSection';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import DetailDebtorSection from './components/DetailDebtorSection';
import useDetailDebtorSection from './components/DetailDebtorSection/DetailDebtorSection.hook';
import useDebtorInformation from './DebtorInformation.hook';
import { MOCK_EXPOSURE_DEBTOR, MOCK_EXPOSURE_GROUP, MOCK_REQUEST_TYPE_OPTIONS } from './DebtorInformation.mock';


const DebtorInformationPage = () => {
  const theme = useTheme();

  const {
    bucketDetail,
    handleClickViewRequest,
    handleViewMaintenanceCustomer,
    handleNext,
    isDpop,
    bucketDetailIsLoading,
    isRequestModule,
    validateResult,
    isValidateSuccess,
    checkBtn,
    similiarProcessData,
    isGroup,
    typeSubmission,
    totalExposure,
    groupExposure,
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

          <Button sx={{ ml: 2 }} onClick={handleViewMaintenanceCustomer}>
            Go to Maintenance Customer
          </Button>

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
        module={TypeModule.FAST_TRACK}
        process={TypeProcess.FAST_TRACK}
      />
      <SectionTitle title="Tipe Permohonan" isOpen>
        <ColumnWrapper gap={1}>
          <Box>
            <Input
              type="radio"
              radioList={typeSubmission}
              value={bucketDetail?.typeSubmission}
              disabled
              sxOptions={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: theme.spacing(2),
                justifyContent: 'space-around',
                mt: 3,
              }}
            />
          </Box>
        </ColumnWrapper>
      </SectionTitle>
      <DetailDebtorSection />
      {bucketDetail.isGroup && (
        <TableBusinessGroup
          module={TypeModule.FAST_TRACK}
          process={TypeProcess.FAST_TRACK}
        />
      )}

      <ExposureDebtorSection
        isAsOf={bucketDetail?.modifiedAt}
        valueAsOf={bucketDetail?.modifiedAt}
        exposuresData={totalExposure}
      />
      {groupExposure?.length > 0 && (
        <ExposureGroupSection
          isAsOf={bucketDetail?.modifiedAt}
          valueAsOf={bucketDetail?.modifiedAt}
          data={groupExposure}
          showTooltip
        />
      )}
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default DebtorInformationPage;

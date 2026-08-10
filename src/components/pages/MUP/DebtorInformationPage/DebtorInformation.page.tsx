'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';
import { FormProvider } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import AlertMIPExpired from '@/components/pages/MIP/DebtorInformationPage/components/AlertMIPExpired/AlertMIPExpired';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import DebtorDetail from './components/DebtorDetail';
import ExposureGroup from './components/ExposureGroup';
import ModalRequestOtherProcess from './components/ModalRequestOtherProcess';
import { modal } from './components/ModalRequestOtherProcess/ModalRequestOtherProcess.constants';
import TableBusinessGroup from './components/TableBusinessGroup';
import TotalDebtorExposure from './components/TotalDebtorExposure';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const theme = useTheme();
  const { goToNextStep } = useMUPContext();

  const {
    handleViewMip,
    handleViewMipReview,
    form,
    isFetching,
    isPemda,
    handleRouteMaintenanceDebitor,
    isGroup,
    renderActionButtons,
    handleSave,
    handleSaveAndNext,
    isAutoSaveFetching,
    isValidateSuccess,
    isViewOnlyMode,
    validateResult,
    isAnalyst,
    isChangeMIPR,
    checkRequestData,
  } = useDebtorInformation();

  return (
    <FormProvider {...form}>
      <RowWrapper justifyContent="space-between" alignItems="center" marginBottom={theme.spacing(3)}>
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
            </Tooltip>
          }
        </RowWrapper>
        <Box display="flex" gap={2}>
          <Button
            startIcon="monitor"
            onClick={handleViewMip}
            disabled={isFetching}
            isLoading={isFetching}
          >
            View MIP
          </Button>
          {isChangeMIPR && (
            <Button
              startIcon="monitor"
              onClick={handleViewMipReview}
              disabled={isFetching}
              isLoading={isFetching}
            >
              View MIP Review
            </Button>
          )}
          {!isAnalyst && (
            <Button startIcon="mouse" onClick={handleRouteMaintenanceDebitor}>
              Go to Maintenance Customer
            </Button>
          )}
        </Box>
      </RowWrapper>

      <ColumnWrapper gap={theme.spacing(3)}>
        {(checkRequestData?.content?.isShowAlert === true && !isAnalyst) && (
          <AlertMIPExpired message={checkRequestData?.content?.message} />
        )}
        {isValidateSuccess && validateResult?.content.invalid &&
          <RowWrapper alignItems="center" gap={1}>
            <Icon iconName="information-shape" />
            <TextStyle variant="body7" color={theme.palette.primary.main} >Untuk mengubah Data Customer silahkan ke Maintenance Data</TextStyle>
          </RowWrapper>
        }
        <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
        <DebtorDetail />
        {!isPemda && isGroup && <TableBusinessGroup />}
        <TotalDebtorExposure />
        {!isPemda && isGroup && <ExposureGroup />}

        <RowWrapper
          justifyContent="end"
          gap={theme.spacing(3)}
          marginY={theme.spacing(3)}
        >
          {renderActionButtons()}
          {!isViewOnlyMode ? (
            <>
              <Button disabled={isAutoSaveFetching} onClick={form.handleSubmit(handleSave)}>
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                onClick={form.handleSubmit(handleSaveAndNext)}
              >
                Next
              </Button>
            </>
          ) : (
            <Button onClick={goToNextStep}>
              Next
            </Button>
          )}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={modal.REQUEST_OTHER_PROCESS}
        component={ModalRequestOtherProcess}
      />
    </FormProvider>
  );
};

export default DebtorInformationPage;

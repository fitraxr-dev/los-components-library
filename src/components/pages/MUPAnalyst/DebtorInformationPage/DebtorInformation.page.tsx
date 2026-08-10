'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';
import { FormProvider } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import DebtorDetail from './components/DebtorDetail';
import ModalRequestOtherProcess from './components/ModalRequestOtherProcess';
import { modal } from './components/ModalRequestOtherProcess/ModalRequestOtherProcess.constants';
import TableBusinessGroup from './components/TableBusinessGroup';
import TableExposureGroup from './components/TableExposureGroup';
import TotalDebtorExposure from './components/TotalDebtorExposure';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const theme = useTheme();

  const {
    canUpdate,
    canView,
    handleOpenModalRequestOther,
    handleSave,
    handleViewMip,
    isAutoSaveFetching,
    isLoading,
    isPemda,
    isValidateSuccess,
    form,
    validateResult,
    viewOnly,
  } = useDebtorInformation();

  if (!canView) {
    return null;
  }

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
        <Button
          startIcon="monitor"
          onClick={handleViewMip}
          disabled={isLoading || !canView}
          isLoading={isLoading}
        >
          View MIP
        </Button>
      </RowWrapper>

      <ColumnWrapper gap={theme.spacing(3)}>
        {isValidateSuccess && validateResult?.content.invalid &&
          <RowWrapper alignItems="center" gap={1}>
            <Icon iconName="information-shape" />
            <TextStyle variant="body7" color={theme.palette.primary.main} >Untuk mengubah Data Customer silahkan ke Maintenance Data</TextStyle>
          </RowWrapper>
        }
        <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />
        <DebtorDetail />
        {!isPemda && <TableBusinessGroup />}
        <TotalDebtorExposure />
        {!isPemda && <TableExposureGroup module={TypeModule.MUP} process={TypeProcess.MUP} />}

        <RowWrapper
          justifyContent="end"
          gap={theme.spacing(3)}
          marginY={theme.spacing(3)}
        >
          {!(viewOnly || !canUpdate) && (
            <Button
              color="success"
              onClick={handleOpenModalRequestOther}
            >
              Request Other Process
            </Button>
          )}
          {viewOnly ? (
            <Button onClick={() => handleSave(false)}>
              Next
            </Button>
          ) : (
            <>
              <Button
                disabled={!canUpdate || isAutoSaveFetching}
                onClick={() => form.handleSubmit(() => handleSave(false))()}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                disabled={!canUpdate}
                onClick={() => form.handleSubmit(() => handleSave(true))()}
              >
                Next
              </Button>
            </>
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

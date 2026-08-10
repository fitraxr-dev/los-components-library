'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';
import { Controller, FormProvider } from 'react-hook-form';

import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import FinancingTypeSection from '@/components/shared/SmiSection/DebtorInformation/FinancingTypeSection';
import ProcessTypeSection from '@/components/shared/SmiSection/DebtorInformation/ProcessTypeSection';
import RequestTypeSection from '@/components/shared/SmiSection/DebtorInformation/RequestTypeSection';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import AlertMIPExpired from './components/AlertMIPExpired/AlertMIPExpired';
import BusinessGroup from './components/BusinessGroup';
import DebtorDetail from './components/DebtorDetail';
import ExposureDebtor from './components/ExposureDebtor';
import ExposureGroup from './components/ExposureGroup';
import FinancialPerformance from './components/FinancialPerformance';
import ModalBusinessGroup from './components/ModalBusinessGroup';
import ModalRequestOtherProcess from './components/ModalRequestOtherProcess';
import { modal } from './DebtorInformation.constants';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();

  const {
    financingTypeData,
    formMethods,
    goToNextStep,
    handleOnSave,
    handleOpenRequestOtherProcessModal,
    isAnalyst,
    isLoadingDetail,
    isPemda,
    isMipr,
    isMip,
    isRequestOtherProcessDisabled,
    isReview,
    isSaveDebtorLoading,
    isAutoSaveFetching,
    isValidateSuccess,
    listButton,
    module,
    isRM,
    isSuperAdminMaker,
    isStaffSuperAdmin,
    process,
    processTypeData,
    requestTypeData,
    stepperStatus,
    setShouldGoNext,
    stepperSteps,
    validateResult,
    bucketMasterId,
    checkRequestData,
  } = useDebtorInformation();

  const { handleSubmit } = formMethods;

  useMipCcExpired({
    bucketMasterId,
    module,
    process,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });

  const renderButtons = () => (
    <RowWrapper>
      {listButton.map((el) => (
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
  );

  return (
    <FormProvider {...formMethods}>
      <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <RowWrapper
            gap={2}
          >
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
          {(listButton.length ? renderButtons() : null)}
        </RowWrapper>

        {(checkRequestData?.content?.isShowAlert === true && !isAnalyst) && (
          <AlertMIPExpired message={checkRequestData?.content?.message} />
        )}

        {isValidateSuccess && validateResult?.content.invalid &&
          <RowWrapper alignItems="center" gap={1}>
            <Icon iconName="information-shape" />
            <TextStyle variant="body7" color={theme.palette.primary.main} >Untuk mengubah Data Customer silahkan ke Maintenance Data</TextStyle>
          </RowWrapper>
        }
        <TableDebtorInformation module={module} process={process} />
        <SectionTitle title="Detail Pengajuan" isOpen>
          <ColumnWrapper gap={1} mt={2}>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <ColumnWrapper gap={2}>
                <RequestTypeSection
                  {...formMethods}
                  radioList={requestTypeData}
                  viewOnly={viewOnly || isAnalyst}
                />
                <FinancingTypeSection {...formMethods} radioList={financingTypeData} viewOnly={viewOnly || isAnalyst} />
              </ColumnWrapper >

              <Box>
                <ProcessTypeSection {...formMethods} radioList={processTypeData} viewOnly={true} />
              </Box>
            </Box>
            <Controller
              control={formMethods.control}
              name="description"
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Keterangan"
                  placeholder="Input Keterangan"
                  disabled={viewOnly || isAnalyst}
                  rows={4}
                  error={!!error}
                  helperText={invalid && error?.message}
                />
              )}
            />
          </ColumnWrapper>
        </SectionTitle>
        <DebtorDetail />
        {(!isPemda && !!formMethods.watch('debtor.isGroup')) && <BusinessGroup />}
        <>
          <FinancialPerformance />
          <ExposureDebtor />
          {(!isPemda && !!formMethods.watch('debtor.isGroup')) && <ExposureGroup />}
        </>

        {/*TODO: This section is hide for now - Albert - 14 Nov 2024 */}
        {/* <SyndicationAndCoBorrowerSection module={_module} process={process} /> */}

        <RowWrapper gap={theme.spacing(3)} justifyContent="end">
          {(!isAnalyst && (isRM || isSuperAdminMaker || isStaffSuperAdmin) && (((stepperStatus === 'REVISION' || stepperStatus === 'REVISION_RETURN_STAFF' || stepperStatus === 'REVISION_RETURN_MAKER') && isMipr) || isMip)) && (
            <Button
              onClick={handleOpenRequestOtherProcessModal}
              color="success"
              disabled={isSaveDebtorLoading || isRequestOtherProcessDisabled}
            >
              Request Other Process
            </Button>
          )}
          {!viewOnly && !isAnalyst &&
            <>
              <Button
                isLoading={isSaveDebtorLoading || isLoadingDetail}
                disabled={isAutoSaveFetching}
                onClick={() => { setShouldGoNext(false); handleSubmit(handleOnSave)(); }}
              >
                {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
              </Button>
              <Button
                isLoading={isSaveDebtorLoading || isLoadingDetail ? true : false}
                onClick={() => { setShouldGoNext(true); handleSubmit(handleOnSave)(); }}
              >
                Next
              </Button>
            </>
          }
          {!viewOnly && isAnalyst &&
            <Button
              isLoading={isSaveDebtorLoading || isLoadingDetail ? true : false}
              onClick={goToNextStep}
            >
              Next
            </Button>
          }
        </RowWrapper>

        <ModalDef
          id={modal.GROUP_BUSINESS}
          component={ModalBusinessGroup}
        />
        <ModalDef
          id={modal.REQUEST_OTHER_PROCESS}
          component={ModalRequestOtherProcess}
        />
      </ColumnWrapper>
    </FormProvider>
  );
};

export default DebtorInformationPage;

'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip } from '@mui/material';
import parse from 'html-react-parser';
import { FormProvider } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import AlertCheckRequest from './components/AlertCheckRequest/AlertCheckRequest';
import BusinessGroup from './components/BusinessGroup';
import DebtorDetail from './components/DebtorDetail';
import ExposureDebtor from './components/ExposureDebtor';
import ExposureGroup from './components/ExposureGroup';
import ModalBusinessGroup from './components/ModalBusinessGroup';
import ModalRequestOtherProcess from './components/ModalRequestOtherProcess';
import RequestTypeSection from './components/RequestTypeSection';
import { modal } from './DebtorInformation.constants';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const {
    formMethods,
    handleOnSave,
    isAutoSaveFetching,
    handleOpenRequestOtherProcessModal,
    handleSaveAndNext,
    isLoadingDetail,
    isPemda,
    isRequestOtherProcessDisabled,
    isSaveDebtorLoading,
    isValidateSuccess,
    listButton,
    module,
    typeProcess,
    requestTypeData,
    validateResult,
    isDepiDivision,
    theme,
    viewOnly,
    isAnalyst,
    isPreview,
    checkRequestData,
    isEdit,
    isRM,
    isBusinessDivision,
    isSuperAdmin,
    handleEdit,
    isRequestOtherProcessAction,
  } = useDebtorInformation();

  const { handleSubmit } = formMethods;

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

  console.log('isRM', isRM);
  console.log('isBusinessDivision', isBusinessDivision);
  console.log('isSuperAdmin', isSuperAdmin);
  console.log('isEdit', isEdit);

  return (
    <FormProvider {...formMethods}>
      <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
        {isDepiDivision && (
          <ConfirmationLatest />
        )}
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
            {((isRM && isBusinessDivision) || isSuperAdmin) && isEdit && <IconButton iconName="edit-2" onClick={handleEdit} />}
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

        {(checkRequestData?.content?.isShowAlert === true && !isAnalyst && !isDepiDivision) && (
          <AlertCheckRequest message={checkRequestData?.content?.message} />
        )}

        {isValidateSuccess && validateResult?.content.invalid &&
          <RowWrapper alignItems="center" gap={1}>
            <Icon iconName="information-shape" />
            <TextStyle variant="body7" color={theme.palette.primary.main} >Untuk mengubah Data Customer silahkan ke Maintenance Data</TextStyle>
          </RowWrapper>
        }
        <TableDebtorInformation module={module} process={typeProcess} />
        {(isPreview || !isDepiDivision) && (
          <SectionTitle title="Tipe Permohonan" isOpen>
            <ColumnWrapper gap={1}>
              <Box >
                <ColumnWrapper gap={2}>
                  <RequestTypeSection
                    {...formMethods}
                    viewOnly={isPreview || viewOnly || isAnalyst}
                    radioList={requestTypeData}
                  />
                </ColumnWrapper >
              </Box>
            </ColumnWrapper>
          </SectionTitle>
        )}
        <DebtorDetail />
        {(!isPemda && !!formMethods.watch('debtor.isGroup')) &&
          <TableBusinessGroup module={TypeModule.ANNUAL_REVIEW} process={TypeProcess.ANNUAL_REVIEW} />
        }
        {(isPreview || !isDepiDivision) && (
          <>
            <ExposureDebtor />
            {(!isPemda && !!formMethods.watch('debtor.isGroup')) && <ExposureGroup />}
          </>
        )}

        {/*TODO: This section is hide for now - Albert - 14 Nov 2024 */}
        {/* <SyndicationAndCoBorrowerSection module={_module} process={process} /> */}

        <RowWrapper gap={theme.spacing(3)} justifyContent="end">
          {(!isPreview && isRequestOtherProcessAction) && (
            <Button
              onClick={handleOpenRequestOtherProcessModal}
              color="success"
              disabled={isSaveDebtorLoading || isRequestOtherProcessDisabled}
            >
              Request Other Process
            </Button>
          )}
          {!viewOnly && !isAnalyst && !isDepiDivision &&
            <Button
              disabled={isAutoSaveFetching}
              isLoading={isSaveDebtorLoading || isLoadingDetail ? true : false}
              onClick={(handleSubmit(handleOnSave))}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          }
          <Button
            onClick={(handleSubmit(handleSaveAndNext))}
          >
            Next
          </Button>
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

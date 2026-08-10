'use client';
import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import ApplicationSection from './components/Application/ApplicationSection';
import BusinessandAddressSection from './components/BusinessandAddress/BusinessandAddress';
import { DebtorInformationProfileProvider } from './DebtorinfoProfile.context';
import { useDebtorInfoProfile } from './DebtorInfoProfile.hook';


const DebtorInfoProfile = () => {
  const theme = useTheme();

  const {
    payload,
    process,
    setPayload,
    control,
    watch,
    handleSubmit,
    handleSubmitForm,
    handleRequestEdit,
    isAutoSaveFetching,
    isRequestPending,
    setValue,
    goToNextStep,
    isAskForInfoMode,
    formState,
    findDataMaster,
    changeBgInput,
    needCheckMaster,
    checkDiffAppCategory,
    appliPurpose,
    viewOnly,
    stepper,
    isRM,
    isBusinessDivision,
    listStatusAskForInfo,
    isSuperAdmin,
  } = useDebtorInfoProfile();


  const renderEditButton = () => {
    if (listStatusAskForInfo?.includes(stepper?.from) && ((isRM && isBusinessDivision) || isSuperAdmin)) {
      return (
        <Button
          variant="text"
          color="error"
          startIcon="edit"
          textVariant="display2"
          startIconSx={{
            mr: 0,
          }}
          sx={{
            minWidth: 0,
            padding: '0 !important',
          }}
          onClick={handleRequestEdit}
          isLoading={isRequestPending}
        />
      );
    }
  };

  return (
    <DebtorInformationProfileProvider value={{ payload, setPayload }}>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: 3 }}>
        <RowWrapper sx={{ alignItems: 'center', gap: 2 }}>
          <Title title="Informasi Profil Customer" />
          {renderEditButton()}
        </RowWrapper>
        <TableDebtorInformation module={TypeModule.APU_PPT} process={process} />
        <ApplicationSection
          appliPurpose={appliPurpose}
          checkDiffAppCategory={checkDiffAppCategory}
          needCheckMaster={needCheckMaster}
          findDataMaster={findDataMaster}
          changeBgInput={changeBgInput}
          control={control}
          watch={watch}
        />
        <BusinessandAddressSection
          needCheckMaster={needCheckMaster}
          changeBgInput={changeBgInput}
          setValue={setValue}
          control={control}
          watch={watch}
          formState={formState}
          findDataMaster={findDataMaster}

        />
        <Box>
          <Controller
            control={control}
            name="remarks"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                disabled={viewOnly}
                inputRef={ref}
                type="area"
                label="Keterangan"
                placeholder="Input Keterangan"
                containerSx={{ flex: 1 }}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('remarks') || '-'}</TextStyle>}

        </Box>
        <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: theme.spacing(4) }}>
          {isAskForInfoMode || viewOnly ? (
            <Button
              onClick={goToNextStep}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleSubmitForm((data) => handleSubmit({ data, goToNext: false }))()}
                disabled={isAutoSaveFetching}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                onClick={() => handleSubmitForm((data) => handleSubmit({ data, goToNext: true }))()}
              >
                Next
              </Button>
            </>
          )}
        </RowWrapper>
      </ColumnWrapper>
    </DebtorInformationProfileProvider>
  );
};


export default DebtorInfoProfile;

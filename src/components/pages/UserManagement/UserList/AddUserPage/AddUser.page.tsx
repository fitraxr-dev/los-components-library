'use client';

import { Box, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useAddUser from './AddUser.hook';


const AddUserPage = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    renderUserDetail,
    watch,
    setValue,
    isRequiredEmpty,
    formMethods,
    handleOnContinue,
    isValidateUserLoading,
    userTypeList,
    setCountResetData,
  } = useAddUser();

  return (
    <FormProvider {...formMethods}>
      <ColumnWrapper gap={theme.spacing(3)} width="100%">
        <BaseContainer sx={{ paddingBottom: theme.spacing(4) }}>
          <Title title="Add User" />
          <RowWrapper gap={theme.spacing(3)}>
            <Box width="45%">
              <Controller
                control={control}
                name="userType"
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="dropdown"
                    label="User Type"
                    placeholder="User Type"
                    dropdownList={userTypeList}
                    onChange={(val) => {
                      setCountResetData((prev) => prev + 1);
                      onChange(val);
                      if (!val) {
                        setValue('email', '');
                      }
                    }}
                    isMandatory
                    required
                    disabled={isValidateUserLoading}
                  />
                )}
              />
            </Box>
            <Box width="45%">
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    {...field}
                    type="text"
                    label="Email"
                    placeholder="Masukkan Email"
                    disabled={!watch('userType') || isValidateUserLoading}
                    isMandatory
                    required
                    error={!!error}
                    helperText={invalid ? error.message : ''}
                  />
                )}
              />
            </Box>
            <Button
              disabled={isRequiredEmpty || isValidateUserLoading}
              isLoading={isValidateUserLoading}
              sx={{ marginTop: '2.2%' }}
              onClick={handleSubmit(handleOnContinue)}
            >
              Continue
            </Button>
          </RowWrapper>
        </BaseContainer>
        {renderUserDetail()}
      </ColumnWrapper>
    </FormProvider>
  );
};

export default AddUserPage;

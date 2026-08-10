'use client';
import { Fragment } from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import TableAccessMenu from '../../../components/TableAccessMenu';

import useAddAccess from './CreationAddAccess.hook';

import type { CreationAccessMenuProps } from './CreationAddAccess.types';


const CreationAccessMenu = (props: CreationAccessMenuProps) => {
  const theme = useTheme();

  const {
    control,
    fields,
    forms,
    handleAddMenu,
    handleDeleteOnAutocomplete,
    handleDeleteAllOnAutocomplete,
    handleOnSave,
    handleOnSubmit,
    handleOnCancelProcess,
    isMandatoryEmpty,
    tableHeader,
    update,
    losMenuDropdownList,
    isAdd,
    isEdit,
    isHasProcessId,
    isHasProcessIdParams,
  } = useAddAccess(props);

  console.log('field: ', fields);

  return (
    <FormProvider {...forms}>
      <ColumnWrapper gap={theme.spacing(3)} width="100%">
        <BaseContainer>
          <ColumnWrapper gap={theme.spacing(3)}>
            <Title title={`${isEdit ? 'Edit ' : 'Add'} Access Menu`} />
            <Controller
              control={control}
              name="accessMenuName"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Access Menu Name"
                  type="text"
                  placeholder="Masukkan Access Menu Name"
                  isMandatory
                />
              )}
            />
            <RowWrapper alignItems="end" gap={theme.spacing(3)} justifyContent="space-between">
              <Box width="100%">
                <Controller
                  control={control}
                  name="accessMenu"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <MultipleAutoComplete
                      {...field}
                      dropdownList={losMenuDropdownList}
                      label="LOS Menu"
                      placeholder="Search Menu Access..."
                      onInputChange={() => { }}
                      isMandatory
                      error={!!error}
                      helperText={invalid && error.message}
                      withSelectAll
                      onChange={(e) => {
                        if (e?.length > 0 || fields?.length === 0) {
                          field.onChange(e);
                        } else {
                          handleDeleteAllOnAutocomplete();
                        }
                      }}
                      onDeleteItem={(option) => handleDeleteOnAutocomplete(option)}
                      onDeleteAll={handleDeleteAllOnAutocomplete}
                      limitTags={5}
                      sortingType="last-in"
                    />
                  )}
                />
              </Box>
              <Button
                startIcon="add"
                sx={{ width: '12vw' }}
                onClick={handleAddMenu}
                disabled={isMandatoryEmpty}
              >
                Add Menu
              </Button>
            </RowWrapper>
          </ColumnWrapper>
        </BaseContainer>
        {fields.length > 0 && (
          <BaseContainer>
            <ColumnWrapper gap={theme.spacing(3)}>
              <Title title="Config Access Menu" />
              {fields.map((field, index) => (
                <Fragment key={index}>
                  <Controller
                    name={`accessMenuList.${index}`}
                    control={control}
                    render={() => (
                      <TableAccessMenu
                        viewOnly={false}
                        tableIndex={index}
                        isLoading={false}
                        tableLabel={field.label}
                        tableData={field.subMenu || []}
                        tableStatus={field.status}
                        tableHeader={tableHeader}
                        onSelectRow={(data, status) => {
                          update(index, { ...field, status, subMenu: data });
                        }}
                        tableId={field.id}
                      />
                    )}
                  />
                </Fragment>
              ))}
              <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
                {(isHasProcessIdParams && isHasProcessId) && (
                  <Button disabled={isAdd} variant="outlined" color="error" onClick={handleOnCancelProcess}>
                    Cancel Process
                  </Button>)}
                <Button onClick={forms.handleSubmit(handleOnSave)}>
                  Save
                </Button>
                {(isHasProcessIdParams && isHasProcessId) && (
                  <Button disabled={isAdd} color="success" onClick={handleOnSubmit}>
                    Submit
                  </Button>)}
              </RowWrapper>
            </ColumnWrapper>
          </BaseContainer>
        )}
      </ColumnWrapper>
    </FormProvider>
  );
};

export default CreationAccessMenu;

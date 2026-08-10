'use client';
import React from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useDetailPage from './DetailPage.hook';


const DetailPage = () => {
  const {
    theme,
    control,
    institutionTypeDropdownList,
    isPemda,
    handleSubmit,
    saveData,
    faceValue,
    getValuesNominal,
    nameset,
  } = useDetailPage();

  return (
    <ColumnWrapper justifyContent="space-between" height="100%">
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title
          title="Maintenance Surat Hutang"
        />

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(1),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Box
            sx={{
              alignItems: 'end',
              display: 'grid',
              gridGap: theme.spacing(1),
              gridTemplateColumns: '30% 1fr',
            }}
          >
            <Controller
              control={control}
              name="institutionTypeId"
              render={({
                field: { ref, ...field }, fieldState: { invalid, error },
              }) => (
                <Input
                  {...field}
                  id="input-institution-type"
                  data-testid="input-institution-type"
                  type="dropdown"
                  label="Institution Type"
                  placeholder="Choose Institution Type"
                  dropdownList={institutionTypeDropdownList}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />

            <Controller
              control={control}
              name="debtorName"
              render={({
                field: { value, ref, onChange, ...field }, fieldState: { invalid, error },
              }) => (
                <>
                  {isPemda ?
                    <Autocomplete
                      value={value}
                      id="input-debtor-name"
                      data-testid="input-debtor-name"
                      placeholder="Nama Customer"
                      dropdownList={nameset}
                      error={invalid}
                      helperText={error ? error.message : ''}
                      onChange={(val) => {
                        onChange(val.id);
                      }}
                    />
                    :
                    <Input
                      value={value}
                      id="input-debtor-name"
                      data-testid="input-debtor-name"
                      placeholder="Nama Customer"
                      error={invalid}
                      helperText={error ? error.message : ''}
                      onChange={(val) => {
                        onChange(val);
                      }}
                    />}
                </>
              )}
            />
          </Box>


          <Controller
            control={control}
            name="seq"
            render={({
              field: { ref, onChange, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                id="input-seq"
                data-testid="input-seq"
                type="text"
                label="Seq"
                placeholder="Enter Sequence"
                error={invalid}
                helperText={error ? error.message : ''}
                onChange={(val) => {
                  onChange(val);
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="bonds"
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                id="input-bonds"
                isMandatory
                data-testid="input-bonds"
                type="text"
                label="Bonds"
                placeholder="Enter Bonds"
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />

          <Controller
            control={control}
            name="faceValue"
            render={({
              field: { ref, onChange, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                ref={ref}
                value={field.value}
                id="input-amount"
                data-testid="input-amount"
                type="currency"
                isMandatory
                label="Face Value"
                placeholder="Enter Face Value"
                error={invalid}
                helperText={error ? error.message : ''}
                onChange={(val) => {
                  onChange(val);
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="issuer"
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                id="input-issuer"
                data-testid="input-issuer"
                type="text"
                label="Issuer"
                isMandatory
                placeholder="Enter Issuer"
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />

          {
            faceValue.currency === 'USD' ?
              <Controller
                control={control}
                name="exchangeRate"
                render={({
                  field: { ref, ...field }, fieldState: { invalid, error },
                }) => (
                  <Input
                    {...field}
                    type="currency"
                    label="Exchange Rate"
                    isMandatory
                    placeholder="Enter Exchange Rate"
                  />
                )}
              />
              : <Box />
          }

          <Controller
            control={control}
            name="maturityDate"
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                id="input-maturity-date"
                data-testid="input-maturity-date"
                type="date"
                label="Maturity Date"
                isMandatory
                placeholder="Enter Maturity Date"
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />

          <Controller
            control={control}
            name="faceValueInIdr"
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                value={getValuesNominal}
                id="input-face-value-idr"
                data-testid="input-face-value-idr"
                type="currency"
                label="Face Value (IDR)"
                placeholder="Enter Face Value in IDR"
                error={invalid}
                helperText={error ? error.message : ''}
                disabled
              />
            )}
          />
        </Box>


      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          sx={{ mr: 1 }}
          onClick={handleSubmit(saveData)}
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default DetailPage;

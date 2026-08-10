/* eslint-disable max-len */
import { Box, useTheme } from '@mui/material';
import { Controller, Form } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import TextStyle from '@/components/shared/TextStyle';

import useFormDebtor from './FormDebtor.hooks';

import type { FormDebtorProps } from './FormDebtor.type';


const FormDebtor = ({
  control,
  resetField,
  disabledFields,
  mandatoryFields,
  userId,
  debtorId,
  watch,
  listText,
  bucketProcessId,
  setValue,
}: FormDebtorProps) => {
  const theme = useTheme();

  // Helper function to check if refinaId is valid (not null, undefined, or "null" string)
  const hasValidRefinaId = watch('refinaId') && watch('refinaId') !== 'null';

  // Note: userId is only available in Pipeline Detail
  const {
    isLoadingAnalystData,
    isLoadingGamData,
    isLoadingGroupData,
    institutionTypeDropdownList,
    dataSourceDropdownList,
    typeProcessDropdownList,
    financingTypeDropdownList,
    analystDropdownList,
    gamDropdownList,
    groupDropdownList,
    setAnalystKeyword,
    setGamKeyword,
    setGroupKeyword,
    isPemda,
    isNamesetLoading,
    nameset,
    debtorType,
    institutionTypeId,
    filteredOwnership,
    ownedByList,
  } = useFormDebtor({
    bucketProcessId,
    control,
    debtorId,
    disabledFields,
    resetField,
    setValue,
    userId,
  });

  return (
    <Form control={control}>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >

        {/* Nama Customer & Proposal ID */}
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(1),
            gridTemplateColumns: '30% 1fr',
          }}
        >
          <Controller
            control={control}
            name="institutionTypeId"
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                id="input-institution-type"
                data-testid="input-institution-type"
                isMandatory={mandatoryFields?.insitutionTypeId}
                disabled={disabledFields?.insitutionTypeId}
                type="dropdown"
                label="Institution Type"
                placeholder="Institution Type"
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
              field: { ref, onChange, ...field },
              fieldState: { invalid, error },
            }) => (
              <>
                {isPemda ?
                  <Autocomplete
                    id="input-debtor-name"
                    data-testid="input-debtor-name"
                    isMandatory={mandatoryFields?.debtorName}
                    disabled={disabledFields?.debtorName}
                    label="Nama Customer"
                    placeholder="Nama Customer"
                    dropdownList={nameset}
                    isLoading={isNamesetLoading}
                    error={invalid}
                    helperText={error ? error.message : ''}
                    value={nameset.find((item) => item.id === field.value) || { id: '', label: '' }}
                    onChange={(val) => {
                      onChange(val?.id || '');
                    }}
                  />
                  :
                  <InputDebtorName
                    control={control}
                    name="debtorName"
                    inputProps={{}}
                    id="input-debtor-name"
                    data-testid="input-debtor-name"
                    isMandatory={mandatoryFields?.debtorName}
                    disabled={disabledFields?.debtorName}
                    label="Nama Customer"
                    placeholder="Nama Customer"
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                }
              </>
            )}
          />
        </Box>


        {isPemda && !!debtorId ?
          <Controller
            control={control}
            name="refinaId"
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                id="input-pipeline-refinaId"
                data-testid="input-pipeline-refinaId"
                disabled
                label="Refina ID"
                placeholder="Refina ID"
                containerSx={{ flex: 1 }}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          /> : <Box></Box>
        }

        {isPemda && watch('debtorName') === 'OTHERS' &&
          <Controller
            control={control}
            name="debtorNameOthers"
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                isMandatory={mandatoryFields?.debtorNameOther}
                label="Nama Customer lainnya"
                labelProps={{
                  minHeight: '1.525vw',
                }}
                placeholder="Input Nama Customer"
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />}

        <Controller
          control={control}
          name="processId"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-pipeline-id"
              data-testid="input-pipeline-id"
              disabled
              label="Pipeline ID"
              placeholder="Pipeline ID"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="createdDate"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-created-date"
              data-testid="input-created-date"
              disabled
              type="date"
              label="Created Date"
              placeholder="Created Date"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        {/* NPWP & Upload */}
        {/* {((isPemda && !debtorId) || !isPemda) && */}
        {/* hanya muncul bukan pemda IST_LOS_BUG_0021 */}
        {(!isPemda) &&
          <Controller
            control={control}
            name="npwp"
            render={({
              field: { ref, ...field },
              fieldState: { error },
            }) => (
              <Input
                {...field}
                id="input-npwp"
                data-testid="input-npwp"
                isMandatory={mandatoryFields?.npwp}
                disabled
                type="npwp"
                label="NPWP"
                placeholder="NPWP"
                maxLength={16}
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message || null}
              />
            )}
          />
        }

        {/*
        This Input field has no use, the design wants a disable input field
        https://www.figma.com/design/2T40mFoRMxpXc1hqqjmcLC/%E2%9C%85NEW-LOS-Fixed-(All-Design)?node-id=43976-60275&p=f&t=rSNyF7fHOcV3u9sY-0
         */}

        {!isPemda && <Controller
          name="documentNpwp"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <Input
              {...field}
              ref={ref}
              type="file"
              downloadOnly
              label="Upload NPWP"
              placeholder="Upload NPWP"
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />}

        {!isPemda &&
          <>
            <Controller
              control={control}
              name="debtorType"
              render={({
                field: { ref, ...field },
                fieldState: { error },
              }) => (
                <Input
                  {...field}
                  isMandatory={mandatoryFields?.debtorType}
                  disabled={disabledFields?.debtorType}
                  label="Jenis Customer"
                  placeholder="Jenis Customer"
                  type="dropdown"
                  dropdownList={filteredOwnership || ownedByList}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Box />
          </>
        }


        {!isPemda &&
          <Controller
            control={control}
            name="isGroup"
            render={({
              field: { ref, onChange, ...field },
              fieldState: { error },
            }) => (
              <Input
                {...field}
                type="radio"
                isMandatory={mandatoryFields?.isGroup}
                disabled={disabledFields?.isGroup}
                label="Customer Memiliki Group"
                onChange={(e) => {
                  const isGroup = e.target.value === 'true';
                  setValue('group', null);
                  onChange(isGroup);
                }}
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        }

        <Controller
          control={control}
          name="isRelatedToSmi"
          render={({
            field: { ref, onChange, ...field },
            fieldState: { error },
          }) => (
            <Input
              {...field}
              type="radio"
              isMandatory={mandatoryFields?.isRelatedToSmi}
              disabled={disabledFields?.isRelatedToSmi}
              label="Terkait Dengan SMI"
              radioList={[
                { label: 'Ya', value: true },
                { label: 'Tidak', value: false }
              ]}
              onChange={(e) => onChange(e.target.value === 'true' ? true : false)}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        {/* Group & Rm Name */}
        {/* {((isPemda && !debtorId) || !isPemda) && */}
        {/* hanya muncul bukan pemda IST_LOS_BUG_0021 */}
        {(!isPemda) &&
          <Controller
            control={control}
            name="group"
            render={({
              field: { ref, ...field },
            }) => (
              <Autocomplete
                {...field}
                value={field.value || null}
                id="input-group"
                testId="input-group"
                isMandatory={mandatoryFields?.group}
                disabled={!watch('isGroup') || disabledFields.group}
                label="Nama Group"
                placeholder="Nama Group"
                dropdownList={groupDropdownList}
                isLoading={isLoadingGroupData}
                onInputChange={setGroupKeyword}
              />
            )}
          />
        }

        <Controller
          control={control}
          name="rmId"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-rm"
              data-testid="input-rm"
              disabled
              label="Nama RM"
              placeholder="Nama RM"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        {/* Datasource & Division */}
        <Controller
          control={control}
          name="dataSource"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-datasource"
              data-testid="input-datasource"
              isMandatory={mandatoryFields?.dataSource}
              disabled={disabledFields?.dataSource}
              type="dropdown"
              label="Datasource"
              placeholder="Datasource"
              containerSx={{ flex: 1 }}
              dropdownList={dataSourceDropdownList}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />
        <Controller
          control={control}
          name="divisionId"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-division"
              data-testid="input-division"
              disabled
              label="Divisi"
              placeholder="Divisi"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        {/* Tipe Proses & General Account Type */}
        <Controller
          control={control}
          name="typeProcess"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-order-type"
              data-testid="input-order-type"
              isMandatory={mandatoryFields?.typeProcess}
              disabled={disabledFields?.typeProcess}
              type="dropdown"
              label="Tipe Proses"
              placeholder="Tipe Proses"
              containerSx={{ flex: 1 }}
              dropdownList={typeProcessDropdownList}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />
        <Controller
          control={control}
          name="gam"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Autocomplete
              {...field}
              id="input-gam"
              testId="input-gam"
              isMandatory={mandatoryFields?.gam}
              disabled={disabledFields?.gam}
              label="General Account Manager"
              placeholder="Input General Account Manager"
              dropdownList={gamDropdownList}
              isLoading={isLoadingGamData}
              onInputChange={(val) => setGamKeyword(val)}
              error={invalid}
              helperText={error ? 'GAM tidak boleh kosong' : ''}
            />
          )}
        />

        {/* Tipe Pembiayaan & Nama Analis */}
        <Controller
          control={control}
          name="financingType"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-financing-type"
              data-testid="input-financing-type"
              isMandatory={mandatoryFields?.financingType}
              disabled={disabledFields?.financingType}
              type="dropdown"
              label="Tipe Pembiayaan"
              placeholder="Tipe Pembiayaan"
              containerSx={{ flex: 1 }}
              dropdownList={financingTypeDropdownList}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />
        <Controller
          control={control}
          name="analyst"
          render={({
            field: { ref, ...field },
            fieldState: { isDirty, invalid, error },
          }) => (
            <Autocomplete
              {...field}
              id="input-analyst"
              testId="input-analyst"
              isMandatory={mandatoryFields?.analyst}
              disabled={disabledFields?.analyst}
              label="Nama Analis"
              placeholder="Nama Analis"
              dropdownList={analystDropdownList}
              isLoading={isLoadingAnalystData}
              onInputChange={setAnalystKeyword}
              error={isDirty && invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        {/* New/Existing & Total Nominal Pengajuan */}
        <Controller
          control={control}
          name="isExisting"
          render={({
            field: { value, onChange },
          }) => (
            <Input
              type="radio"
              disabled
              label="New / Existing Client"
              radioList={[
                {
                  label: 'New Client',
                  value: false,
                },
                {
                  label: 'Existing Client',
                  value: true,
                },
              ]}
              sx={{ flex: 1 }}
              value={value}
              onChange={onChange}
            />
          )}
        />
        {watch('typeProcess') !== 'ANNUAL_REVIEW' && (
          <Controller
            control={control}
            name="totalPlafond"
            render={({
              field: { ref, value, ...field },
              fieldState: { invalid, error },
            }) => (
              <Currency
                {...field}
                id="input-total-plafond"
                testId="input-total-plafond"
                disabled={!hasValidRefinaId}
                disabledCurrency={true}
                label="Total Nominal Pengajuan"
                placeholder="Input total nominal pengajuan"
                containerSx={{ flex: 1 }}
                value={{
                  currency: 'IDR',
                  value: value?.value,
                }}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
        )}

        {/* Remarks */}
        <Controller
          control={control}
          name="remarks"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              id="input-remarks"
              data-testid="input-remarks"
              isMandatory={mandatoryFields?.remarks}
              disabled={disabledFields?.remarks}
              type="area"
              label="Remarks"
              placeholder="Remarks"
              containerSx={{ gridColumn: '1 / 3' }}
              rows={4}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />
      </Box>
    </Form>
  );
};

export default FormDebtor;

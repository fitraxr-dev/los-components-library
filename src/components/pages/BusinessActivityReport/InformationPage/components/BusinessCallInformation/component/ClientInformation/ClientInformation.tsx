import React from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';

import useClientInformation from './ClientInformation.hook';


const ClientInformation = ({ isViewOnly }: { isViewOnly?: boolean }) => {

  const {
    isNew,
    theme,
    institutionTypeDropdownList,
    groupLists,
    watchFields,
    setValue,
    errors,
    control,
    handleNewGroup,
    sectorList,
    isPemda,
    institutionTypeId,
    nameset,
    isNamesetLoading,
    setGroupKeyword,
    canEditBAR,
    isRenderGroup,
    canCreateBAR,
    isBarCreation,
  } = useClientInformation();

  return (
    <>
      <SectionTitle title="Client Information" isOpen>
        <ColumnWrapper sx={{ mt: 2 }}>
          {!isNew ?
            <RowWrapper sx={{ justifyContent: 'end' }}>
              {isRenderGroup && !isViewOnly && (
                <Button onClick={handleNewGroup}>
                  {canEditBAR === false || !canCreateBAR || !isBarCreation ? 'Group' : 'Add New Group'}
                </Button>
              )}
            </RowWrapper> : null}
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="isNewClient"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                  type="radio"
                  label="New / Existing Client"
                  radioList={[
                    {
                      label: 'New Client',
                      value: 'true',
                    },
                    {
                      label: 'Existing Client',
                      value: 'false',
                    },
                  ]}
                  sx={{ flex: 1 }}
                />
              )}
            />
            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="input-group"
                  testId="input-group"
                  disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                  label="Nama Group"
                  placeholder="Pilih Nama Group"
                  dropdownList={groupLists}
                  value={field.value}
                  onInputChange={setGroupKeyword}
                />
              )}
            />
            {/* Nama Customer & Proposal ID */}
            <Box
              sx={{
                alignItems: 'start',
                display: 'grid',
                gridGap: theme.spacing(1),
                gridTemplateColumns: '30% 1fr',
              }}
            >
              <Controller
                control={control}
                name="institution"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error },
                }) => (
                  <Input
                    {...field}
                    disabled={!isNew || isViewOnly}
                    type="dropdown"
                    label="Institution Type"
                    isMandatory = {isNew}
                    placeholder="Institution Type"
                    value={watchFields.institution}
                    onChange={(e) => setValue('institution', e)}
                    dropdownList={institutionTypeDropdownList}
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {(isPemda && institutionTypeId.includes('CENTRAL_GOVER')) ?
                <>
                  <Input
                    disabled={true}
                    type="text"
                    label="Nama Customer"
                    isMandatory
                    placeholder="Input Nama Customer"
                    value="OTHERS"
                  />
                </> :
                <>
                  <Controller
                    control={control}
                    name="name"
                    render={({
                      field: { ref, onChange, value, ...field },
                      fieldState: { invalid, error },
                    }) => (
                      <>
                        {isPemda ?
                          <Autocomplete
                            {...field}
                            disabled={!isNew || isViewOnly}
                            label="Nama Customer"
                            placeholder="Input Nama Customer"
                            isMandatory={isNew}
                            dropdownList={nameset}
                            isLoading={isNamesetLoading}
                            error={invalid}
                            helperText={error ? error.message : ''}
                            value={{ id: value, label: value }}
                            onChange={(val) => {
                              onChange(val.id);
                            }}
                          />
                          :
                          <InputDebtorName
                            control={control}
                            name="name"
                            inputProps={{
                              disabled: !isNew || isViewOnly,
                            }}
                            id="input-debtor-name"
                            data-testid="input-debtor-name"
                            label="Nama Customer"
                            isMandatory={isNew}
                            placeholder="Nama Customer"
                            error={invalid}
                            helperText={error ? error.message : ''}
                            disabled={!isNew || isViewOnly}
                            bg=""
                          />
                        }
                      </>
                    )}
                  />
                </>
              }
            </Box>

            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  isMandatory={!isNew || isBarCreation && (canCreateBAR === true || canEditBAR === true)}
                  disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                  dropdownList={sectorList}
                  label="Sektor Industri"
                  placeholder="Pilih Sektor Industri"
                  value={{ id: field.value?.id || '', label: field.value?.label || '' }}
                  error={!!errors.sector}
                  helperText={errors.sector?.id?.message || null}
                  onChange={(e) => {
                    field.onChange({ id: e.value, label: e.label });
                    setValue('sectorOther', null);
                  }}
                />
              )}
            />

            {isPemda && institutionTypeId.includes('CENTRAL_GOVER') ?
              <Controller
                control={control}
                name="name"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error },
                }) => (
                  <Input
                    {...field}
                    disabled={!isNew || isViewOnly}
                    label=""
                    labelProps={{
                      minHeight: '1.525vw',
                    }}
                    placeholder="Input Nama Customer"
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              /> :
              <Box />
            }

            {watchFields.sector?.id === 'OTHER_SECTOR' ?
              <Controller
                name="sectorOther"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isMandatory={!isNew && isBarCreation && canCreateBAR === true || canEditBAR === true}
                    disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                    type="text"
                    label="Other"
                    placeholder="Input Sektor Industri"
                    containerSx={{ flex: 1 }}
                    error={!!errors.sectorOther}
                    helperText={errors.sectorOther?.message || null}
                  />
                )}
              /> : null}

          </Box>
        </ColumnWrapper>
      </SectionTitle>
    </>
  );
};

export default ClientInformation;

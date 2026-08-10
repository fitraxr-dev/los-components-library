'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Paper } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ModalRecommendedGroup from './components/ModalRecommendedGroup/ModalRecommendedGroup';
import { CreateNewPageHooks, modal } from './CreateNew.hook';


const CreateNewPage = () => {
  const {
    groupTypeList,
    sectorDropdownList,
    tableHeaderMember,
    isSaveLoading,
    control,
    isDirty,
    isValid,
    theme,
    handleSubmit,
    handleSubmitForm,
  } = CreateNewPageHooks();

  return (
    <ColumnWrapper
      sx={{
        gap: theme.spacing(2),
      }}
    >
      <TextStyle
        variant="title1"
        color={theme.palette.primary.main}
        weight={700}
      >
        Create New Group
      </TextStyle>
      <>
        <Paper
          sx={{
            alignItems: 'center',
            borderRadius: theme.radius(2),
            boxShadow: 2,
            display: 'grid',
            gap: theme.spacing(4),
            gridTemplateColumns: '1fr 1fr',
            overflow: 'hidden',
            padding: theme.spacing(2),
            width: '100%',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: theme.spacing(2),
              gridTemplateColumns: '1fr 2fr',
              width: '100%',
            }}
          >
            <TextStyle color="primary.main">ID Group</TextStyle>
            <Controller
              control={control}
              name="idGroup"
              render={({ field: { ref, ...field }, fieldState: { invalid, isTouched, error } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  placeholder="ID Group"
                  containerSx={{ flex: 1 }}
                  disabled
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />

            <RowWrapper mb={1}>
              <TextStyle color="primary.main" >Nama Group </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <Controller
              control={control}
              name="groupName"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  placeholder="Nama Group"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />

            <RowWrapper mb={1}>
              <TextStyle color="primary.main">
                Jenis Group Customer
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <Controller
              name="groupType"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  placeholder="Jenis Group Customer"
                  containerSx={{ flex: 1 }}
                  type="dropdown"
                  error={invalid}
                  helperText={error ? error.message : ''}
                  dropdownList={groupTypeList}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: theme.spacing(2),
              gridTemplateColumns: '1fr 2fr',
              width: '100%',
            }}
          >
            <RowWrapper mb={1}>
              <TextStyle color="primary.main">Sektor Industri</TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <Controller
              control={control}
              name="sector"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  placeholder="Sektor Industri"
                  containerSx={{ flex: 1 }}
                  type="dropdown"
                  error={invalid}
                  helperText={error ? error.message : ''}
                  dropdownList={sectorDropdownList}
                />
              )}
            />
            <RowWrapper mb={1}>
              <TextStyle color="primary.main">Tahun didirikan</TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
              </TextStyle>
            </RowWrapper>
            <Controller
              control={control}
              name="yearFounded"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  containerSx={{ flex: 1 }}
                  type="date"
                  format="YYYY"
                  views={['year']}
                  error={invalid}
                  helperText={error ? error.message : ''}
                  dropdownList={sectorDropdownList}
                />
              )}
            />
            <RowWrapper mb={1}>
              <TextStyle color="primary.main">Terkait dengan SMI</TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <Controller
              control={control}
              name="isRelatedToSmi"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  containerSx={{ flex: 1 }}
                  type="radio"
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  error={invalid}
                  helperText={error ? error.message : ''}
                  dropdownList={sectorDropdownList}
                />
              )}
            />
          </Box>
        </Paper>
        <SectionTitle title="Group Member" isOpen>
          <Table
            maxHeight="42vh"
            tableHeader={tableHeaderMember}
            tableData={null}
          />
        </SectionTitle>


        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            disabled={!isDirty || !isValid || isSaveLoading}
            onClick={handleSubmitForm((data) => handleSubmit(data))}
          >
            Save
          </Button>
        </Box>
      </>

      <ModalDef
        id={modal.RECOMMENDED_GROUP}
        component={ModalRecommendedGroup}
      />
    </ColumnWrapper >
  );
};

export default CreateNewPage;

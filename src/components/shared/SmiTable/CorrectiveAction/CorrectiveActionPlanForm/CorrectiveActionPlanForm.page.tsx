'use client';

import React from 'react';

import { Controller, FormProvider } from 'react-hook-form';


import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import DescriptionForm from '../DescriptionForm/DescriptionForm';

import useCorrectiveActionPlanFormHooks from './CorrectiveActionPlanForm.hooks';

import type { CorrectiveActionPlanFormProps } from './CorrectiveActionPlanForm.types';


const CorrectiveActionPlanForm = (
  {
    module,
    process,
    isBusinessResponse = false,
    viewOnly,
    isBusinessResponseMandatory = false,
  }: CorrectiveActionPlanFormProps) => {

  const {
    container,
    control,
    currentPage,
    data,
    errors,
    fields,
    handleAddDescription,
    handleCancel,
    handleDeleteDescription,
    handleOnSave,
    handleSaveBusinessResponse,
    isAutoSaveFetching,
    isEditData,
    isSubmitting,
    methods,
    moduleListESS,
    setContainer,
    setCurrentPage,
    setValue,
    theme,
    watch,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
  } = useCorrectiveActionPlanFormHooks({ isBusinessResponse, module, process, viewOnly });


  return (
    <ColumnWrapper sx={{ gap: '16px' }}>
      <FormProvider {...methods}>
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            marginBottom: theme.spacing(4),
            p: 1,
          }}
        >
          <TextStyle variant="body1" color={theme.palette.primary.main}>
            {viewOnly && isEditData
              ? 'Detail Existing Correction Action Plan'
              : isEditData
                ? 'Edit Existing Correction Action Plan'
                : 'Add New Correction Action Plan'}
          </TextStyle>
        </RowWrapper>
        <ColumnWrapper>
          <Controller
            name="ess"
            control={control}
            render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                placeholder="Choose ESS"
                label="ESS"
                type="dropdown"
                dropdownList={moduleListESS}
                value={watch('ess')}
                onChange={(val) => setValue('ess', val)}
                error={invalid}
                helperText={error ? error.message : ''}
                disabled={viewOnly || isBusinessResponse}
              />
            )}
          />
        </ColumnWrapper>
        <ColumnWrapper>
          <Text>
            Temuan/Gaps
          </Text>
          <WordEditor
            id="businessResponse"
            container={container}
            setContainer={setContainer}
            initialValue={data?.description}
            isReadOnly={viewOnly || isBusinessResponse}
            isWordEditorEmpty={isWordEditorEmpty}
            setIsWordEditorEmpty={setIsWordEditorEmpty}
          />
        </ColumnWrapper>

        <BaseContainer>
          <RowWrapper
            sx={{
              borderBottom: '0.1vw solid',
              borderColor: theme.palette.custom.gray30,
              justifyContent: isBusinessResponse ? 'end' : 'space-between',
              marginBottom: theme.spacing(4),
              p: 1,
            }}
          >
            {!isBusinessResponse &&
              <Button
                onClick={handleAddDescription}
                startIcon="add"
                disabled={viewOnly}
              >
                Tambah Deskripsi
              </Button>
            }

            <RowWrapper sx={{ alignItems: 'center', gap: '16px' }}>
              <Button variant="text" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage < 1}>
                <Icon iconName="arrow-square-left" sx={{ height: '24px', width: '24px' }} />
              </Button>
              <TextStyle variant="body2" weight={600} color={theme.palette.primary.main}>
                {`${currentPage + 1} / ${fields.length}`}
              </TextStyle>
              <Button variant="text" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= fields.length - 1}>
                <Icon iconName="arrow-square-right" sx={{ height: '24px', width: '24px' }} />
              </Button>
            </RowWrapper>
          </RowWrapper>
          {fields.map((data, index) => (
            <ColumnWrapper
              key={data.id}
              sx={currentPage === index ? {} : { height: 0, opacity: 0, overflow: 'hidden' }}
            >
              <DescriptionForm
                index={index}
                fields={fields}
                onDelete={handleDeleteDescription}
                isBusinessResponse={isBusinessResponse}
                isBusinessResponseMandatory={isBusinessResponseMandatory}
                viewOnly={viewOnly}
                callback={(e) => {
                  methods.setValue(`descriptionList.${index}.businessResponse`, e);
                }}
              />
            </ColumnWrapper>
          ))}
        </BaseContainer>
        <RowWrapper sx={{ gap: '16px', justifyContent: 'end' }}>
          {viewOnly ? (
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={isBusinessResponse ?
                  methods.handleSubmit(handleSaveBusinessResponse) : methods.handleSubmit(handleOnSave)}
                disabled={
                  !!Object.keys(errors).length ||
                  viewOnly ||
                  isSubmitting || isAutoSaveFetching
                }
                isLoading={isSubmitting}
              >
                {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
              </Button>
            </>
          )}
        </RowWrapper>
      </FormProvider>
    </ColumnWrapper>
  );
};

export default CorrectiveActionPlanForm;

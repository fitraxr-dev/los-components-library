'use client';

import React from 'react';

import { Controller, FormProvider } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import DescriptionForm from '../DescriptionForm/DescriptionForm';

import useCorrectiveActionPlanFormHooks from './CorrectiveActionPlanForm.hooks';

import type { CorrectiveActionPlanFormProps } from './CorrectiveActionPlanForm.types';


const CorrectiveActionPlanForm = ({
  module,
  process,
  isBusinessResponse = false,
  viewOnly = false,
  isBusinessResponseMandatory = true,
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
    canAddMoreDescription,
    isEssFilled,
  } = useCorrectiveActionPlanFormHooks({ module, process });

  const isFormValid = !Object.keys(errors).length && isEssFilled && !viewOnly && !isSubmitting;

  const getFormTitle = () => {
    if (viewOnly) return 'Detail Correction Action Plan';

    return isEditData
      ? 'Edit Existing Correction Action Plan'
      : 'Add New Correction Action Plan';
  };

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
            {getFormTitle()}
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
                required
              />
            )}
          />
        </ColumnWrapper>
        <ColumnWrapper>
          <Text>Temuan/Gaps</Text>
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
            {!isBusinessResponse && (
              <Button onClick={handleAddDescription} startIcon="add" disabled={viewOnly || !canAddMoreDescription}>
                Tambah Deskripsi
              </Button>
            )}

            <RowWrapper sx={{ alignItems: 'center', gap: '16px' }}>
              <Button variant="text" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage < 1}>
                <Icon iconName="arrow-square-left" sx={{ height: '24px', width: '24px' }} />
              </Button>
              <TextStyle variant="body2" weight={600} color={theme.palette.primary.main}>
                {`${currentPage + 1} / ${fields.length}`}
              </TextStyle>
              <Button
                variant="text"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= fields.length - 1}
              >
                <Icon iconName="arrow-square-right" sx={{ height: '24px', width: '24px' }} />
              </Button>

              {fields.length > 1 && (
                <IconButton
                  onClick={() => handleDeleteDescription()}
                  iconName="delete"
                  isDisabled={viewOnly}
                  sx={{ ml: 1 }}
                />
              )}
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
                callback={(e) => {
                  methods.setValue(`descriptionList.${index}.businessResponse`, e);
                }}
                viewOnly={viewOnly}
              />
            </ColumnWrapper>
          ))}
        </BaseContainer>
        <RowWrapper sx={{ gap: '16px', justifyContent: 'end' }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
            {viewOnly ? 'Close' : 'Cancel'}
          </Button>
          {!viewOnly &&
            (
              <Button
                onClick={
                  isBusinessResponse ? methods.handleSubmit(handleSaveBusinessResponse) :
                    methods.handleSubmit(handleOnSave)
                }
                disabled={!isFormValid || isSubmitting || isAutoSaveFetching}
                isLoading={isSubmitting}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
            )}
        </RowWrapper>
      </FormProvider>
    </ColumnWrapper>
  );
};

export default CorrectiveActionPlanForm;

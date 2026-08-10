import React from 'react';

import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useCallDescription from './CallDescription.hook';

import type { TimeSteps } from '@/components/shared/Input/Input.types';


const CallDescription = ({ isOpen, isViewOnly }: { isOpen: boolean; isViewOnly?: boolean }) => {
  const today = dayjs();
  const minDate = today.subtract(13, 'day');

  const {
    mediaDropdownList,
    businessCallDropdownList,
    summaryAlertDropdownList,
    canCreateBAR,
    setValue,
    isNew,
    errors,
    control,
    watchFields,
    theme,
    canEditBAR,
    isBarCreation,
  } = useCallDescription();

  console.log('isViewOnly', isViewOnly);

  const timeSteps: TimeSteps = {
    hours: 1,
    minutes: 30,
    seconds: 0,
  };

  return (
    <ColumnWrapper sx={{ gap: 2 }}>
      <SectionTitle title="Call Description" isOpen={isOpen}>
        <BaseContainer
          sx={{
            boxShadow: 2,
            padding: 2,
          }}
        >
          <ColumnWrapper
            sx={{
              display: 'grid',
              gap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <ColumnWrapper
              sx={{
                display: 'grid',
                gap: theme.spacing(2),
                gridColumn: 1,
                gridTemplateRows: 'repeat(3, 1fr)' }}
            >
              {/* Call Date */}
              <Controller
                name="callDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isMandatory={!isNew && isBarCreation && canCreateBAR && canEditBAR}
                    disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                    maxDate={today.toString()}
                    minDate={minDate.toString()}
                    type="date"
                    label="Call Date"
                    placeholder="Pilih Call Date"
                    containerSx={{ flex: 1 }}
                    error={!!errors.callDate || (field.value &&
                        (new Date().getTime() - new Date(field.value).getTime()) / (1000 * 60 * 60 * 24) > 14)}
                    helperText={errors.callDate?.message || (field.value &&
                        (new Date().getTime() - new Date(field.value).getTime()) / (1000 * 60 * 60 * 24) > 14) ? 'callDate tidak boleh lebih dari 14 hari kebelakang' : null}
                  />
                )}
              />

              {/* Call Time */}
              <Controller
                name="callTime"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      isMandatory={!isNew && isBarCreation && canCreateBAR && canEditBAR}
                      onChange={(e) => {
                        if (e === 'Invalid Date') {
                          field.onChange(null);
                        } else {
                          field.onChange(e);
                        }
                      }}
                      timeSteps={timeSteps}
                      disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                      type="time"
                      label="Call Time"
                      placeholder="Periode"
                      containerSx={{ flex: 1 }}
                      error={!!errors.callTime}
                      helperText={errors.callTime?.message || null}
                    />
                  );}
                }
              />

              {/* Summary Alert */}
              {!isNew && (
                <Controller
                  name="summaryAlert"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                      type="dropdown"
                      isMandatory={!isNew && isBarCreation && canCreateBAR && canEditBAR}
                      label="Summary Alert"
                      placeholder="Choose one"
                      dropdownList={summaryAlertDropdownList}
                      containerSx={{ flex: 1 }}
                      error={!!errors.summaryAlert}
                      helperText={errors.summaryAlert?.message || null}
                    />
                  )}
                />
              )}
            </ColumnWrapper>

            <ColumnWrapper
              sx={{ display: 'grid',
                gap: theme.spacing(2),
                gridColumn: 2,
                gridTemplateRows: 'repeat(3, 1fr)' }}
            >
              {/* Media Dropdown */}
              <Controller
                name="media"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isMandatory={!isNew && isBarCreation && canCreateBAR && canEditBAR}
                    disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                    type="dropdown"
                    label="Media"
                    placeholder="Pilih Media"
                    dropdownList={mediaDropdownList}
                    containerSx={{ flex: 1 }}
                    error={!!errors.media}
                    helperText={errors.media?.message || null}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue('mediaOther', null);
                    }}
                  />
                )}
              />


              {watchFields.media === 'OTHER' ? <Controller
                name="mediaOther"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isMandatory={!isNew && isBarCreation && canCreateBAR && canEditBAR}
                    disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                    type="text"
                    label="Other"
                    placeholder="Input Media"
                    containerSx={{ flex: 1 }}
                    error={!!errors.mediaOther}
                    helperText={errors.mediaOther?.message || null}
                  />
                )}
              /> : null}

              {/* Business Call Type Dropdown */}
              <Controller
                name="businessCallType"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isMandatory={!isNew && isBarCreation && canCreateBAR && canEditBAR}
                    disabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                    type="dropdown"
                    label="Tipe Business Call"
                    placeholder="Tipe Business Call"
                    dropdownList={businessCallDropdownList}
                    containerSx={{ flex: 1 }}
                    error={!!errors.businessCallType}
                    helperText={errors.businessCallType?.message || null}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue('checklist', []);
                      setValue('other', null);
                    }}
                  />
                )}
              />
            </ColumnWrapper>


          </ColumnWrapper>
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default CallDescription;

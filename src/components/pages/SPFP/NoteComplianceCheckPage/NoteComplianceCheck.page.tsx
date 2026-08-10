'use client';
import React, { useState } from 'react';

import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
} from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useNoteComplianceCheck } from './NoteComplianceCheck.hook';


const NoteComplianceCheck = () => {
  const theme = useTheme();
  const [state] = useApp();
  const [containerBusiness, setContainerBusiness] = useState(null);
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const bucket = useSpfpBucketContext();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view note compliance check page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION];

  // Use same structure as Business.page.tsx
  const businessCheck = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);
  console.log('businessCheck', businessCheck);
  const list = [{ label: 'Open', value: 1 }, { label: 'Close', value: 2 }];

  const {
    control,
    handleSubmit,
    handleBack,
    isComplianceCheck,
    isDetailLoading,
    isSaveLoading,
    dataDetail,
    handleOnSave,
    mode,
    formState,
    watch,
    handleContentChange,
    container,
    setContainer,
    isContentEmpty,
  } = useNoteComplianceCheck();

  // Jika user adalah bisnis, semua field bisa di-edit
  // Jika bukan bisnis, field utama disabled
  const isBusiness = businessCheck;
  const shouldDisableFields = isBusiness;
  const watchedValues = watch();
  const catatan = watchedValues.catatan?.trim();
  const status = watchedValues.status;

  // Disable save button if: isContentEmpty OR catatan is empty OR status is empty
  const isSaveDisabled = isContentEmpty || !catatan || status === undefined || status === null;


  const onSubmit = (data) => {

    const promises = [];

    if (container) {
      promises.push(convertToDocx(container));
    }

    if (containerBusiness) {
      promises.push(convertToDocx(containerBusiness));
    }

    if (promises.length === 0) {
      // If no containers, save with empty blob array
      handleOnSave({ blob: [], form: data });
      return;
    }

    Promise.all(promises)
      .then((values) => {

        handleOnSave({ blob: values, form: data });

      })
      .catch((error) => {
        console.error('Error converting to docx:', error);
      });
  };

  return (
    <>
      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
          p: 1,
        }}
      >
        <TextStyle sx={{ fontWeight: 'bold' }} variant="body1" color={theme.palette.primary.main}>
          Catatan
        </TextStyle>
      </RowWrapper>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Controller
          name="catatan"
          control={control}
          rules={{
            required: (mode === 'create' || mode === 'edit') ? 'Catatan wajib diisi' : false,
            validate: (value) => {
              if ((mode === 'create' || mode === 'edit') && (!value || value.trim() === '')) {
                return 'Catatan wajib diisi';
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <Input
                {...field}
                label="Catatan"
                type="text"
                disabled={shouldDisableFields}
                placeholder="Input Catatan"
                isMandatory={mode === 'create' || mode === 'edit'}
                rows={3}
                multiline
                error={!!error}
                helperText={error?.message}
              />
            );
          }}
        />

        <Controller
          name="status"
          control={control}
          rules={{
            required: (mode === 'create' || mode === 'edit') ? 'Open / Close wajib diisi' : false,
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <Input
                {...field}
                label="Open / Close"
                type="dropdown"
                disabled={shouldDisableFields}
                dropdownList={list}
                placeholder="Input Open / Close"
                isMandatory={mode === 'create' || mode === 'edit'}
                rows={3}
                multiline
                error={!!error}
                helperText={error?.message}
              />
            );
          }}
        />
        <WordEditor
          container={container}
          setContainer={setContainer}
          isReadOnly={shouldDisableFields}
          isLoading={isDetailLoading || isSaveLoading}
          initialValue={dataDetail?.comment}
          onContentChange={handleContentChange}
          onSave={() => { }}
        />

        {/* Respon Bisnis: muncul hanya jika user adalah bisnis */}
        {isBusiness &&
          <>
            <RowWrapper alignItems="center">
              <Title title="Respon Bisnis" />
            </RowWrapper>
            <WordEditor
              container={containerBusiness}
              isReadOnly={viewOnly}
              setContainer={setContainerBusiness}
              isLoading={isDetailLoading || isSaveLoading}
              initialValue={dataDetail?.note}
              onSave={() => { }}
            />
          </>
        }
        {!viewOnly && (
          <RowWrapper py={3} gap={2} justifyContent="end">
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={isSaveLoading}
              disabled={viewOnly || isSaveDisabled}
            >
              Save
            </Button>
          </RowWrapper>
        )}
        {viewOnly && (
          <RowWrapper py={3} gap={2} justifyContent="end">

            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Close
            </Button>
          </RowWrapper>
        )}
      </ColumnWrapper>
    </>
  );
};

export default NoteComplianceCheck;

'use client';
import React, { useEffect, useMemo, useRef } from 'react';

import { Box } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import { DECLINE } from '@/configs/constants';

import { useMaintenanceModalContext } from '@/components/layouts/MaintenanceModalLayout/MaintenanceModal.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import { TabItem } from '@/components/shared/Tabs';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useMaintenanceModalDetail from './MaintenanceModalDetail.hook';


const MaintenanceModalDetail = () => {
  const { setFormProgress } = useMaintenanceModalContext();
  const {
    theme,
    control,
    handleSubmit,
    isAutoSaveFetching,
    handleSave,
    handleOpenSubmitModal,
    isPending,
    isSubmitLoading,
    viewOnly,
    actions,
    isFormValid,
    canSubmit,
    isRM,
    isSuperAdminMaker,
    isSuperAdminChecker,
    isKadiv,
    methods,
    watchedModal,
    isViewOnlyByDivision,
    watchedCapitalPositionDate,
  } = useMaintenanceModalDetail();

  const progressPercentage = useMemo(() => {
    let filledFields = 0;
    const totalFields = 2;

    if (watchedModal?.value > 0 && watchedModal?.currency?.trim() !== '') {
      filledFields += 1;
    }

    if (watchedCapitalPositionDate && String(watchedCapitalPositionDate).trim() !== '') {
      filledFields += 1;
    }

    const progress = Math.round((filledFields / totalFields) * 100);

    return progress;
  }, [watchedModal, watchedCapitalPositionDate]);

  const prevProgressRef = useRef(progressPercentage);

  useEffect(() => {
    if (prevProgressRef.current !== progressPercentage) {
      prevProgressRef.current = progressPercentage;
      setFormProgress(progressPercentage);
    }
  }, [progressPercentage, setFormProgress]);

  return (
    <FormProvider {...methods}>
      <ColumnWrapper
        gap={theme.spacing(3)}
        height={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Title title="Maintenance Modal" />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(1),
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Controller
            control={control}
            name="modal"
            rules={{ required: 'Modal wajib diisi' }}
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                type="currency"
                label="Modal"
                placeholder="Masukkan Modal"
                error={invalid}
                helperText={error ? error.message : ''}
                disabled={viewOnly || (!isRM && !isSuperAdminMaker) || isViewOnlyByDivision}
              />
            )}
          />
          <Controller
            control={control}
            name="capitalPositionDate"
            rules={{ required: 'Capital Date wajib diisi' }}
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                type="date"
                label="Tanggal Posisi Modal"
                placeholder="Pilih Tanggal Posisi Modal"
                error={invalid}
                helperText={error ? error.message : ''}
                disabled={viewOnly || (!isRM && !isSuperAdminMaker) || isViewOnlyByDivision}
                maxDate={new Date().toISOString()}
              />
            )}
          />

          <Controller
            control={control}
            name="lastModifiedDate"
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                type="text"
                label="Last Modified"
                error={invalid}
                disabled
                helperText={error ? error.message : ''}
              />
            )}
          />
          <Controller
            control={control}
            name="approvedBy"
            render={({
              field: { ref, ...field }, fieldState: { invalid, error },
            }) => (
              <Input
                {...field}
                type="text"
                label="Approved By"
                placeholder="Enter Approver's Name"
                error={invalid}
                disabled
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Box>
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3, py: 3 }}>
        {(!isViewOnlyByDivision && (actions['CANCEL'] || actions['REJECT'])) && (
          <>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleOpenSubmitModal({ action: DECLINE })}
              disabled={isSubmitLoading}
            >Decline
            </Button>
          </>
        )}
        {(!isViewOnlyByDivision && actions['SAVE']) && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleSave)}
              disabled={isPending || isSubmitLoading || viewOnly || !isFormValid || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          </>
        )}
        {(!isViewOnlyByDivision && actions['RETURN_TO_STAFF']) && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenSubmitModal({ action: actions['RETURN_TO_STAFF'] })}
              disabled={isSubmitLoading}
            >Return to staff
            </Button>
          </>
        )}
        {(!isViewOnlyByDivision && actions['RETURN_TO_MAKER']) && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenSubmitModal({ action: actions['RETURN_TO_MAKER'] })}
              disabled={isSubmitLoading}
            >Return to maker
            </Button>
          </>
        )}
        {(!isViewOnlyByDivision && actions['SUBMIT']) && (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={() =>
                handleOpenSubmitModal({
                  action: 'SUBMIT',
                })
              }

              disabled={isSubmitLoading || viewOnly || !canSubmit}
            >{['APPROVE', 'APPROVED', 'COMPLETED'].includes(actions['SUBMIT']) ? 'Approve' : 'Submit'}
            </Button>
          </>
        )}
      </RowWrapper>

    </FormProvider>
  );
};

export default MaintenanceModalDetail;

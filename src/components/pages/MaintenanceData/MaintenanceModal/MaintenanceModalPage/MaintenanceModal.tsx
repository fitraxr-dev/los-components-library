'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from '../components/ApprovalStatusModal';
import HistoryModal from '../components/HistoryModal';

import { modal } from './MaintenanceModal.constants';
import useMaintenanceModal from './MaintenanceModal.hook';


const MaintenanceModal = () => {
  const {
    theme,
    actions,
    canSubmit,
    control,
    handleSubmit,
    handleSave,
    isBucketActive,
    isBusinessDivision,
    isPending,
    isFormValid,
    isRM,
    isSuperAdminMaker,
    handleApprovalModal,
    handleOpenSubmitModal,
    handleHistoryModal,
    stepper,
    userData,
    identity,
  } = useMaintenanceModal();

  return (
    <>
      <ColumnWrapper
        gap={theme.spacing(3)}
        height={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Title title="Maintenance Data Modal" />

        <Box sx={{ display: 'grid', gap: theme.spacing(1), gridTemplateColumns: '1.5fr 1fr', mb: theme.spacing(1) }}>
          <RowWrapper>
            {isBucketActive ?
              <RowWrapper mt={2}>
                <Box display="flex" gap={1} alignItems="center">
                  <Icon iconName="information-shape" />
                  <TextStyle variant="body4" color="#284A63" sx={{ fontWeight: 700 }}>
                    Data ini sedang dalam proses pengajuan, silakan cek pada Approval Status
                  </TextStyle>
                </Box>
              </RowWrapper>
              : <></>
            }
          </RowWrapper>
          <RowWrapper sx={{ justifyContent: 'end' }}>
            {isBusinessDivision ?
              <>
                <Button onClick={handleApprovalModal} sx={{ mr: 2 }}>Approval Status</Button>
                {/* <Button variant="outlined" onClick={handleHistoryModal} sx={{ ml: 2 }}>History Modal</Button> */}
              </> : null
            }
          </RowWrapper>
        </Box>

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
                disabled={(!isRM && !isSuperAdminMaker) || isBucketActive}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="capitalPositionDate"
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
                disabled={(!isRM && !isSuperAdminMaker) || isBucketActive}
                required
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
        {(isRM || isSuperAdminMaker) && !isBucketActive && (
          <Button
            color="primary"
            sx={{ mr: 1 }}
            onClick={handleSubmit(handleSave)}
            disabled={isPending || !isFormValid}
          >
            Save
          </Button>
        )}
        {(isRM || isSuperAdminMaker) && !isBucketActive && (
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              handleOpenSubmitModal({
                action: 'SUBMIT',
              })
            }
            disabled={!canSubmit}
          >
            {['APPROVE', 'APPROVED', 'COMPLETED'].includes(actions['SUBMIT']) ? 'Approve' : 'Submit'}
          </Button>
        )}
      </RowWrapper>

      <ModalDef
        id={modal.APPROVAL_MODAL}
        component={ApprovalStatusModal}
      />
      <ModalDef
        id={modal.HISTORY_MODAL}
        component={HistoryModal}
      />
    </>
  );
};

export default MaintenanceModal;

'use client';

import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep, formatDateTime } from '@/helpers/date';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import { modal } from '../../components/ActionFooterDetail/ActionFooterDetail.constant';
import ModalPlafonValidation from '../../components/ModalPlafonValidation/ModalPlafonValidation.page';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import useDebtorIdentity from './DebtorIdentity.hooks';


const DebtorIdentity = () => {
  const theme = useTheme();
  const {
    handleOpenSubmitModal,
    handleClose,
    isSubmitLoading,
    isPending,
    actions,
    isViewOnly,
    isDebtor,
    isDirty,
    isAutoSaveFetching,
    debtorData,
    control,
    handleSave,
    findDataMaster,
    dataSourceDropdownList,
    watch,
    canEdit,
    setIsSubmit,
    isSubmit,
  } = useDebtorIdentity();

  const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="Customer Identity" />
      { isDebtor ?
        <>
          <TableDebtorInformationLocal
            debtorName={debtorData?.name}
            gamName={debtorData?.gamName}
            staffName={debtorData?.staffName}
            isNewClient={debtorData?.isNewDebtor}
            cif={debtorData?.cif}
            division={debtorData?.divisionName}
            debtorId={debtorData?.debtorId}
            createdAt={debtorData?.createdDate}
          />
        </> :
        <>
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
            showDifferentDataAlert={false}
          />
        </>
      }

      <SectionTitle title="Customer Identity" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingTop: theme.spacing(3),
          }}
        >

          <Controller
            name="debtorIdentity.npwpNo"
            control={control}
            render={({ field, fieldState: { error, invalid } }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="NPWP No."
                placeholder="Masukkan No. Npwp"
                type={isViewOnly ? 'text' : 'number'}
                maxLength={16}
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
                isMandatory
                hasDataMaster={findDataMaster('npwpNo')}
                error={!!error}
                helperText={(invalid || error) && error.message}
              />
            }
          />

          <Controller
            name="debtorIdentity.npwpDocument"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Upload NPWP"
                placeholder="Upload NPWP"
                type="file"
                downloadOnly={isViewOnly}
                showPreviewFile={!!field.value}
                isMandatory
                hasDataMaster={findDataMaster('npwpDocument')}

              />
            }
          />

          <Controller
            name="debtorIdentity.placeFounded"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Tempat Pendirian"
                placeholder="Masukkan Tempat Pendirian"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
                isMandatory
                hasDataMaster={findDataMaster('placeFounded')}

              />
            }
          />

          <Controller
            name="debtorIdentity.dateFounded"
            control={control}
            render={({
              field: { onChange, ...field },
            }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Tanggal Pendirian."
                placeholder="Masukkan Tanggal Pendirian"
                type="date"
                maxDate={dayJsJakartaKeep(new Date())}
                onChange={(val) => onChange(dayJsJakartaKeep(val))}
                isMandatory
                hasDataMaster={findDataMaster('dateFounded')}

              />
            }
          />

          <Controller
            name="debtorIdentity.notaryDeedNo"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Notary deed No."
                placeholder="Masukkan No. Notary deed"
                type="text"
                isMandatory
                hasDataMaster={findDataMaster('notaryDeedNo')}

              />
            }
          />

          <Controller
            name="debtorIdentity.notaryDeedDocument"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Upload Notary Deed "
                placeholder="Upload Notary Deed "
                type="file"
                downloadOnly={isViewOnly}
                showPreviewFile={!!field.value}
                hasDataMaster={findDataMaster('notaryDeedDocument')}
                isMandatory
              />
            }
          />

          <Controller
            name="debtorIdentity.firstNotaryDeedNo"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="First Notary Deed No."
                placeholder="Masukkan First Notary Deed Date"
                type="text"
                hasDataMaster={findDataMaster('firstNotaryDeedNo')}

              />
            }
          />

          <Controller
            name="debtorIdentity.lastNotaryDeedNo"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Last Notary Deed No."
                placeholder="Masukkan Last Notary Deed Date"
                type="text"
                hasDataMaster={findDataMaster('lastNotaryDeedNo')}

              />
            }
          />

          <Controller
            name="debtorIdentity.firstNotaryDeedDate"
            control={control}
            render={({
              field: { onChange, ...field },
            }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="First Notary Deed Date"
                placeholder="Masukkan First Notary Deed Date"
                maxDate={watch('debtorIdentity.lastNotaryDeedDate') ?? ''}
                type="date"
                onChange={(val) => onChange(dayJsJakartaKeep(val))}
                hasDataMaster={findDataMaster('firstNotaryDeedDate')}

              />
            }
          />

          <Controller
            name="debtorIdentity.lastNotaryDeedDate"
            control={control}
            render={({
              field: { onChange, ...field },
            }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Last Notary Deed Date"
                placeholder="Masukkan Last Notary Deed Date"
                minDate={watch('debtorIdentity.firstNotaryDeedDate') ?? ''}
                type="date"
                onChange={(val) => onChange(dayJsJakartaKeep(val))}
                hasDataMaster={findDataMaster('lastNotaryDeedDate')}

              />
            }
          />

          <Controller
            name="debtorIdentity.firstNotaryDeedDocument"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Upload First Notary Deed "
                placeholder="Upload First Notary Deed "
                type="file"
                downloadOnly={isViewOnly}
                showPreviewFile={!!field.value}
                hasDataMaster={findDataMaster('firstNotaryDeedDocument')}

                isMandatory
              />
            }
          />

          <Controller
            name="debtorIdentity.lastNotaryDeedDocument"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                // disabled={isViewOnly}
                label="Upload Last Notary Deed "
                placeholder="Upload Last Notary Deed "
                type="file"
                downloadOnly={isViewOnly}
                showPreviewFile={!!field.value}
                hasDataMaster={findDataMaster('lastNotaryDeedDocument')}

                isMandatory
              />
            }
          />
        </Box>
      </SectionTitle>

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          name="debtorIdentity.modifiedBy"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Modified By"
              placeholder="Modified By"
              type="text"
              disabled
            />
          }
        />

        <Controller
          name="debtorIdentity.modifiedDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value ? formatDateTime(field.value) : null}
              label="Last Modified"
              placeholder="Last Modified"
              type="text"
              disabled
            />
          }
        />
      </Box>


      <ActionFooterDetail
        handleSave={handleSave}
        isAutoSaveFetching={isAutoSaveFetching}
        viewOnly={isViewOnly}
        onChange={(value) => {
          if (value) {
            setIsSubmit(value);
            handleSave();
          }
        }}
      />
      <ModalDef
        id={modal.PLAFON_VALIDATION}
        component={ModalPlafonValidation}
      />
    </ColumnWrapper>
  );
};

export default DebtorIdentity;

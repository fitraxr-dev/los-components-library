import * as React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Divider, Grid } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL_ID } from '../../CommitteeMeeting.constant';

import useModalMember from './ModalMember.hook';


interface ModalMemberProps {
  id?: string | number;
  status?: 'add' | 'edit' | 'detail';
}

const ModalMember = NiceModal.create((props: ModalMemberProps) => {
  const modalId = MODAL_ID.MODAL_MEMBER;
  const modal = useModal(modalId);

  const currentStatus = props.status ?? 'add';
  const isEdit = currentStatus === 'edit';
  const isReadOnly = currentStatus === 'detail';
  const title = currentStatus === 'edit'
    ? 'Edit Anggota Rapat'
    : currentStatus === 'detail'
      ? 'Detail Anggota Rapat'
      : 'Add Anggota Rapat';

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      directorateId: '',
      divisionId: '',
      hasSku: false,
      isPresent: true,
      jobPositionLabel: '',
      skuMember: {
        directorateId: '',
        divisionId: '',
        jobPositionLabel: '',
        skuDate: '',
        skuNo: '',
        staffId: '',
      },
      staff: '',
    },
  });

  const hasSku = useWatch({ control, name: 'hasSku' });
  const isPresent = useWatch({ control, name: 'isPresent' });
  const jobPositionLabel = useWatch({ control, name: 'jobPositionLabel' });
  const skuJobPositionLabel = useWatch({ control, name: 'skuMember.jobPositionLabel' });

  const {
    getRoleCodeFromPosition,
    directorateOptions,
    divisionOptions,
    skuDivisionOptions,
    skuStaffOptions,
    staffOptions,
    selectedRole,
    handleSave,
    isAutoSaveFetching,
    isLoading,
    memberDetailData,
    setUserSearch,
    setSkuUserSearch,
    setDivSearch,
    setDirSearch,
    setSelectedRole,
  } = useModalMember({ control, id: props.id });

  const isKadiv = selectedRole === 'KADIV';
  const isBOD = selectedRole === 'BOD';

  React.useEffect(() => {
    if (!memberDetailData) return;

    const roleCode = getRoleCodeFromPosition(memberDetailData.position ?? '');

    setSelectedRole(roleCode);

    reset({
      directorateId: memberDetailData.directorateId ? String(memberDetailData.directorateId) : '',
      divisionId: memberDetailData.divisionId ? String(memberDetailData.divisionId) : '',
      hasSku: !!memberDetailData.skuMember,
      isPresent: memberDetailData.isPresent ?? true,
      jobPositionLabel: memberDetailData.position ?? '',
      skuMember: {
        directorateId: memberDetailData.skuMember?.directorateId ? String(memberDetailData.skuMember.directorateId) : '',
        divisionId: memberDetailData.skuMember?.divisionId ? String(memberDetailData.skuMember.divisionId) : '',
        jobPositionLabel: memberDetailData.skuMember?.jobPositionLabel ?? '',
        skuDate: memberDetailData.skuMember?.skuDate ?? '',
        skuNo: memberDetailData.skuMember?.skuNo ?? '',
        staffId: memberDetailData.skuMember?.staffId ? String(memberDetailData.skuMember.staffId) : '',
      },
      staff: memberDetailData.staff ? String(memberDetailData.staff) : '',
    });
  }, [memberDetailData, reset, setSelectedRole]);

  const handleResetDivisionAndStaff = () => {
    setValue('divisionId', '');
    setValue('staff', '');
    setValue('jobPositionLabel', '');
    setSelectedRole('');
  };

  const handleResetStaffField = () => {
    setValue('staff', '');
    setValue('jobPositionLabel', '');
    setSelectedRole('');
  };

  const handleResetSkuDivisionAndStaff = () => {
    setValue('skuMember.divisionId', '');
    setValue('skuMember.staffId', '');
    setValue('skuMember.jobPositionLabel', '');
  };

  const handleResetSkuStaff = () => {
    setValue('skuMember.staffId', '');
    setValue('skuMember.jobPositionLabel', '');
  };

  const setJobPositionFromDropdown = (value: string) => {
    const selectedStaff = (staffOptions as any[]).find((option) => String(option.value) === String(value));
    setValue('jobPositionLabel', selectedStaff?.jobTitle ?? '');
    setSelectedRole(selectedStaff?.roleCode ?? '');
  };

  const setSkuJobPositionFromDropdown = (value: string) => {
    const selectedStaff = (skuStaffOptions as any[]).find((option) => String(option.value) === String(value));
    setValue('skuMember.jobPositionLabel', selectedStaff?.jobTitle ?? '');
  };

  return (
    <SectionModal
      title={title}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{ gap: 3, minWidth: '52vw' }}
      customFooter={
        isReadOnly ? (
          <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
            >
              Close
            </Button>
          </RowWrapper>
        ) : (
          <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
            >
              Cancel
            </Button>
            <Button
              isLoading={isLoading || isSubmitting}
              onClick={handleSubmit(handleSave)}
              disabled={isLoading || isAutoSaveFetching}
            >
              {isEdit && isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
          </RowWrapper>
        )
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextStyle
            variant="body2"
            weight={600}
            color="primary.main"
          >
            Keanggotaan
          </TextStyle>
        </Grid>

        <Grid item xs={6}>
          <Controller
            control={control}
            name="directorateId"
            rules={{ required: 'Direktorat wajib dipilih' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                label="Direktorat"
                placeholder="Choose Direktorat"
                dropdownList={directorateOptions}
                isMandatory
                disabled={isReadOnly}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={directorateOptions.find((opt) => String(opt.id) === String(field.value)) || null}
                onInputChange={setDirSearch}
                onChange={(val) => {
                  field.onChange(val?.id || '');
                  handleResetDivisionAndStaff();
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="divisionId"
            rules={{ required: 'Divisi wajib dipilih' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                label="Divisi"
                placeholder="Choose Divisi"
                dropdownList={divisionOptions}
                isMandatory
                disabled={isReadOnly}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={divisionOptions.find((opt) => String(opt.id) === String(field.value)) || null}
                onInputChange={setDivSearch}
                onChange={(val) => {
                  field.onChange(val?.id || '');
                  handleResetStaffField();
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="staff"
            rules={{ required: 'Nama wajib dipilih' }}
            render={({ field, fieldState }) => {
              const options = (staffOptions as any[]) || [];
              return (
                <Autocomplete
                  {...field}
                  label="Nama"
                  placeholder="Choose Nama"
                  dropdownList={options}
                  isMandatory
                  disabled={isReadOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={options.find((opt) => String(opt.id) === String(field.value)) || null}
                  onInputChange={setUserSearch}
                  onChange={(val) => {
                    field.onChange(val?.id ? String(val.id) : '');
                    setJobPositionFromDropdown(val?.id ? String(val.id) : '');
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Jabatan"
            placeholder="Jabatan"
            type="text"
            disabled
            value={jobPositionLabel ?? ''}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="isPresent"
            render={({ field }) => (
              <Input
                label="Kehadiran"
                type="radio"
                radioList={[
                  { label: 'Hadir', value: 'true' },
                  { label: 'Tidak Hadir', value: 'false' },
                ]}
                {...field}
                value={field.value ? 'true' : 'false'}
                disabled={isReadOnly || isLoading}
                onChange={(event) => {
                  const isHadir = event?.target?.value === 'true';
                  field.onChange(isHadir);
                  if (isHadir) {
                    setValue('hasSku', false);
                  }
                }}
              />
            )}
          />
        </Grid>
      </Grid>


      {!isPresent && (isKadiv || isBOD) && (
        <>
          <Divider sx={{ borderColor: 'custom.gray10' }} />

          <ColumnWrapper gap={1}>
            <TextStyle
              variant="body2"
              weight={600}
              color="primary.main"
            >
              Apakah Terdapat SKU?
            </TextStyle>

            <Controller
              control={control}
              name="hasSku"
              render={({ field }) => (
                <Input
                  type="radio"
                  radioList={[
                    { label: 'Ya', value: 'true' },
                    { label: 'Tidak', value: 'false' },
                  ]}
                  {...field}
                  disabled={isReadOnly || isLoading}
                  value={field.value ? 'true' : 'false'}
                  onChange={(event) => {
                    const hasSkuValue = event.target.value === 'true';
                    field.onChange(hasSkuValue);

                    if (!hasSkuValue) {
                      setValue('skuMember', {
                        directorateId: '',
                        divisionId: '',
                        jobPositionLabel: '',
                        skuDate: '',
                        skuNo: '',
                        staffId: '',
                      });
                    }
                  }}
                />
              )}
            />
          </ColumnWrapper>
        </>
      )}

      {hasSku && !isPresent && (isKadiv || isBOD) && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextStyle
              variant="body2"
              weight={600}
              color="primary.main"
            >
              Detail SKU
            </TextStyle>
          </Grid>

          <Grid item xs={6}>
            <Controller
              control={control}
              name="skuMember.directorateId"
              rules={{ required: 'Direktorat wajib dipilih' }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Direktorat"
                  placeholder="Choose Direktorat"
                  dropdownList={directorateOptions}
                  {...field}
                  isMandatory
                  disabled={isReadOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={directorateOptions.find((opt) => String(opt.id) === String(field.value)) || null}
                  onInputChange={setDirSearch}
                  onChange={(val) => {
                    field.onChange(val?.id || '');
                    handleResetSkuDivisionAndStaff();
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="skuMember.divisionId"
              rules={{ required: 'Divisi wajib dipilih' }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Divisi"
                  placeholder="Choose Divisi"
                  dropdownList={skuDivisionOptions}
                  {...field}
                  isMandatory
                  disabled={isReadOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={skuDivisionOptions.find((opt) => String(opt.id) === String(field.value)) || null}
                  onInputChange={setDivSearch}
                  onChange={(val) => {
                    field.onChange(val?.id || '');
                    handleResetSkuStaff();
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="skuMember.staffId"
              rules={{ required: 'Nama wajib dipilih' }}
              render={({ field, fieldState }) => {
                const options = (skuStaffOptions as any[]) || [];
                return (
                  <Autocomplete
                    label="Nama"
                    placeholder="Choose Nama"
                    dropdownList={options}
                    {...field}
                    isMandatory
                    disabled={isReadOnly}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    value={options.find((opt) => String(opt.id) === String(field.value)) || null}
                    onInputChange={setSkuUserSearch}
                    onChange={(val) => {
                      field.onChange(val?.id ? String(val.id) : '');
                      setSkuJobPositionFromDropdown(val?.id ? String(val.id) : '');
                    }}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              label="Jabatan"
              placeholder="Jabatan"
              type="text"
              disabled
              value={skuJobPositionLabel ?? ''}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="skuMember.skuNo"
              control={control}
              rules={{ required: 'Nomor SKU wajib diisi' }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Nomor SKU"
                  placeholder="Input Nomor SKU"
                  type="text"
                  isMandatory
                  disabled={isReadOnly || isLoading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="skuMember.skuDate"
              control={control}
              rules={{ required: 'Tanggal SKU wajib dipilih' }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Tanggal SKU"
                  placeholder="Pilih Tanggal SKU"
                  type="date"
                  isMandatory
                  disabled={isReadOnly || isLoading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      )}
    </SectionModal>
  );
});

export default ModalMember;

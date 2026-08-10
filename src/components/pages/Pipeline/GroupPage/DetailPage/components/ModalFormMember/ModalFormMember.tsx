import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Checkbox from '@/components/shared/CheckBox';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useModalFormMember from './ModalFormMember.hook';

import type { ModalFormMemberProps } from './ModalFormMember.types';


const ModalFormMember = NiceModal.create(({
  debtorId,
  groupId,
  data,
  title = 'Edit Group Member',
  type = 'edit',
}: ModalFormMemberProps) => {
  const {
    sectorDropdownList,
    isSaveLoading,
    modalId,
    control,
    theme,
    visible,
    handleSubmit,
    onSubmitHandler,
    handleCloseModalWarning,
    initialFormValues,
    isFormDirty,
    setIsFormDirty,
  } = useModalFormMember({
    data,
    debtorId,
    groupId,
    type,
  });
  return (
    <SectionModal
      title={title}
      isOpen={visible}
      onClose={() => handleCloseModalWarning()}
      customFooter={() => null}
    >
      <Box
        sx={{
          display: 'grid',
          gap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Nama Customer"
              placeholder="Nama Customer"
              disabled
              containerSx={{ flex: 1 }}
              error={isTouched && invalid}
              helperText={isTouched && error ? error.message : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="sector"
          render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Sektor Industri"
              placeholder="Sektor Industri"
              disabled
              containerSx={{ flex: 1 }}
              type="dropdown"
              error={isTouched && invalid}
              helperText={isTouched && error ? error.message : ''}
              dropdownList={sectorDropdownList}
            />
          )}
        />

        <Controller
          control={control}
          name="cif"
          render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="CIF"
              placeholder="CIF"
              disabled
              containerSx={{ flex: 1 }}
              error={isTouched && invalid}
              helperText={isTouched && error ? error.message : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="gamName"
          render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="General account manager"
              placeholder="General account manager"
              disabled
              containerSx={{ flex: 1 }}
              error={isTouched && invalid}
              helperText={isTouched && error ? error.message : ''}
              dropdownList={[{ label: 'Batu Bara', value: 12 }]}
            />
          )}
        />
      </Box>
      <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mt: theme.spacing(2), padding: 2 }}>
        <TextStyle sx={{ color: '#284A63', fontSize: '0.9375vw', fontWeight: 500, mb: 2 }}>
          Dasar pengelompokan customer/client beserta anggotanya telah sesuai dengan ketentuan yang berlaku yaitu
          apabila customer/client mempunyai hubungan pengendalian dengan customer/client lain baik melalui hubungan
          kepemilikan, kepengurusan, dan/atau keuangan yang meliputi (dapat lebih dari satu):
          <span style={{ fontStyle: 'normal' }}>*</span>
        </TextStyle>

        <Box sx={{ color: '#284A63', display: 'flex', flexDirection: 'column', gap: 0, mt: 2 }}>
          {[
            { label: 'Customer merupakan pengendali customer lain.', name: 'isControllingOther' },
            { label: '1 (satu) pihak yang sama merupakan pengendali dari beberapa customer.', name: 'isControlledBySameParty' },
            { label: 'Customer memilki ketergantungan keuangan dengan customer lain.', name: 'hasFinancialDependency' },
            { label: 'Customer menerbitkan jaminan untuk mengambil alih dan/atau melunasi sebagian atau seluruh kewajiban customer lain jika customer lain tersebut gagal memenuhi kewajibannya (wanprestasi) kepada Perusahaan.', name: 'isGuarantorForOther' },
            { label: 'Dewan komisaris dan/atau direksi customer menjadi dewan komisaris dan/atau direksi pada customer lain.', name: 'hasSharedDirectors' }
          ].map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={type === 'detail'}
                  onChange={(e) => {
                    field.onChange(e);
                    const currentValues = {
                      hasFinancialDependency: !!control._formValues.hasFinancialDependency,
                      hasSharedDirectors: !!control._formValues.hasSharedDirectors,
                      isControlledBySameParty: !!control._formValues.isControlledBySameParty,
                      isControllingOther: !!control._formValues.isControllingOther,
                      isGuarantorForOther: !!control._formValues.isGuarantorForOther,
                    };

                    const hasChanges = Object.keys(currentValues).some(
                      (key) => currentValues[key] !== initialFormValues[key]
                    );

                    setIsFormDirty(hasChanges);
                  }}
                  label={item.label}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: '#284A63',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                    },
                  }}
                />
              )}
            />
          ))}
        </Box>
      </Box>

      <Controller
        control={control}
        name="remark"
        render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
          <Input
            {...field}
            inputRef={ref}
            label="Keterangan"
            placeholder="Keterangan"
            containerSx={{
              mt: theme.spacing(2),
            }}
            error={isTouched && invalid}
            helperText={isTouched && error ? error.message : ''}
            rows={4}
            type="area"
            disabled={type === 'detail'}
            onChange={(e) => {
              field.onChange(e);
              const currentValues = {
                hasFinancialDependency: !!control._formValues.hasFinancialDependency,
                hasSharedDirectors: !!control._formValues.hasSharedDirectors,
                isControlledBySameParty: !!control._formValues.isControlledBySameParty,
                isControllingOther: !!control._formValues.isControllingOther,
                isGuarantorForOther: !!control._formValues.isGuarantorForOther,
                remark: (e?.target?.value || field.value || '') || '',
              };

              const hasChanges = Object.keys(currentValues).some(
                (key) => currentValues[key] !== initialFormValues[key]
              );

              setIsFormDirty(hasChanges);
            }}
          />
        )}
      />
      <Box
        sx={{
          display: 'flex',
          gap: theme.spacing(2),
          justifyContent: 'flex-end',
          mt: theme.spacing(2),
        }}
      >
        <Button
          variant="outlined"
          onClick={
            () => closeNiceModal(modalId)
          }
        >
          {type === 'detail' ? 'Close' : 'Cancel'}
        </Button>
        {type !== 'detail' && (
          <Button
            onClick={handleSubmit((data) => onSubmitHandler(data))}
            isLoading={isSaveLoading}
            disabled={!isFormDirty}
          >
            Save
          </Button>
        )}
      </Box>

    </SectionModal>
  );
},
);

export default ModalFormMember;

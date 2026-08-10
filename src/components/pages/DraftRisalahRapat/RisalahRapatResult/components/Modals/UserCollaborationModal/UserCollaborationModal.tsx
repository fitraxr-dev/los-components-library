import React from 'react';

import { create } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL } from '../../../RisalahRapatResult.contants';

import useUserCollaborationModal from './UserCollaborationModal.hook';

import type { UserCollaborationModalProps } from './UserCollaborationModal.types';


const UserCollaborationModal = create(({ division }: UserCollaborationModalProps) => {

  const {
    handleSubmitCollaborator,
    modal,
    modalId,
    control,
    errors,
    directorDataName,
    watch,
    others,
    divisionData,
    setValue,
  } = useUserCollaborationModal(division);

  return (
    <SectionModal
      title="Add Penandatanganan"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        '-ms-overflow-style': 'none',
        gap: 2,
        minWidth: '25vw',
        'scrollbar-width': 'none',
      }}
    >
      <Controller
        control={control}
        name="user"
        render={({
          field: { ref, ...field },
        }) => (
          <Input
            {...field}
            label="Direktorat"
            placeholder="Input Direktorat"
            value={field.value?.division?.[0]?.directorate?.name}
            disabled
          />
        )}
      />
      {others ?
        <Controller
          control={control}
          name="division"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Autocomplete
              {...field}
              id="input-division"
              testId="input-division"
              isMandatory={others}
              label="Divisi"
              placeholder="Choose Divisi"
              value={watch('division')}
              dropdownList={divisionData}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        /> :
        <Controller
          control={control}
          name="user"
          render={({
            field: { ref, ...field },
          }) => (
            <Input
              {...field}
              label="Divisi"
              placeholder="Input Divisi"
              value={field.value?.division?.[0]?.name}
              disabled
            />
          )}
        />
      }
      <Controller
        control={control}
        name="user"
        render={({
          field: { ref, ...field },
          fieldState: { invalid, error },
        }) => (
          <Autocomplete
            {...field}
            id="input-name"
            isMandatory
            label="Nama"
            placeholder="Choose Nama"
            value={field.value?.fullName ? { id: field.value?.userId, label: field.value?.fullName } : null}
            dropdownList={directorDataName}
            disabled={others && !!!watch('division.id')}
            onInputChange={(val) => setValue('user.fullName', val)}
            error={invalid}
            helperText={error ? error.message : ''}
          />
        )}
      />
      <Controller
        control={control}
        name="user"
        render={({
          field: { ref, ...field },
        }) => (
          <Input
            label="Jabatan"
            placeholder="Input Jabatan"
            value={field.value?.roleRefactor?.name}
            disabled
          />
        )}
      />
      <RowWrapper sx={{ gap: 4, justifyContent: 'end', mt: 4 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(MODAL.USER_COLLABORATION)}>Cancel</Button>
        <Button color="primary" disabled={Object.keys(errors).length > 0} onClick={handleSubmitCollaborator}>Save</Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default UserCollaborationModal;

import * as React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller, useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalConsentSheetStore from '../ModalConsentSheet/ModalConsentSheet.store';


interface ModalConsentSheetSectionProps {
  sectionId?: string;
}

const ModalConsentSheetSection = NiceModal.create(({ sectionId }: ModalConsentSheetSectionProps) => {
  const modalId = MODAL.RISALAH_RAPAT.CONSENT_SHEET_SECTION;
  const { visible } = useModal(modalId);

  const { addSection, renameSection, section } = useModalConsentSheetStore(
    useShallow((state) => ({
      addSection: state.addSection,
      renameSection: state.renameSection,
      section: sectionId
        ? state.consentSheetSections.find((sec) => sec.localId === sectionId)
        : undefined,
    }))
  );

  const { control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      sectionName: '',
    },
  });

  React.useEffect(() => {
    if (section?.divisionName) {
      reset({ sectionName: section.divisionName });
    } else {
      reset({ sectionName: '' });
    }
  }, [reset, section?.divisionName]);

  const isEditMode = Boolean(sectionId);

  const onSubmit = React.useCallback(({ sectionName }) => {
    try {
      if (isEditMode && sectionId) {
        renameSection(sectionId, sectionName);
      } else {
        addSection({
          divisionName: sectionName,
          listUser: [],
        });
      }

      closeNiceModal(modalId);
      showNiceModalV2({
        title: isEditMode ? 'Berhasil mengubah nama section.' : 'Berhasil menambahkan section baru.',
        type: 'success',
      });
      reset();
    } catch {
      showNiceModalV2({
        title: isEditMode ? 'Gagal mengubah nama section.' : 'Gagal menambahkan section baru.',
        type: 'error',
      });
    }
  }, [addSection, isEditMode, modalId, renameSection, reset, sectionId]);

  return (
    <SectionModal
      title={isEditMode ? 'Edit Section' : 'Add New Section'}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        gap: 3,
        minWidth: '40vw',
      }}
      customFooter={
        <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </RowWrapper>
      }
    >
      <Controller
        control={control}
        name="sectionName"
        rules={{ required: 'Nama Section is required' }}
        render={({ field, fieldState: { error } }) => (
          <Input
            label="Nama Section"
            placeholder="Enter Section Name"
            type="text"
            {...field}
            isMandatory
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </SectionModal>
  );
});

export default ModalConsentSheetSection;

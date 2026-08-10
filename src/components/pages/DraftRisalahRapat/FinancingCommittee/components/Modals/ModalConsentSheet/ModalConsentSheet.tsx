import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import SortableSection from '@/components/shared/SortableSection';

import TableConsentSheetUser from '../../Tables/TableConsentSheetUser';

import useModalConsentSheet from './ModalConsentSheet.hook';


const ModalConsentSheet = NiceModal.create(() => {
  const { viewOnly } = useViewOnly();

  const modalId = MODAL.RISALAH_RAPAT.CONSENT_SHEET_LIST;
  const { visible } = NiceModal.useModal(modalId);

  const {
    consentSheetIds,
    consentSheetSections,
    handleAddNewSection,
    handleDeleteSection,
    handleEditSection,
    handleOnDragEnd,
    handleSave,
    isAutoSaveFetching,
    isLoading,
  } = useModalConsentSheet();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  return (
    <SectionModal
      title="Lembar Persetujuan"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        gap: 3,
        minWidth: '75vw',
      }}
      customFooter={
        <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId) }
          >
            Close
          </Button>
          {!viewOnly && (
            <Button
              disabled={isLoading || viewOnly || isAutoSaveFetching}
              onClick={handleSave}
              isLoading={isLoading}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
          )}
        </RowWrapper>
      }
    >
      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={viewOnly ? undefined : handleOnDragEnd}
      >
        <SortableContext
          items={consentSheetIds}
          disabled={viewOnly}
          strategy={verticalListSortingStrategy}
        >
          {consentSheetSections?.map((section) => (
            <SortableSection
              key={section.localId}
              id={section.localId}
              disabled={viewOnly}
              title={section.divisionName}
              rightComponent={
                (!viewOnly && section.isEditable) && (
                  <RowWrapper gap={1} alignItems="center">
                    <IconButton
                      iconName="edit"
                      onClick={() => handleEditSection(section.localId)}
                    />
                    <IconButton
                      iconName="delete"
                      onClick={() => handleDeleteSection(section.localId)}
                    />
                  </RowWrapper>
                )
              }
            >
              <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
                <TableConsentSheetUser
                  sectionId={section.localId}
                  tableData={section?.listUser ?? []}
                  isLoading={isLoading}
                />
              </BaseContainer>
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>

      {!viewOnly && (
        <RowWrapper justifyContent="end">
          <Button
            variant="outlined"
            startIcon="add-2"
            startIconSx={{ fontSize: '1.25vw' }}
            onClick={handleAddNewSection}
            isLoading={isLoading}
          >
            Add New Section
          </Button>
        </RowWrapper>
      )}
    </SectionModal>
  );
});

export default ModalConsentSheet;

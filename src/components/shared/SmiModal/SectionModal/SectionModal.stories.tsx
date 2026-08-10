import NiceModal, { ModalDef, useModal, Provider } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';

import SectionModal from './SectionModal';


export default {
  decorators: [
    (Story) => {
      const SectionModalComponent = NiceModal.create(
        () => {
          const modalId = 'SECTION_MODAL';
          const modal = useModal(modalId);

          return (
            <SectionModal
              title="Section Modal"
              isOpen={modal.visible}
              onClose={() => closeNiceModal(modalId)}
            >
              <div>Modal Content here</div>
            </SectionModal>
          );
        }
      );

      return (
        <Provider>
          <ModalDef
            id="SECTION_MODAL"
            component={SectionModalComponent}
          />
          <Story />
        </Provider>);
    }
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Shared/SmiModal/SectionModal',
};

export const Template = () => {
  const openModalHandler = () => {
    NiceModal.show('SECTION_MODAL'); // get information section modal from modalid.ts
  };

  return (
    <Button onClick={openModalHandler}>Open Modal</Button>
  );
};

import NiceModal, { ModalDef, Provider } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';

import ConfirmModal from './WarningModal';


export default {
  component: ConfirmModal,
  decorators: [
    (Story) => {
      return (
        <Provider>
          <ModalDef
            id="CONFIRM"
            component={ConfirmModal}
          />
          <Story />
        </Provider>);
    }
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Shared/Modal/ConfirmModal',
};


export const Template = () => {
  const openModalHandler = () => {
    NiceModal.show('CONFIRM', {
      onSubmit: () => {
        console.log('submit');
      },
      title: 'Apakah anda yakin ingin menghapus management ini?',
    });
  };

  return <Button onClick={openModalHandler}>Open Modal</Button>;
};

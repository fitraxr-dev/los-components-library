import NiceModal, { ModalDef, Provider } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';

import ErrorModal from './ErrorModal';


export default {
  component: ErrorModal,
  decorators: [
    (Story) => {
      return (
        <Provider>
          <ModalDef
            id="ERROR"
            component={ErrorModal}
          />
          <Story />
        </Provider>);
    }
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Shared/Modal/ErrorModal',
};


export const Template = () => {
  const openModalHandler = () => {
    NiceModal.show('ERROR', {
      title: 'Gagal Menyimpan Perubahan',
    });
  };

  return <Button onClick={openModalHandler}>Open Modal</Button>;
};

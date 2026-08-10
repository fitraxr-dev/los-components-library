import NiceModal, { ModalDef, Provider } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';

import SuccessModal from './SuccessModal';


export default {
  component: SuccessModal,
  decorators: [
    (Story) => {
      return (
        <Provider>
          <ModalDef
            id="SUCCESS"
            component={SuccessModal}
          />
          <Story />
        </Provider>);
    }
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Shared/Modal/SuccessModal',
};


export const Template = () => {
  const openModalHandler = () => {
    NiceModal.show('SUCCESS', {
      title: 'Data Berhasil Disimpan',
    });
  };

  return <Button onClick={openModalHandler}>Open Modal</Button>;
};

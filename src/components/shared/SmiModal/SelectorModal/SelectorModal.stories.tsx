import NiceModal, { ModalDef, Provider } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';

import SelectorModal from './SelectorModal';


export default {
  component: SelectorModal,
  decorators: [
    (Story) => {
      return (
        <Provider>
          <ModalDef
            id="SELECTOR"
            component={SelectorModal}
          />
          <Story />
        </Provider>);
    }
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Shared/Modal/SelectorModal',
};


export const Template = () => {
  const openModalHandler = () => {
    NiceModal.show('SELECTOR', {
      data: [
        {
          description: 'Adimitra Energi Hidro',
          key: 'hidro',
          label: 'Adimitra Energi Hidro',
        },
        {
          description: 'Adimitra Energi',
          key: 'non-hidro',
          label: 'Adimitra Energi',
        },
      ],
      onSubmit: (val: any) => {
        console.log(val);
      },
      title: 'Tambah Fasilitas Pembiayaan',
    });
  };

  return <Button onClick={openModalHandler}>Open Modal</Button>;
};

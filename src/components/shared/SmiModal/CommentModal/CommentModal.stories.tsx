import { useState } from 'react';

import NiceModal, { ModalDef, Provider } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';

import ModalComment from './ModalComment';


export default {
  component: ModalComment,
  decorators: [
    (Story) => {
      return (
        <Provider>
          <ModalDef
            id="COMMENT"
            component={ModalComment}
          />
          <Story />
        </Provider>);
    }
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Shared/Modal/ModalComment',
};


export const Template = () => {
  const [value, setValue] = useState('');
  const openModalHandler = () => {
    NiceModal.show('COMMENT', {
      onChange: setValue,
      onSubmit: () => {
        console.log('submit');
      },
      value: value,
    });
  };

  console.log(value);

  return <Button onClick={openModalHandler}>Open Modal</Button>;
};

export const ViewOnly = () => {
  const openModalHandler = () => {
    NiceModal.show('COMMENT', {
      initialComment: 'ini comment',
      onSubmit: () => {
        console.log('submit');
      },
      viewOnly: true,
    });
  };

  return <Button onClick={openModalHandler}>Open Modal</Button>;
};

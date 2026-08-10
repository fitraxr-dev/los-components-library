// Alert Component
// --------------------------------------------------------

import React from 'react';

import { Toaster } from 'react-hot-toast';

import { showToast } from '@/helpers/toast';

import Button from '@/components/shared/Button';

import Toast from './index';


export default {
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Toast',
};


const Template = ({ severity }) => {
  const notify = () => showToast(severity);

  return (
    <>
      <Button onClick={notify}>Notify !</Button>

      {/* Make sure that you have import toaster in root component */}
      <Toaster />
    </>
  );
};

export const Default = Template.bind({});

Default.args = {
  severity: 'success',
};

Default.argTypes = {
  severity: {
    control: { type: 'radio' },
    options: ['success', 'error', 'warning'],
  },
};

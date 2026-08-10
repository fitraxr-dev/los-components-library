// FormItem Component
// --------------------------------------------------------
import React from 'react';

import Cell from './index';


export default {
  component: Cell,
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Cell',
};


export const Default = {
  args: {
    sx: { marginBottom: '8px' },
    title: 'Nama Customer',
    value: 'Shandra Augustin Doe',
  },
};

export const WithButtonText = {
  args: {
    buttons: [
      {
        action: () => {},
        iconName: 'image',
        label: 'Button1',
      },
    ],
    sx: { marginBottom: '8px' },
    title: 'Nama Customer',
    value: 'Shandra Augustin Doe',
  },
};

export const WithTwoButtonText = {
  args: {
    buttons: [
      {
        action: () => {},
        iconName: 'image',
        label: 'Button1',
      },
      {
        action: () => {},
        iconName: 'image',
        label: 'Button2',
      },
    ],
    sx: { marginBottom: '8px' },
    title: 'Nama Customer',
    value: 'Shandra Augustin',
  },
};

export const WithButtonIcon = {
  args: {
    buttons: [
      {
        action: () => {},
        iconName: 'image',
      },
    ],
    sx: { marginBottom: '8px' },
    title: 'Nama Customer',
    value: 'Shandra Augustin Doe',
  },
};

export const WithTwoButtonIcon = {
  args: {
    buttons: [
      {
        action: () => {},
        iconName: 'image',
      },
      {
        action: () => {},
        iconName: 'image',
      },
    ],
    sx: { marginBottom: '8px' },
    title: 'Nama Customer',
    value: 'Shandra Augustin Doe',
  },
};

export const WithMixedButton = {
  args: {
    buttons: [
      {
        action: () => {},
        iconName: 'image',
      },
      {
        action: () => {},
        iconName: 'image',
        label: 'Button2',
      },
    ],
    sx: { marginBottom: '8px' },
    title: 'Nama Customer',
    value: 'Shandra Augustin Doe',
  },
};

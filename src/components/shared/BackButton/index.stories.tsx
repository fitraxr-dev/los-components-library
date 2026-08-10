import React from 'react';

import BackButton from './index';


export default {
  component: BackButton,
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/BackButton',
};


export const Default = {};

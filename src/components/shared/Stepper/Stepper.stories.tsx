// Stepper Component
// --------------------------------------------------------
import React, { useState } from 'react';

import Stepper from './index';


export default {
  component: Stepper,
  decorators: [
    (Story) => (
      <div
        style={{ backgroundColor: 'white', padding: '10px', width: '600px' }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Stepper',
};

const STEPS = [
  {
    label: 'Informasi Customer',
    url: '/informasi-debitur',
  },
  {
    label: 'Fasilitas Pembiayaan',
    url: '/fasilitas-pembiayaan',
  },
  {
    label: 'Fasilitas Bank Lain',
    url: '/fasilitas-bank-lain',
  },
  {
    label: 'Persetujuan Khusus',
    url: '/persetujuan-khusus',
  },
  {
    label: 'View All Documents',
    url: '/view-all-docs',
  },
  {
    label: 'Validasi',
    url: '/validasi',
  },
];

const Template = () => {
  const [activeUrl, setActiveUrl] = useState('/informasi-debitur');

  return (
    <>
      <Stepper
        activeUrl={activeUrl}
        steps={STEPS}
        onClick={(url) => {
          setActiveUrl(url);
        }}
        percentage={50}
      />
      <pre style={{ marginTop: 10 }}>{`Active URL: ${activeUrl}`}</pre>
    </>
  );
};

export const Default = Template.bind({});

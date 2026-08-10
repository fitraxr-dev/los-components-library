import React, { useState } from 'react';

import { Paper } from '@mui/material';

import InputSelect from './index';


export default {
  component: InputSelect,
  decorators: [
    (Story) => (
      <Paper sx={{ boxShadow: 10, padding: 5, width: 800 }}>
        <Story />
      </Paper>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Input/components/InputSelect',
};

const Template = ({ ...rest }) => {
  const [val, setVal] = useState(null);
  return (
    <>
      <InputSelect
        {...rest}
        onChange={(val) => {
          setVal(val);
        }}
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ val }, null, 2)}</pre>
    </>
  );
};


export const Default = Template.bind({});
Default.args = {
  data: [
    {
      label: 'Create Date',
      value: 'createdDate',
    },
    {
      label: 'Status',
      value: 'status',
    },
  ],
};

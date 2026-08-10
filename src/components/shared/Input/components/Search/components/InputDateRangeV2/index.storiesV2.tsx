import React, { useState } from 'react';

import { Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import InputDateRangeV2 from './index';


export default {
  component: InputDateRangeV2,
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper sx={{ boxShadow: 10, padding: 5, width: 800 }}>
          <Story />
        </Paper>
      </LocalizationProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Input/components/InputDateRange',
};
const TemplateV2 = ({ ...rest }) => {
  const [val, setVal] = useState(null);
  return (
    <>
      <InputDateRangeV2
        {...rest}
        onChange={(val) => {
          setVal(val);
        }}
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ val }, null, 2)}</pre>
    </>
  );
};


export const Default = TemplateV2.bind({});

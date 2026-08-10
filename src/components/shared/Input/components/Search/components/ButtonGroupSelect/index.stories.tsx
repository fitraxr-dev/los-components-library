import React from 'react';

import { Paper } from '@mui/material';

import ButtonGroupSelect from './index';


export default {
  component: ButtonGroupSelect,
  decorators: [
    (Story) => (
      <Paper sx={{ boxShadow: 10, padding: 5, width: 350 }}>
        <Story />
      </Paper>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Input/components/ButtonGroupSelect',
};


const Template = ({ ...rest }) => {
  const [value, setValue] = React.useState([]);
  return (
    <>
      <ButtonGroupSelect
        {...rest}
        value={value}
        onChange={(val) => setValue(val)}
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ value }, null, 2)}</pre>
    </>
  );
};
export const Default = Template.bind({});

Default.args = {
  data: [
    {
      label: 'Bappenas',
      value: 'BAPPENAS',
    },
    {
      label: 'Walking in Customer',
      value: 'WALKING_IN_CUSTOMER',
    },
  ],
  label: 'Status',
};

export const MultipleSelect = Template.bind({});

MultipleSelect.args = {
  data: [
    {
      label: 'Bappenas',
      value: 'BAPPENAS',
    },
    {
      label: 'Walking in Customer',
      value: 'WALKING_IN_CUSTOMER',
    },
    {
      label: 'Reference',
      value: 'REFERENCE',
    },
    {
      label: 'Penugasan Khusus',
      value: 'PENUGASAN_KHUSUS',
    },
    {
      label: 'Eprocurement',
      value: 'EPROCUREMENT',
    },
  ],
  label: 'Datasource',
  multiple: true,
};

import React, { useState } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { addDays, substractDays, toCurrentDate } from '@/helpers/date';

import Input from './index';


export default {
  argTypes: {
    value: {
      control: {
        disable: true,
      },
    },
  },
  component: Input,
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <div style={{ width: '800px' }}>
          <Story />
        </div>
      </LocalizationProvider>
    ),
  ],
  tags: ['autodocs'],
  title: 'components/shared/Input',
};

const Template = ({ ...rest }) => {
  const [val, setVal] = useState(null);

  return (
    <>
      <Input
        {...rest}
        onChange={(val) => {
          setVal(val);
        }}
        value={val}
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ val }, null, 2)}</pre>
    </>
  );
};

const DownloadableFileTemplate = ({ ...rest }) => {
  const val = {
    extension: 'jpeg',
    name: 'Downloadable',
    url: 'https://www.myinfosys.net/image/istlogo.png',
  };

  return (
    <>
      <Input {...rest} value={val} />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ val }, null, 2)}</pre>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Default Label',
  placeholder: 'This is a default input',
};

export const Mandatory = Template.bind({});
Mandatory.args = {
  isMandatory: true,
  label: 'Mandatory Input',
  placeholder: 'This is a mandatory input',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  label: 'Disabled Input',
  placeholder: 'This is a disabled input',
};

export const TextArea = Template.bind({});
TextArea.args = {
  label: 'Text Area',
  placeholder: 'Lorem ipsum bla bla bla',
  type: 'area',
};

export const Number = Template.bind({});
Number.args = {
  label: 'Number Input',
  placeholder: 'Only number...',
  type: 'number',
};

export const Checkbox = Template.bind({});
Checkbox.args = {
  checkboxList: [
    {
      label: 'a',
      value: 'A',
    },
    {
      label: 'b',
      value: 'B',
    },
    {
      label: 'c',
      value: 'C',
    }
  ],
  label: 'Checkbox',
  type: 'checkbox',
};

export const Currency = Template.bind({});
Currency.args = {
  label: 'Currency Input',
  maxLength: 9,
  placeholder: '1,000,000,000',
  type: 'currency',
};

export const Error = Template.bind({});
Error.args = {
  error: true,
  helperText: 'Something went wrong',
  label: 'Error Input',
  placeholder: 'This how an error would look like',
};

export const Dropdown = Template.bind({});
Dropdown.args = {
  dropdownList: [
    {
      label: 'Label 0',
      value: 0,
    },
    {
      label: 'Label 1',
      value: 1,
    },
    {
      label: 'Label 2',
      value: 2,
    },
    {
      label: 'Label 3',
      value: 3,
    },
    {
      label: 'Label 4 ',
      value: 4,
    },
  ],
  label: 'Dropdown',
  placeholder: 'Please select something',
  type: 'dropdown',
};

export const Date = Template.bind({});
Date.args = {
  label: 'Date Input',
  type: 'date',
};

export const MinDate = Template.bind({});
MinDate.args = {
  label: 'Min Date Input',
  minDate: substractDays(toCurrentDate(), 7),
  type: 'date',
};

export const MaxDate = Template.bind({});
MaxDate.args = {
  label: 'Max Date Input',
  maxDate: addDays(toCurrentDate(), 7),
  type: 'date',
};

export const FileOutlined = Template.bind({});
FileOutlined.args = {
  label: 'Upload File',
  type: 'file',
};

export const DownloadableFileOutlined = DownloadableFileTemplate.bind({});
DownloadableFileOutlined.args = {
  label: 'Upload File',
  type: 'file',

};

export const File = Template.bind({});
File.args = {
  label: 'Upload File',
  noBorder: true,
  type: 'file',
};

export const DownloadableFile = DownloadableFileTemplate.bind({});
DownloadableFile.args = {
  label: 'Upload File',
  noBorder: true,
  type: 'file',
};

export const Radio = Template.bind({});
Radio.args = {
  label: 'Radio Input',
  radioList: [
    {
      label: 'Label 0',
      value: 0,
    },
    {
      label: 'Label 1',
      value: 1,
    },
    {
      label: 'Label 2',
      value: 2,
    },
  ],
  type: 'radio',
};

export const TimePicker = Template.bind({});
TimePicker.args = {
  label: 'Time Picker',
  type: 'time',
};

import { useState } from 'react';

import Currency from './Dropdown';


export default {
  argTypes: {
    value: {
      control: {
        disable: true,
      },
    },
  },
  component: Currency,
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  title: 'components/shared/Currency',
};

const Template = ({ ...rest }) => {
  const [val, setVal] = useState(null);

  return (
    <>
      <Currency
        {...rest}
        containerSx={{ flex: 1 }}
        onChange={(val) => {
          setVal(val);
        }}
        value={val}
      />
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ val }, null, 2)}</pre>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Currency Input',
  maxLength: 9,
  placeholder: '1,000,000,000',
};

export const Mandatory = Template.bind({});
Mandatory.args = {
  isMandatory: true,
  label: 'Currency Input',
  maxLength: 9,
  placeholder: '1,000,000,000',
};

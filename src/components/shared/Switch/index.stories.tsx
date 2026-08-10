// Switch Component
// --------------------------------------------------------
import { useState } from 'react';

import Switch from './index';


export default {
  component: Switch,
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Switch',
};

const Template = ({ ...rest }) => {
  const [val, setVal] = useState(false);

  return (
    <Switch
      {...rest}
      checked={val}
      label={val.toString()}
      onChange={(e) => setVal(e.target.checked)}
    />
  );
};

export const Default = Template.bind({});

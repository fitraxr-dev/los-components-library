import { Fragment, useState } from 'react';

import TextStyle from '@/components/shared/TextStyle';

import Tabs, { TabItem } from './index';


export default {
  component: Tabs,
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
  title: 'components/shared/Tabs',
};

const Template = ({ ...rest }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Tabs
        {...rest}
        activeTab={activeTab}
        onChange={(val) => {
          setActiveTab(val);
        }}
      />
      <TabItem activeValue={activeTab} value={0}>
        <TextStyle>Content Tab 1</TextStyle>
      </TabItem>
      <TabItem activeValue={activeTab} value={1}>
        <TextStyle>Content Tab 2</TextStyle>
      </TabItem>
      <TabItem activeValue={activeTab} value={2}>
        <TextStyle>Content Tab 3</TextStyle>
      </TabItem>
      <pre style={{ marginTop: 10 }}>{JSON.stringify({ activeTab: activeTab }, null, 2)}</pre>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      label: 'Tab 1',
    },
    {
      label: 'Tab 2',
    },
    {
      label: 'Tab 3',
    }
  ],
};

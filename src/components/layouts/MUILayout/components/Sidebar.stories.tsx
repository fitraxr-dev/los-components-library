import { AppProvider } from '@/components/layouts/AppLayout/App.context';

import Sidebar from './Sidebar';
import { ALL_MENU } from './Sidebar.constants';


export default {
  component: Sidebar,
  decorators: [
    (Story) => (
      <AppProvider>
        <div style={{ width: '350px' }}>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Sidebar',
};

const Template = () => {
  return (
    <>
      <Sidebar sidebarMenu={ALL_MENU} />
    </>
  );
};


export const Default = Template.bind({});

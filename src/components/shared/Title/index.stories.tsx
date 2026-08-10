import Title from './index';


export default {
  component: Title,
  decorators: [
    (Story) => (
      <div style={{ borderStyle: 'dotted', width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Title',
};


export const Default = {
  args: {
    title: 'Legal Checking List',
  },
};

export const WithButtons = {
  args: {
    buttons: [
      {
        iconName: 'plus',
        label: 'Add New Manajemen & Shareholder',
      },
      {
        iconName: 'plus',
        label: 'Add New Proyek',
      },
    ],
    title: 'Create New Nasabah',
  },
};

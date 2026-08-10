import Icon from './index';


export default {
  component: Icon,
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: 'grey', width: '100px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Icon',
};


export const Default = {
  args: {
    iconName: 'home',
  },
};

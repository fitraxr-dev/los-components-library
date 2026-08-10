import IconTooltip from './IconTooltip';


export default {
  component: IconTooltip,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ backgroundColor: 'grey', width: '100px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/IconTooltip',
};


export const Default = {
  args: {
    iconName: 'home',
  },
};

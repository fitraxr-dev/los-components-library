import Empty from '.';


export default {
  component: Empty,
  decorators: [
    (Story) => (
      <Story />
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/EmptyPlaceholder',
};

export const Default = {
  args: {
    status: 'reminder',
  },
};

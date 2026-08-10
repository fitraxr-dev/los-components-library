import TextStyle from './index';


export default {
  component: TextStyle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/TextStyle',
};


export const Default = {
  args: {
    children: 'Lorem ipsum',
  },
};

export const Light = {
  args: {
    children: 'Light',
    weight: 300,
  },
};

export const Regular = {
  args: {
    children: 'Regular',
    weight: 400,
  },
};

export const Medium = {
  args: {
    children: 'Medium',
    weight: 500,
  },
};

export const SemiBold = {
  args: {
    children: 'SemiBold',
    weight: 600,
  },
};

export const Bold = {
  args: {
    children: 'Bold',
    weight: 700,
  },
};

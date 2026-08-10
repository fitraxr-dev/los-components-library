import Button from './index';


export default {
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'warning', 'info', 'success', 'error'],
    },
  },
  component: Button,
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
  title: 'components/shared/Button',
};


export const Default = {
  args: {
    children: 'Lorem ipsum',
  },
};

// Contained
export const ContainedPrimary = {
  args: {
    children: 'Lorem ipsum',
    color: 'primary',
    variant: 'contained',
  },
};

export const ContainedSecondary = {
  args: {
    children: ' Lorem ipsum',
    color: 'secondary',
    variant: 'contained',
  },
};

export const ContainedWarning = {
  args: {
    children: 'Lorem ipsum',
    color: 'warning',
    variant: 'contained',
  },
};

export const ContainedInfo = {
  args: {
    children: 'Lorem ipsum',
    color: 'info',
    variant: 'contained',
  },
};

export const ContainedSuccess = {
  args: {
    children: 'Lorem ipsum',
    color: 'success',
    variant: 'contained',
  },
};

export const ContainedError = {
  args: {
    children: 'Lorem ipsum',
    color: 'error',
    variant: 'contained',
  },
};

export const ContainedDisabled = {
  args: {
    children: 'Lorem ipsum',
    disabled: true,
    variant: 'contained',
  },
};

// Outlined
export const OutlinedPrimary = {
  args: {
    children: 'Lorem ipsum',
    color: 'primary',
    variant: 'outlined',
  },
};

export const OutlinedSecondary = {
  args: {
    children: 'Lorem ipsum',
    color: 'secondary',
    variant: 'outlined',
  },
};

export const OutlinedWarning = {
  args: {
    children: 'Lorem ipsum',
    color: 'warning',
    variant: 'outlined',
  },
};

export const OutlinedInfo = {
  args: {
    children: 'Lorem ipsum',
    color: 'info',
    variant: 'outlined',
  },
};

export const OutlinedSuccess = {
  args: {
    children: 'Lorem ipsum',
    color: 'success',
    variant: 'outlined',
  },
};

export const OutlinedError = {
  args: {
    children: 'Lorem ipsum',
    color: 'error',
    variant: 'outlined',
  },
};

export const OutlinedDisabled = {
  args: {
    children: 'Lorem ipsum',
    disabled: true,
    variant: 'outlined',
  },
};

// Text
export const TextPrimary = {
  args: {
    children: 'Lorem ipsum',
    color: 'primary',
    variant: 'text',
  },
};

export const TextSecondary = {
  args: {
    children: 'Lorem ipsum',
    color: 'secondary',
    variant: 'text',
  },
};

export const TextWarning = {
  args: {
    children: 'Lorem ipsum',
    color: 'warning',
    variant: 'text',
  },
};

export const TextInfo = {
  args: {
    children: 'Lorem ipsum',
    color: 'info',
    variant: 'text',
  },
};

export const TextSuccess = {
  args: {
    children: 'Lorem ipsum',
    color: 'success',
    variant: 'text',
  },
};

export const TextError = {
  args: {
    children: 'Lorem ipsum',
    color: 'error',
    variant: 'text',
  },
};

export const TextDisabled = {
  args: {
    children: 'Lorem ipsum',
    disabled: true,
    variant: 'text',
  },
};

export const WithIcon = {
  args: {
    children: 'Lorem ipsum',
    startIcon: 'plus',
    variant: 'contained',
  },
};

// Unclickable
export const Unclickable = {
  args: {
    children: 'Lorem ipsum',
    color: 'primary',
    noClick: true,
    variant: 'contained',
  },
};

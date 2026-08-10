'use client';

import { Box, Button, useTheme } from '@mui/material';

import TextStyle from '@/components/shared/TextStyle';


interface StatusToggleProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ label: string; value: string }>;
  disabled?: boolean;
  placeholder?: string;
}

const defaultOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Non Active', value: 'nonactive' },
];

const StatusToggle = ({
  value = '',
  onChange,
  options = defaultOptions,
  disabled = false,
  placeholder,
}: StatusToggleProps) => {
  const theme = useTheme();

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 1,
        display: 'flex',
        gap: 0,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => !disabled && handleChange(option.value)}
          disabled={disabled}
          sx={{
            '&:disabled': {
              cursor: 'not-allowed',
              opacity: 0.5,
            },
            '&:hover': {
              backgroundColor: value === option.value ? theme.palette.primary.dark : theme.palette.action.hover,
            },
            '&:not(:last-child)': {
              borderRight: `1px solid ${theme.palette.primary.main}`,
            },
            backgroundColor: value === option.value ? theme.palette.primary.main : 'transparent',
            border: 'none',
            borderRadius: 0,
            color: value === option.value ? theme.palette.primary.contrastText : theme.palette.text.primary,
            flex: 1,
            minWidth: 'auto',
            padding: {
              md: '10px 16px',
              sm: '6px 8px',
              xs: '6px 8px',
            },
            textTransform: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <TextStyle
            variant="body3"
            weight={500}
            sx={{
              fontSize: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {option.label}
          </TextStyle>
        </Button>
      ))}
    </Box>
  );
};

export default StatusToggle;

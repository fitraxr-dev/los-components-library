import { useState, useEffect } from 'react';

import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';


type RadioButtonNotificationProps = {
  label: string;
  value?: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  initialValue?: boolean; // default value awal
};

export const RadioButtonNotification = ({
  label,
  value,
  onChange,
  disabled,
  initialValue = false,
}: RadioButtonNotificationProps) => {
  const [selected, setSelected] = useState<boolean | null>(value ?? initialValue);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelected(value);
    }
  }, [value]);

  const handleChange = (_: any, newValue: boolean | null) => {
    if (newValue !== null) {
      setSelected(newValue);
      onChange(newValue);
    }
  };

  return (
    <Box>
      {label && (
        <Typography
          variant="subtitle2"
          sx={{
            color: disabled ? 'text.disabled' : 'inherit',
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}
      <ToggleButtonGroup
        value={selected}
        exclusive
        disabled={disabled}
        onChange={handleChange}
        sx={{
          '& .MuiToggleButton-root': {

            '&.Mui-selected': {
              '&:hover': {
                backgroundColor: disabled ? '#bdbdbd' : '#1f384c',
              },
              backgroundColor: disabled ? '#bdbdbd' : '#284A63',
              // abu jika disabled
              color: '#fff',
            },

            '&:hover': {
              backgroundColor: disabled ? 'transparent' : '#e6eef3',
            },
            // diperlebar sedikit
            border: '1px solid #284A63',
            borderRadius: '4px',
            color: 'black',
            fontWeight: 500,
            minWidth: 100,
            padding: '6px 12px',

            textTransform: 'none',
            // default tombol tidak dipilih hitam
            transition: 'all 0.2s ease',
          },
        }}
      >
        <ToggleButton value={true}>
          <Typography variant="subtitle2">Ya</Typography>
        </ToggleButton>
        <ToggleButton value={false}>
          <Typography variant="subtitle2">Tidak</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

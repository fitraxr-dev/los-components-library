import { useState, useEffect } from 'react';

import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { blue, green } from '@mui/material/colors';

import ColumnWrapper from '@/components/shared/ColumnWrapper';


type RadioButtonReminderProps = {
  label: string;
  value?: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  initialValue?: boolean; // default value awal
};

export const RadioButtonReminder = ({
  label,
  value,
  onChange,
  disabled,
  initialValue = false,
}: RadioButtonReminderProps) => {
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
    <ColumnWrapper
      sx={{
        backgroundColor: '#ffcccc',
        // maxWidth: '18.75rem',
        // // 300px / 16 = 18.75rem
        // minWidth: '18.75rem',
        // // Gunakan rem untuk ukuran yang konsisten terhadap zoom
        // width: '18.75rem',
      }}
    >
      {label && (
        <Typography
          sx={{
            color: disabled ? 'text.disabled' : 'inherit',
            fontSize: '0.875rem', // 14px converted to rem
            lineHeight: '1.25rem', // 20px converted to rem
            mb: '0.5rem', // 8px converted to rem
            transform: 'scale(1)',
            transformOrigin: 'left center',
            whiteSpace: 'nowrap',
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
              color: '#fff',
            },
            '&:hover': {
              backgroundColor: disabled ? 'transparent' : '#e6eef3',
            },
            borderRadius: '0.25rem', // 4px converted to rem
            color: 'black',
            fontSize: '0.8125rem', // 13px converted to rem
            fontWeight: 500,
            height: '1.875rem', // 30px converted to rem
            maxHeight: '1.875rem',
            // 100px converted to rem
            maxWidth: '9.375rem',
            minHeight: '1.875rem',
            // 150px converted to rem
            minWidth: '6.25rem',
            padding: '0.375rem 0.75rem',
            // 6px 12px converted to rem
            textTransform: 'none',
            transition: 'all 0.2s ease',
            // Gunakan rem untuk konsistensi
            width: '9.375rem',
          },

          maxWidth: '18.75rem',
          // 300px converted to rem
          minWidth: '18.75rem',
          width: '18.75rem',
        }}
      >
        <ToggleButton value={true}>Ya</ToggleButton>
        <ToggleButton value={false}>Tidak</ToggleButton>
      </ToggleButtonGroup>
    </ColumnWrapper>
  );
};

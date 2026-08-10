import * as React from 'react';

import { Typography, ToggleButton, ToggleButtonGroup, type ToggleButtonGroupProps } from '@mui/material';


export type ToggleProps = {
  value?: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  initialValue?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  groupProps?: Omit<ToggleButtonGroupProps, 'value' | 'onChange' | 'exclusive'>;
};

const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  disabled,
  initialValue = false,
  trueLabel = 'Ya',
  falseLabel = 'Tidak',
  groupProps,
}) => {
  const [selected, setSelected] = React.useState<boolean | null>(value ?? initialValue);

  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelected(value);
    }
  }, [value]);

  const handleChange = (_: unknown, newValue: boolean | null) => {
    if (newValue !== null) {
      setSelected(newValue);
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      disabled={disabled}
      onChange={handleChange}
      sx={{
        '& .MuiToggleButton-root': {
          '&.Mui-selected': {
            '&:hover': { backgroundColor: disabled ? '#bdbdbd' : '#1f384c' },
            backgroundColor: disabled ? '#bdbdbd' : '#284A63',
            color: '#fff',
          },
          '&:hover': { backgroundColor: disabled ? 'transparent' : '#e6eef3' },
          border: '1px solid #284A63',
          borderRadius: '4px',
          color: 'black',
          fontWeight: 500,
          minWidth: 100,
          padding: '6px 12px',
          textTransform: 'none',
          transition: 'all 0.2s ease',
        },
      }}
      {...groupProps}
    >
      <ToggleButton value={true}>
        <Typography variant="subtitle2">{trueLabel}</Typography>
      </ToggleButton>
      <ToggleButton value={false}>
        <Typography variant="subtitle2">{falseLabel}</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default Toggle;

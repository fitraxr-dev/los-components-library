'use client';
import { Box, useTheme } from '@mui/material';


interface SeparatorProps {
  height?: string | number;
  width?: string | number;
  color?: string;
  margin?: string | number;
}

const Separator = ({
  height = '2rem',
  width = '2px',
  color,
  margin = '0 8px',
}: SeparatorProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: color || theme.palette.text.secondary,
        borderRadius: '1px',
        height,
        margin,
        width,
      }}
    />
  );
};

export default Separator;

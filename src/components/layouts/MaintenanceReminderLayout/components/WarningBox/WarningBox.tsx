import React from 'react';

import ReportIcon from '@mui/icons-material/Report';
import { Box, Typography } from '@mui/material';


type WarningBoxProps = {
  text: string;
};

export const WarningBox: React.FC<WarningBoxProps> = ({ text }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        // kuning tua
        backgroundColor: '#FFF8DC',

        border: '1px solid #F6C000',
        borderRadius: 1,
        display: 'flex',
        // kuning muda
        padding: 1.5,
      }}
    >
      <ReportIcon
        sx={{
          color: '#F6C000',
          flexShrink: 0,
          marginRight: 1,
        }}
      />
      <Typography variant="subtitle2" sx={{ color: '#333', whiteSpace: 'pre-line' }}>
        {text}
      </Typography>
    </Box>
  );
};

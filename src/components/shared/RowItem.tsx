import { Grid, Box } from '@mui/material';

import type { ReactNode } from 'react';


interface RowItemProps {
  readonly label: string;
  readonly children: ReactNode;
}

const RowItem = ({ label, children }: RowItemProps) => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container spacing={1}>
        <Grid item xs={11} md={3}>
          <Box
            sx={{
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: 1.4,
              pt: 1,
              wordBreak: 'break-word',
            }}
          >
            {label}
          </Box>
        </Grid>
        <Grid item xs={1} md={1}>
          <Box
            sx={{
              fontSize: '0.875rem',
              fontWeight: 400,
              pt: 1,
              textAlign: 'center',
            }}
          >
            :
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ width: '100%' }}>{children}</Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RowItem;

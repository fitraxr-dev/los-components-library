import { Box, styled, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import TextStyle from '@/components/shared/TextStyle';


const Progress = ({
  percentage = 0,
}) => {
  const theme = useTheme();

  const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    borderRadius: '5.2vw',
    height: theme.spacing(1.5),
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.custom.blueGray,
    },
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: theme.palette.custom.pc20,
      borderRadius: '5.2vw',
    },
  }));

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        mb: theme.spacing(6),
        mt: theme.spacing(1),
      }}
    >
      <Box sx={{ mr: 1, width: '100%' }}>
        <CustomLinearProgress variant="determinate" value={percentage} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <TextStyle
          variant="body4"
          weight={500}
          color="text.secondary"
        >{`${percentage}%`}
        </TextStyle>
      </Box>
    </Box>
  );
};

export default Progress;

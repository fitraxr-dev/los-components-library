import { Box } from '@mui/material';


const CustomBox = ({ children }) => {
  return (
    <Box display="flex" gap="2%" rowGap="2%" width="100%" sx={{ borderBottom: '1px solid #D3D3D3' }} mb={2} pb={2} flexWrap="wrap">
      {children}
    </Box>
  );
};

export default CustomBox;

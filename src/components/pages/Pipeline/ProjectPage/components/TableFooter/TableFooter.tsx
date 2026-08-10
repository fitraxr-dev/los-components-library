import { Box } from '@mui/material';

import IconTooltip from '@/components/shared/IconTooltip';
import RowWrapper from '@/components/shared/RowWrapper';


const TableFooter = ({ handleAddProject }) => (
  <RowWrapper sx={{ justifyContent: 'end', mb: 2, mr: 2 }}>
    <Box onClick={handleAddProject}>
      <IconTooltip iconName="add" />
    </Box>
  </RowWrapper>
);

export default TableFooter;

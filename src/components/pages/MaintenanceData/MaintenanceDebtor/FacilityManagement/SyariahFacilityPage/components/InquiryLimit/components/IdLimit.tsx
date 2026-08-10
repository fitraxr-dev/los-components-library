import { Box } from '@mui/material';

import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';

import useInquiryLimit from '../InquiryLimit.hook';


const IdLimit = () => {
  const {
    idLimitAnak,
    idLimitInduk,
    idPipeline,
  } = useInquiryLimit();

  return (
    <SectionTitle title="ID Limit" isOpen>
      <RowWrapper
        sx={{
          gap: 3,
          justifyContent: 'space-between',
          paddingY: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Input
            disabled
            type="text"
            label="ID Limit"
            placeholder="ID Limit"
            value={idLimitAnak}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Input
            disabled
            type="text"
            label="ID Limit Induk"
            placeholder="ID Limit Induk"
            value={idLimitInduk}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Input
            disabled
            type="text"
            label="ID Pipeline"
            placeholder="ID Pipeline"
            value={idPipeline}
          />
        </Box>
      </RowWrapper>
    </SectionTitle>
  );
};
export default IdLimit;

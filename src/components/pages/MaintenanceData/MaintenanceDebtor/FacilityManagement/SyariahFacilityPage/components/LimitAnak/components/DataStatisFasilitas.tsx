import { Box, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useLimitAnak from '../LimitAnak.hook';


const DataStatisFasilitas = () => {
  const theme = useTheme();
  const { sectionDataStatisFasilitas } = useLimitAnak();

  return (
    <SectionTitle title="Data Statis Fasilitas" isOpen>
      <ColumnWrapper
        sx={{
          boxShadow: 0,
          gap: theme.spacing(3),
          maxWidth: '100%',
          mt: theme.spacing(3),
        }}
        px={3}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {sectionDataStatisFasilitas && sectionDataStatisFasilitas.map((item) => (
            <Input
              disabled
              key={item.key}
              type="text"
              label={item.label}
              placeholder={item.placeHolder}
              value={item.value}
            />
          ))}
        </Box>
      </ColumnWrapper>
    </SectionTitle>
  );
};
export default DataStatisFasilitas;

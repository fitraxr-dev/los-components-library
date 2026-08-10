import { Box, Divider, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useLimitInduk from '../LimitInduk.hook';


const InformasiLimit = () => {
  const theme = useTheme();
  const {
    sectionInformasiLimit1,
    sectionInformasiLimit2,
    catatan1,
    keteranganBmpp,
  } = useLimitInduk();

  return (
    <SectionTitle title="Informasi Limit" isOpen>
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
            '& > *': { gridColumn: 'span 2' },
            '& > :nth-last-child(1):nth-child(3n+1)': { gridColumn: 'span 6' },
            '& > :nth-last-child(2):nth-child(3n+1), \
              & > :nth-last-child(1):nth-child(3n+2)': { gridColumn: 'span 3' },
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(6, 1fr)',
          }}
        >
          {sectionInformasiLimit1 && sectionInformasiLimit1.map((item) => (
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
        <Divider />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {sectionInformasiLimit2 && sectionInformasiLimit2.map((item) => (
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
        <Input
          disabled
          type="area"
          label="Keterangan BMPP"
          placeholder="Keterangan BMPP"
          rows={3}
          value={keteranganBmpp}
        />
        <Input
          disabled
          type="area"
          label="Catatan 1"
          placeholder="Catatan 1"
          rows={3}
          value={catatan1}
        />
      </ColumnWrapper>
    </SectionTitle>
  );
};
export default InformasiLimit;

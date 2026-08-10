import { Box, Divider, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useLimitAnak from '../LimitAnak.hook';


const InformasiLimit = () => {
  const theme = useTheme();
  const {
    sectionInformasiLimit1,
    sectionInformasiLimit2,
    keteranganBmpk,
    frekuensiReview,
    groupCif,
  } = useLimitAnak();

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
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(3, 1fr)',
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
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            disabled
            type="text"
            label="Frekuensi Review"
            placeholder="Frekuensi Review"
            value={frekuensiReview}
          />
          <Input
            disabled
            type="text"
            label="CIF Kelompok"
            placeholder="CIF Kelompok"
            value={groupCif}
          />
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
          label="Keterangan BMPK"
          placeholder="Keterangan BMPK"
          rows={3}
          value={keteranganBmpk}
        />
      </ColumnWrapper>
    </SectionTitle>
  );
};
export default InformasiLimit;

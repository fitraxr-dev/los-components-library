'use client';
import { Box, Divider, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useInquiryLimit from '../InquiryLimit.hook';


const InformasiLimit = () => {
  const theme = useTheme();
  const {
    catatan1,
    keteranganBmpp,
    sectionInformationLimit1,
    sectionInformationLimit2,
  } = useInquiryLimit();

  return (
    <SectionTitle title="Informasi Limit" isOpen>
      <ColumnWrapper
        sx={{
          boxShadow: 0,
          gap: theme.spacing(3),
          maxWidth: '100%',
          mt: theme.spacing(3),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
        >
          {sectionInformationLimit1 && sectionInformationLimit1.map((item) => (
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
          {sectionInformationLimit2 && sectionInformationLimit2.map((item) => (
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

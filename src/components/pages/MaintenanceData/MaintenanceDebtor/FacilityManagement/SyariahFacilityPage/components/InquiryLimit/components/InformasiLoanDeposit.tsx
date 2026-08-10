'use client';

import { Box, Divider, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useInquiryLimit from '../InquiryLimit.hook';


const InformasiLoanDeposit = () => {
  const theme = useTheme();
  const {
    deskripsiResponseFlag,
    informasiLoanDeposit,
    responseFlag,
  } = useInquiryLimit();

  return (
    <SectionTitle title="Informasi Loan dan Deposit" isOpen>
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
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {informasiLoanDeposit && informasiLoanDeposit.map((item) => (
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
          label="Response Flag"
          placeholder="Response Flag"
          rows={3}
          value={responseFlag}
        />
        <Input
          disabled
          type="area"
          label="Deskripsi Response Flag"
          placeholder="Deskripsi Response Flag"
          rows={3}
          value={deskripsiResponseFlag}
        />
      </ColumnWrapper>
    </SectionTitle>
  );
};
export default InformasiLoanDeposit;

import { Box } from '@mui/material';

import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useTypeSection from './TypeSection.hook';


const TypeSection = () => {
  const {
    debtorData,
    payload,
    theme,
    typeFinancingData,
    typeProcessData,
    typeSubmissionData,
    changePayload,
    viewOnly,
  } = useTypeSection();

  return (
    <Box
      sx={{
        display: 'grid',
        gridGap: theme.spacing(2),
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
    >
      <Box>
        <SectionTitle title="Tipe Proses" />
        <Input
          type="radio"
          disabled
          radioList={typeProcessData}
          label=""
          sxOptions={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(3, 1fr)',
            mt: 3,
          }}
          value={debtorData.typeProcess}
          onChange={(val) => changePayload.typeProcess(val.target.value)}
        />
      </Box>
      <Box>
        <SectionTitle title="Tipe Permohonan" />
        <Input
          type="radio"
          radioList={typeSubmissionData}
          label=""
          disabled={viewOnly}
          sxOptions={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(3, 1fr)',
            mt: 3,
          }}
          value={debtorData.typeProposal}
          onChange={(val) => changePayload.typeProposal(val.target.value)}

        />
        <SectionTitle title="Tipe Pembiayaan" sx={{ mt: 3 }} />
        <Input
          type="radio"
          radioList={typeFinancingData}
          label=""
          disabled={viewOnly}
          sxOptions={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(3, 1fr)',
            mt: 3,
          }}
          value={debtorData.typeFinancing}
          onChange={(val) => changePayload.typeFinancing(val.target.value)}
        />
      </Box>
      <Box
        sx={{
          gridColumn: '1 / span 2',
          mt: 3,
        }}
      >
        <Input
          type="area"
          label="Keterangan"
          placeholder="Input Keterangan"
          disabled={viewOnly}
          rows={4}
          value={payload.description}
          onChange={(val) => changePayload.description(val)}
        />
      </Box>
    </Box>
  );
};

export default TypeSection;

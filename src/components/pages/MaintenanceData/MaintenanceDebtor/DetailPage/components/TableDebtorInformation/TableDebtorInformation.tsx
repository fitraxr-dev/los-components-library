'use client';
import { Box, useTheme } from '@mui/material';
import * as Yup from 'yup';

import { toDateString } from '@/helpers/date';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';


const validationSchema = Yup.object({
  analyst: Yup.object({ id: Yup.number(), label: Yup.string() }),
});

type DebtorInformationProps = {
  debtorId?: string;
  processId?: string;
}

const TableDebtorInformation = ({
  debtorId,
  processId,
}: DebtorInformationProps) => {
  const theme = useTheme();
  const { data: debtorInfoDataMaster } = useGetDetailMasterDebtor(
    { debtorId }
  );


  const renderDefault = (
    <Cell title="Nama Analis" value={debtorInfoDataMaster?.analystName} />
  );

  const renderAnalystCell = renderDefault;

  return (
    <SectionTitle title="Informasi Customer" subtitle={`${debtorInfoDataMaster?.name} | CIF: ${debtorInfoDataMaster?.cif} | RM: ${debtorInfoDataMaster?.staffName}`}>
      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          mt: theme.spacing(3),
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell title="Nama Customer" value={debtorInfoDataMaster?.name} />
          <Cell title="Nama RM" value={debtorInfoDataMaster?.staffName} />
          <Cell title="New / Eksisting Client" value={debtorInfoDataMaster?.isExisting ? 'Eksisting Client' : 'New Client'} />
          {renderAnalystCell}
          <Cell title="CIF" value={debtorInfoDataMaster?.cif} />
          <Cell title="Divisi" value={debtorInfoDataMaster?.divisionName} />
          <Cell title="ID" value={debtorInfoDataMaster?.bucketProcessId} />
          <Cell title="General Account Manager" value={debtorInfoDataMaster?.gamName} />
          <Cell title="Created Date" value={toDateString(debtorInfoDataMaster?.proposalDate)} />
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableDebtorInformation;

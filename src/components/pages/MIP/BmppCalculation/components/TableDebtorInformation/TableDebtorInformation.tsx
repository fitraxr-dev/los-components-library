'use client';
import { Box, useTheme } from '@mui/material';

import { toDateString } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';

import type { DebtorInformationProps } from './TableDebtorInformation.types';


const TableDebtorInformation = ({
  debtorName,
  gamName,
  staffName,
  isNewClient,
  cif,
  division,
  debtorId,
  createdAt,
}: DebtorInformationProps) => {
  const theme = useTheme();

  return (
    <SectionTitle title="Informasi Customer" subtitle={`${debtorName || '-'} | CIF: ${cif || '-'} | RM: ${staffName || '-'}`}>
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
          <Cell title="Nama Customer" value={debtorName || '-'} />
          <Cell title="Nama RM" value={staffName || '-'} />
          <Cell title="New / Eksisting Client" value={isNewClient ? 'New Client' : 'Eksisting Client' } />
          <Cell title="CIF" value={cif || '-'} />
          <Cell title="Divisi" value={division || '-'} />
          <Cell title="ID" value={debtorId || '-'} />
          <Cell title="General Account Manager" value={gamName || '-'} />
          <Cell title="Created Date" value={createdAt ? toDateString(createdAt) : '-'} />
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableDebtorInformation;

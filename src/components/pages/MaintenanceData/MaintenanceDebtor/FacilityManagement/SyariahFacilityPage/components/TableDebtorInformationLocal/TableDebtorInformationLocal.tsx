'use client';
import { Box, useTheme } from '@mui/material';

import { toDateString } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';

import useTableDebtorInformationLocal from './TableDebtorInformationLocal.hook';

import type { DebtorInformationProps } from './TableDebtorInformationLocal.types';


const TableDebtorInformationSyariah = ({
  title,

}: DebtorInformationProps) => {
  const theme = useTheme();

  const { debtorData } = useTableDebtorInformationLocal();

  return (
    <SectionTitle title={title || 'Informasi Customer'} subtitle={`${debtorData?.name} | CIF: ${debtorData?.cif ? debtorData?.cif : '-'} | GAM: ${debtorData?.gamName} | ID: ${debtorData?.debtorId}`}>
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
          <Cell title="Nama Customer" value={debtorData?.name} />
          <Cell title="Nama RM" value={debtorData?.staffName} />
          <Cell title="New / Eksisting Client" value={debtorData?.isNewDebtor ? 'New Client' : 'Eksisting Client' } />
          <Cell title="Divisi" value={debtorData?.divisionName} />
          <Cell title="CIF" value={debtorData?.cif ? debtorData?.cif : '-'} />
          <Cell title="ID" value={debtorData?.debtorId} />
          <Cell title="General Account Manager" value={debtorData?.gamName} />
          <Cell title="Created Date" value={debtorData?.createdDate ? toDateString(debtorData?.createdDate) : '-'} />
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableDebtorInformationSyariah;

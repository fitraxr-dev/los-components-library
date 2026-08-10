'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import useFinancingStructureProposal from './FinancingStructureProposal.hook';


const FinancingStructureProposalPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();

  const {
    handleOpenAddForm,
    handleNext,
    tableHeader,
    noPage,
    setNoPage,
    setItemPerPage,
    isLoading,
    financingContents,
    financingPage,
  } = useFinancingStructureProposal();

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(2)}>
      <Title title="Usulan Struktur Pembiayaan" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={financingContents}
          totalPage={financingPage?.totalPage ?? 1}
          currentPage={noPage}
          onPageSizeChange={setItemPerPage}
          handlePageChange={setNoPage}
          footer={!viewOnly && <TableFooter handleOpenAddModal={handleOpenAddForm} />}
        />
      </BaseContainer>
      <RowWrapper justifyContent="end">
        <Button onClick={handleNext}>Next</Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FinancingStructureProposalPage;

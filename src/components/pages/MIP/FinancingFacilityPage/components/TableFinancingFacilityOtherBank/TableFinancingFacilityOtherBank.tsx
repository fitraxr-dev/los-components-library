import React from 'react';

import { useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTableFinancingFacilityOtherBank from './TableFinancingFacilityOtherBank.hook';


const TableFinancingFacilityOtherBank = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();

  const {
    noPage,
    setItemPerPage,
    setNoPage,
    handleOpenAddModal,
    tableData,
    tableHeader,
    tablePage,
    isLoading,
  } = useTableFinancingFacilityOtherBank();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <SectionTitle title="Fasilitas Pembiayaan Bank Lain" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            maxHeight="42vh"
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={!viewOnly && (<TableFooter onClick={handleOpenAddModal} />)
            }
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TableFinancingFacilityOtherBank;

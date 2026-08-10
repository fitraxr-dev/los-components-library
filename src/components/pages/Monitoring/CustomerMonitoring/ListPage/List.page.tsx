'use client';
import { useContext } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { CustomerMonitoringContext } from '@/components/layouts/CustomerMonitoringLayout/CustomerMonitoring.context';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import InformationCustomerModal from './components/DetailInformationCustomer/InformationCustomerModal';
import { modalCustomerMonitoring } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { state, setState } = useContext(CustomerMonitoringContext);

  const {
    tableData,
    tablePage,
    filter,
    isLoading,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
  } = useList();

  return (
    <>
      <Title title="Customer Monitoring" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={modalCustomerMonitoring.DETAIL_INFORMATION_CUSTOMER}
        component={InformationCustomerModal}
      />
    </>
  );
};

export default ListPage;

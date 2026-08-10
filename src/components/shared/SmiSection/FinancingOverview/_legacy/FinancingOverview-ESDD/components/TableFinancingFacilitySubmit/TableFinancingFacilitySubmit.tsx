'use client';
import { TableCell } from '@mui/material';


import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTableFinancingFacilitySubmit from './TableFinancingFacilitySubmit.hook';

import type { TableFinancingFacilitySubmitProps } from './TableFinancingFacilitySubmit.types';


const TableFinancingFacilitySubmit = (props: TableFinancingFacilitySubmitProps) => {

  const {
    theme,
    contents,
    facilityListData,
    facilityListLoading,
    anomalyRow,
    tableHeader,
    totalOrder,
    setItemPerPage,
    setNoPage,
  } = useTableFinancingFacilitySubmit(props);

  const page = facilityListData?.page;

  return (
    <Table
      maxHeight="82vh"
      tableHeader={tableHeader}
      tableData={contents}
      pageSize={10}
      currentPage={page?.noPage}
      totalPage={page?.totalPage}
      handlePageChange={setNoPage}
      onPageSizeChange={setItemPerPage}
      anomalyRow={anomalyRow}
      isLoading={facilityListLoading}
      renderAdditonalRow={() => (
        <>
          <TableCell colSpan={4}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.primary.main}
            >
              Total
            </TextStyle>
          </TableCell>
          <TableCell>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.primary.main}
            >
              {totalOrder}
            </TextStyle>
          </TableCell>

        </>
      )}
    />
  );
};

export default TableFinancingFacilitySubmit;

'use client';
import { Box, TableCell } from '@mui/material';

import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import useTableFinancingFacilitySubmit from './TableFinancingFacilitySubmit.hook';

import type { TableFinancingFacilitySubmitProps } from './TableFinancingFacilitySubmit.types';


const TableFinancingFacilitySubmit = (props: TableFinancingFacilitySubmitProps) => {

  const {
    viewOnly,
    theme,
    contents,
    facilityListData,
    facilityListLoading,
    anomalyRow,
    tableHeader,
    totalOrder,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    itemPerPage,
  } = useTableFinancingFacilitySubmit(props);

  const page = facilityListData?.page;

  return (
    <>
      <SectionTitle title="Fasilitas Pembiayaan" isOpen sx={{ mb: 3 }}>
        <Table
          maxHeight="82vh"
          tableHeader={tableHeader}
          tableData={contents}
          pageSize={itemPerPage}
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
          footer={!viewOnly && (<TableFooter onClick={popupSelectorHandler} />)}
        />
      </SectionTitle>
    </>
  );
};

export default TableFinancingFacilitySubmit;

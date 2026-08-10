'use client';
import { TableCell } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTableFinancingFacilitySubmit from './TableFinancingFacilitySubmit.hook';


const TableFinancingFacilitySubmit = ({ module, process }: { module: string; process: string }) => {
  const { viewOnly } = useViewOnly();
  const {
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
  } = useTableFinancingFacilitySubmit({ module, process });

  const page = facilityListData?.page;

  return (
    <Table
      maxHeight="82vh"
      tableHeader={tableHeader}
      tableData={contents}
      pageSize={5}
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

      footer={
        <RowWrapper
          sx={{ justifyContent: 'end', mb: 2, mr: 4 }}
        >
          {
            viewOnly ? null : (
              <Button
                variant="outlined"
                startIcon="add-2"
                startIconSx={{ fontSize: theme.spacing(3) }}
                sx={{
                  height: theme.spacing(6),
                  padding: theme.spacing(1),
                }}
                onClick={popupSelectorHandler}
              >
                Add New
              </Button>
            )
          }
        </RowWrapper>
      }
    />
  );
};

export default TableFinancingFacilitySubmit;

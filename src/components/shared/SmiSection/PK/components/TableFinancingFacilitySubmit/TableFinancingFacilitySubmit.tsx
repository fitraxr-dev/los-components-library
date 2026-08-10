'use client';
import { TableCell } from '@mui/material';

import ConfirmationInfo from '@/components/pages/LPS/components/ConfirmationInfo';
import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import useTableFinancingFacilitySubmit from './TableFinancingFacilitySubmit.hook';


const TableFinancingFacilitySubmit = (
  { isBeingProcessed, ...props }: { isBeingProcessed: boolean } & SmiComponentProps
) => {
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
    popupSelectorHandler,
    viewOnly,
    isLegalSigning,
    showAlertFacility,
  } = useTableFinancingFacilitySubmit({ ...props, isBeingProcessed });

  const page = facilityListData?.page;

  return (
    <>
      {showAlertFacility && <ConfirmationInfo notice="Fasilitas Usulan masih memiliki data yang belum lengkap. Mohon segera dilakukan pengkinian data" />}
      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen>
        <BaseContainer sx={{ boxShadow: 2 }}>
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
                <TableCell colSpan={7}>
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
              (!viewOnly && !isLegalSigning) ? !isBeingProcessed ?
                <TableFooter onClick={popupSelectorHandler} /> : null : null
            }
          />
        </BaseContainer>

      </SectionTitle>

    </>
  );
};

export default TableFinancingFacilitySubmit;

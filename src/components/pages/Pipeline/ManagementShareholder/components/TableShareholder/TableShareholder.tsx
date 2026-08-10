import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell, useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import { modalData } from '../../ManagementShareholder.constants';
import ModalShareholderDetailExisting from '../ExistingModel/ModalShareholderDetailExisting';
import ModalShareholderExisting from '../ExistingModel/ModalShareholderExisting';

import useTableShareholder from './TableShareholder.hook';


const TableShareholder = ({ isPemda }: { isPemda?: boolean }) => {
  const theme = useTheme();
  const [state] = useApp();
  const {
    handleAddShareholder,
    tableHeader,
    isFetching,
    data,
    noPage,
    viewOnly,
    setNoPage,
    setItemPerPage } = useTableShareholder();

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly) || isPemda;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Shareholder" />
      <BaseContainer>
        <Table
          tableHeader={tableHeader}
          tableData={data?.shareholderList}
          totalPage={data?.shareholderPage?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          isLoading={isFetching}
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
                  {data?.totalShares}
                </TextStyle>
              </TableCell>
              <TableCell>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  {data?.totalPercentage}%
                </TextStyle>
              </TableCell>
            </>
          )}
          footer={!isViewOnly && <TableFooter onClick={handleAddShareholder} />}
        />
      </BaseContainer>

      <ModalDef
        id={modalData.MODAL_SHAREHOLDER_EXISTING}
        component={ModalShareholderExisting}
      />

      <ModalDef
        id={modalData.MODAL_SHAREHOLDER_DETAIL_EXISTING}
        component={ModalShareholderDetailExisting}
      />

    </ColumnWrapper>
  );
};

export default TableShareholder;

'use client';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import IconTooltip from '@/components/shared/IconTooltip';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTableLPAInformation from './TableLPAInformation.hook';

import type { TableLPAInformationProps } from './TableLPAInformation.types';


const TableLPAInformation = (props: TableLPAInformationProps) => {
  const { viewOnly } = useViewOnly();

  const {
    LPAInformationListData,
    LPAInformationListLoading,
    anomalyRow,
    handleOpenPopUpLPAInformationNew,
    tableHeader,
    typeReview,
  } = useTableLPAInformation(props);

  return (
    <>
      <SectionTitle title="Informasi LPA" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            maxHeight="82vh"
            tableHeader={tableHeader}
            tableData={LPAInformationListData?.contents}
            pageSize={5}
            isLoading={LPAInformationListLoading}
            anomalyRow={anomalyRow}
            footer={!viewOnly && typeReview !== 'lpa-review' ?
              <TableFooter onClick={handleOpenPopUpLPAInformationNew} disabled={viewOnly} />
              : null

            }
          />
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default TableLPAInformation;

import React from 'react';

import { Box } from '@mui/material';

import IconTooltip from '../../IconTooltip';
import RowWrapper from '../../RowWrapper';
import Table from '../../Table';
import TableFooter from '../../TableFooter';

import useCorrectiveActionPlanHooks from './CorrectiveActionPlan.hooks';

import type { CorrectiveActionPlanHooks } from './CorrectiveActionPlan.types';


const CorrectiveActionTable = ({
  module,
  process,
  isBusinessResponse = false,
  viewOnly,
}: CorrectiveActionPlanHooks) => {

  const {
    tableHeader,
    outputData,
    handleNewData,
    renderTableInBetweenRow,
    isLoading,
  } = useCorrectiveActionPlanHooks({ isBusinessResponse, module, process, viewOnly });

  return (
    <Table
      isPaper
      isLoading={isLoading}
      tableHeader={tableHeader}
      tableData={outputData}
      renderInBetweenRow={renderTableInBetweenRow}
      footer={
        !viewOnly && !isBusinessResponse ?
          <TableFooter onClick={handleNewData} /> : null
      }
    />
  );
};

export default CorrectiveActionTable;

import React from 'react';

import { Box } from '@mui/material';

import { TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';
import SectionTitle from '@/components/shared/SectionTitle';

import ExposureGroupBase from './components/ExposureGroupBase';
import useGetExposureGroup from './hooks/useGetExposureGroup';

import type { TypeModule } from '@/enums/Module';


type TableExposureGroupProps = {
  module: TypeModule;
  process: TypeProcess;
}

const TableExposureGroup = (props: TableExposureGroupProps) => {
  const { module, process } = props;
  const { bucketParentId } = useMUPAnalystContext();


  const { data: exposureGroupData } = useGetExposureGroup({
    bucketProcessId: bucketParentId,
    module,
    process,
  }, { enabled: !!bucketParentId });

  let renderTable;
  switch (process) {
    case TypeProcess.MIP:
      renderTable = <ExposureGroupBase data={exposureGroupData} />;
      break;
    default:
      renderTable = <ExposureGroupBase data={exposureGroupData} />;
      break;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <SectionTitle sx={{ mb: 3 }} title="Total Eksposure Group" isOpen>
        {renderTable}
      </SectionTitle>
    </Box>
  );
};

export default TableExposureGroup;

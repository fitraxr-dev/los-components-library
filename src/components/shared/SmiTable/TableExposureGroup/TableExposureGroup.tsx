import { Box, useTheme } from '@mui/material';

import { TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import useIdentity from '@/hooks/useIdentity';

import SectionTitle from '@/components/shared/SectionTitle';

import Icon from '../../Icon';
import TextStyle from '../../TextStyle';

import ExposureGroupBase from './components/ExposureGroupBase';
import useGetExposureGroup from './hooks/useGetExposureGroup';

import type { TypeModule } from '@/enums/Module';


type TableExposureGroupProps = {
  module: TypeModule;
  process: TypeProcess;
  isAsOf?: boolean;
  valueAsOf?: string;
}

const TableExposureGroup = (props: TableExposureGroupProps) => {
  const { module, process, isAsOf, valueAsOf } = props;
  const theme = useTheme();
  const { processId } = useIdentity();
  const { data: exposureGroupData } = useGetExposureGroup({
    bucketProcessId: processId,
    module,
    process,
  });

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
      <SectionTitle sx={{ mb: 3 }} title="Total Eksposure Group" />
      {isAsOf &&
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <TextStyle
          variant="body3"
          sx={{
            fontWeight: 'bold',
          }}
          color={theme.palette.custom.gray30}
        >
          As Of :
        </TextStyle>
        <Box

          sx={{
            alignItems: 'center',
            border: '1px solid #bebebe',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            p: '10px',
          }}
        >
          <TextStyle
            variant="body4"
            color={theme.palette.custom.gray30}

          >
            {` ${ valueAsOf?.length ? toDateString(valueAsOf) : 'DD/MM/YYYY'}`}

          </TextStyle>
          <Icon
            textVariant="body2"
            iconName="calendar"
          />
        </Box>
      </Box>}

      {renderTable}
    </Box>
  );
};

export default TableExposureGroup;

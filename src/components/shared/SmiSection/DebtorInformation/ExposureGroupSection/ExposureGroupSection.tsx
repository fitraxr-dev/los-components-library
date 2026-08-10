import { Box, useTheme } from '@mui/material';

import { toDateString } from '@/helpers/date';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import TableExposureGroup from './components/TableExposureGroup';

import type { ExposureGroupSectionProps } from './ExposureGroupSection.types';


const ExposureGroupSection = (props: ExposureGroupSectionProps) => {
  const { isAsOf, valueAsOf, data, showTooltip } = props;
  const theme = useTheme();
  const tooltipText = showTooltip ? 'Include Customer Provide' : null;

  return (
    <SectionTitle title="Total Eksposure Group" isOpen tooltipText={tooltipText}>
      <ColumnWrapper mt={2}>
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
            As Of:
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
        <TableExposureGroup data={data} />
      </ColumnWrapper>

    </SectionTitle>
  );
};

export default ExposureGroupSection;

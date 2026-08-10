import React from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { MIP_STATUS_COLOR } from '@/configs/constants/mip';
import { PIPELINE_STATUS_COLOR } from '@/configs/constants/pipeline';

import TextStyle from '@/components/shared/TextStyle';

import type { StatusLabelProps } from './StatusLabel.types';


const StatusLabel = (props: StatusLabelProps) => {
  const { data } = props;
  const pathname = usePathname();
  const theme = useTheme();

  const isPipeline = pathname.split('/').includes('pipeline');
  const isMIP = pathname.split('/').includes('mip');

  const pipelineBorder = theme.palette?.[PIPELINE_STATUS_COLOR?.[data?.status] ?? 'primary'].main;
  const mipBorder = theme.palette?.[MIP_STATUS_COLOR?.[data?.status] ?? 'primary'].main;

  return (
    <TextStyle
      variant="body4"
      weight={500}
      color={theme.palette.primary.main}
      sx={{
        border: `1px solid ${isPipeline ? pipelineBorder : ''} ${isMIP ? mipBorder : ''}`,
        borderRadius: theme.radius(10),
        display: 'flex',
        justifyContent: 'center',
        minWidth: '15vw',
        px: 1.5,
        textAlign: 'center',
      }}
    >
      {data?.statusLabel || '-'}
    </TextStyle>
  );
};

export default StatusLabel;

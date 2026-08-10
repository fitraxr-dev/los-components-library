'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import Cell from '../Cell';


type DetailHostoryProps = {
  data: {
    status: string;
    date: string;
    time: string;
    name: string;
    role: string;
    type: string;
    description: string;
  };
}

const DetailHostory = ({ data }: DetailHostoryProps) => {
  const theme = useTheme();
  return (
    <BaseContainer>
      <ColumnWrapper sx={{ gap: 3 }}>
        <TextStyle
          variant="title2"
          weight={700}
          color={theme.palette.primary.main}
          py={1}
        >
          {data.status}
        </TextStyle>
        <Cell content={[data.date, data.time]} />
        <Cell content={data.name} />
        <Cell content={data.role} />
        <Cell content={data.type} />
        <Box>
          <Input
            label="Keterangan"
            type="area"
            value={data.description}
            inputProps={{ readOnly: true }}
          />
        </Box>
      </ColumnWrapper>
    </BaseContainer>
  );
};

export default DetailHostory;

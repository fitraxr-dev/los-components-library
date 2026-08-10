import React from 'react';

import styled from '@emotion/styled';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import TextStyle from '@/components/shared/TextStyle';

import type { ExposureGroupBucketResponseDto } from '@/services/openapi/bucket-service';


type ExposureGroupBaseProps = {
  data: Array<ExposureGroupBucketResponseDto>;
}

const ExposureGroupBase = ({ data }: ExposureGroupBaseProps) => {
  const theme = useTheme();
  const formatText = (text) => (
    <TextStyle
      variant="body4"
      weight={500}
      color={theme.palette.primary.main}
    >
      {text}
    </TextStyle>
  );

  return (
    <BaseContainer
      sx={{ boxShadow: 5, p: 0 }}
    >
      <TableStyle>
        <HeadStyle>
          <tr>
            <th rowSpan={2}>{formatText('No.')}</th>
            <th rowSpan={2}>{formatText('Nama Grup')}</th>
            <th rowSpan={2}>{formatText('Tahun Didirikan')}</th>
            <th colSpan={3}>{formatText('IDR')}</th>
            <th colSpan={3}>{formatText('USD')}</th>
          </tr>
          <tr>
            <th>{formatText('Plafond')}</th>
            <th>{formatText('O/S')}</th>
            <th>{formatText('Propose')}</th>
            <th>{formatText('Plafond')}</th>
            <th>{formatText('O/S')}</th>
            <th>{formatText('Propose')}</th>
          </tr>
        </HeadStyle>
        <BodyStyle>
          {
            data.map((item, index) => (
              <tr key={index}>
                <td>{formatText(index + 1)}</td>
                <td>{formatText(item.groupName)}</td>
                <td>{formatText(item.yearFounded)}</td>
                <td>{formatText(item.idr.plafond)}</td>
                <td>{formatText(item.idr.outstanding)}</td>
                <td>{formatText(item.idr.propose)}</td>
                <td>{formatText(item.usd.plafond)}</td>
                <td>{formatText(item.usd.outstanding)}</td>
                <td>{formatText(item.usd.propose)}</td>
              </tr>
            ))
          }
        </BodyStyle>
      </TableStyle>
    </BaseContainer>
  );
};

export default ExposureGroupBase;

const TableStyle = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    border: 8px solid white;
    outline-offset: -2px;
  `;
const BodyStyle = styled.tbody`
    text-align: center;
    & tr > td {
      padding: 8px 3px;
    }
    & tr :nth-child(3n) {
        border-right: 0.5px solid #ABABAB;
      }
    & tr :nth-child(3) {
      width: 12%;
    }
    & tr :nth-child(2) {
      width: 20%;
    }
    & :not(:last-child) {
      border-bottom: 0.5px solid #ABABAB;
    }
  `;
const HeadStyle = styled.thead`
    text-align: center;
    border-bottom: 0.5px solid #ABABAB;
    & tr > th {
      padding-top: 8px;
      padding-bottom: 8px;
    }
    & :nth-child(1) :nth-child(n+3) {
        border-right: 0.5px solid #ABABAB;
      }

    & :nth-child(2) :nth-child(3n) {
      border-right: 0.5px solid #ABABAB;
    }
  `;

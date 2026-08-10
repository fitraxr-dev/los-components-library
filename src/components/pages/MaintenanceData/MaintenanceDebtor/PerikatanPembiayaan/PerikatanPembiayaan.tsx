'use client';
import React from 'react';

import { Box, Tooltip } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../components/ActionFooterDetail/ActionFooterDetail';

import { tableHeader } from './PerikatanPembiayaan.constants';
import usePerikatanPembiayaan from './PerikatanPembiayaan.hooks';


const PerikatanPembiayaan = () => {

  const {
    perikatanAkadList,
    tableHeaderList,
    pageNo,
    pageSize,
    setPageNo,
    setPageSize,
    isLoading,
    contentList,
    searchByOptions,
    filter,
    setFilter,
    theme,
  } = usePerikatanPembiayaan();

  const date = new Date(perikatanAkadList?.data?.additionalData?.lastUpdate);
  const dataAsOf = date.setHours(date.getHours() - 7);

  return (
    <Box>
      <Title title="Perikatan Pembiayaan atau Akad" />

      <SectionTitle title="Perikatan Pembiayaan atau Akad" isOpen>
        <Box width="45vw">
          <Input
            type="search"
            value={filter}
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            useMinChar={false}
            dropdownList={searchByOptions.data}
            contentList={contentList}
          />
        </Box>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : { perikatanAkadList?.data?.additionalData?.lastUpdate ? formatDateTime(dataAsOf) : '-' }
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderList}
            tableData={perikatanAkadList?.data?.contents}
            totalPage={perikatanAkadList?.data?.page?.totalPage}
            isLoading={isLoading}
            pageSize={pageSize}
            currentPage={pageNo}
            handlePageChange={setPageNo}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </SectionTitle>
      <ActionFooterDetail />
    </Box>
  );
};

export default PerikatanPembiayaan;

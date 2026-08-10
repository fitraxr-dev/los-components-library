'use client';

import { TableCell } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { mockTableData } from './ShareHolder.constant';
import useShareHolder from './ShareHolder.hook';


const ShareHolderPage = () => {
  const {
    tableHeaderList,
    theme,
    gotoAddPage,
    tableData,
  } = useShareHolder();
  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Shareholder" />
      <SectionTitle title="Shareholder" />
      <BaseContainer>
        <Table
          tableHeader={tableHeaderList}
          tableData={tableData?.shareholderList}
          isLoading={false}
          totalPage={1}
          pageSize={10}
          currentPage={1}
          renderAdditonalRow={() => (
            <>
              <TableCell colSpan={3}>
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
                  {tableData?.totalShares || '-'}
                </TextStyle>
              </TableCell>
              <TableCell>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  {tableData?.totalPercentage || '-'}
                </TextStyle>
              </TableCell>
            </>
          )}
          footer={
            <RowWrapper
              sx={{ justifyContent: 'end', mb: 2 }}
            >
              <Button
                variant="outlined"
                startIcon="add-2"
                startIconSx={{ fontSize: theme.spacing(3) }}
                sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                onClick={gotoAddPage}
              >
                Add New
              </Button>
            </RowWrapper>
          }
        />
      </BaseContainer>
      <Input
        type="area"
        label="Keterangan"
        rows={4}
        onChange={() => {}}
      />

      <RowWrapper justifyContent="end">
        <Button>
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ShareHolderPage;

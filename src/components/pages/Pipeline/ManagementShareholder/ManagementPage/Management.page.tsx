'use client';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { mockTableData } from './Management.constant';
import useManagement from './Management.hook';


const ManagementPage = () => {
  const {
    tableHeaderList,
    theme,
    gotoAddPage,
    data,
  } = useManagement();
  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Management" />
      <SectionTitle title="Management" />
      <BaseContainer>
        <Table
          tableHeader={tableHeaderList}
          tableData={data?.contents}
          isLoading={false}
          totalPage={1}
          pageSize={10}
          currentPage={1}
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

export default ManagementPage;

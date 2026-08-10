'use client';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import UseValidasi from './Validasi.hooks';


const ProjectInformation = () => {
  const {
    isLoadingValidasi,
    tableHeaderValidasi,
    validasiDataMapped,
  } = UseValidasi();
  return (
    <ColumnWrapper>
      <RowWrapper sx={{ marginBottom: 5 }}>
        <Title
          title="Validasi"
        />
      </RowWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderValidasi}
            isLoading={isLoadingValidasi}
            tableData={validasiDataMapped}
          />
        </BaseContainer>
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default ProjectInformation;

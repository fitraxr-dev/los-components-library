import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useDetailFacility from './DetailFacility.hooks';


const DetailFacility = () => {
  const { tableHeaderList } = useDetailFacility();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Detail Fasilitas"></SectionTitle>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderList}
          tableData={[]}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default DetailFacility;

import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useManajemenShareholder from './ManajemenShareholder.hook';


const ManajemenShareholder = () => {
  const {
    isLoadingManagementList,
    isLoadingShareholderList,
    managementListData,
    shareholderListData,
    tableShareholderHeader,
    tableManajemenHeader,
    pageShareholder,
    setPageShareholder,
    setPageSizeShareholder,
    pageManagement,
    setPageManagement,
    setPageSizeManagement,
  } = useManajemenShareholder();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Shareholder" isOpen>
          <BaseContainer>
            <Table
              isLoading={isLoadingShareholderList}
              tableData={shareholderListData?.shareholderList}
              tableHeader={tableShareholderHeader}
              totalPage={shareholderListData?.shareholderPage?.totalPage ?? 1}
              currentPage={pageShareholder}
              handlePageChange={setPageShareholder}
              onPageSizeChange={setPageSizeShareholder}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>

      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Manajemen" isOpen>
          <BaseContainer>
            <Table
              isLoading={isLoadingManagementList}
              tableData={managementListData?.contents}
              tableHeader={tableManajemenHeader}
              totalPage={managementListData?.page?.totalPage ?? 1}
              currentPage={pageManagement}
              handlePageChange={setPageManagement}
              onPageSizeChange={setPageSizeManagement}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>

    </ColumnWrapper>
  );
};

export default ManajemenShareholder;

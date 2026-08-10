import { TypeModule } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTableManagement from './TableManagement.hook';

import type { TableManagementProps } from './TableManagement.types';


const TableManagement = ({
  module,
  onSelectedChange,
  selected,
  viewOnly,
  status,
  tableType,
}: TableManagementProps) => {
  const {
    noPage,
    setNoPage,
    setItemPerPage,
    handleNewData,
    tableHeaderManagement,
    tableDataManagement,
    managementPage,
    isLoading,
  } = useTableManagement({ module, onSelectedChange, selected, status, tableType, viewOnly });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Management" isOpen>
        <BaseContainer>
          <Table
            tableHeader={tableHeaderManagement}
            tableData={tableDataManagement}
            isLoading={isLoading}
            // footer={viewOnly || module !== TypeModule.CREDIT_CHECKING &&
            // <TableFooter onClick={() => handleNewData()} />
            // }
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            totalPage={managementPage?.totalPage}
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TableManagement;

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useTabSummary from './TabSummary.hook';


const TabSummary = () => {
  const {
    isLoading,
    renderButtons,
    tableData,
    tableHeader,
  } = useTabSummary();

  return (
    <ColumnWrapper gap={3}>
      <Title title="Summary" />

      <SectionTitle title="Update" isOpen>
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
          isLoading={isLoading}
          isMaintenanceParameterBar={true}
        />
      </SectionTitle>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        {renderButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabSummary;

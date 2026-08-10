import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import useCustomRouter from '@/hooks/useCustomRouter';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ParameterSyariahDetailModal from '../../../CommonComponent/ParameterSyariahDetailModal/ParameterSyariahDetailModal';

import { MODAL } from './TabSummary.constants';
import useTabSummary from './TabSummary.hook';


const TabSummary = () => {
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    isLoading,
    page,
    pageSize,
    pageTitle,
    renderButtons,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    tablePage,
  } = useTabSummary();

  return (
    <ColumnWrapper gap={3}>
      <Title title="Summary" />

      <SectionTitle title={pageTitle} isOpen></SectionTitle>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
          isLoading={isLoading}
          isMaintenanceParameterBar={true}
          currentPage={page}
          totalPage={tablePage?.totalPage || 1}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>

      {/* Conditional Buttons from Hook */}
      {renderButtons() && (
        <RowWrapper gap={2} alignItems="center" justifyContent="end">
          {renderButtons()}
        </RowWrapper>
      )}

      {/* Modal Definition */}
      <ModalDef
        id={MODAL.PARAMETER_SYARIAH_DETAIL}
        component={ParameterSyariahDetailModal}
      />
    </ColumnWrapper>
  );
};

export default TabSummary;

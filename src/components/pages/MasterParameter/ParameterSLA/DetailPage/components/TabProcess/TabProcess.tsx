import { ModalDef } from '@ebay/nice-modal-react';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useMasterParameterTabs } from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';
import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { TAB } from '../../Detail.constant';

import EditProcessSLAModal from './components/EditProcessSLAModal';
import { MODAL } from './TabProcess.constant';
import useTabProcess from './TabProcess.hook';


const TabProcess = () => {
  const router = useCustomRouter();
  const { setActiveTab } = useMasterParameterTabs();
  const { isViewOnly, mode } = useMasterParameter();

  const {
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useTabProcess();

  return (
    <ColumnWrapper gap={3}>
      <Title title="Process" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
          totalPage={totalPage ?? 1}
          currentPage={page}
          handlePageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
        />
      </BaseContainer>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => router.push(MASTER_PARAMETER.PARAMETER_SLA_LIST_PAGE)}
        >
          Close
        </Button>
        {!isViewOnly && mode === 'submission' && (
          <Button
            variant="contained"
            onClick={() => setActiveTab(TAB.SUMMARY)}
          >
            Next
          </Button>
        )}
      </RowWrapper>

      <ModalDef
        id={MODAL.EDIT_PROCESS_SLA_MODAL}
        component={EditProcessSLAModal}
      />
    </ColumnWrapper>
  );
};

export default TabProcess;

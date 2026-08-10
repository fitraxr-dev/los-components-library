'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import Remark from './components/Remark/Remark';
import TableDebtor from './components/TableDebtor';
import TableManagement from './components/TableManagement';
import TableShareholder from './components/TableShareholder';
import useManagementShareholderHook from './ManagementShareholder.hook';


const ManagementShareholderPage = () => {
  const {
    activeTab,
    control,
    saveDebiturPending,
    saveManagementPending,
    saveShareholderPending,
    shouldViewOnly,
    handleChangeTab,
    onSaveHandler,
    handleCloseButton,
    shouldRenderForm,
    debtorId,
    isPemda,
    isAutoSaveFetching,
  } = useManagementShareholderHook();

  const isSaving = saveManagementPending || saveDebiturPending || saveShareholderPending;

  const renderEditMode = (
    <RowWrapper sx={{ justifyContent: 'end', py: 4 }}>
      <Button
        isLoading={isSaving}
        onClick={onSaveHandler}
        sx={{ mr: 1 }}
        disabled={isSaving || isAutoSaveFetching}
      >
        {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
      </Button>
    </RowWrapper>
  );

  const renderViewOnlyMode = (
    <RowWrapper sx={{ justifyContent: 'end', py: 4 }}>
      <Button
        variant="outlined"
        sx={{ mr: 3 }}
        onClick={handleCloseButton}
      >
        Close
      </Button>
    </RowWrapper>
  );

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Manajemen & Shareholder" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: number) => handleChangeTab(val)}
        items={[
          { label: 'Customer' },
          { label: 'Shareholder' },
          { label: 'Manajemen' },
          // ...(!isHaveFrom ? [{ label: 'Pihak Lain' }] : []),
        ]}
      />
      <TableDebtorInformation
        module={TypeModule.PIPELINE}
        process={TypeProcess.PIPELINE}
        showDifferentDataAlert={false}
      />
      <TabItem activeValue={activeTab} value={0}>
        <TableDebtor />
      </TabItem>
      <TabItem activeValue={activeTab} value={1}>
        <TableShareholder isPemda={isPemda} />
      </TabItem>
      <TabItem activeValue={activeTab} value={2}>
        <TableManagement />
      </TabItem>

      {/* <TabItem activeValue={activeTab} value={3}>
        <TableOtherParties />
      </TabItem> */}

      <Remark control={control} viewOnly={shouldViewOnly} />

      {shouldRenderForm ? renderEditMode : renderViewOnlyMode}

    </ColumnWrapper>
  );
};

export default ManagementShareholderPage;

'use client';
import { TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtor from '@/components/shared/SmiTable/ManagementAndShareholder/TableDebtor';
import TableManagement from '@/components/shared/SmiTable/ManagementAndShareholder/TableManagement';
import TableShareholder from '@/components/shared/SmiTable/ManagementAndShareholder/TableShareholder';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import Remark from './components/Remark/Remark';
import TableDebtorInformation from './components/TableDebtorInformation';
import TableOtherParties from './components/TableOtherParties';
import useManagementShareholderHook from './Detail.hook';


const ManagementShareholderPage = () => {
  const {
    activeTab,
    control,
    saveDebiturPending,
    saveManagementPending,
    saveShareholderPending,
    shouldViewOnly,
    debtorModule,
    handleChangeTab,
    onSubmitHandler,
    onSaveHandler,
    handleCloseButton,
    theme,
    isStaff,
    shouldViewOnlyTable,
    shouldRenderForm,
    debtorId,
    isHaveFrom,
  } = useManagementShareholderHook();

  const renderEditMode = (
    <RowWrapper sx={{ justifyContent: 'end', py: 4 }}>
      <Button
        isLoading={saveManagementPending || saveDebiturPending || saveShareholderPending}
        onClick={onSaveHandler}
        sx={{ mr: 1 }}
      >{isStaff ? 'Save' : 'Return to Staff'}
      </Button>
      <Button
        isLoading={saveManagementPending || saveDebiturPending || saveShareholderPending}
        onClick={onSubmitHandler}
        sx={{ bgcolor: theme.palette.success.main, mr: 1 }}
      >{isStaff ? 'Submit' : 'Approve'}
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
          ...(!isHaveFrom ? [{ label: 'Pihak Lain' }] : []),
        ]}
      />
      <TableDebtorInformation
        debtorId={debtorId}
      />
      <TabItem activeValue={activeTab} value={0}>
        <TableDebtor module={debtorModule} viewOnly={shouldViewOnlyTable} />
      </TabItem>
      <TabItem activeValue={activeTab} value={1}>
        <TableShareholder module={debtorModule} process={TypeProcess.MAINTENANCE_DEBTOR} />
      </TabItem>
      <TabItem activeValue={activeTab} value={2}>
        <TableManagement module={debtorModule} viewOnly={shouldViewOnlyTable} />
      </TabItem>

      <TabItem activeValue={activeTab} value={3}>
        <TableOtherParties />
      </TabItem>

      <Remark control={control} viewOnly={shouldViewOnly} />

      {!isHaveFrom && (shouldRenderForm ? renderEditMode : renderViewOnlyMode)}

    </ColumnWrapper>
  );
};

export default ManagementShareholderPage;

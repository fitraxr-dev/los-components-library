'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
// import TableDebtor from '@/components/shared/SmiTable/ManagementAndShareholder/TableDebtor';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import { modal } from '../components/ActionFooterDetail/ActionFooterDetail.constant';
import ModalPlafonValidation from '../components/ModalPlafonValidation/ModalPlafonValidation.page';

import Remark from './components/Remark/Remark';
import TableDebtor from './components/TableDebtor';
import TableDebtorInformation from './components/TableDebtorInformation';
import TableManagement from './components/TableManagement';
import TableOtherParties from './components/TableOtherParties';
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
    isPemda,
  } = useManagementShareholderHook();

  const renderEditMode = (
    <RowWrapper sx={{ justifyContent: 'end', py: 4 }}>
      <Button
        isLoading={saveManagementPending || saveDebiturPending || saveShareholderPending}
        onClick={onSaveHandler}
        sx={{ mr: 1 }}
      >{isStaff ? 'Save' : 'Return to Staff'}
      </Button>
      {!isHaveFrom && (
        <Button
          isLoading={saveManagementPending || saveDebiturPending || saveShareholderPending}
          onClick={onSubmitHandler}
          sx={{ bgcolor: theme.palette.success.main, mr: 1 }}
        >{isStaff ? 'Submit' : 'Approve'}
        </Button>
      )}
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
        <TableDebtor />
      </TabItem>
      <TabItem activeValue={activeTab} value={1}>
        <TableShareholder isPemda={isPemda} />
      </TabItem>
      <TabItem activeValue={activeTab} value={2}>
        <TableManagement />
      </TabItem>

      <TabItem activeValue={activeTab} value={3}>
        <TableOtherParties />
      </TabItem>

      <Remark control={control} viewOnly={shouldViewOnly} />


      <ModalDef
        id={modal.PLAFON_VALIDATION}
        component={ModalPlafonValidation}
      />
    </ColumnWrapper>
  );
};

export default ManagementShareholderPage;

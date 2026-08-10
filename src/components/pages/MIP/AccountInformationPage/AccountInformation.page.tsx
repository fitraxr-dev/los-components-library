'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import { modal } from './AccountInformation.constants';
import { useAccountInformation } from './AccountInformation.hook';
import ModalFormFinancingFacilityOtherBank from './components/ModalFormAccountInformation';
import TableAccountInformationOtherBankSummary from './components/TableAccountInformationOtherBankSummary';


const AccountInformationPage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();
  const theme = useTheme();
  const { processId } = useIdentity();

  const {
    bucketMasterId,
    noPage,
    setItemPerPage,
    setNoPage,
    isSaveLoading,
    isAutoSaveFetching,
    handleSave,
    tableData,
    tablePage,
    isAccountInfoListLoading,
    setShouldGoNext,
    tableHeaderAccountInfo,
    handleOpenAddModal,
    desc,
    setDesc,
    stepperStatus,
    stepperSteps,
  } = useAccountInformation();

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Informasi Rekening" />
      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />
      <SectionTitle title="Informasi Rekening" sx={{ marginBottom: theme.spacing(3) }} isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            maxHeight="42vh"
            isLoading={isAccountInfoListLoading}
            tableHeader={tableHeaderAccountInfo}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={!viewOnly && (<TableFooter onClick={handleOpenAddModal} />)}
          />
        </BaseContainer>
      </SectionTitle>
      <TableAccountInformationOtherBankSummary />
      <Input
        label="Keterangan"
        type="area"
        rows="3"
        value={desc}
        onChange={((val) => setDesc(val))}
        placeholder="Input keterangan"
        containerSx={{ flex: 1, mt: 2 }}
        disabled={viewOnly}
      />

      <RowWrapper justifyContent="end" gap={theme.spacing(2)}>
        {viewOnly ? (
          <Button
            isLoading={isSaveLoading}
            onClick={() => {setShouldGoNext(true);}}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isSaveLoading}
              disabled={viewOnly || isAutoSaveFetching}
              onClick={() => {setShouldGoNext(false); handleSave();}}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isSaveLoading}
              onClick={() => {setShouldGoNext(true); handleSave();}}
              disabled={viewOnly}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
      <ModalDef
        id={modal.FORM_ACCOUNT_INFORMATION}
        component={ModalFormFinancingFacilityOtherBank}
      />
    </ColumnWrapper>
  );
};

export default AccountInformationPage;

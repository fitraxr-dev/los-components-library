'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

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

import ModalDetailFinancingFacilityExisting from './components/ModalDetailFinancingFacilityExisting';
import ModalDetailFinancingFacilityOtherBank from './components/ModalDetailFinancingFacilityOtherBank';
import ModalFormFinancingFacilityOtherBank from './components/ModalFormFinancingFacilityOtherBank';
import TableFinancingFacilityExistingSummary from './components/TableFinancingFacilityExistingSummary';
import TableFinancingFacilityOtherBank from './components/TableFinancingFacilityOtherBank';
import TableFinancingFacilityOtherBankSummary from './components/TableFinancingFacilityOtherBankSummary';
import { modal } from './FinancingFacility.constants';
import { useFinancingFacility } from './FinancingFacility.hook';


const FinancingFacilityPage = () => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const { processId } = useIdentity();

  const {
    bucketMasterId,
    handleOnSave,
    isSaveLoading,
    isAutoSaveFetching,
    isFetchFacilityExistingLoading,
    tableHeaderExisting,
    form,
    setShouldGoNext,
    isPemda,
    itemPerPage,
    noPage,
    setNoPage,
    setItemPerPage,
    tableData,
    tablePage,
    stepperStatus,
    stepperSteps,
  } = useFinancingFacility();

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
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
          <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />
          <SectionTitle title="Fasilitas Pembiayaan Eksisting" isOpen>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                maxHeight="42vh"
                isLoading={isFetchFacilityExistingLoading}
                tableHeader={tableHeaderExisting}
                tableData={tableData}
                totalPage={Number(tablePage?.totalPage ?? 1)}
                currentPage={noPage}
                handlePageChange={setNoPage}
                onPageSizeChange={setItemPerPage}
              />
            </BaseContainer>
          </SectionTitle>
        </ColumnWrapper>

        <SectionTitle title="Summary Fasilitas Pembiayaan Eksisting" isOpen>
          <TableFinancingFacilityExistingSummary
            itemPerPage={itemPerPage}
            noPage={noPage}
          />

          <Controller
            control={form.control}
            name="remarkExisting"
            render={({ field }) => (
              <Input
                {...field}
                disabled={viewOnly}
                type="area"
                label="Keterangan"
                placeholder="Input keterangan"
                rows={4}
                containerSx={{ flex: 1 }}
              />
            )}
          />


        </SectionTitle>


        {!isPemda &&
          <>
            <TableFinancingFacilityOtherBank />
            <SectionTitle title="Summary Fasilitas Pembiayaan Bank Lain" isOpen>
              <TableFinancingFacilityOtherBankSummary />
              <Controller
                control={form.control}
                name="remarkOtherBank"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={viewOnly}
                    type="area"
                    label="Keterangan"
                    placeholder="Input keterangan"
                    rows={4}
                    containerSx={{ flex: 1 }}
                  />
                )}
              />
            </SectionTitle>
          </>
        }

        <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
          <Button
            isLoading={isSaveLoading}
            disabled={viewOnly || isAutoSaveFetching}
            onClick={() => {setShouldGoNext(false); form.handleSubmit(handleOnSave)();}}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
          <Button
            isLoading={isSaveLoading}
            disabled={viewOnly}
            onClick={() => {setShouldGoNext(true); form.handleSubmit(handleOnSave)();}}
          >
            Next
          </Button>
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={modal.DETAIL_FACILITY_EXISTING}
        component={ModalDetailFinancingFacilityExisting}
      />
      <ModalDef
        id={modal.DETAIL_FACILITY_OTHER_BANK}
        component={ModalDetailFinancingFacilityOtherBank}
      />
      <ModalDef
        id={modal.FORM_FACILITY_OTHER_BANK}
        component={ModalFormFinancingFacilityOtherBank}
      />
    </>
  );
};

export default FinancingFacilityPage;

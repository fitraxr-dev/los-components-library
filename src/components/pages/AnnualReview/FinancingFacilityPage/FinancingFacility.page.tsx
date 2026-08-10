'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

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

  const {
    handleOnSave,
    isSaveLoading,
    isFetchFacilityExistingLoading,
    tableHeaderExisting,
    form,
    isPemda,
    noPage,
    setNoPage,
    setItemPerPage,
    tableData,
    tablePage,
  } = useFinancingFacility();
  const { isDepiDivision } = useAnnualReviewContext();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        {isDepiDivision && (
          <ConfirmationLatest />
        )}
        <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
          <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />
          <SectionTitle title="Fasilitas Pembiayaan Eksisting" isOpen>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                maxHeight="42vh"
                isLoading={isFetchFacilityExistingLoading}
                tableHeader={tableHeaderExisting}
                tableData={tableData}
                totalPage={tablePage?.totalPage ?? 1}
                currentPage={noPage}
                handlePageChange={setNoPage}
                onPageSizeChange={setItemPerPage}
              />
            </BaseContainer>
          </SectionTitle>
        </ColumnWrapper>

        <SectionTitle title="Summary Fasilitas Pembiayaan Eksisting" isOpen>
          <TableFinancingFacilityExistingSummary />

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
                containerSx={{
                  flex: 1,
                  mt: 3,
                }}
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
                    containerSx={{
                      flex: 1,
                      mt: 3,
                    }}
                  />
                )}
              />
            </SectionTitle>
          </>
        }

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          {!viewOnly && (
            <Button
              isLoading={isSaveLoading}
              onClick={form.handleSubmit(handleOnSave)}
            >
              Save
            </Button>
          )}
          <Button
            onClick={() => console.log('Next')}
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

'use client';

import { Info } from '@mui/icons-material';
import { Alert } from '@mui/material';

import { TypeModule } from '@/enums/Module';
import useGoToNextStep from '@/hooks/useGoToNextStep';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useSimpleFormConfirmation from './SimpleFormConfirmation.hook';


const SimpleFormConfirmation = () => {
  const goToNextStep = useGoToNextStep();

  const {
    theme,
    process,
    tableHeader,
    isAutoSaveFetching,
    isLoading,
    data,
    handleCreateMappingStep,
    isCreateLoading,
    isViewOnly,
  } = useSimpleFormConfirmation();

  return (
    <ColumnWrapper>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Title title="Konfirmasi Simple Form" />
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />

        <SectionTitle title="Konfirmasi Simple Form" sx={{ mb: 2 }} isOpen>
          <Alert sx={{ marginBottom: 2 }} icon={<Info fontSize="inherit" />} severity="warning"><TextStyle sx={{ fontSize: 14 }}>PENTING: Wajib memastikan bahwa konfirmasi perubahan telah sesuai dengan informasi yang diterima.</TextStyle></Alert>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isLoading}
              tableHeader={tableHeader}
              tableData={data ?? []}
            // totalPage={tablePage?.totalPage ?? 1}
            // currentPage={noPage}
            // handlePageChange={setNoPage}
            // onPageSizeChange={setItemPerPage}
            />
          </BaseContainer>
        </SectionTitle>
        <RowWrapper justifyContent="end" p={4} gap={theme.spacing(2)}>
          {isViewOnly ? (
            <Button
              onClick={goToNextStep}
              isLoading={isCreateLoading}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleCreateMappingStep({ goToNext: false })}
                isLoading={isCreateLoading}
                disabled={isAutoSaveFetching}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                onClick={() => handleCreateMappingStep({ goToNext: true })}
                isLoading={isCreateLoading}
              >
                Next
              </Button>
            </>
          )}
        </RowWrapper>
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default SimpleFormConfirmation;

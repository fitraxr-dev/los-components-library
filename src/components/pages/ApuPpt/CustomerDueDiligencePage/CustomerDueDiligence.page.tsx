'use client';

import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import TableDocumentVerification from '../components/TableDocumentVerification';

import useCustomerDueDiligence from './CustomerDueDiligence.hook';


const CustomerDueDiligence = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();

  const {
    tableHeader,
    tableData,
    isLoading,
    renderActionButtons,
    process,
    tableHeadChildVerif,
    tableHeadGrandChildVerif,
    listDiff,
    isLoadingBucket,
    showTableUpload,
    isDisabledFromAction,
    control,
  } = useCustomerDueDiligence();


  return (
    <ColumnWrapper>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Title title="Customer Due Diligence" />
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <TableDocumentVerification
            isLoading={isLoading || isLoadingBucket}
            tableData={tableData}
            listDiff={listDiff}
            tableHeaderChild={tableHeadChildVerif}
            tableHeaderGrandChild={tableHeadGrandChildVerif}
            tableHeader={tableHeader}
          />
        </BaseContainer>
        <Controller
          control={control}
          name="remark"
          render={({ field }) => (
            <Input
              {...field}
              label="Keterangan"
              type="area"
              rows={4}
              disabled={isDisabledFromAction || viewOnly}
            />
          )}
        />

        {showTableUpload && <TableUploadDocument
          module={TypeModule.APU_PPT}
          process={process}
          showModalSelector
        />}
        <RowWrapper sx={{ gap: theme.spacing(3), justifyContent: 'end', marginY: theme.spacing(3) }}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>

    </ColumnWrapper>
  );
};

export default CustomerDueDiligence;

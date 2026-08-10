'use client';

import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import TableDocumentVerification from '../components/TableDocumentVerification';

import useDebtorDocument from './DebtorDocument.hook';


const DebtorDocument = () => {
  const theme = useTheme();
  const { goToNextStep } = useApuPptContext();
  const { viewOnly } = useViewOnly();

  const {
    debtorDocumentOptions,
    tableHeader,
    isSaveDocumentRemarkLoading,
    isAutoSaveFetching,
    handleChangeDebtorDocument,
    handleOnSave,
    isDocumentRemarkLoading,
    isDpopDivision,
    process,
    tablerHeadChildCus,
    isDebtorLoading,
    listDataTableDebtor,
    tablerHeadGrandChildCus,
    listDiff,
    isLoadingBucket,
    valDebtorDocument,
    control,
  } = useDebtorDocument();


  return (
    <ColumnWrapper>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Title title="Informasi / Dokumen Customer" />
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />
        <Input
          type="dropdown"
          label="Dokumen Customer"
          placeholder="Choose Dokumen Customer"
          value={valDebtorDocument}
          dropdownList={debtorDocumentOptions}
          onChange={handleChangeDebtorDocument}
          containerSx={{ width: '50%' }}
          disabled={isDpopDivision || viewOnly}
          isMandatory
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <TableDocumentVerification
            tableHeader={tableHeader}
            tableData={listDataTableDebtor}
            tableHeaderGrandChild={tablerHeadGrandChildCus}
            isLoading={isDebtorLoading || isLoadingBucket}
            tableHeaderChild={tablerHeadChildCus}
            listDiff={listDiff}
          />
        </BaseContainer>

        <Controller
          control={control}
          name="remark"
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              label="Keterangan"
              rows={4}
              disabled={viewOnly}
            />
          )}
        />

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          {viewOnly ? (
            <Button
              onClick={goToNextStep}
              isLoading={isSaveDocumentRemarkLoading}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                disabled={isDocumentRemarkLoading || isSaveDocumentRemarkLoading || isAutoSaveFetching}
                isLoading={isSaveDocumentRemarkLoading}
                onClick={() => handleOnSave({ goToNext: false })}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
              <Button
                disabled={isDocumentRemarkLoading || isSaveDocumentRemarkLoading}
                isLoading={isSaveDocumentRemarkLoading}
                onClick={() => handleOnSave({ goToNext: true })}
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

export default DebtorDocument;

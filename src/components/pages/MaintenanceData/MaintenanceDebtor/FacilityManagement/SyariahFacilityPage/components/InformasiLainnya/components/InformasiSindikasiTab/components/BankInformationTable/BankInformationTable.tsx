import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell } from '@mui/material';

import { formatCurrency } from '@/helpers/formatCurrency';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/TableV2';
import TextStyle from '@/components/shared/TextStyle';

import ModalBankInformation from '../ModalBankInformation/ModalBankInformation';
import { modal } from '../ModalBankInformation/ModalBankInformation.constants';

import useBankInformationTable from './BankInformationTable.hook';

import type { BankInformationTableProps } from './BankInformationTable.types';


const BankInformationTable = ({ methods, isReadOnly }: BankInformationTableProps) => {
  const {
    bankFields,
    handleAddItem,
    isLoading,
    tableHeaderBankInformation,
    theme,
    totalAmount,
  } = useBankInformationTable({ isReadOnly, methods });

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <BaseContainer
          sx={{
            gap: 2,
            padding: 3,
          }}
        >
          <Table
            isLoading={isLoading}
            tableData={bankFields}
            tableHeader={tableHeaderBankInformation}
            renderAdditonalRow={() => (
              <>
                <TableCell colSpan={2}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    Total
                  </TextStyle>
                </TableCell>
                <TableCell>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {formatCurrency(String(totalAmount))}
                  </TextStyle>
                </TableCell>
                <TableCell />
              </>
            )}
            footer={(
              isReadOnly ?
                null :
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={handleAddItem}
                  >
                    Add New
                  </Button>
                </RowWrapper>
            )}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={modal.MODAL_BANK_INFORMATION}
        component={ModalBankInformation}
      />
    </>
  );
};
export default BankInformationTable;

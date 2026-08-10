import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import { MODALPK } from '../../PK.constants';
import ModalDetailFacilityPk from '../ModalDetailFacilityPk';

import useTableMappingFacility from './TableMappingFacility.hook';

import type { PkTabsProps } from '../../PK.types';


const TableMappingFacility = ({ handleNextTab, isLegalSigning, isViewOnly, pkStatus }: PkTabsProps) => {
  const {
    tableHeader,
    facilityListContents,
    theme,
    totalOrder,
    handleNext,
    handleSave,
    isAutoSaveFetching,
    isLoading,
    selected,
    viewOnly,
    isCheckbox,
    isPkRoute,
  } = useTableMappingFacility({ handleNextTab, isLegalSigning, isViewOnly, pkStatus });
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Ringkasan Fasilitas Pembiayaan" />
      <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen>
        <BaseContainer sx={{ boxShadow: 7, p: 1 }}>
          <Table
            tableHeader={tableHeader}
            tableData={facilityListContents}
            renderAdditonalRow={() => (
              <>
                <TableCell colSpan={!isLegalSigning && !viewOnly ? 8 : 7}>
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
                    {totalOrder}
                  </TextStyle>
                </TableCell>
              </>
            )}
          />
        </BaseContainer>
      </SectionTitle>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {isCheckbox && isPkRoute && (
          <Button
            isLoading={isLoading}
            onClick={handleSave}
            disabled={isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
        <Button
          isLoading={isLoading}
          onClick={isLegalSigning ? handleNextTab : handleNext}
        >
          Next
        </Button>
      </RowWrapper>
      <ModalDef
        id={MODALPK.DETAIL_FACILITY_PK}
        component={ModalDetailFacilityPk}
      />
    </ColumnWrapper>
  );
};

export default TableMappingFacility;

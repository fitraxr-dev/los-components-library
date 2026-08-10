'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell } from '@mui/material';

import useCustomRouter from '@/hooks/useCustomRouter';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
// import ModalDetailFacilityPk from '@/components/shared/SmiSection/PK/components/ModalDetailFacilityPk';
import ModalDetailFacility from '@/components/shared/SmiSection/PK/components/ModalDetailFacility';
import { MODALPK } from '@/components/shared/SmiSection/PK/PK.constants';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useChildLimit from './ChildLimit.hook';


interface ChildLimitProps {
  financingFacilityId?: number | null;
  setActiveTab: (tab: string) => void;
}

const ChildLimit = ({
  financingFacilityId,
  setActiveTab,
}: ChildLimitProps) => {
  const router = useCustomRouter();
  const {
    tableHeader,
    facilityListContents,
    theme,
    totalOrder,
    handleSave,
    isLoading,
    isLegalSigning,
    isLpsMode,
    isDetailMode,
    disableSave,
    viewOnly,
  } = useChildLimit({
    financingFacilityId: financingFacilityId ? Number(financingFacilityId) : null,
    setActiveTab,
  });

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <ColumnWrapper sx={{ gap: 3, mt: 3 }}>
        <Title title="Ringkasan Fasilitas Pembiayaan" />
        <SectionTitle title="Fasilitas Pembiayaan yang diajukan" isOpen>
          <BaseContainer sx={{ boxShadow: 7, p: 1 }}>
            <Table
              tableHeader={tableHeader}
              tableData={facilityListContents}
              renderAdditonalRow={() => (
                <>
                  <TableCell colSpan={8}>
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
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          {!isLegalSigning && !viewOnly && !isDetailMode ? (
            <Button isLoading={isLoading} disabled={disableSave} onClick={handleSave}>
              Next
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleBack}>
              Cancel
            </Button>
          )}
        </RowWrapper>
        <ModalDef
          id={MODALPK.DETAIL_FACILITY}
          component={ModalDetailFacility}
        />
      </ColumnWrapper>
    </>
  );
};

export default ChildLimit;

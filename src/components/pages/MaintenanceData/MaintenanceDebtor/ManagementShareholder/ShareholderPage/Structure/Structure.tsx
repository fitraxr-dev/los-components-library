'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TableDebtorInformationLocal from '../../../components/TableDebtorInformationLocal';
import ModalDetailStructure from '../ModalDetailStructure';
import { modal } from '../ShareHolder.constant';
import TableNestedChild from '../TableNestedChild';
import TableParent from '../TableParent/TableParent';

import useStructure from './Structure.hook';

import type { TableHeader } from '../TableNestedChild/TableNestedChild.types';


const StructurePage = () => {
  const {
    theme,
    tableHeaderNestedChild,
    tableHeaderParent,
    isLoadingGrouped,
    splitGropuedData,
    parentLevel,
    isDebtor,
    debtorData,
    canEditShareholder,
    differentDataWithApu,
    roleCanEdit,
  } = useStructure();
  const { groupedDataDataChild, groupedDataDataParent } = splitGropuedData();
  return (
    <ColumnWrapper gap={theme.spacing(3)} pb={theme.spacing(3)}>
      <Title title="Struktur Kepemilikan Saham" />
      {roleCanEdit && differentDataWithApu && (
        <RowWrapper
          alignItems="center"
          width="100%"
          mb={2}
          sx={{ backgroundColor: '#fffce4', gap: 2, padding: 2 }}
        >
          <Icon iconName="warning-2" />
          <TextStyle>
            Data Shareholder APU PPT telah berubah, silahkan sesuaikan kembali.
          </TextStyle>
        </RowWrapper>
      )}

      {
        roleCanEdit && !isDebtor && !canEditShareholder && (
          <RowWrapper
            alignItems="center"
            width="100%"
            mb={2}
            sx={{ backgroundColor: '#fffce4', gap: 2, padding: 2 }}
          >
            <Icon iconName="warning-2" />
            <TextStyle>
              Dalam proses pengajuan APU PPT, data tidak dapat diubah.
            </TextStyle>
          </RowWrapper>
        )
      }
      { isDebtor ?
        <>
          <TableDebtorInformationLocal
            debtorName={debtorData?.name}
            gamName={debtorData?.gamName}
            staffName={debtorData?.staffName}
            isNewClient={debtorData?.isNewDebtor}
            cif={debtorData?.cif}
            division={debtorData?.divisionName}
            debtorId={debtorData?.debtorId}
            createdAt={debtorData?.createdDate}
          />
        </> :
        <>
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
          />
        </>
      }
      <TableParent
        tableHeader={tableHeaderParent}
        isLoading={isLoadingGrouped}
        tableData={groupedDataDataParent}
        parentLevel={parentLevel}
        canEditShareholder={canEditShareholder}
      />
      <TableNestedChild
        tableData={groupedDataDataChild}
        tableHeader={tableHeaderNestedChild as TableHeader[]}
        isLoading={isLoadingGrouped}
        parentLevel={parentLevel}
        canEditShareholder={canEditShareholder}
      />
      <ModalDef
        id={modal?.STRUCTURE_MODAL}
        component={ModalDetailStructure}
      />
    </ColumnWrapper>
  );
};

export default StructurePage;

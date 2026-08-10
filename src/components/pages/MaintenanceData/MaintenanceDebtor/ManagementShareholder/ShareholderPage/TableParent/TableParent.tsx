import React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { TableCell, useTheme } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';


import ModalAddStructure from '../Structure/component/ModalAddStructure/ModalAddStructure';
import { GetAccessEdit, modal as MODAL } from '../Structure/Structure.constants';

import { TABLE_HEADER_PARENT } from './TableParent.constant';

import type { TableParentProps } from './TableParent.types';


const TableParent = (props: TableParentProps) => {
  const theme = useTheme();
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const { processId } = useIdentity();
  const isDebtor = processId?.includes('DEBT');
  const [{ stepper }] = useApp();
  const isEdit = GetAccessEdit(stepper);
  const handleAddNewLevel = (level: any) => {
    // const parentList = props.tableData.filter((item: any) => item.level === level);
    NiceModal.show(MODAL.STRUCTURE_ADD_MODAL, {
      action: 'add-level',
      level: level + 1,
      parentLevel: props.parentLevel,
    });
  };

  NiceModal.register(MODAL.STRUCTURE_ADD_MODAL, ModalAddStructure);


  return (
    <SectionTitle title="Tingkat 1" isOpen sx={{ mb: 1 }}>
      {props.tableData?.length > 0 ? props.tableData.map((item, idx) => (
        item.shareholders?.map((holder, idx) => (
          (
            <Table
              key={idx}
              isPaper
              maxHeight="42vh"
              tableHeader={props.tableHeader}
              tableData={holder?.childList}
              renderAdditonalRow={() => (
                <>
                  <TableCell colSpan={1} />
                  <TableCell colSpan={1}>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.dark}
                    >
                      Total
                    </TextStyle>
                  </TableCell>
                  <TableCell colSpan={1}>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.dark}
                    >
                      {holder.totalShares || '-'}
                    </TextStyle>
                  </TableCell>
                  <TableCell>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.dark}
                    >
                      {holder.totalPercentage || 0}%
                    </TextStyle>
                  </TableCell>
                </>
              )}
            />
          )
        ))
      )
      ) : <Table
        isPaper
        maxHeight="42vh"
        tableHeader={TABLE_HEADER_PARENT}
        tableData={[]}
        renderAdditonalRow={() => (
          <>
            <TableCell colSpan={1} />
            <TableCell colSpan={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.dark}
              >
                Total
              </TextStyle>
            </TableCell>
            <TableCell colSpan={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.dark}
              >
                -
              </TextStyle>
            </TableCell>
            <TableCell>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.dark}
              >
                {0}%
              </TextStyle>
            </TableCell>
          </>
        )}
        isLoading={props.isLoading}
      />
      }
      {roleCanEdit && !isDebtor && isEdit && props.canEditShareholder && (
        <Button
          variant="outlined"
          startIcon="add-2"
          startIconSx={{ fontSize: theme.spacing(3) }}
          sx={{ float: 'right', height: theme.spacing(6), mt: theme.spacing(2), padding: theme.spacing(1) }}
          onClick={ () => handleAddNewLevel(props.tableData[0].level)}
        >
          Add New Level
        </Button>
      )}
    </SectionTitle>
  );
};

export default TableParent;

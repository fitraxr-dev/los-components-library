import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Preview } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';


import useSearchListModal from './SearchListModal.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const SearchListModal = NiceModal.create(() => {
  const modalId = MODAL.REVIEW.SEARCH_LIST;
  const modal = useModal(modalId);
  const theme = useTheme();

  const { selected, setSelected } = useSearchListModal();

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected?.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected?.some((el) => el.id === data.id)) {
          setSelected(selected.filter((el) => el.id !== data.id));
        } else {
          setSelected([...selected, data]);
        }
      },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '8%',
      },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama',
    },
  ];

  const tableData = [
    {
      id: 324,
      name: 'Albert',
    },
    {
      id: 234,
      name: 'Elon Musk',
    }
  ];

  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '40vw',
      }}
    >
      <Box marginBottom={theme.spacing(4)}>
        <Input
          type="search"
          hasFilter
          onChange={() => {}}
          placeholder="Pencarian"
          contentList={[]}
          withDropdown={false}
        />
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
        />
      </Box>

      <RowWrapper gap={theme.spacing(3)} justifyContent="end">
        <Button
          disabled={selected.length === 0}
          onClick={() => {}}
        >
          Assign
        </Button>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default SearchListModal;

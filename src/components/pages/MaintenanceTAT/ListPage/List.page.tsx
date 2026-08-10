'use client';


import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import DetailModal from '../components/DetailModal/DetailModal';
import EditModal from '../components/EditModal/EditModal';
import Table from '../components/Table/Table';

import { modal } from './List.constants';
import useList from './List.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const ListPage = () => {
  const canEditTAT = useCheckAccess(accessid.MAINTENANCE_MODAL_UPDATE);

  const {
    TABLE_HEADER_MAINTENANCE_TAT,
    LIST_DATA,
    isEdit,
    isConfirmEdit,
    setIsEdit,
    setIsConfirmEdit,
  } = useList();

  const TABLE_HEADER_MAINTENANCE_TAT_CONFIRM: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <TextStyle variant="body4" weight={700}>
          {row.status}
        </TextStyle>
      ),
    },
    {
      key: 'endOfDay',
      label: 'End Of Day',
    },
    {
      key: 'extraEndOfDay',
      label: 'Extra End Of Day',
    },
    {
      key: 'active',
      label: 'Active',
    },
    {
      key: 'createdBy',
      label: 'Created By',
    },
    {
      key: 'createdDate',
      label: 'Created Date',
    },
    {
      isDisabled: () => false,
      isSelected: (data) => false,
      key: 'checkbox',
      label: 'Confirm',
      onSelectChange: (data) => {},
      type: 'checkbox',
    },
  ];

  const mockDataConfirm = [
    {
      multiRow: {
        header: ['index', 'checkbox'],
        row: [
          {
            active: 'Ya',
            createdBy: 'Reni',
            createdDate: '20 Mei 2024',
            endOfDayDefault: '15:00',
            extraEndOfDay: '17:00',
            feature: 'TAT',
            status: 'Current',
          },
          {
            active: 'Ya',
            createdBy: 'Reni',
            createdDate: '20 Mei 2024',
            endOfDayDefault: '15:00',
            extraEndOfDay: '17:00',
            feature: 'TAT',
            status: 'Last Modified',
          },
        ],
      },
    },
    {
      multiRow: {
        header: ['index', 'checkbox'],
        row: [
          {
            active: 'Ya',
            createdBy: 'Reni',
            createdDate: '20 Mei 2024',
            endOfDayDefault: '15:00',
            extraEndOfDay: '17:00',
            feature: 'TAT',
            status: 'Current',
          },
          {
            active: 'Ya',
            createdBy: 'Reni',
            createdDate: '20 Mei 2024',
            endOfDayDefault: '15:00',
            extraEndOfDay: '17:00',
            feature: 'TAT',
            status: 'Last Modified',
          },
        ],
      },
    },
  ];

  return (
    <>
      <ColumnWrapper gap={2}>
        {isConfirmEdit ?
          <>
            <Title title="Konfirmasi Turn Around Time  (TAT)" />
            <SectionTitle title="Update" />
          </>
          :
          <RowWrapper
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Title title="Maintenance Turn Around Time  (TAT)" />
            {isEdit ?
              <Button
                onClick={() => {
                  setIsConfirmEdit(true);
                }}
                color="success"
              >
                Simpan & Konfirmasi
              </Button>
              :
              <RowWrapper gap={2}>
                <Button onClick={() => {}}>Approval List</Button>
                <Button
                  onClick={() => {
                    setIsEdit((prev) => !prev);
                  }}
                  startIcon="edit"
                  color="info"
                >
                  Edit TAT
                </Button>
              </RowWrapper>
            }
          </RowWrapper>
        }

        <BaseContainer sx={{ boxShadow: 7 }}>
          {isConfirmEdit ?
            <>
              <Table
                tableHeader={TABLE_HEADER_MAINTENANCE_TAT_CONFIRM}
                tableData={mockDataConfirm}
              />

              <RowWrapper sx={{ gap: 3, justifyContent: 'flex-end', py: 3 }}>
                <Button
                  onClick={() => {
                    setIsConfirmEdit(false);
                    setIsEdit(false);
                  }}
                  color="success"
                >
                  Submit
                </Button>
              </RowWrapper>

            </>
            :
            <Table
              tableHeader={TABLE_HEADER_MAINTENANCE_TAT}
              tableData={LIST_DATA.contents}
            />
          }
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={modal.DETAIL_MODAL}
        component={DetailModal}
      />
      <ModalDef
        id={modal.EDIT_MODAL}
        component={EditModal}
      />
    </>
  );
};

export default ListPage;

'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { Paper } from '@mui/material';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import ModalFormMember from './components/ModalFormMember';
import { modal } from './Detail.constants';
import { DetailPageHook } from './Detail.hook';


const DetailPage = () => {
  const {
    tableHeaderMember,
    groupMember,
    groupMemberIsLoading,
    cellData,
    noPage,
    theme,
    setNoPage,
    setItemPerPage,
    popupGroupMemberHandler,
    isJoined,
  } = DetailPageHook();

  return (
    <>
      <ColumnWrapper
        sx={{
          gap: theme.spacing(2),
        }}
      >
        <TextStyle
          variant="title1"
          color={theme.palette.primary.main}
          weight={700}
        >
          Group Detail
        </TextStyle>
        <Paper
          sx={{
            borderRadius: theme.radius(2),
            boxShadow: 2,
            display: 'grid',
            gap: theme.spacing(4),
            gridTemplateColumns: '1fr 1fr',
            overflow: 'hidden',
            padding: theme.spacing(2),
          }}
        >
          {cellData.map((item, index) => (
            <Cell
              key={index}
              title={item.title}
              value={item.value}
            />
          ))}
        </Paper>

        <SectionTitle title="Group Member" isOpen>
          <Table
            maxHeight="42vh"
            tableHeader={tableHeaderMember}
            isLoading={groupMemberIsLoading}
            tableData={
              !groupMember?.contents ||
              groupMember?.contents.every((item) => item === null) ? [] : groupMember?.contents}
            footer={!isJoined ?
              <TableFooter onClick={() => popupGroupMemberHandler('Add New Group Member', 'new')} /> : null
            }
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            totalPage={groupMember?.page.totalPage}
          />
        </SectionTitle>

      </ColumnWrapper>

      <ModalDef
        id={modal.FORM_MEMBER_GROUP}
        component={ModalFormMember}
      />
    </>
  );
};

export default DetailPage;

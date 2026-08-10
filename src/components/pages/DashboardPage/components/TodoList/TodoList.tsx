import React from 'react';

import { Box, useTheme } from '@mui/material';

import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Pagination from '@/components/shared/Pagination';
import Title from '@/components/shared/Title';

import TodoListFilter from '../TodoListFilter';
import TodoListItem from '../TodoListItem';

import useTodoList from './TodoList.hook';


const TodoList = () => {
  const theme = useTheme();

  const [{ currentRole }] = useApp();
  const isTL = currentRole?.includes('TL');
  const isRM = currentRole?.includes('RM');
  const isKadiv = currentRole?.includes('Kadiv');

  const {
    data,
    currentPage,
    setCurrentPage,
    pageSize,
    page,
    setFilter,
    filter,
    setPageSize,
    onClickHandler,
  } = useTodoList();

  const tileContent = isRM ? 'To Do List' : isTL ? 'Approval List' : isKadiv ? 'Approval List' : 'To Do List';


  return (
    <BaseContainer>
      <Title
        title={tileContent}
        customRender={
          <TodoListFilter
            localValue={filter}
            onChangeValue={setFilter}
          />
        }
      />
      {data && data.length > 0 ? (
        <ColumnWrapper sx={{ gap: theme.spacing(1) }}>
          <Box
            sx={{
              justifyContent: 'center',
              maxHeight: theme.spacing(44),
              overflow: 'scroll',
            }}
          >
            <ColumnWrapper
              sx={{
                gap: theme.spacing(2),
                marginRight: theme.spacing(1),
              }}
            >
              {data?.map((item, index) => (
                <TodoListItem
                  key={index}
                  subject={item.debtorName}
                  title={item.statusLabel}
                  date={item.modifiedDate}
                  onClick={() => onClickHandler(item)}
                />
              ))}
            </ColumnWrapper>
          </Box>
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalPage={page.totalPage ?? 1}
            setPageSize={setPageSize}
            handlePageChange={setCurrentPage}
          />
        </ColumnWrapper>
      ) : (
        <Box
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flex: 1,
            margin: theme.spacing(4),
          }}
        >
          <EmptyPlaceholder status="task" />
        </Box>
      )}

    </BaseContainer>
  );
};

export default TodoList;

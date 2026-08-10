import { useEffect } from 'react';

import { Box, Menu } from '@mui/material';

import Button from '@/components/shared/Button';
import PopupFilter from '@/components/shared/Input/components/Search/components/PopupFilter';

import useTodoListFilter from './ListFilter.hook';


const ListFilter = ({
  localValue,
  onChangeValue,
}) => {

  const {
    open,
    handleClick,
    handleClose,
    contentList,
    setLocalValue,
  } = useTodoListFilter({
    localValue,
    onChangeValue,
  });
  return (
    <Box>
      <Button sx={{ padding: 0 }} variant="text" endIcon="filter-2" onClick={handleClick}>
        Filter
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <PopupFilter
          data={localValue}
          listContent={contentList}
          onChange={onChangeValue}
          onClose={handleClose}
        />
      </Menu>
    </Box>
  );

};


export default ListFilter;

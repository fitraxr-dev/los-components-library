import { useEffect } from 'react';

import { Box, Menu, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import PopupFilter from '@/components/shared/Input/components/Search/components/PopupFilter';

import useListFilter from './ListFilter.hook';


const ListFilter = ({
  localValue,
  onChangeValue,
}) => {
  const theme = useTheme();

  const {
    open,
    handleClick,
    handleClose,
    contentList,
    setLocalValue,
  } = useListFilter({
    localValue,
    onChangeValue,
  });
  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '0.5208333333333334vw',
        color: theme.palette.primary.main,
        paddingX: theme.spacing(2),
        paddingY: theme.spacing(1),
      }}
    >
      <Button sx={{ gap: theme.spacing(3), padding: 0 }} variant="text" endIcon="filter" onClick={handleClick}>
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

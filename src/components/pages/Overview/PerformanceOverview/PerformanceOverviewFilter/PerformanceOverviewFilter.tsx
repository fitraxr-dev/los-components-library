'use client';

import { Box, Menu } from '@mui/material';

import Button from '@/components/shared/Button';
import PopupFilter from '@/components/shared/Input/components/Search/components/PopupFilter';

import usePerformanceOverviewFilter from './PerformanceOverviewFilter.hook';


const PerformanceOverviewFilter = ({
  localValue,
  onChangeValue,
}) => {

  const {
    open,
    handleClick,
    handleClose,
    contentList,
    setLocalValue,
  } = usePerformanceOverviewFilter({
    localValue,
    onChangeValue,
  });

  return (
    <Box>
      <Button
        sx={{
          '& .MuiSvgIcon-root': {
            color: '#274664',
            fontSize: 16,
            margin: 0,
          },
          '&:hover': {
            backgroundColor: 'rgba(39, 70, 100, 0.05)',
            boxShadow: 'none',
          },
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: '1.5px solid #274664',
          borderRadius: '10px',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'center',
          minWidth: 'auto',
          padding: '6px',
        }}
        variant="text"
        startIcon="filter-2"
        onClick={handleClick}
      />

      <Menu
        id="performance-overview-menu"
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'performance-overview-button',
        }}
      >
        <PopupFilter
          data={localValue}
          listContent={contentList}
          onChange={setLocalValue}
          onClose={handleClose}
        />
      </Menu>
    </Box>
  );
};

export default PerformanceOverviewFilter;

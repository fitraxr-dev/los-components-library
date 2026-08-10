import { Checkbox, SvgIcon, Tooltip } from '@mui/material';


const CheckboxGroupIcon = null;


import type { CheckboxSelectAllProps } from './CheckboxSelectAll.types';


const ICON_FONT_SIZE = 'clamp(22px, 1.6vw, 36px)';

const CheckboxSelectAll = ({
  checked = false,
  disabled = false,
  indeterminate = false,
  onChange,
  sx,
  tooltipTitle = 'Pilih Semua',
  ...rest
}: CheckboxSelectAllProps) => {
  return (
    <Tooltip placement="top" title={tooltipTitle}>
      <Checkbox
        checked={checked}
        checkedIcon={
          <SvgIcon
            component={CheckboxGroupIcon}
            inheritViewBox
            sx={{ fontSize: ICON_FONT_SIZE }}
          />
        }
        disabled={disabled}
        icon={
          <SvgIcon
            sx={{ fontSize: ICON_FONT_SIZE, overflow: 'visible' }}
            viewBox="0 0 24 24"
          >
            <rect height="11" rx="1" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }} width="11" x="9" y="2" />
            <rect height="14" rx="1" style={{ fill: 'white', stroke: 'currentColor', strokeWidth: 1.5 }} width="14" x="2" y="7" />
          </SvgIcon>
        }
        indeterminate={indeterminate}
        sx={{ '& .MuiSvgIcon-root': { fontSize: ICON_FONT_SIZE }, ...sx }}
        onChange={onChange}
        {...rest}
      />
    </Tooltip>
  );
};

export default CheckboxSelectAll;

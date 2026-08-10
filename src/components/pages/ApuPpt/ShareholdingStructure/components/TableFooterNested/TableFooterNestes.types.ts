import type { BoxProps } from '@mui/material';


export type TableFooterNestedProps = {
  sx?: BoxProps['sx'];
  onClickLevel: () => void;
  onClickRow: () => void;
  onClickDelete: () => void;
  disabled?: boolean;
  isShowBtnAddNewLevel?: boolean;
}

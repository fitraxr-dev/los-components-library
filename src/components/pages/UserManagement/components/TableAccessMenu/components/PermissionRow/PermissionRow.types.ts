import type { AccessMenu } from '../../TableAccessMenu.types';
import type { RowProps } from '../Row/Row.types';


export type PermissionRowProps = Pick<RowProps, 'compute' | 'viewOnly'> & {
  data: AccessMenu;
}

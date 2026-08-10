import type { AccessMenu } from '../../../components/TableAccessMenu/TableAccessMenu.types';


export type AccessMenuList = Array<AccessMenu>

export type CreationAccessMenuProps = {
  creationType: 'add' | 'edit';
}

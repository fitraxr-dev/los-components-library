import type { AccessMenu } from '../../../components/TableAccessMenu/TableAccessMenu.types';


interface AccessMenuItems extends AccessMenu {
  subMenu: AccessMenuItems[];
}

export type ModalAccessMenuProps = {
  accessMenuItems: AccessMenuItems[];
}

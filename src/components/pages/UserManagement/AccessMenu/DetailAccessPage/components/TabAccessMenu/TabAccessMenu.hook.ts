import { createElement, useEffect, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { userManagement } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import { status } from '@/components/pages/UserManagement/components/TableAccessMenu/TableAccessMenu.constants';
import useGetAccessMenuDetail from '@/components/pages/UserManagement/hooks/useGetAccessMenuDetail';
import TextStyle from '@/components/shared/TextStyle';

import useGetApprovalDetail from '../../../hooks/useGetApprovalDetail';

import { tableHeaderList } from './TabAccessMenu.constants';

import type { AccessMenu } from '@/components/pages/UserManagement/components/TableAccessMenu/TableAccessMenu.types';


interface AccessMenuItems extends AccessMenu {
  subMenu: AccessMenuItems[];
}

const useTabAccessMenu = () => {
  const { id } = useParams();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const { idParams, isApproval, isWait, editUser } = useUserManagementContext();

  const {
    data: accesMenuDetailData,
    isSuccess: isAccessMenuDetailSuccess,
  } = useGetAccessMenuDetail({ id: idParams }, {
    enabled: !isApproval,
  });
  const {
    data: accessMenuApprovalDetailData,
    isSuccess: isAccessMenuApprovalDetailSuccess,
  } = useGetApprovalDetail({ id: idParams }, {
    enabled: isApproval,
  });

  const generateMenuDetailData = (item: any) => {
    const temp = item?.menuItems?.map((e) => {
      return e?.permissions ? { ...e, isParent: true, subMenu: [e]} : { ...e };
    }) || [];
    console.log('menu item', temp);

    return { ...item, menuItems: temp };
  };

  const accessMenuDetail = isApproval ? accessMenuApprovalDetailData : accesMenuDetailData;
  const isDetailSuccess = isApproval ? isAccessMenuApprovalDetailSuccess : isAccessMenuDetailSuccess;
  const accessName = accessMenuDetail?.name || 'Access Menu';
  const [processedAccessMenuItems, setProcessedAccessMenuItems] = useState<AccessMenuItems[]>([]);

  const detailData = useMemo(() => generateMenuDetailData(accessMenuDetail), [accessMenuDetail]);

  const calculateDisplayStatus = (item: AccessMenuItems): number => {
    if (item.status === status.checked) {
      return status.checked;
    }

    if (item.subMenu && item.subMenu.length > 0) {
      const subMenuStatuses = item.subMenu.map(calculateDisplayStatus);
      const allSubMenuChecked = subMenuStatuses.every((s) => s === status.checked);
      const someSubMenuChecked = subMenuStatuses.some((s) => s === status.checked || s === status.indeterminate);

      if (allSubMenuChecked) {
        return status.checked;
      } else if (someSubMenuChecked) {
        return status.indeterminate;
      } else {
        return status.unchecked;
      }
    }

    if (item.permissions && item.permissions.length > 0) {
      const allPermissionsChecked = item.permissions.every((perm) => perm.status === status.checked);
      const somePermissionsChecked = item.permissions.some((perm) => perm.status === status.checked);

      if (allPermissionsChecked) {
        return status.checked;
      } else if (somePermissionsChecked) {
        return status.indeterminate;
      } else {
        return status.unchecked;
      }
    }

    return item.status;
  };


  useEffect(() => {
    if (isDetailSuccess && detailData?.menuItems) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: idParams,
        module: TypeModule.ACCESS_MENU,
        process: TypeProcess.ACCESS_MENU,
        remarks: 'view Access Menu detail',
      });
      const transformItemsForDisplay = (items: AccessMenuItems[]): AccessMenuItems[] => {
        return items.map((item) => {
          const newItem = { ...item };

          if (newItem.subMenu && newItem.subMenu.length > 0) {
            newItem.subMenu = transformItemsForDisplay(newItem.subMenu);
          }

          newItem.status = calculateDisplayStatus(newItem);
          return newItem;
        });
      };
      setProcessedAccessMenuItems(transformItemsForDisplay(detailData.menuItems as AccessMenuItems[]));
    }
  }, [isDetailSuccess, detailData]);
  const handleOpenEditAccess = () => {
    router.push(replacePath(userManagement.ACCESS_MENU.EDIT, { id }));
  };

  const tableHeader = [
    {
      isDisabled: false,
      isSelected: false,
      key: 'checkbox',
      onSelectChange: () => { },
      render: () => { },
      sx: {
        minWidth: '4vw',
      },
      type: 'checkbox',
    },
    {
      key: 'label',
      label: (labelName) => createElement(
        TextStyle,
        {
          variant: 'body4',
          weight: 600,
        },
        labelName
      ),
      sx: {
        width: '70%',
      },
      type: 'label',
    },
    ...tableHeaderList,
    {
      key: 'action',
      options: [
        {
          iconName: 'delete',
          isDisabled: true,
          isLoading: false,
          onClick: () => { },
        }
      ],
      sx: {
        minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  const isUserHasChanged = accessMenuDetail?.userHasChanged;
  const isAccessWait = editUser;
  const isShowButton = accessMenuDetail?.editButtonShow;
  return {
    accessMenuItems: processedAccessMenuItems,
    accessName,
    handleOpenEditAccess,
    isAccessWait,
    isShowButton,
    isUserHasChanged,
    tableHeader,
  };
};

export default useTabAccessMenu;

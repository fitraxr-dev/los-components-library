import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { userManagement } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import TextStyle from '@/components/shared/TextStyle';

import { status } from '../../../components/TableAccessMenu/TableAccessMenu.constants';
import useGetAccessMenuDetail from '../../../hooks/useGetAccessMenuDetail';
import useGetApprovalDetail from '../../hooks/useGetApprovalDetail';
import useGetLosMenuList from '../../hooks/useGetLosMenuList';
import useSaveAccessMenu from '../../hooks/useSaveAccessMenu';
import useSubmitAddMenu from '../../hooks/useSubmitAddMenu';

import { CreationAccessMenuSchema, tableHeaderList } from './CreationAddAccess.constants';

import type { CreationAccessMenuProps } from './CreationAddAccess.types';
import type { AccessMenu } from '../../../components/TableAccessMenu/TableAccessMenu.types';
import type * as yup from 'yup';


type MenuItem = {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  status?: number;
  isParent?: boolean;
  permissions?: MenuItem[];
  subMenu?: MenuItem[];
};


function mergeMenus(base: MenuItem[], toMerge: MenuItem[]): MenuItem[] {
  const merged = [...base];

  for (const itemToMerge of toMerge) {
    const existingIndex = merged.findIndex((item) => item.id === itemToMerge.id);

    if (existingIndex === -1) {
      // Item tidak ada, langsung push
      merged.push(itemToMerge);
    } else {
      const existingItem = merged[existingIndex];

      // Gabungkan permissions
      if (itemToMerge.permissions) {
        const existingPermissions = existingItem.permissions || [];
        const newPermissions = itemToMerge.permissions.filter(
          (perm) => !existingPermissions.some((ep) => ep.id === perm.id)
        );
        existingItem.permissions = [...existingPermissions, ...newPermissions];
      }

      // Gabungkan subMenu secara rekursif
      if (itemToMerge.subMenu) {
        existingItem.subMenu = mergeMenus(existingItem.subMenu || [], itemToMerge.subMenu);
      }

      // Update isParent jika perlu
      if (itemToMerge.isParent !== undefined) {
        existingItem.isParent = itemToMerge.isParent;
      }

      // Perbarui item di list utama
      merged[existingIndex] = existingItem;
    }
  }

  return merged;
}
interface AccessMenuItems extends AccessMenu {
  subMenu?: AccessMenuItems[];
  permissions?: AccessMenu[];
  isParent?: boolean;
}

const useCreationAccessMenu = (props: CreationAccessMenuProps) => {
  const { creationType } = props;
  const router = useCustomRouter();
  const { isApproval, currentModule, currentProcess } = useUserManagementContext();
  const { id }: { id: string } = useParams();

  const queryClient = useQueryClient();
  const processIdParams = isApproval && id;
  const isHasProcessIdParams = id;
  const isHasProcessId = id && id.includes('AM-');
  const isAdd = creationType === 'add';
  const isEdit = creationType === 'edit';
  const { recordActivity } = useRecordLog();

  const [newBucketProcessId, setNewBucketProcessId] = useState<string | undefined>(undefined);

  const forms = useForm({
    defaultValues: {
      accessMenu: [],
      accessMenuList: [],
      accessMenuName: '',
    },
    mode: 'onChange',
    resolver: yupResolver(CreationAccessMenuSchema),
  });

  const { control, watch, setValue, reset, getValues } = forms;

  const { fields, remove, update } = useFieldArray({
    control,
    keyName: '_id',
    name: 'accessMenuList',
  });

  const tableHeader = [
    {
      isDisabled: false,
      isSelected: false,
      key: 'checkbox',
      onSelectChange: () => {},
      render: () => {},
      sx: { minWidth: '4vw' },
      type: 'checkbox',
    },
    {
      key: 'label',
      label: (labelName: string) =>
        createElement(TextStyle, { variant: 'body4', weight: 600 }, labelName),
      sx: { width: '70%' },
      type: 'label',
    },
    ...tableHeaderList,
    {
      key: 'action',
      options: [
        {
          iconName: 'delete',
          isDisabled: false,
          isLoading: false,
          onClick: ({ tableId, tableIndex, tableLabel }) => {
            handleDeleteOnTable({ tableId, tableIndex, tableLabel });
          },
        },
      ],
      sx: { minWidth: '4vw' },
      type: 'action',
    },
  ];

  const { mutate: saveAccessMenu } = useSaveAccessMenu({
    onError: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({ title: errorMessage, type: 'error' });
    },
    onSuccess: (response, payload) => {
      recordActivity({
        activity: isEdit ? ActivityType.EDIT : ActivityType.ADD,
        bucketProcessId: response.bucketProcessId,
        changeAfter: JSON.stringify(payload),
        module: TypeModule.ACCESS_MENU,
        process: TypeProcess.ACCESS_MENU,
        remarks: isEdit ? 'edit access menu' : 'add access menu',
      });
      if (response?.bucketProcessId) setNewBucketProcessId(response.bucketProcessId);
      showNiceModalV2({
        onClose() {
          if (isAdd) {
            router.replace(replacePath(userManagement.ACCESS_MENU.EDIT, { id: response.bucketProcessId }));
          }
          if (isHasProcessIdParams && !isHasProcessId) {
            router.push(userManagement.ACCESS_MENU.BUCKET_LIST);
          }
        },
        title: `Pembuatan access menu ${payload.name} berhasil`,
        type: 'success',
      });
    },
  });

  const { mutate: submitAddMenu } = useSubmitAddMenu({
    onError: () => {
      showNiceModalV2({
        title: 'Access Menu gagal ditambahkan',
        type: 'error',
      });
    },
    onSuccess: (response) => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: newBucketProcessId || processIdParams,
        changeAfter: JSON.stringify(response),
        module: TypeModule.ACCESS_MENU,
        process: TypeProcess.ACCESS_MENU,
        remarks: 'Submit Add Data Access Menu',
      });
      const generateAddData = (item: any) => {
        const temp = item?.map((e) => {
          return e?.permissions ? {
            ...e,
            isParent: true,
            status: status.checked,
            subMenu: [{
              ...e,
              permissions: e.permissions.map((perm) => ({
                ...perm,
                status: status.checked,
              })),
              status: status.checked,
            }],
          } : { ...e };
        }) || [];

        return temp;
      };

      const existingList = getValues('accessMenuList');
      const processedResponse = generateAddData(response);

      const mergedMenu = mergeMenus(existingList, processedResponse);

      setValue('accessMenuList', mergedMenu);
    },
  });


  const { mutate: submitBucket } = useSubmitBucket({
    onError: () => showNiceModalV2({ title: 'Data gagal disubmit', type: 'error' }),
    onSuccess: (response) => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: newBucketProcessId || processIdParams,
        changeAfter: JSON.stringify(response),
        module: TypeModule.ACCESS_MENU,
        process: TypeProcess.ACCESS_MENU,
        remarks: 'Submit Add Bucket Access Menu',
      });
      queryClient.invalidateQueries({ queryKey: ['access-menu-approval-list']});
      queryClient.invalidateQueries({ queryKey: ['access-menu-list']});
      showNiceModalV2({
        onClose: () => router.replace(userManagement.ACCESS_MENU.BUCKET_LIST),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { data: losMenuData, isSuccess } = useGetLosMenuList({ menuName: '' });

  const existingAccessMenuKeys = watch('accessMenuList').map((menu) => menu.id);
  const selectedMenuValues = watch('accessMenu');
  const selectedFromLos = losMenuData?.filter((menu) =>
    selectedMenuValues.includes(menu.key)
  ).map((menu) => ({
    label: menu.label,
    value: menu.key,
  })) || [];

  const allLosMenus = losMenuData?.map((menu) => ({
    label: menu.label,
    value: menu.key,
  })) || [];

  const losMenuDropdownList = useMemo(() => {
    const merged = [...selectedFromLos, ...allLosMenus];
    const map = new Map(merged.map((item) => [item.value, item]));
    return Array.from(map.values());
  }, [losMenuData, selectedMenuValues]);

  const { data: approvalDetailData, isSuccess: isApprovalDetailSuccess } = useGetApprovalDetail(
    { id },
    { enabled: !isAdd && isApproval }
  );
  const { data: accessMenuDetailData, isSuccess: isAccessMenuDetailSuccess } = useGetAccessMenuDetail(
    { id },
    { enabled: !isAdd && !isApproval }
  );


  const generateMenuDetailData = (item: any) => {
    const temp = item?.menuItems?.map((e) => {
      return e?.permissions ? { ...e, isParent: true, subMenu: [e]} : { ...e };
    }) || [];
    console.log('menu item', temp);

    return { ...item, menuItems: temp };
  };

  const rawDetailData = isApproval ? approvalDetailData : accessMenuDetailData;
  const isDetailSuccess = isApproval ? isApprovalDetailSuccess : isAccessMenuDetailSuccess;

  const detailData = useMemo(() => generateMenuDetailData(rawDetailData), [rawDetailData]);

  const calculateLoadedStatus = (item: AccessMenuItems): number => {
    if (item.permissions?.length) {
      const allChecked = item.permissions.every((p) => p.status === status.checked);
      const someChecked = item.permissions.some((p) => p.status === status.checked);
      if (allChecked) return status.checked;
      if (someChecked) return status.indeterminate;
    }
    if (item.subMenu?.length) {
      const statuses = item.subMenu.map(calculateLoadedStatus);
      const allChecked = statuses.every((s) => s === status.checked);
      const someChecked = statuses.some((s) => s !== status.unchecked);
      if (allChecked) return status.checked;
      if (someChecked) return status.indeterminate;
    }
    return item.status;
  };

  useEffect(() => {
    if (isEdit && isDetailSuccess && detailData) {
      console.log('detail', JSON.stringify(detailData.menuItems));
      const transformLoadedItems = (items: AccessMenuItems[]): AccessMenuItems[] => {
        return items.map((item) => {
          const newItem = { ...item };
          if (newItem.subMenu) newItem.subMenu = transformLoadedItems(newItem.subMenu);
          if (newItem.permissions)
            newItem.permissions = newItem.permissions.map((perm) => ({ ...perm, status: perm.status }));
          else delete newItem.permissions;
          newItem.status = calculateLoadedStatus(newItem);
          return newItem;
        });
      };

      reset({
        accessMenu: detailData.searchSelected?.map((item) => item.key) || [],
        accessMenuList: transformLoadedItems(detailData.menuItems || []),
        accessMenuName: detailData.name ?? '',
      });
    }
  }, [detailData, isDetailSuccess, isEdit, reset]);
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'accessMenuList') {
        console.log('accessMenuList updated:', value.accessMenuList);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const prevNewMenuIdsCountRef = useRef(0);


  const handleAddMenu = () => {
    const payload = watch('accessMenu');
    const currentAccessMenuList = getValues('accessMenuList');
    const existingAccessMenuKeys = currentAccessMenuList.map((menu) => menu.id);

    const newMenuIdsToAdd = payload.filter((id) => !existingAccessMenuKeys.includes(id));
    const sanitizedAccessMenuList = currentAccessMenuList.map((menu) => {
      if (menu.isParent) {
        const { subMenu, ...rest } = menu; // buang subMenu
        return rest;
      }
      return menu;
    });
    if (newMenuIdsToAdd.length > 0) {
      submitAddMenu({
        accessMenuExisting: isAdd ? sanitizedAccessMenuList : [],
        id: newMenuIdsToAdd,
      });
    } else {
      showNiceModalV2({
        title: 'Tidak ada menu baru yang dipilih untuk ditambahkan',
        type: 'warning',
      });
    }

    prevNewMenuIdsCountRef.current = newMenuIdsToAdd.length;
  };


  const handleDeleteOnTable = ({ tableId, tableIndex, tableLabel }) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const accessMenuList = getValues('accessMenuList');
        const accessMenu = getValues('accessMenu');
        function filterData2ByParent(data1, data2, parentId) {
          const parent = data1.find((item) => item.id === parentId);

          if (!parent || !Array.isArray(parent.subMenu)) {
            return data2;
          }
          const subMenuIds = parent.subMenu.map((sub) => sub.id);

          return data2.filter((id) => !subMenuIds.includes(id));
        }

        const result = filterData2ByParent(accessMenuList, accessMenu, tableId);
        setValue('accessMenu', result);
        remove(tableIndex);
      },
      submitText: 'Ya',
      title: `Apakah anda yakin ingin menghapus ${tableLabel}`,
      type: 'warning',
    });
  };

  const findAndRemoveItem = (items, itemId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].subMenu) {
        if (findAndRemoveItem(items[i].subMenu, itemId)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleDeleteOnAutocomplete = (option) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const currentAccessMenu = getValues('accessMenu');
        const newAccessMenu = currentAccessMenu.filter((val) => val !== option.value);
        setValue('accessMenu', newAccessMenu);

        const accessMenuListCopy = [...getValues('accessMenuList')];

        findAndRemoveItem(accessMenuListCopy, option.value);

        setValue('accessMenuList', accessMenuListCopy);
      },
      submitText: 'Ya',
      title: `Apakah anda yakin ingin menghapus ${option.label}`,
      type: 'warning',
    });};


  const handleDeleteAllOnAutocomplete = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        setValue('accessMenu', []);
        setValue('accessMenuList', []);
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus semua menu?',
      type: 'warning',
    });
  };

  const generateMenuDetailDataPayload = (menuItems: AccessMenuItems[]): AccessMenuItems[] => {
    const dataTemp = menuItems.map((item) => {
      if (item.isParent && item.subMenu && item.subMenu.length > 0) {
        const newItem = { ...item.subMenu[0] };
        return newItem;
      }
      return item;
    });

    return dataTemp;
  };


  const handleOnSave = (data: yup.InferType<typeof CreationAccessMenuSchema>) => {
    const payload = {
      menuItems: generateMenuDetailDataPayload(data.accessMenuList),
      name: data.accessMenuName,
      searchSelected: data.accessMenu,
      ...(isEdit && {
        bucketProcessId: isHasProcessId ? detailData?.bucketProcessId : null,
        permissionCode: detailData?.permissionCode,
      }),
    };
    // console.log("sdw payload ", payload)
    saveAccessMenu(payload);
  };

  const handleOnSubmit = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'SUBMIT',
            bucketProcessId: newBucketProcessId || processIdParams,
            comment,
            module: currentModule,
            process: currentProcess,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleOnCancelProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'CANCELED',
            bucketProcessId: detailData?.bucketProcessId,
            comment,
            module: currentModule,
            process: currentProcess,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const isMandatoryEmpty = !watch('accessMenuName') || watch('accessMenu').length < 1;

  return {
    control,
    fields,
    forms,
    handleAddMenu,
    handleDeleteAllOnAutocomplete,
    handleDeleteOnAutocomplete,
    handleOnCancelProcess,
    handleOnSave,
    handleOnSubmit,
    isAdd,
    isEdit,
    isHasProcessId,
    isHasProcessIdParams,
    isMandatoryEmpty,
    losMenuDropdownList,
    tableHeader,
    update,
  };
};

export default useCreationAccessMenu;

import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { MODAL as modalGlobal } from '@/configs/constants/modalId';
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetBucketDetail from '../../../hooks/useGetBucketDetail';
import useDeleteStructure from '../hooks/useDeleteStructure';
import useGetShareholderStructureList from '../hooks/useGetListShareholderStructure';

import { GetAccessEdit, modal, TABLE_HEADER_NESTED_CHILD, TABLE_HEADER_PARENT } from './Structure.constants';


import type { TableHeader } from '@/components/shared/Table/Table.types';


const useStructure = () => {
  const theme = useTheme();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();
  const pathname = usePathname();
  const router = useCustomRouter();
  const moduleIndex = pathname.split('/')[3];
  const isDebtor = processId?.includes('DEBT');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const [{ stepper }] = useApp();
  const { recordActivity } = useRecordLog();
  const isEdit = GetAccessEdit(stepper);

  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });


  const {
    data: groupedData,
    isSuccess,
    isLoading: isLoadingGrouped,
  } = useGetShareholderStructureList();

  const dataStructure = groupedData?.data;
  const canEditShareholder = dataStructure?.additionalData?.canCreateBucket ||
                              dataStructure?.additionalData?.isEditable;
  const differentDataWithApu = dataStructure?.additionalData?.isDifferentWithApuPpt;

  const {
    data: bucketDetail,
  } = useGetBucketDetail({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer structure page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Shareholder', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/management-shareholder/shareholder` },
      { label: 'Structure', url: '' },
    ]);
  }, []);

  // const handleModalAction = (params: ModalShareholderProps) => {
  //   NiceModal.show(modal.STRUCTURE_MODAL, params);
  // };

  const tableHeaderParent: TableHeader[] = [
    ...TABLE_HEADER_PARENT,
    {
      key: 'action',
      label: 'Action',
      options: [
        // {
        //   iconName: 'detail',
        //   onClick: (data) => {
        //     const newData: ModalShareholderProps = {
        //       beneficialOwner: data?.beneficialOwner,
        //       informationSource: data?.informationSource,
        //       isParentLevel: true,
        //       level: data?.level,
        //       name: data?.name,
        //       percentage: data?.percentage,
        //       prefix: data?.prefix,
        //       shareholder: data?.name,
        //       shares: data?.shares,
        //       suffix: data?.suffix,
        //       type: data?.type,
        //       typeLabel: data?.typeLabel,
        //     };
        //     handleModalAction(newData);
        //   },
        // }
        {
          iconName: 'edit',
          // isDisabled: isViewOnly,
          isDisabled: !roleCanEdit || isDebtor || !canEditShareholder,
          onClick: (data) => {
            router.push(replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_SHAREHOLDER_EDIT, {
              debtorId: processId,
              id: data?.shareholderCode,
              module: moduleIndex,
            }));
          },
        },
      ],
      type: 'action',
    },

  ];

  const [parentLevel, setParentLevel] = useState([]);

  useEffect(() => {
    setParentLevel([]);
    let parent = [];
    if (groupedData) {
      dataStructure?.contents.map((item: any) => {
        item.shareholders.map((items: any) => {
          items.childList.map((child: any) => {
            parent.push({
              label: child.name,
              level: child.level,
              value: child.shareholderCode,
            });
          });

        });
      });
    }
    setParentLevel(parent);
  }, [groupedData]);

  const tableHeaderNestedChild = [
    ...TABLE_HEADER_NESTED_CHILD,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          // isDisabled: isViewOnly,
          isDisabled: !roleCanEdit || isDebtor || !isEdit || !canEditShareholder,
          onClick: (data) => {
            const parent = parentLevel.filter((item: any) => item.level === data.level - 1);
            NiceModal.show(modal.STRUCTURE_ADD_MODAL, {
              ...data,
              action: 'edit',
              parentLevel: groupedData ? parent : '',
            });
          },
        },
        {
          iconName: 'delete',
          // isDisabled: isViewOnly,
          isDisabled: !roleCanEdit || isDebtor || !isEdit || !canEditShareholder,
          onClick: (data) => {
            NiceModal.show(modalGlobal.GLOBAL.CONFIRM, {
              agreeText: 'Ya',
              cancelText: 'Tidak',
              onSubmit: () => handleDeleteStructure(data),
              title: 'Apakah anda yakin ingin menghapus data ini?',
            });
          },
        },
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    },
  ];

  const splitGropuedData = () => {
    const groupedDataDataParent = [];
    const groupedDataDataChild = [];
    let count = 0;

    // console.log('🔍 Debug splitGropuedData:');
    // console.log('- isSuccess:', isSuccess);
    // console.log('- groupedData:', groupedData);
    // console.log('- groupedData?.contents:', groupedData?.contents);
    // console.log('- Type of groupedData?.contents:', typeof groupedData?.contents);
    // console.log('- Is array:', Array.isArray(groupedData?.contents));

    if (isSuccess && groupedData) {
      let tempData = [];

      if (Array.isArray(groupedData?.contents)) {
        tempData = groupedData.contents;
      } else if (Array.isArray(dataStructure?.contents)) {
        tempData = dataStructure.contents;
      } else if (Array.isArray(dataStructure)) {
        tempData = dataStructure;
      } else if (Array.isArray(groupedData)) {
        tempData = groupedData;
      }

      // console.log('- tempData after processing:', tempData);
      // console.log('- tempData length:', tempData.length);

      if (Array.isArray(tempData) && tempData.length > 0) {
        for (const item of tempData) {
          if (item && typeof item === 'object') {
            if (item.level === 1) {
              groupedDataDataParent.push(item);
            } else {
              if (count < 10) {
                groupedDataDataChild.push(item);
              }
              count++;
            }
          }
        }
      } else {
        console.warn('⚠️ tempData is not a valid array:', tempData);
      }
    }

    // console.log('- Final groupedDataDataParent:', groupedDataDataParent);
    // console.log('- Final groupedDataDataChild:', groupedDataDataChild);

    return {
      groupedDataDataChild,
      groupedDataDataParent,
    };
  };

  const { mutate: deleteStructure, isPending: isDeleteLoading } = useDeleteStructure({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId,
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'delete maintenance customer structure',
      });
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDeleteStructure = (payload: any) => {
    const payloadDelete = {
      bucketProcessId: processId.includes('MAI') ? processId : '',
      debtorId: processId.includes('DEBT') ? processId : bucketDetail?.data?.content?.debtorId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      shareholderId: payload.shareholderCode,
    };
    deleteStructure(payloadDelete);
  };

  return {
    canEditShareholder,
    debtorData,
    differentDataWithApu,
    handleDeleteStructure,
    isDebtor,
    isDeleteLoading,
    isLoadingGrouped,
    parentLevel,
    roleCanEdit,
    splitGropuedData,
    tableHeaderNestedChild,
    tableHeaderParent,
    theme,
  };
};

export default useStructure;

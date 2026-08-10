import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';


import useDeleteByLevel from './hooks/useDeleteByLevel';
import useDeleteShareHoldingStructure from './hooks/useDeleteShareHoldingStructure';
import useGetGroupedList from './hooks/useGetGroupList';
import useGetRemarksAndAdditional from './hooks/useGetRemarksandAdditionalInfo';
import useSaveRemarksAndAdditional from './hooks/useSaveRemarksandAdditionalInfo';
import { modal, TABLE_HEADER_NESTED_CHILD, TABLE_HEADER_PARENT } from './ShareholdingStructure.constant';

import type { ModalShareholderProps } from './components/ModalAddNewShareholder/ModalAddNewShareholder.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


export const useShareholdingStructure = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { process } = useApuPpt();
  const { setDirtyMsg } = useContext(DirtyContext);
  const pathname = usePathname();

  const { stepper, goToNextStep } = useApuPptContext();
  const isDpopDivision = process === TypeProcess.APU_PPT_DPOP;
  const isFromHR = stepper.from === 'HR_ASK_FOR_INFO';

  const [container, setContainer] = useState(null);

  const { control, watch, setValue, formState: { isDirty } } = useForm(({
    defaultValues: {
      remark: '',
    },
    mode: 'onChange',
  }));


  const {
    data: groupedData,
    isLoading: isLoadingGrouped,
    isSuccess,
  } = useGetGroupedList({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });


  const { mutate: deleteTableBylevel } = useDeleteByLevel({
    onError() {
      showNiceModalV2({
        onClose: () => {
        }, type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.CONFIRM);
        },
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const splitGropuedData = () => {
    const group = groupedData?.contents || [];
    const lastLevel = group?.length;
    const groupedDataDataParent = [];
    const groupedDataDataChild = [];
    let count = 0;
    if (isSuccess && group) {
      const tempData = groupedData?.contents;
      for (const item of tempData) {
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

    return {
      groupedDataDataChild,
      groupedDataDataParent,
      lastLevel,
    };
  };


  const { data: getRemarksAndAdditionalInfo,
    isLoading: isRemarksAndAdditionalInfoLoading,
    isSuccess: isRemarkSuccess,
  } = useGetRemarksAndAdditional({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const { mutate: deleteShareholdingStructure } = useDeleteShareHoldingStructure({
    onError() {
      showNiceModalV2({
        onClose: () => {
        }, type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });


  const { mutate: saveRemarksandAdditionalInfo, isPending: isLoadingSave } = useSaveRemarksAndAdditional({
    onError() {
      showNiceModalV2({
        onClose: () => {
        }, type: 'error',
      });
    },
  });


  const onSaveRemark = async ({ goToNext }: { goToNext?: boolean }) => {
    saveRemarksandAdditionalInfo({
      bucketProcessId: processId,
      debtorId: bucketDetail?.debtorId,
      description: await convertToDocx(container),
      module: TypeModule.APU_PPT,
      options: {},
      process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      remark: watch('remark'),
    }, {
      onSuccess: () => {
        setDirtyMsg(undefined);
        showNiceModalV2({
          onClose: goToNext ? goToNextStep : undefined,
          type: 'success',
        });
      },
    });
  };

  const handleDelete = (id) => {
    NiceModal.show(
      MODAL.GLOBAL.CONFIRM,
      {
        agreeText: 'Ya',
        cancelText: 'Tidak',
        onSubmit: () => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: RequestByIdDtoLong = {
            id: id,
          };

          deleteShareholdingStructure(payload);
        },
        title: 'Apakah anda yakin ingin menghapus row pada tingkat ini? tindakan anda akan menghapus seluruh row tingkat di bawahnya.',
      },
    );
  };


  const handleModalAction = (params: ModalShareholderProps) => {
    NiceModal.show(modal.SHAREHOLDER_MODAL, params);
  };


  const tableHeaderParent: TableHeader[] = [
    ...TABLE_HEADER_PARENT,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isDisabled: viewOnly,
          onClick: (data) => {
            const newData: ModalShareholderProps = {
              action: 'edit',
              beneficialOwner: data?.beneficialOwner,
              id: data?.id,
              informationSource: data?.informationSource,
              isParentLevel: true,
              level: data?.level,
              name: data?.name,
              parentId: data?.parentId,
              percentage: data?.percentage,
              prefix: data?.prefix,
              shareHolderLevel: data?.level <= 1 ? 1 : data?.level - 1,
              shares: data?.shares,
              suffix: data?.suffix,
              type: data?.type,
            };
            handleModalAction(newData);
          },
        }
      ],
      type: 'action',
    },
  ];

  const tableHeaderNestedChild = [
    ...TABLE_HEADER_NESTED_CHILD,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isDisabled: viewOnly,
          onClick: (data) => {
            const newData: ModalShareholderProps = {
              action: 'edit',
              beneficialOwner: data?.beneficialOwner,
              id: data?.id,
              informationSource: data?.informationSource,
              isParentLevel: false,
              level: data?.level,
              name: data?.name,
              parentId: data?.parentId,
              percentage: data?.percentage,
              prefix: data?.prefix,
              shareHolderLevel: data?.level <= 1 ? 1 : data?.level - 1,
              shares: data?.shares,
              suffix: data?.suffix,
              type: data?.type,

            };
            handleModalAction(newData);
          },
        },
        {
          iconName: 'delete',
          isDisabled: viewOnly,
          onClick: (data) => {
            handleDelete(data?.id);
          },
        }
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    },
  ];


  useEffect(() => {
    if (isRemarkSuccess && getRemarksAndAdditionalInfo) {
      setValue('remark', getRemarksAndAdditionalInfo?.content?.remark || '');
    }
  }, [getRemarksAndAdditionalInfo, isRemarkSuccess]);

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, pathname]);

  const onDeleteLevelTable = (level) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onCancel: () => closeNiceModal(MODAL.GLOBAL.CONFIRM),
      onSubmit: () => {
        deleteTableBylevel({
          bucketProcessId: processId,
          level,
          module: TypeModule.APU_PPT,
          process,
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus tingkat ini? tindakan anda akan menghapus seluruh tingkat di bawahnya.',
      type: 'warning',
    });
  };

  const handleGotoCustomer = () => {
    const path = replacePath(
      maintenanceDebtor.LIST_PAGE,
      {
        debtorId: bucketDetail?.debtorId,
        from: 'apu-ppt',
        module: 'maintenance',
      });
    window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
  };

  const listButtons = [
    {
      disabled: false,
      iconName: 'goto-maintenance-customer',
      isLoading: false,
      label: 'Go To Maintenance Customer',
      onClick: handleGotoCustomer,
    }
  ];

  const initialSectionFormat = {
    bottomMargin: 5.00,
    footerDistance: 0,
    headerDistance: 0,
    leftMargin: 5.00,
    pageHeight: 792,
    pageWidth: 447.30,
    rightMargin: 5.00,
    topMargin: 0,
  };

  const watchedValues = watch();

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    if (!container && !watchedValues.remark) {
      return Promise.resolve(null);
    }

    const description = container ? await convertToDocx(container) : getRemarksAndAdditionalInfo?.content?.description || '';

    const payload = {
      bucketProcessId: processId,
      debtorId: bucketDetail?.debtorId,
      description: description,
      module: TypeModule.APU_PPT,
      options: {},
      process: isDpopDivision ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      remark: watchedValues.remark,
    };

    return Promise.resolve(payload);
  }, [container,
    watchedValues.remark,
    processId,
    bucketDetail?.debtorId,
    isDpopDivision,
    getRemarksAndAdditionalInfo?.content?.description]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly &&
              !!processId &&
              !!bucketDetail?.debtorId &&
              (!!container || !!watchedValues.remark),
    payload: autoSavePayload,
    url: 'mip.apuppt.saveRemark',
  });


  return {
    container,
    control,
    getRemarksAndAdditionalInfo,
    handleModalAction,
    initialSectionFormat,
    isAutoSaveFetching,
    isLoadingGrouped,
    isLoadingSave,
    isRemarksAndAdditionalInfoLoading,
    listButtons,
    onDeleteLevelTable,
    onSaveRemark,
    process,
    processId,
    setContainer,
    setValue,
    splitGropuedData,
    tableHeaderNestedChild,
    tableHeaderParent,
    watch,
  };
};

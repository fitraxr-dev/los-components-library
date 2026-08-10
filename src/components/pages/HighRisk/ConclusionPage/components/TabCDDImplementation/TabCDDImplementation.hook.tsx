import { useContext, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import { tab } from '../../Conclusion.constants';

import useDeleteSpecialApprovalType from './hooks/useDeleteSpecialApprovalType';
import useGetDetailSpecialApproval from './hooks/useGetDetailSpecialApproval';
import useGetSpecialApprovalTypeList from './hooks/useGetSpecialApprovalTypeList';
import useSaveSpecialApproval from './hooks/useSaveSpecialApproval';
import { modal } from './TabCDDImplementation.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabCDDImplementation = ({ handleNextTab }) => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [descriptionContainer, setDescriptionContainer] = useState(null);

  const { data: specialApprovalOptions } = useGetParameterList('specialApproval');

  const { data: specialApprovalDetail, isLoading: isDetailLoading } = useGetDetailSpecialApproval({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { mutate: saveSpecialApproval, isPending: isSaveLoading } = useSaveSpecialApproval({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });

  const { mutate: deleteSpecialApproval } = useDeleteSpecialApprovalType({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnDelete = (id: number) => {
    deleteSpecialApproval({
      options: {
        bucketProcessId: processId,
        module: TypeModule.HIGH_RISK,
        process: TypeProcess.HIGH_RISK_DK,

      },
      payload: {
        id,
      },
    });
  };

  const { data: specialApprovalListData, isLoading: isSpecialApprovalLoading } = useGetSpecialApprovalTypeList({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const tableData = specialApprovalListData?.contents?.map((item) => ({
    ...item,
    description: item.description ?? '-',
    type: item.typeSpecialApprovalLabel ?? '-',
  }));

  const tablePage = specialApprovalListData?.page;

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'type',
      label: 'Persetujuan Khusus',
      sx: {
        minWidth: '22vw',
      },
    },
    {
      key: 'description',
      label: 'Deksripsi',
      render: (data) => (
        <TextStyle
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            overflow: 'hidden',
          }}
        >
          {data?.description?.trim()}
        </TextStyle>
      ),
      sx: {
        minWidth: '25vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          isDisabled: viewOnly,
          onClick: (row) => {
            showNiceModalV2(
              {
                onSubmit: () => handleOnDelete(Number(row.id)),
                submitText: 'Ya',
                title: 'Apakah Anda yakin ingin menghapus data?',
                type: 'warning',
              });
          },
        },
        {
          iconName: 'edit',
          isDisabled: viewOnly,
          onClick: (row) => {
            NiceModal.show(modal.ADD_SPECIAL_APPROVAL, {
              description: row.description,
              id: row.id,
              specialApprovalOptions,
              specialNote: row.specialNote,
              typeSpecialApproval: row.typeSpecialApproval,
            });
          },
        },
        {
          iconName: 'detail',
          onClick: (row) => {
            NiceModal.show(modal.DETAIL_SPECIAL_APPROVAL, {
              description: row.description,
              id: row.id,
              specialApprovalOptions,
              specialNote: row.specialNote,
              typeSpecialApproval: row.typeSpecialApproval,
            });
          },
        }
      ],
      sx: {
        minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  const handleOpenAddModal = () => {
    NiceModal.show(modal.ADD_SPECIAL_APPROVAL, {
      specialApprovalOptions,
    });
  };

  const handleSave = async ({ goToNext }: { goToNext?: boolean }) => {
    const description = await convertToDocx(descriptionContainer);

    saveSpecialApproval({
      bucketProcessId: processId,
      description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    }, {
      onSuccess: () => {
        showNiceModalV2({
          onClose: () => {
            closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
              goToNext ? handleNextTab(tab.ADDITIONAL_INFORMATION) : undefined;
            });
          },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      },
    });
  };

  const autoSavePayload = useMemo(() => async () => {
    const descriptionBlob = await convertToDocx(descriptionContainer);

    return {
      bucketProcessId: processId,
      description: descriptionBlob,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    };
  }, [descriptionContainer, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!specialApprovalDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.hr.saveSpecial',
  });

  return {
    descriptionContainer,
    handleOpenAddModal,
    handleSave,
    isAutoSaveFetching,
    isDetailLoading,
    isSaveLoading,
    isSpecialApprovalLoading,
    noPage,
    setDescriptionContainer,
    setItemPerPage,
    setNoPage,
    specialApprovalDetail,
    specialApprovalOptions,
    tableData,
    tableHeader,
    tablePage,
  };
};
export default useTabCDDImplementation;

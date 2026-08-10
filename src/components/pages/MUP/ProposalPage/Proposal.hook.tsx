import { useContext, useState } from 'react';


import { mup } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';

import useDeleteStructure from './hooks/useDeleteStructure';
import useGetFinancingStructureList from './hooks/useGetFinancingStructureList';
import useGetProposalDetail from './hooks/useGetProposalDetail';
import useSaveProposal from './hooks/useSaveProposal';
import { tab, tableHeaderList } from './Proposal.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProposal = () => {
  const { processId } = useIdentity();
  const { goToNextStep } = useMUPContext();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [activeTab, setActiveTab] = useState(tab.PROPOSAL);
  const [containerProposal, setContainerProposal] = useState(undefined);
  const [containerStructure, setContainerStructure] = useState(undefined);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };


  const {
    data: financingProposalList,
    isFetching: isFetchingList,
  } = useGetFinancingStructureList({
    filter: {
      bucketProcessId: processId as string,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
  });
  const {
    data: financingProposalDetail,
    isFetching: isFetchLoading,
  } = useGetProposalDetail({
    bucketProcessId: processId as string,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveFinancingProposal } = useSaveProposal({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { isPending: isDeleteLoading, mutate: deleteStructure } = useDeleteStructure({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: () => {
        return [
          {
            iconName: 'edit',
            onClick: (row) => {
              router.push(
                replacePath(
                  mup.MUNICIPAL_FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE,
                  {
                    id: row.id,
                    processId: row.bucketProcessId,
                  }
                ));
            },
          },
          {
            iconName: 'delete',
            isDisabled: isDeleteLoading,
            onClick: (row) => {
              handleDelete(row?.id);
            },
          }
        ];
      },
      type: 'action',
    },
  ];

  const handleSave = async () => {
    if (viewOnly) {
      goToNextStep();
    } else {
      if (activeTab === tab.PROPOSAL) {
        const description = await convertToDocx(containerProposal);
        saveFinancingProposal({
          bucketProcessId: processId as string,
          description: description,
          module: TypeModule.MUP,
          process: TypeProcess.MUP,
        });
        handleChangeTab(tab.STRUCTURE);
      } else {
        goToNextStep();
      }
    }
  };

  const handleDelete = (id) => {
    showNiceModalV2(
      {
        onSubmit: () => {
          deleteStructure({
            id: id,
          });
        },
        submitText: 'Ya',
        title: 'Apakah Anda yakin ingin menghapus data?',
        type: 'warning',
      });

  };

  return {
    activeTab,
    containerProposal,
    containerStructure,
    financingProposalDetail,

    financingProposalList,
    // financingStructureDetail,
    handleChangeTab,
    handleSave,
    isFetchLoading,
    isFetchingList,
    isSaveLoading,
    itemPerPage,
    page,
    processId,
    setContainerProposal,
    setContainerStructure,
    setItemPerPage,
    setPage,
    tableHeader,
  };
};

export default useProposal;

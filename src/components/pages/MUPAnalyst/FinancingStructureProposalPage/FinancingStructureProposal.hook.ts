import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';


import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';

import { tableHeaderList } from './FinancingStructureProposal.constants';
import useDeleteFinancingStructureProposal from './hooks/useDeleteFinancingStructureProposal';
import useGetFinancingStructureProposal from './hooks/useGetFinancingStructureProposalList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useFinancingStructureProposal = () => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const { goToNextStep } = useMUPAnalystContext();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data, isLoading } = useGetFinancingStructureProposal({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const financingContents = data?.contents?.map((content) => ({
    ...content,
    title: content.title ?? '-',
  }));
  const financingPage = data?.page;

  const { mutate: deleteProposal, isPending: isDeleteProposalLoading } = useDeleteFinancingStructureProposal({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDelete = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteProposal({
        bucketProcessId: processId,
        module: TypeModule.MUP,
        payload: {
          id,
        },
        process: TypeProcess.MUP,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus data ini?',
      type: 'warning',
    });
  };

  const handleOpenAddForm = () => {
    router.push(replacePath(mup.FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE, { processId }));
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isDisabled: isDeleteProposalLoading || viewOnly,
          onClick: (row) => {
            router.push(
              replacePath(
                mup.FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE,
                {
                  id: row.id,
                  processId: row.bucketProcessId,
                }
              ));
          },
        }, {
          iconName: 'delete',
          isDisabled: isDeleteProposalLoading || viewOnly,
          onClick: (row) => handleDelete(row.id),
        }
      ],
      sx: {
        width: '6vw',
      },
      type: 'action',
    }
  ];

  const handleNext = () => {
    goToNextStep();
    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    }]});
  };

  return {
    financingContents,
    financingPage,
    handleNext,
    handleOpenAddForm,
    isLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useFinancingStructureProposal;

import { useQueryClient } from '@tanstack/react-query';


import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';

import useGetRiskIdentificationList from './hooks/useGeRiskIdentificationList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useLegalAndComplianceIssue = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { goToNextStep } = useMUPAnalystContext();

  const { data, isLoading: isRiskIdentificationLoading } = useGetRiskIdentificationList({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const riskIdentificationDataContents = data?.map((item) => ({
    ...item,
    riskType: item.legalRiskTypeLabel,
  }));

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '4vw',
      },
      type: 'index',
    },
    {
      key: 'riskType',
      label: 'Jenis Resiko',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          onClick: (row) => {
            router.push(
              replacePath(
                mup.LEGAL_AND_COMPLIANCE_ISSUE_EDIT_PAGE,
                { id: row.id, processId }
              ));
          },
        },
      ],
      sx: {
        width: '5vw',
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
    handleNext,
    isRiskIdentificationLoading,
    riskIdentificationDataContents,
    tableHeader,
  };
};

export default useLegalAndComplianceIssue;

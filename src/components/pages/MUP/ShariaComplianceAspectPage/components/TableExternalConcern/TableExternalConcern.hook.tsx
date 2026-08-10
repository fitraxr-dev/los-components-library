import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetConcernList from '@/hooks/services/mip/sharia-compliance/useGetConcernList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import TextStyle from '@/components/shared/TextStyle';

import { TYPE_EXTERNAL } from '../../ShariaComplianceAspect.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface UseTableExternalConcernProps {
  viewOnly: boolean;
}

const useTableExternalConcern = ({ viewOnly }: UseTableExternalConcernProps) => {
  const { processId } = useIdentity();
  const router = useCustomRouter();

  const { data: concernList, isLoading: isConcernListLoading } = useGetConcernList({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
    type: TYPE_EXTERNAL,
  });

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
      key: 'shariaCompliance',
      label: 'Catatan Kepatuhan Syariah',
      sx: {
        width: '30vw',
      },
    },
    {
      key: 'businessResponse',
      label: 'Tanggapan Bisnis',
      render: (row) => {
        if (row.businessResponse === 'agree') {
          return (
            <TextStyle>
              Setuju
            </TextStyle>
          );
        } else if (row.businessResponse === 'disagree') {
          return (
            <TextStyle>
              Tidak Setuju
            </TextStyle>
          );
        } else {
          return (
            <TextStyle>
              -
            </TextStyle>
          );
        }
      },
      sx: {
        width: '30vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: viewOnly ? 'detail' : 'edit',
          onClick: (row) => {
            router.push(
              replacePath(
                mup.SHARIA_COMPLIANCE_ASPECT_EDIT_EXTERNAL_PAGE,
                { id: row.id, processId: row.bucketProcessId }
              )
            );
          },
        }
      ],
      sx: {
        width: '3vw',
      },
      type: 'action',
    },
  ];

  return {
    concernList,
    isConcernListLoading,
    tableHeader,
  };
};

export default useTableExternalConcern;

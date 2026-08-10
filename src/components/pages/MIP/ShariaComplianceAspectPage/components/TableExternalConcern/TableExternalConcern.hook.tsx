import { mip } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetConcernList from '@/hooks/services/mip/sharia-compliance/useGetConcernList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import { TYPE_EXTERNAL } from '../../ShariaComplianceAspect.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableExternalConcern = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();

  const { data: concernList, isLoading: isConcernListLoading } = useGetConcernList({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
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
                mip.SHARIA_COMPLIANCE_ASPECT_EDIT_EXTERNAL_PAGE,
                { id: row.id, processId: row.bucketProcessId }
              ));
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

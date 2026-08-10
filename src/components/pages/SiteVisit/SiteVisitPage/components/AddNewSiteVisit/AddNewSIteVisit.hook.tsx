import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useViewOnly from '@/hooks/useViewOnly';

import useViewAllDocument from '../../../ViewAllDocumentPage/ViewAllDocument.hook';
import { modalSiteVisit } from '../../SiteVisit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export enum PartyType {
  OWNER = 'OWNER',
  CLIENT = 'CLIENT',
  OTHER = 'OTHER',
}

export type PartySiteVisit = {
  division?: string;
  id?: number;
  instance?: string;
  name?: string;
  position?: string;
  staffId?: number;
  type?: string;
};


type UseAddSiteVisitProps = {
  disableEdit?: boolean;
  form: any;
  onDeleteParty?: (type: PartyType, index: number) => void;
  onEditParty?: (type: PartyType, data: PartySiteVisit, index: number) => void;
};

const useAddSiteVisit = ({
  disableEdit = false,
  form,
  onEditParty,
  onDeleteParty,
}: UseAddSiteVisitProps) => {
  const { viewOnly } = useViewOnly();
  const { data: mediaVisitList } = useGetParameterList('mediaSiteVisit', { label: 'value1', value: 'value1' });
  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const { isPemda } = useViewAllDocument();

  const handleEdit = (type: PartyType, row: PartySiteVisit, index: number) => {
    if (onEditParty) {
      onEditParty(type, row, index);
    }
  };

  const handleDelete = (type: PartyType, index: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => {
        if (onDeleteParty) {
          onDeleteParty(type, index);
        }
        NiceModal.hide(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Apakah anda yakin ingin menghapus data ini?',
    });
  };

  const smiVisitHeader: TableHeader[] = [
    {
      key: 'division',
      label: 'Divisi',
    },
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Position',
    },
    ...(!isPemda ? [
      {
        key: 'action',
        label: 'Action',
        options: [
          {
            iconName: 'edit',
            isDisabled: disableEdit || viewOnly,
            onClick: (row: PartySiteVisit, index: number) => {
              handleEdit(PartyType.OWNER, row, index);
            },
          },
          {
            iconName: 'delete',
            isDisabled: disableEdit || viewOnly,
            onClick: (row: PartySiteVisit, index: number) => {
              handleDelete(PartyType.OWNER, index);
            },
          },
        ],
        sx: { minWidth: '8vw' },
        type: 'action' as any,
      },
    ]
      : []),
  ];

  const clientVisitHeader: TableHeader[] = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Position',
    },
    ...(!isPemda ? [
      {
        key: 'action',
        label: 'Action',
        options: [
          {
            iconName: 'edit',
            isDisabled: disableEdit || viewOnly || isPemda,
            onClick: (row: PartySiteVisit, index: number) => {
              handleEdit(PartyType.CLIENT, row, index);
            },
          },
          {
            iconName: 'delete',
            isDisabled: disableEdit || viewOnly || isPemda,
            onClick: (row: PartySiteVisit, index: number) => {
              handleDelete(PartyType.CLIENT, index);
            },
          },
        ],
        sx: {
          minWidth: '8vw',
        },
        type: 'action' as any,
      },
    ]
      : []),
  ];

  const othersVisitHeader: TableHeader[] = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Jabatan',
    },
    {
      key: 'instance',
      label: 'Instansi',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isDisabled: disableEdit || viewOnly,
          onClick: (row: PartySiteVisit, index: number) => {
            handleEdit(PartyType.OTHER, row, index);
          },
        },
        {
          iconName: 'delete',
          isDisabled: disableEdit || viewOnly,
          onClick: (row: PartySiteVisit, index: number) => {
            handleDelete(PartyType.OTHER, index);
          },
        },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action' as any,
    },
  ];

  return {
    clientVisitHeader,
    institutiontypeData,
    mediaVisitList,
    othersVisitHeader,
    smiVisitHeader,
  };
};

export default useAddSiteVisit;

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tabs = {
  GROUP: 'group',
  GROUP_MEMBER: 'group_member',
};

export const tabItems = [
  { label: 'Group', value: tabs.GROUP },
  { label: 'Group Member', value: tabs.GROUP_MEMBER },
];

export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'groupCode',
    label: 'ID Group',
  },
  {
    key: 'groupName',
    label: 'Nama Group',
  },
  {
    key: 'groupType',
    label: 'Jenis Group',
  },
  {
    key: 'isRelatedSmi',
    label: 'Pihak Terkait/Tidak',
  },
  {
    key: 'sector',
    label: 'Sektor Industri',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
  },
];

export const mockTableData = [
  {
    groupId: '1111',
    groupName: 'Group Name 1',
    groupType: 'Type 1',
    industrialSector: 'Industrial Sector',
    lastModified: '-',
    modifiedBy: '-',
    relatedParty: 'Ya',
  },
  {
    groupId: '2222',
    groupName: 'Group Name 2',
    groupType: 'Type 2',
    industrialSector: 'Industrial Sector',
    lastModified: '-',
    modifiedBy: '-',
    relatedParty: 'Tidak',
  },
  {
    groupId: '1111',
    groupName: 'Group Name 3',
    groupType: 'Type 3',
    industrialSector: 'Industrial Sector',
    lastModified: '-',
    modifiedBy: '-',
    relatedParty: 'Ya',
  },
];

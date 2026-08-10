import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tabs = {
  LIST_FACILITY: 'list-facility-related',
  PROJECT: 'project',
};

export const tabItems = [
  { label: 'Project', value: tabs.PROJECT },
  { label: 'List Facility Related', value: tabs.LIST_FACILITY },
];


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama Proyek',
  },
  {
    key: 'projectValue',
    label: 'Nilai Proyek',
    render: (value) => (
      <TextStyle> {value.projectValue ? formatCurrency(String(value.projectValue)) : '-'}</TextStyle>
    ),
  },
  {
    key: 'sector',
    label: 'Sektor yang dibiayai',
  },
  {
    key: 'district',
    label: 'Lokasi Proyek (Kecamatan)',
  },
  {
    key: 'city',
    label: 'Lokasi Proyek (Kabupaten)',
  },
  {
    key: 'province',
    label: 'Lokasi Proyek (Provinsi)',
  },
];

export const mockTableData = [
  {
    id: '1234',
    projectCity: 'City A',
    projectDistrict: 'District A',
    projectName: 'Project A',
    projectProvince: 'Province A',
    projectValue: '500',
    sectorFinanced: 'Sector A',
  },
  {
    id: '2345',
    projectCity: 'City B',
    projectDistrict: 'District B',
    projectName: 'Project B',
    projectProvince: 'Province B',
    projectValue: '500',
    sectorFinanced: 'Sector B',
  },
  {
    id: '3456',
    projectCity: 'City C',
    projectDistrict: 'District C',
    projectName: 'Project C',
    projectProvince: 'Province C',
    projectValue: '500',
    sectorFinanced: 'Sector C',
  },
  {
    id: '4567',
    projectCity: 'City D',
    projectDistrict: 'District D',
    projectName: 'Project D',
    projectProvince: 'Province D',
    projectValue: '500',
    sectorFinanced: 'Sector D',
  },
  {
    id: '5678',
    projectCity: 'City E',
    projectDistrict: 'District E',
    projectName: 'Project E',
    projectProvince: 'Province E',
    projectValue: '500',
    sectorFinanced: 'Sector E',
  },
  {
    id: '6789',
    projectCity: 'City F',
    projectDistrict: 'District F',
    projectName: 'Project F',
    projectProvince: 'Province F',
    projectValue: '500',
    sectorFinanced: 'Sector F',
  },
];

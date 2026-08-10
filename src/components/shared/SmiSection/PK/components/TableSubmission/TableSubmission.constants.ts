export const TableHeaderPkProcessingType = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'pkName',
    label: 'Nama PK',
    sx: { minWidth: '7.5vw' },
  },
  {
    key: 'signingConditions',
    label: 'Syarat Penandatanganan',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'pkNumber',
    label: 'No PK/Adendum',
    sx: { minWidth: '14vw' },
  },
  {
    key: 'pkDate',
    label: 'Tanggal PK/Adendum',
    sx: { minWidth: '14vw' },
  },
  {
    key: 'effectiveDate',
    label: 'Tanggal Efektif',
    sx: { minWidth: '14vw' },
  }
];


export type SubmissionTableProps = {
  module: string;
  process: string;
}

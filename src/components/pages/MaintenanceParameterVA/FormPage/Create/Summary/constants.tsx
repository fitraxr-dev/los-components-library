import { ActivityType } from '@/enums/Activity';

import Button from '@/components/shared/Button';

import type { GridColDef } from '@mui/x-data-grid';


export const createAddNewBusinessSummaryHeader = (
  handleDetailClick: (data: any) => void
): GridColDef[] => [
  {
    field: 'index',
    headerName: 'No',
    renderCell: (params) => {
      if (params.value?.rowSpan > 0) {
        return (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              fontWeight: 'bold',
              height: '100%',
              justifyContent: 'center',
            }}
          >
            {params.value.value}
          </div>
        );
      }
      return null;
    },
    sortable: false,
    width: 80,
  },
  {
    field: 'action',
    headerName: 'Action',
    renderCell: (params) => {
      if (params.value?.rowSpan > 0) {
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDetailClick(params.row)}
          >
            Detail
          </Button>
        );
      }
      return null;
    },
    sortable: false,
    width: 100,
  },
  {
    field: 'bankName',
    headerName: 'Bank Name',
    sortable: false,
    width: 150,
  },
  {
    field: 'vaType',
    headerName: 'VA Type',
    sortable: false,
    width: 120,
  },
  {
    field: 'customerType',
    headerName: 'Customer Type',
    sortable: false,
    width: 150,
  },
  {
    field: 'currency',
    headerName: 'Currency',
    sortable: false,
    width: 100,
  },
  {
    field: 'bankPrefix',
    headerName: 'Bank Prefix',
    sortable: false,
    width: 120,
  },
  {
    field: 'totalDigit',
    headerName: 'Total Digit',
    sortable: false,
    width: 120,
  },
  {
    field: 'vaTypeDigit',
    headerName: 'VA Type Digit',
    sortable: false,
    width: 130,
  },
  {
    field: 'isActive',
    headerName: 'Active',
    renderCell: (params) => (params.value ? 'Yes' : 'No'),
    sortable: false,
    width: 80,
  },
  {
    field: 'createdBy',
    headerName: 'Created By',
    sortable: false,
    width: 150,
  },
  {
    field: 'createdDate',
    headerName: 'Created Date',
    sortable: false,
    width: 150,
  },
];

export const createUpdateBusinessSummaryHeader = (
  theme: any,
  handleDetailClick: (data: any) => void
): GridColDef[] => [
  {
    field: 'index',
    headerName: 'No',
    renderCell: (params) => {
      if (params.value?.rowSpan > 0) {
        return (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              fontWeight: 'bold',
              height: '100%',
              justifyContent: 'center',
            }}
          >
            {params.value.value}
          </div>
        );
      }
      return null;
    },
    sortable: false,
    width: 80,
  },
  {
    field: 'action',
    headerName: 'Action',
    renderCell: (params) => {
      if (params.value?.rowSpan > 0) {
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDetailClick(params.row)}
          >
            Detail
          </Button>
        );
      }
      return null;
    },
    sortable: false,
    width: 100,
  },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (params) => {
      const isPrevious = params.value === 'Previous';
      const isLastModified = params.value === 'Last Modified';

      return (
        <div
          style={{
            backgroundColor: isPrevious
              ? theme.palette.grey[200]
              : isLastModified
                ? theme.palette.primary.light
                : 'transparent',
            borderRadius: '4px',
            color: isPrevious
              ? theme.palette.grey[700]
              : isLastModified
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '4px 8px',
          }}
        >
          {params.value}
        </div>
      );
    },
    sortable: false,
    width: 120,
  },
  {
    field: 'bankName',
    headerName: 'Bank Name',
    sortable: false,
    width: 150,
  },
  {
    field: 'vaType',
    headerName: 'VA Type',
    sortable: false,
    width: 120,
  },
  {
    field: 'customerType',
    headerName: 'Customer Type',
    sortable: false,
    width: 150,
  },
  {
    field: 'currency',
    headerName: 'Currency',
    sortable: false,
    width: 100,
  },
  {
    field: 'bankPrefix',
    headerName: 'Bank Prefix',
    sortable: false,
    width: 120,
  },
  {
    field: 'totalDigit',
    headerName: 'Total Digit',
    sortable: false,
    width: 120,
  },
  {
    field: 'vaTypeDigit',
    headerName: 'VA Type Digit',
    sortable: false,
    width: 130,
  },
  {
    field: 'isActive',
    headerName: 'Active',
    renderCell: (params) => (params.value ? 'Yes' : 'No'),
    sortable: false,
    width: 80,
  },
  {
    field: 'createdBy',
    headerName: 'Created By',
    sortable: false,
    width: 150,
  },
  {
    field: 'createdDate',
    headerName: 'Created Date',
    sortable: false,
    width: 150,
  },
];

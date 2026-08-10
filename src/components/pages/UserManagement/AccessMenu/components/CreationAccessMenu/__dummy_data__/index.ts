import type { AccessMenuList } from '../CreationAddAccess.types';


export const dropdownAccessMenu = [
  {
    label: 'Loan Processing',
    value: 'loan-processing',
  },
  {
    label: 'Overview',
    value: 'overview',
  },
];

export const accessMenuData = ['loan-processing', 'overview'];

export const accessMenuListData: AccessMenuList = [
  {
    id: 'loan-processing',
    label: 'Loan Processing',
    status: 0,
    subMenu: [
      {
        id: 'loan-processing/submission-proposal',
        label: 'Proposal Pengajuan',
        status: 0,
        subMenu: [
          {
            id: 'loan-processing/submission-proposal/pipeline',
            label: 'Pipeline',
            permissions: [
              {
                id: 'loan-processing/submission-proposal/pipeline/view',
                label: 'View',
                status: 0,
              },
              {
                id: 'loan-processing/submission-proposal/pipeline/create',
                label: 'Create',
                status: 0,
              },
              {
                id: 'loan-processing/submission-proposal/pipeline/edit',
                label: 'Edit',
                status: 0,
              },
              {
                id: 'loan-processing/submission-proposal/pipeline/delete',
                label: 'Delete',
                status: 0,
              },
              {
                id: 'loan-processing/submission-proposal/pipeline/download',
                label: 'Download',
                status: 0,
              },
              {
                id: 'loan-processing/submission-proposal/pipeline/showMenu',
                label: 'Show Menu',
                status: 0,
              },
            ],
            status: 0,
          }
        ],
      },
      {
        id: 'loan-processing/review',
        label: 'Review',
        status: 0,
        subMenu: [
          {
            id: 'loan-processing/review/eligibility-review',
            label: 'Review Kajian',
            status: 0,
            subMenu: [
              {
                id: 'loan-processing/review/eligibility-review/assignment',
                label: 'Assignment',
                permissions: [
                  {
                    id: 'loan-processing/review/eligibility-review/assignment/view',
                    label: 'View',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/assignment/create',
                    label: 'Create',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/assignment/edit',
                    label: 'Edit',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/assignment/delete',
                    label: 'Delete',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/assignment/download',
                    label: 'Download',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/assignment/showMenu',
                    label: 'Show Menu',
                    status: 0,
                  },
                ],
                status: 0,
              },
              {
                id: 'loan-processing/review/eligibility-review/monitoring',
                label: 'Monitoring',
                permissions: [
                  {
                    id: 'loan-processing/review/eligibility-review/monitoring/view',
                    label: 'View',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/monitoring/create',
                    label: 'Create',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/monitoring/edit',
                    label: 'Edit',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/monitoring/delete',
                    label: 'Delete',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/monitoring/download',
                    label: 'Download',
                    status: 0,
                  },
                  {
                    id: 'loan-processing/review/eligibility-review/monitoring/showMenu',
                    label: 'Show Menu',
                    status: 0,
                  },
                ],
                status: 0,
              }
            ],
          },
        ],
      },
      {
        id: 'loan-processing/credit-checking',
        label: 'Credit Checking',
        status: 0,
        subMenu: [
          {
            id: 'loan-processing/credit-checking/request',
            label: 'Request',
            permissions: [
              {
                id: 'loan-processing/credit-checking/request/view',
                label: 'View',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/request/create',
                label: 'Create',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/request/edit',
                label: 'Edit',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/request/delete',
                label: 'Delete',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/request/download',
                label: 'Download',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/request/showMenu',
                label: 'Show Menu',
                status: 0,
              },
            ],
            status: 0,
          },
          {
            id: 'loan-processing/credit-checking/assignment',
            label: 'Assignment',
            permissions: [
              {
                id: 'loan-processing/credit-checking/assignment/view',
                label: 'View',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/assignment/create',
                label: 'Create',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/assignment/edit',
                label: 'Edit',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/assignment/delete',
                label: 'Delete',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/assignment/download',
                label: 'Download',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/assignment/showMenu',
                label: 'Show Menu',
                status: 0,
              },
            ],
            status: 0,
          },
          {
            id: 'loan-processing/credit-checking/document-verification',
            label: 'Document Verification',
            permissions: [
              {
                id: 'loan-processing/credit-checking/document-verification/view',
                label: 'View',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/document-verification/create',
                label: 'Create',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/document-verification/edit',
                label: 'Edit',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/document-verification/delete',
                label: 'Delete',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/document-verification/download',
                label: 'Download',
                status: 0,
              },
              {
                id: 'loan-processing/credit-checking/document-verification/showMenu',
                label: 'Show Menu',
                status: 0,
              },
            ],
            status: 0,
          },
        ],
      }
    ],
  },
  {
    id: 'overview',
    label: 'Overview',
    status: 0,
    subMenu: [
      {
        id: 'overview/success-rate',
        label: 'Success Rate',
        permissions: [
          {
            id: 'overview/success-rate/view',
            label: 'View',
            status: 0,
          },
          {
            id: 'overview/success-rate/create',
            label: 'Create',
            status: 0,
          },
          {
            id: 'overview/success-rate/edit',
            label: 'Edit',
            status: 0,
          },
          {
            id: 'overview/success-rate/delete',
            label: 'Delete',
            status: 0,
          },
          {
            id: 'overview/success-rate/download',
            label: 'Download',
            status: 0,
          },
          {
            id: 'overview/success-rate/showMenu',
            label: 'Show Menu',
            status: 0,
          },
        ],
        status: 0,
      },
      {
        id: 'overview/progress',
        label: 'Progress',
        permissions: [
          {
            id: 'overview/progress/view',
            label: 'View',
            status: 0,
          },
          {
            id: 'overview/progress/create',
            label: 'Create',
            status: 0,
          },
          {
            id: 'overview/progress/edit',
            label: 'Edit',
            status: 0,
          },
          {
            id: 'overview/progress/delete',
            label: 'Delete',
            status: 0,
          },
          {
            id: 'overview/progress/download',
            label: 'Download',
            status: 0,
          },
          {
            id: 'overview/progress/showMenu',
            label: 'Show Menu',
            status: 0,
          },
        ],
        status: 0,
      }
    ],
  }
];

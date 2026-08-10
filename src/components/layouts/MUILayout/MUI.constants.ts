import {
  analyst,
  eligibilityReview,
  HIGH_RISK,
  lpaReview,
  creditChecking,
  HOME_PAGE,
  mip,
  NOT_FOUND_PAGE,
  pipeline,
  siteVisit,
  maintenanceDebtor,
  ESDD,
  apuPpt,
} from '@/configs/constants/pathname';

// Menu ID
const HOME = 'home';
const LOAN_PROCESSING = 'loan-processing';
const LOAN_PROCESSING_SUMMARY = 'loan-processing-summary';
const MAINTENANCE_DEBTOR = 'maintenance-data';
const VIRTUAL_ACCOUNT_CREATION = 'virtual-account-creation';
const BUSINESS_ACTIVITY_REPORT = 'business-activity-report';
const OVERVIEW = 'overview';
const REPORT = 'report';
const MASTER_PARAMETER = 'master-parameter';

export const ALL_MENU = [
  {
    icon: 'home',
    id: HOME,
    label: 'Home',
    path: HOME_PAGE,
  },
  {
    icon: 'bmpp-simulation',
    id: 'bmpp-simulation',
    label: 'Simulasi BMPP',
    path: NOT_FOUND_PAGE,
  },
  {
    icon: 'loan-processing',
    id: LOAN_PROCESSING,
    label: 'Loan Processing',
    subMenu: [
      {
        icon: 'submission-proposal',
        id: 'submission-proposal',
        label: 'Proposal Pengajuan',
        subMenu: [
          {
            icon: 'pipeline',
            id: 'pipeline',
            label: 'Pipeline',
            path: pipeline.LIST_PAGE,
          },
          {
            icon: 'mip',
            id: 'mip',
            label: 'MIP',
            path: mip.LIST_PAGE,
          },
          {
            icon: 'analyst',
            id: 'analyst',
            label: 'Analyst',
            path: analyst.LIST_PAGE,
          },
          {
            icon: 'mir',
            id: 'mir',
            label: 'MIR',
            path: NOT_FOUND_PAGE,
          },
          {
            icon: 'annual-review',
            id: 'annual-review',
            label: 'Annual Review',
            path: NOT_FOUND_PAGE,
          },
        ],
      },
      {
        icon: 'assessment-apu-ppt',
        id: 'assessment-apu-ppt',
        label: 'Assesment APU PPT / Pengkinian Data',
        path: apuPpt.LIST_PAGE,
      },
      {
        icon: 'high-risk',
        id: 'enhance-due-diligence-high-risk',
        label: 'Enhance Due Diligence (EDD) - High Risk',
        path: HIGH_RISK.LIST_PAGE,
      },
      {
        icon: 'site-visit',
        id: 'site-visit',
        label: 'Site Visit',
        path: siteVisit.LIST_PAGE,
      },
      {
        icon: 'credit-checking',
        id: 'credit-checking',
        label: 'Credit Checking',
        subMenu: [
          {
            icon: 'request',
            id: 'request',
            label: 'Request',
            path: creditChecking.REQUEST_PAGE,
          },
          {
            icon: 'assignment',
            id: 'assignment',
            label: 'Assignment',
            path: creditChecking.ASSIGNMENT_PAGE,
          },
          {
            icon: 'bucket-credit-checking',
            id: 'bucket-credit-checking',
            label: 'Bucket Credit Checking',
            path: creditChecking.BUCKET_DOCUMENT_VERIFICATION_PAGE,
          },
          {
            icon: 'monitoring',
            id: 'monitoring',
            label: 'Monitoring',
            path: creditChecking.MONITORING_PAGE,
          }
        ],
      },
      {
        icon: 'review',
        id: 'review',
        label: 'Review',
        subMenu: [
          {
            icon: 'eligibility-review',
            id: 'eligibility-review',
            label: 'Review Kajian Risiko Pembiayaan dan Internal Rating',
            path: eligibilityReview.LIST_PAGE,
          },
          {
            icon: 'legal-aspect-review',
            id: 'legal-aspect-review',
            label: 'Review Aspek Legal & Hukum',
            subMenu: [
              {
                icon: 'dummy',
                id: 'dummy',
                label: 'Dummy',
                path: NOT_FOUND_PAGE,
              }
            ],
          },
          {
            icon: 'technical-study-review',
            id: 'technical-study-review',
            label: 'Review Kajian Teknis',
            subMenu: [
              {
                icon: 'dummy',
                id: 'dummy',
                label: 'Dummy',
                path: NOT_FOUND_PAGE,
              }
            ],
          },
          {
            icon: 'environmental-social-assessment-review',
            id: 'environmental-social-assessment-review',
            label: 'Review Kajian Lingkungan & Sosial',
            path: ESDD.LIST_PAGE,
          },
          {
            icon: 'shariah-compliance-review',
            id: 'shariah-compliance-review',
            label: 'Review Kepatuhan Syariah',
            subMenu: [
              {
                icon: 'dummy',
                id: 'dummy',
                label: 'Dummy',
                path: NOT_FOUND_PAGE,
              }
            ],
          },
          {
            icon: 'lpa-review',
            id: 'lpa-review',
            label: 'Review LPA',
            subMenu: [
              {
                icon: 'dummy',
                id: 'dummy',
                label: 'Dummy',
                path: NOT_FOUND_PAGE,
              }
            ],
          }
        ],
      },
      {
        icon: 'mup',
        id: 'mup',
        label: 'MUP',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'mur',
        id: 'mur',
        label: 'MUR',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'minutes-of-meeting',
        id: 'minutes-of-meeting',
        label: 'Risalah Rapat',
        subMenu: [
          {
            icon: 'dummy',
            id: 'dummy',
            label: 'Dummy',
            path: NOT_FOUND_PAGE,
          }
        ],
      },
      {
        icon: 'spfp',
        id: 'spfp',
        label: 'SPFP',
        subMenu: [
          {
            icon: 'dummy',
            id: 'dummy',
            label: 'Dummy',
            path: NOT_FOUND_PAGE,
          }
        ],
      },
      {
        icon: 'legal-signing',
        id: 'legal-signing',
        label: 'Legal Signing',
        subMenu: [
          {
            icon: 'dummy',
            id: 'dummy',
            label: 'Dummy',
            path: NOT_FOUND_PAGE,
          }
        ],
      }
    ],
  },
  {
    icon: 'loan-processing-summary',
    id: LOAN_PROCESSING_SUMMARY,
    label: 'Loan Processing Summary',
    subMenu: [
      {
        icon: 'dummy',
        id: 'dummy',
        label: 'Dummy',
        path: NOT_FOUND_PAGE,
      }
    ],
  },
  {
    icon: 'maintenance-data',
    id: MAINTENANCE_DEBTOR,
    label: 'Maintenance Data',
    subMenu: [
      {
        icon: 'maintenance-debtor',
        id: 'maintenance-debtor',
        label: 'Maintenance Customer',
        path: maintenanceDebtor.LIST_PAGE,
      },
      {
        icon: 'maintenance-group',
        id: 'maintenance-group',
        label: 'Maintenance Group',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'maintenance-proyek',
        id: 'maintenance-proyek',
        label: 'Maintenance Proyek',
        path: NOT_FOUND_PAGE,
      },
    ],
  },
  {
    icon: 'virtual-account-creation',
    id: VIRTUAL_ACCOUNT_CREATION,
    label: 'Virtual Account Creation',
    path: NOT_FOUND_PAGE,
  },
  {
    icon: 'business-activity-report',
    id: BUSINESS_ACTIVITY_REPORT,
    label: 'Business Activity Report',
    path: NOT_FOUND_PAGE,
  },
  {
    icon: 'overview',
    id: OVERVIEW,
    label: 'Overview',
    subMenu: [
      {
        icon: 'success-rate',
        id: 'success-rate',
        label: 'Success Rate',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'progress',
        id: 'progress',
        label: 'Progress',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'performance',
        id: 'performance',
        label: 'Performance',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'capacity',
        id: 'capacity',
        label: 'Capacity',
        path: NOT_FOUND_PAGE,
      },
      {
        icon: 'annual-review',
        id: 'annual-review',
        label: 'Annual Review',
        path: NOT_FOUND_PAGE,
      },
    ],
  },
  {
    icon: 'report',
    id: REPORT,
    label: 'Report',
    path: NOT_FOUND_PAGE,
  },
  {
    icon: 'master-parameter',
    id: MASTER_PARAMETER,
    label: 'Master Parameter',
    path: NOT_FOUND_PAGE,
  },

];

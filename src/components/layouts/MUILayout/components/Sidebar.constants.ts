import {
  APUPPT,
  ASPECT_LEGAL_REVIEW,
  ESDD,
  HIGH_RISK,
  HOME_PAGE,
  KEPATUHAN_SYARIAH,
  NOT_FOUND_PAGE,
  technicalStudyReview,
  analyst,
  creditChecking,
  eligibilityReview,
  engagementSubmission,
  lpaRequestReview,
  lpaReview,
  maintenanceDebtor,
  mip,
  pipeline,
  risalahRapat,
  siteVisit,
  userManagement,
  loanProcessingSummary,
} from '@/configs/constants/pathname';

// Menu ID
const HOME = 'home';
const LOAN_PROCESSING = 'loan-processing';
const LOAN_PROCESSING_SUMMARY = 'loan-processing-summary';
const MAINTENANCE_DATA = 'maintenance-data';
const VIRTUAL_ACCOUNT_CREATION = 'virtual-account-creation';
const BUSINESS_ACTIVITY_REPORT = 'business-activity-report';
const OVERVIEW = 'overview';
const REPORT = 'report';
const MASTER_PARAMETER = 'master-parameter';
const USER_MANAGEMENT = 'user-management';

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
        icon: 'minutes-of-meeting',
        id: 'minutes-of-meeting',
        label: 'Risalah Rapat',
        subMenu: [
          {
            icon: 'dot',
            id: 'draft-list',
            label: 'Bucket',
            path: risalahRapat.DRAFT_LIST_PAGE,
          },
          {
            icon: 'dot',
            id: 'monitoring',
            label: 'Monitoring',
            path: risalahRapat.MONITORING_PAGE,
          },
          {
            icon: 'dot',
            id: 'approval',
            label: 'Collaboration',
            path: risalahRapat.BUCKET_COLLABORATION,
          },
        ],
      },
      {
        icon: 'assessment-apu-ppt',
        id: 'assessment-apu-ppt',
        label: 'Assesment APU PPT / Pengkinian Data',
        path: APUPPT.LIST_PAGE,
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
            path: creditChecking.BUCKET_LIST_PAGE,
          },
          {
            icon: 'monitoring',
            id: 'monitoring',
            label: 'Monitoring',
            path: creditChecking.MONITORING_PAGE,
          },
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
            subMenu: [
              {
                icon: 'dot',
                id: 'assignment-eligibility-review',
                label: 'Assignment',
                path: eligibilityReview.ASSIGNMENT_PAGE,
              },
              {
                icon: 'dot',
                id: 'monitoring-eligibility-review',
                label: 'Monitoring',
                path: eligibilityReview.MONITORING_LIST_PAGE,
              },
              {
                icon: 'dot',
                id: 'list-eligibility-review',
                label: 'Bucket List',
                path: eligibilityReview.LIST_PAGE,
              },
            ],
          },
          {
            icon: 'legal-aspect-review',
            id: 'legal-aspect-review',
            label: 'Review Aspek Legal & Hukum',
            subMenu: [
              {
                icon: 'dot',
                id: 'assignment-legal-aspect-review',
                label: 'Assignment',
                path: ASPECT_LEGAL_REVIEW.ASSIGNMENT_PAGE,
              },
              {
                icon: 'dot',
                id: 'monitoring-legal-aspect-review',
                label: 'Monitoring',
                path: ASPECT_LEGAL_REVIEW.MONITORING_LIST_PAGE,
              },
              {
                icon: 'dot',
                id: 'list-legal-aspect-review',
                label: 'Bucket List',
                path: ASPECT_LEGAL_REVIEW.LIST_PAGE,
              },
            ],
          },
          {
            icon: 'technical-study-review',
            id: 'technical-study-review',
            label: 'Review Kajian Teknis',
            subMenu: [
              {
                icon: 'request',
                id: 'request-technical-study',
                label: 'Request',
                path: technicalStudyReview.REQUEST_PAGE,
              },
              {
                icon: 'assignment',
                id: 'assignment-technical-study',
                label: 'Assignment',
                path: technicalStudyReview.ASSIGNMENT_PAGE,
              },
              {
                icon: 'review',
                id: 'review-technical-study',
                label: 'Review',
                path: technicalStudyReview.REVIEW_PAGE,
              },
              {
                icon: 'monitoring',
                id: 'monitoring-technical-study',
                label: 'Monitoring',
                path: technicalStudyReview.MONITORING_PAGE,
              },
            ],
          },
          {
            icon: 'environmental-social-assessment-review',
            id: 'environmental-social-assessment-review',
            label: 'Review Kajian Lingkungan & Sosial',
            subMenu: [
              {
                icon: 'maintenance-data',
                id: 'esdd-bucket-list',
                label: 'Bucket List',
                path: ESDD.LIST_PAGE,
              },
              {
                icon: 'assignment',
                id: 'esdd-assignment',
                label: 'Assignment',
                path: ESDD.ASSIGNMENT_PAGE,
              },
              {
                icon: 'monitoring',
                id: 'esdd-monitoring',
                label: 'Monitoring',
                path: ESDD.MONITORING_PAGE,
              },
            ],
          },
          {
            icon: 'shariah-compliance-review',
            id: 'shariah-compliance-review',
            label: 'Review Kepatuhan Syariah',
            subMenu: [
              {
                icon: 'maintenance-data',
                id: 'shariah-compliance-review-bucket-list',
                label: 'Bucket List',
                path: KEPATUHAN_SYARIAH.LIST_PAGE,
              },
              {
                icon: 'assignment',
                id: 'shariah-compliance-review-assignment',
                label: 'Assignment',
                path: KEPATUHAN_SYARIAH.ASSIGNMENT_PAGE,
              },
              {
                icon: 'monitoring',
                id: 'shariah-compliance-review-monitoring',
                label: 'Monitoring',
                path: KEPATUHAN_SYARIAH.MONITORING_PAGE,
              },
            ],
          },
          {
            icon: 'lpa-review',
            id: 'lpa-request',
            label: 'Request Review LPA',
            subMenu: [
              {
                icon: 'dot',
                id: 'lpa-bucket-list',
                label: 'Bucket Review',
                path: lpaRequestReview.BUCKET_LIST,
              },
              {
                icon: 'dot',
                id: 'lpa-bucket-monitoring',
                label: 'Monitoring',
                path: lpaRequestReview.MONITORING,
              },
            ],
          },
          {
            icon: 'lpa-review',
            id: 'lpa-review',
            label: 'Review LPA',
            subMenu: [
              {
                icon: 'dot',
                id: 'lpa-assignment',
                label: 'Assignment',
                path: lpaReview.ASSIGNMENT,
              },
              {
                icon: 'dot',
                id: 'lpa-monitoring',
                label: 'Monitoring',
                path: lpaReview.MONITORING,
              },
              {
                icon: 'dot',
                id: 'lpa-review-request',
                label: 'Bucket Review',
                path: lpaReview.REQUEST,
              },
            ],
          },
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
        icon: 'spfp',
        id: 'spfp',
        label: 'SPFP',
        subMenu: [
          {
            icon: 'dummy',
            id: 'dummy',
            label: 'Dummy',
            path: NOT_FOUND_PAGE,
          },
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
          },
        ],
      },
      {
        icon: 'legal-checking',
        id: 'pengajuan-perikatan',
        label: 'Pengajuan Perikatan',
        subMenu: [
          {
            icon: 'dot',
            id: 'Bucket List',
            label: 'Bucket List',
            path: engagementSubmission.LIST_PAGE,
          },
        ],
      },
    ],
  },
  {
    icon: 'loan-processing-summary',
    id: LOAN_PROCESSING_SUMMARY,
    label: 'Loan Processing Summary',
    subMenu: [
      {
        icon: 'legal-checking',
        id: 'bast',
        label: 'LPS BAST List',
        path: '/loan-processing-summary/bast',
      },
      {
        icon: 'legal-checking',
        id: 'core',
        label: 'LPS CORE List',
        path: '/loan-processing-summary/core',
      }
    ],
  },
  {
    icon: 'maintenance-data',
    id: MAINTENANCE_DATA,
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
  // {
  //   icon: 'master-parameter',
  //   id: USER_MANAGEMENT,
  //   label: 'User Managemenet',

  //   subMenu: [
  //     {
  //       icon: 'legal-aspect-review',
  //       id: 'user-list',
  //       label: 'Access Menu',
  //       path: userManagement.USER_LIST,
  //     },
  //     {
  //       icon: 'legal-aspect-review',
  //       id: 'access-menu',
  //       label: 'Access Menu',
  //       path: userManagement.ACCESS_MENU,
  //     }
  //   ],
  // },
  {
    icon: 'master-parameter',
    id: USER_MANAGEMENT,
    label: 'User Management',
    subMenu: [
      {
        icon: 'legal-aspect-review',
        id: 'user-list',
        label: 'User List',
        path: userManagement.USER_LIST,
      },
      {
        icon: 'legal-aspect-review',
        id: 'access-menu',
        label: 'Access Menu',
        path: userManagement.ACCESS_MENU,
      },
    ],
  },
];

import {
  apuPpt,
  creditChecking,
  lpaRequestReview,
  siteVisit,
  technicalStudyReview,
} from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';


export const modal = {
  REQUEST_OTHER_PROCESS: 'REQUEST_OTHER_PROCESS',
};

export const processList = [
  {
    module: TypeModule.CREDIT_CHECKING,
    name: 'Credit Checking',
    process: TypeProcess.CREDIT_CHECKING,
    urlPath: creditChecking.REQUEST_DEBTOR_INFORMATION_PAGE,
  },
  {
    module: TypeModule.APU_PPT,
    name: 'APU PPT',
    process: TypeProcess.APU_PPT,
    urlPath: apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE,
  },
  {
    module: TypeModule.SITE_VISIT,
    name: 'Site Visit',
    process: TypeProcess.SITE_VISIT,
    urlPath: siteVisit.DEBTOR_INFORMATION_PAGE,
  },
  {
    module: TypeModule.TECHNICAL_REVIEW,
    name: 'Technical Review',
    process: TypeProcess.TECHNICAL_REVIEW,
    urlPath: technicalStudyReview.DEBTOR_INFORMATION_PAGE,
  },
  {
    module: TypeModule.LPA,
    name: 'Kajian LPA',
    process: TypeProcess.LPA,
    urlPath: lpaRequestReview.DEBTOR_INFORMATION,
  },
  {
    module: TypeModule.MUP,
    name: 'Part Analyst',
    process: TypeProcess.MUP_ANALYST,
    urlPath: '',
  }
];

import { TypeModule, TypeProcess } from '@/enums/Module';

import type { RequestOtherProcessOption } from './ModalRequestOtherProcess.types';


export const modal = {
  REQUEST_OTHER_PROCESS: 'REQUEST_OTHER_PROCESS',
};

export const requestOtherProcessOptions: RequestOtherProcessOption[] = [
  {
    hasComment: false,
    label: 'Credit Checking',
    module: TypeModule.CREDIT_CHECKING,
    process: TypeProcess.CREDIT_CHECKING,
  },
  {
    hasComment: false,
    label: 'APU PPT',
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT,
  },
  {
    hasComment: false,
    label: 'Site Visit',
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
  },
  {
    hasComment: false,
    label: 'Kajian Teknis',
    module: TypeModule.TECHNICAL_REVIEW,
    process: TypeProcess.TECHNICAL_REVIEW,
  },
  {
    hasComment: false,
    label: 'Kajian LPA',
    module: TypeModule.LPA,
    process: TypeProcess.LPA,
  },
  {
    hasComment: true,
    label: 'Part Analyst',
    module: TypeModule.MIP,
    process: TypeProcess.MIP_ANALYST,
  },
];

export const urlPaths =
{
  [TypeProcess.CREDIT_CHECKING]: '/loan-processing/credit-checking',
  [TypeProcess.SITE_VISIT]: '/loan-processing/site-visit',
  [TypeProcess.LPA]: '/loan-processing/review/lpa-request-review',
  [TypeProcess.TECHNICAL_REVIEW]: '/loan-processing/review/technical-study-review',
  [TypeProcess.APU_PPT]: '/loan-processing/apu-ppt',
};

import type { ButtonDinamisPKProps } from './PkProcessingType.types';


export const btnModulePK: ButtonDinamisPKProps[] = [
  {
    title: 'Cancel',
    variant: 'outlined',
  },
  {
    color: 'primary',
    title: 'Save',
    variant: 'contained',
  },
];


export const btnLegalSignStaff: ButtonDinamisPKProps[] = [
  {
    color: 'primary',
    title: 'Save',
    variant: 'contained',
  },
  {
    color: 'lightYellow',
    title: 'Ask For Info',
    variant: 'contained',
  },
  {
    action: 'SUBMIT',
    color: 'success',
    title: 'Submit',
    variant: 'contained',
  }];


export const btnLegalSigninTlNormal: ButtonDinamisPKProps[] = [
  {
    color: 'primary',
    title: 'Save',
    variant: 'contained',
  },
  {
    action: 'RETURN_TO_STAFF',
    color: 'primary',
    title: 'Return To Staff',
    variant: 'contained',
  },
  {
    action: 'SUBMIT',
    color: 'success',
    title: 'Submit',
    variant: 'contained',
  }];

export const btnLegalSigninTlAfi: ButtonDinamisPKProps[] = [
  {
    color: 'primary',
    title: 'Save',
    variant: 'contained',
  },
  {
    action: 'RETURN_TO_STAFF',
    color: 'primary',
    title: 'Return to staff',
    variant: 'contained',
  },
  {
    color: 'lightYellow',
    title: 'Approve Ask For Info',
    variant: 'contained',
  }];

export const btnLegalSigninKadivNormal: ButtonDinamisPKProps[] = [
  {
    color: 'primary',
    title: 'Save',
    variant: 'contained',
  },
  {
    action: 'RETURN_TO_STAFF',
    color: 'primary',
    title: 'Return to staff',
    variant: 'contained',
  },
  {
    action: 'RETURN_TO_TL',
    color: 'info',
    title: 'Return to TL',
    variant: 'contained',
  },
  {
    action: 'APPROVE',
    color: 'success',
    title: 'Submit',
    variant: 'contained',
  }
];
export const btnLegalSigninKadivAfi: ButtonDinamisPKProps[] = [
  {
    color: 'primary',
    title: 'Save',
    variant: 'contained',
  },
  {
    action: 'RETURN_TO_STAFF',
    color: 'primary',
    title: 'Return to staff',
    variant: 'contained',
  },
  {
    action: 'RETURN_TO_TL',
    color: 'info',
    title: 'Return to TL',
    variant: 'contained',
  },
  {
    action: 'ASK_FOR_INFO_BUSINESS',
    color: 'lightYellow',
    title: 'Approve Ask For Info',
    variant: 'contained',
  }];

export const BTN_SUBMIT = 'Submit';
export const BTN_RETURN_TO_STAFF = 'Return to staff';
export const BTN_RETURN_TO_TL = 'Return to TL';
export const BTN_APROVE_ASK_FOR_INFO = 'Approve Ask For Info';
export const BTN_ASK_FOR_INFO = 'Ask For Info';
export const BTN_SAVE = 'Save';
export const BTN_CANCEL = 'Cancel';


//   ask for info buat staff
// [
//     { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
//     { label: 'TL', value: 'ASK_FOR_INFO_TL' }
//   ]

// tl
//  [
//     { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
//     { label: 'Kadiv', value: 'ASK_FOR_INFO_KADIV' }
//   ]
//
// kadiv
// ASK_FOR_INFO_BUSINESS

/**
  * staff
  */
export const PK_LEGAL_SIGNING = 'PK_LEGAL_SIGNING';
/**
  * TL Normal
  */
export const PK_WAITING_APPROVAL_TL = 'PK_WAITING_APPROVAL_TL';
// // RETURN_TO_STAFF / APPROVE
/**
  * TL AFI
  */
export const PK_WAITING_ASK_FOR_INFO_APPROVAL_TL = 'PK_WAITING_ASK_FOR_INFO_APPROVAL_TL';
/**
  * Kadiv Normal
  */
export const PK_WAITING_APPROVAL_KADIV = 'PK_WAITING_APPROVAL_KADIV';
// RETURN_TO_STAFF / APPROVE
/**
  *Kadiv AFI
  */
export const PK_WAITING_ASK_FOR_INFO_APPROVAL_KADIV = 'PK_WAITING_ASK_FOR_INFO_APPROVAL_KADIV';

// Return To Staff action nya RETURN_TO_STAFF buat TL
// Return To TL action nya RETURN_TO_TL buat KADIV

'use client';
import React from 'react';

import { TypeModule } from '@/enums/Module';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


const ValidationPage = () => {
  const { typeProcess, isDepiDivision } = useAnnualReviewContext();

  return (
    <>
      {isDepiDivision && <ConfirmationLatest />}
      <TableValidation
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
      />
    </>
  );
};

export default ValidationPage;

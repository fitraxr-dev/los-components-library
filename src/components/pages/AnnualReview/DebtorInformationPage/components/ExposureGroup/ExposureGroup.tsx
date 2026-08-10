import React from 'react';

import { useFormContext } from 'react-hook-form';

import ExposureGroupSection from '@/components/shared/SmiSection/DebtorInformation/ExposureGroupSection';

import useExposureGroup from './ExposureGroup.hook';


const ExposureGroup = () => {
  const formMethods = useFormContext();
  const {
    exposureGroupData,
  } = useExposureGroup();

  const valueAsOf = formMethods.watch('performanceFinancial.performanceFinancialDate');

  return (
    <ExposureGroupSection isAsOf valueAsOf={valueAsOf} data={exposureGroupData} showTooltip />
  );
};

export default ExposureGroup;

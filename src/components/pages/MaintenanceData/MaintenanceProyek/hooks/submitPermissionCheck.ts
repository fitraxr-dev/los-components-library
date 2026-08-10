const SubmitPermissionCheck = (detailData: any): boolean => {
  const requiredFields = [
    { name: 'projectInformation.name', value: detailData.projectInformation.name?.value },
    { name: 'projectInformation.startDate', value: detailData.projectInformation.startDate?.value },
    { name: 'projectInformation.endDate', value: detailData.projectInformation.endDate?.value },
    { name: 'projectInformation.sector', value: detailData.projectInformation.sector?.value },
    { name: 'projectInformation.value', value: detailData.projectInformation.value?.value?.value },
    { name: 'projectInformation.exchangeRate', value: detailData.projectInformation.exchangeRate?.value?.value },
    { name: 'projectInformation.classification', value: detailData.projectInformation.classification?.value },
    { name: 'projectInformation.category', value: detailData.projectInformation.category?.value },
    { name: 'projectInformation.output', value: detailData.projectInformation.output?.value },
    { name: 'projectInformation.outputUnit', value: detailData.projectInformation.outputUnit?.value },
    { name: 'projectInformation.description', value: detailData.projectInformation.description?.value },
    { name: 'projectInformation.projectAddress.address', value: detailData.projectInformation.projectAddress?.address?.value },
    { name: 'projectInformation.projectAddress.province', value: detailData.projectInformation.projectAddress?.province?.value },
    { name: 'projectInformation.projectAddress.city', value: detailData.projectInformation.projectAddress?.city?.value },
    { name: 'otherInformation.programSourceOfFund', value: detailData.otherInformation.programSourceOfFund?.value },
    { name: 'otherInformation.projectSourceOfFund', value: detailData.otherInformation.projectSourceOfFund?.value },
    { name: 'otherInformation.valueSourceOfFund', value: detailData.otherInformation.valueSourceOfFund?.value },
    { name: 'otherInformation.physicalRealization', value: detailData.otherInformation.physicalRealization?.value },
    { name: 'otherInformation.exchangeRateSourceOfFund', value: detailData.otherInformation.exchangeRateSourceOfFund?.value },
    { name: 'otherInformation.remarkSourceOfFund', value: detailData.otherInformation.remarkSourceOfFund?.value },
  ];

  const conditionalFields = [];

  // Check if 'others' field is required (when programSourceOfFund is 'OTHERS')
  const programSourceOfFund = detailData.otherInformation.programSourceOfFund?.value;
  if (programSourceOfFund === 'OTHERS') {
    conditionalFields.push({
      name: 'otherInformation.others',
      value: detailData.otherInformation.others?.value,
    });
  }

  // Check if 'physicalRealizationOthers' field is required (when physicalRealization is 'OTHERS')
  const physicalRealization = detailData.otherInformation.physicalRealization?.value;
  if (physicalRealization === 'OTHERS') {
    conditionalFields.push({
      name: 'otherInformation.physicalRealizationOthers',
      value: detailData.otherInformation.physicalRealizationOthers?.value,
    });
  }

  const allRequiredFields = [...requiredFields, ...conditionalFields];

  const invalidFields = allRequiredFields.filter(
    (field) =>
      field.value === null ||
      field.value === undefined ||
      (typeof field.value === 'string' && field.value.trim() === '')
  );

  // if (invalidFields.length > 0) {
  //   console.warn('🚫 Field yang invalid:');
  //   invalidFields.forEach((field) => console.log(`- ${field.name}:`, field.value));
  // }

  return invalidFields.length === 0;
};

export default SubmitPermissionCheck;

import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailRatingManagement from '@/hooks/services/mip/rating/useGetDetailRatingManagement';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';

import { modal, ratingTypeOptions } from './Rating.constants';


export const useRating = () => {
  const { processId } = useIdentity();
  const [supportingContainer, setSupportingContainer] = useState(null);
  const [constrainContainer, setConstrainContainer] = useState(null);
  const [othersContainer, setOthersContainer] = useState(null);

  const { data: listRatingCategory } = useGetParameterList('ratingRate', { label: 'value1', value: 'key', value2: 'value2', value3: 'value3', value4: 'value4' });


  const { data: detailRatingData } = useGetDetailRatingManagement({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });

  console.log('detailRatingData', detailRatingData);
  const ratingType = detailRatingData?.ratingType;

  const isFound = ratingTypeOptions.some((item) => item.value.includes(ratingType));

  const ratingTypeValue = isFound ? ratingType : 'others';

  const othersRatingTypeDesc = isFound ? '' : ratingType;


  const selectedCategory = listRatingCategory?.find((item) => item.value === detailRatingData?.rating);

  const categoryValue = {
    label: selectedCategory?.value4,
    value: selectedCategory?.value3,
  };


  return {
    categoryValue,
    constrainContainer,
    detailRatingData,
    listRatingCategory,
    othersContainer,
    othersRatingTypeDesc,
    ratingTypeValue,
    setConstrainContainer,
    setOthersContainer,
    setSupportingContainer,
    supportingContainer,
  };
};

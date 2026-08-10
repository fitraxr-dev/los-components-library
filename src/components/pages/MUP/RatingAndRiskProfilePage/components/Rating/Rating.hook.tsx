import { useEffect, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailRatingManagement from '@/hooks/services/mip/rating/useGetDetailRatingManagement';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPAccess } from '@/components/pages/MUP/hooks/useMUPAccess';

import { ratingTypeOptions } from './Rating.constants';


export const useRating = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { viewOnly: globalViewOnly } = useViewOnly();
  const { baseMUPAccess, isAnalyst } = useMUPAccess();

  const [internalSupportingContainer, setInternalSupportingContainer] = useState(null);
  const [internalConstrainContainer, setInternalConstrainContainer] = useState(null);
  const [internalOthersContainer, setInternalOthersContainer] = useState(null);

  const supportingContainer = internalSupportingContainer;
  const constrainContainer = internalConstrainContainer;
  const othersContainer = internalOthersContainer;

  const setSupportingContainer = (container: any) => {
    setInternalSupportingContainer(container);
  };

  const setConstrainContainer = (container: any) => {
    setInternalConstrainContainer(container);
  };

  const setOthersContainer = (container: any) => {
    setInternalOthersContainer(container);
  };

  const isViewOnly = globalViewOnly || isAnalyst || !baseMUPAccess.canUpdate;

  const { data: listRatingCategory } = useGetParameterList('ratingRate', { label: 'value1', value: 'key', value2: 'value2', value3: 'value3', value4: 'value4' });


  const { data: detailRatingData, isLoading: isRatingLoading } = useGetDetailRatingManagement({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });


  const ratingType = detailRatingData?.ratingType;

  const isFound = ratingTypeOptions.some((item) => item.value.includes(ratingType));

  const ratingTypeValue = isFound ? ratingType : null;

  const othersRatingTypeDesc = isFound ? '' : ratingType;


  const selectedCategory = listRatingCategory?.find((item) => item.value === detailRatingData?.rating);

  const categoryValue = {
    label: selectedCategory?.value4,
    value: selectedCategory?.value3,
  };

  useEffect(() => {
    if (detailRatingData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({
          component: 'Rating',
          description: detailRatingData?.description?.substring(0, 100) + (detailRatingData?.description?.length > 100 ? '...' : ''),
          rating: detailRatingData?.rating,
          ratingLabel: detailRatingData?.ratingLabel,
          ratingPeriod: detailRatingData?.ratingPeriod,
          ratingType: detailRatingData?.ratingType,
        }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'Viewing MUP rating information',
      });
    }
  }, [recordActivity, processId, detailRatingData]);

  return {
    categoryValue,
    constrainContainer,
    detailRatingData,
    isRatingLoading,
    isViewOnly,
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

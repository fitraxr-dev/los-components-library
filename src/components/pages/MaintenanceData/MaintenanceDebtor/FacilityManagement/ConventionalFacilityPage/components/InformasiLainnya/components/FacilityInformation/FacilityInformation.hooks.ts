import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import useIdentity from '@/hooks/useIdentity';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetFacilityInformation from '../../../../hooks/FacilityInformation/useGetFacilityInformation';


export const useFacilityInformation = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();

  const { control, watch, reset } = useForm();

  const { data: facilityInformation } = useGetFacilityInformation({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });

  useEffect(() => {
    if (facilityInformation) {
      reset(facilityInformation?.data?.content as any);
    }
  }, [facilityInformation]);

  return {
    control,
    theme,
    watch,
  };
};

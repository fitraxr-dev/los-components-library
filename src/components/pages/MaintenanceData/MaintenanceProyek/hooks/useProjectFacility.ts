import { useEffect, useState } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { FinancingFacilityControllerApi, ProjectControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoFacilityProjectFilterRequest } from '@/services/openapi/master-service';


export interface RequestByIdDtoString {
  /**
   *
   * @type {string}
   * @memberof RequestByIdDtoString
   */
  id?: string;
}

const api = new ProjectControllerApi();
const apiProduct = new FinancingFacilityControllerApi();

export const useGetProjectFacility = (
  payload: GenericBucketRequestDtoFacilityProjectFilterRequest,
) => {
  const pathname = usePathname();
  const [finalProjectCode, setFinalProjectCode] = useState(null);
  const [sessionStep, setSessionStep] = useState(null);
  const [sessionMaintenanceProyek, setSessionMaintenanceProyek] = useState(null);

  useEffect(() => {
    const determineProjectCode = () => {
      // Check session storage for step
      const step = typeof window !== 'undefined' ? sessionStorage.getItem('step') : null;
      const maintenanceProyek = typeof window !== 'undefined' ? sessionStorage.getItem('maintenance-proyek') : null;

      // Update local state to track changes
      setSessionStep(step);
      setSessionMaintenanceProyek(maintenanceProyek);

      if (step === '1' && maintenanceProyek) {
        // Use maintenance-proyek value from session storage
        setFinalProjectCode(maintenanceProyek);
        return;
      }

      // Extract project code from URL
      const urlMatch = pathname.match(/(MNTP-\d+|PRJ-\d+)/);
      if (urlMatch) {
        const extractedCode = urlMatch[1];

        if (extractedCode.includes('MNTP')) {
          setFinalProjectCode(extractedCode);
        } else if (extractedCode.includes('PRJ')) {
          setFinalProjectCode(extractedCode);
        }
      } else {
        setFinalProjectCode(payload?.filter?.projectCode || null);
      }
    };

    determineProjectCode();

    // Set up interval to check session storage changes
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const currentStep = sessionStorage.getItem('step');
        const currentMaintenanceProyek = sessionStorage.getItem('maintenance-proyek');

        // Check if session storage values have changed
        if (currentStep !== sessionStep || currentMaintenanceProyek !== sessionMaintenanceProyek) {
          determineProjectCode();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pathname, payload?.filter?.projectCode, sessionStep, sessionMaintenanceProyek]);

  const query = useQuery({
    enabled: !!finalProjectCode,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const modifiedPayload = {
        ...payload,
        filter: {
          ...payload.filter,
          projectCode: finalProjectCode,
        },
      };
      const res = await api.projectFacilityAll(modifiedPayload);
      return res?.data;
    },
    queryKey: [
      'project-facility-list',
      {
        ...payload,
        filter: {
          ...payload.filter,
          projectCode: finalProjectCode,
        },
      },
    ],
  });

  return query;
};

export const useGetProjectFacilityProduct = () => {
  const pathname = usePathname();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [sessionStep, setSessionStep] = useState<string | null>(null);
  const [sessionMaintenanceProyek, setSessionMaintenanceProyek] = useState<string | null>(null);

  useEffect(() => {
    const determineProjectId = () => {
      const step = typeof window !== 'undefined' ? sessionStorage.getItem('step') : null;
      const maintenanceProyek = typeof window !== 'undefined' ? sessionStorage.getItem('maintenance-proyek') : null;

      // Update local state to track changes
      setSessionStep(step);
      setSessionMaintenanceProyek(maintenanceProyek);

      // Extract project ID from current URL
      const urlMatch = pathname.match(/(MNTP-\d+|PRJ-\d+)/);
      if (urlMatch) {
        const extractedId = urlMatch[1];

        if (extractedId.includes('PRJ') && step === '1' && maintenanceProyek) {
          setProjectId(maintenanceProyek);
        } else {
          setProjectId(extractedId);
        }
      } else {
        setProjectId(null);
      }
    };

    determineProjectId();

    // Set up interval to check session storage changes
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const currentStep = sessionStorage.getItem('step');
        const currentMaintenanceProyek = sessionStorage.getItem('maintenance-proyek');

        // Check if session storage values have changed
        if (currentStep !== sessionStep || currentMaintenanceProyek !== sessionMaintenanceProyek) {
          determineProjectId();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pathname, sessionStep, sessionMaintenanceProyek]);

  const query = useQuery({
    enabled: !!projectId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const payload: RequestByIdDtoString = { id: projectId };
      const res = await apiProduct.getProductsByProjectId(payload);
      return res?.data;
    },
    queryKey: [
      'project-facility-product',
      projectId
    ],
  });

  return query;
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';
import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { SaveDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useSaveDebtorGroup = ({
  onError = (error?: any) => { },
  onSuccess = (data, variables) => { },
}) => {
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDebtorGroupRequestDto) => {
      const response = await api.modifyGroup(payload);
      return response?.data;
    },

    onError: (error) => {
      onError(error);
    },
    onSuccess: (data, variables) => {
      const isCreate = !variables.bucketProcessId;

      recordActivity({
        activity: isCreate ? ActivityType.CREATE : ActivityType.EDIT,
        bucketProcessId: data?.data?.content?.bucketProcessId || variables.id || '',
        changeAfter: JSON.stringify({
          groupType: variables.groupType,
          isRelatedSmi: variables.isRelatedSmi,
          name: variables.name,
          sector: variables.sector,
          yearFounded: variables.yearFounded,
        }),
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: isCreate
          ? 'successfully created maintenance group from list page'
          : 'successfully edited maintenance group from list page',
      });

      queryClient.invalidateQueries({ queryKey: ['maintenance-group-list']});
      onSuccess(data, variables);
    },
  });

  return mutation;

};

export default useSaveDebtorGroup;

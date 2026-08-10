import { API } from '@/helpers/api';

import type { RecordLogRequest, RecordLogResponse } from '@/types/RecordLog';


const recordLog = async (body: RecordLogRequest): Promise<RecordLogResponse> => {

  try {
    await API('userManagement.auditTrail.record', { data: body });
    return null;
  } catch (error) {
    throw error.message || error;
  }
};

export default recordLog;

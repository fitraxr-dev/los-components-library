import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';


import { formatDate, formatDateTime } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import ButtonClose from '../../../ButtonClose/ButtonClose';

import { useNotification } from './Notification.hooks';


const Notification = ({ facilityInformation }: { facilityInformation: any }) => {
  const {
    control,
    theme,
    watch,
    isViewOnly,
    handleSaveNotification,
    intervalOptions,
    statusProjectPhaseOptions,
    findDataMaster,
  } = useNotification();


  return (
    <>
      <Title title="Notification" sx={{ mb: theme.spacing(3) }} />
      <ColumnWrapper sx={{ gap: 3 }}>

        <SectionTitle isOpen title="Notification" subtitle={`Facility No: ${facilityInformation?.facilityNo ? facilityInformation?.facilityNo : '-'} | RM: ${facilityInformation?.relationshipManager ? facilityInformation?.relationshipManager : '-'} | Divisi: ${facilityInformation?.division ? facilityInformation?.division : '-'}`}>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >

            <Controller
              control={control}
              name="statusProjectPhase"
              render={({ field }) => {

                return (
                  <Input
                    {...field}
                    label="Status Project Phase"
                    placeholder="Status Project Phase"
                    containerSx={{ flex: 1 }}
                    disabled={isViewOnly}
                    type="dropdown"
                    dropdownList={statusProjectPhaseOptions}
                    hasDataMaster={findDataMaster('statusProjectPhase', statusProjectPhaseOptions)}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="startDateCOD"
              render={({ field }) => {

                return (
                  <Input
                    {...field}
                    label="Start Date COD"
                    placeholder="Start Date COD"
                    containerSx={{ flex: 1 }}
                    disabled={isViewOnly}
                    type="date"
                    hasDataMaster={findDataMaster('startDateCOD')}
                  />
                );
              }}
            />

            <Controller
              name="endDateCOD"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="End Date COD"
                  placeholder="End Date COD"
                  containerSx={{ flex: 1 }}
                  disabled={isViewOnly}
                  type="date"
                  hasDataMaster={findDataMaster('endDateCOD')}
                />
              )}
            />

          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >

            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  type="text"
                  disabled

                />
              }
            />

            <Controller
              name="modifiedDate"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"
                  value={field?.value ? formatDateTime(field?.value) : ''}
                  disabled
                />
              }
            />
          </Box>
        </SectionTitle>
      </ColumnWrapper>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
        <ButtonClose isViewOnly={isViewOnly} handleSave={handleSaveNotification} />
      </RowWrapper>
    </>
  );
};
export default Notification;

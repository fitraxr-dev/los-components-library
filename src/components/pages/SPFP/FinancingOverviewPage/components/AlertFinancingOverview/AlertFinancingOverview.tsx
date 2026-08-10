import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useFinancingFacilityAlert from './hooks/useFinancingFacilityAlert';


const AlertFinancingOverview = () => {

  const { bucketProcessId, module: moduleName, process } = useSpfpBucketContext();

  const payload = {
    bucketProcessId,
    module: moduleName,
    process,
  };

  const { data: dataAlert } = useFinancingFacilityAlert(payload);
  const hasIncompleteFacility = dataAlert ?? false;

  if (!hasIncompleteFacility) return null;

  return (
    <RowWrapper
      alignItems="center"
      width="100%"
      mb={2}
      sx={{ backgroundColor: '#fffce4', gap: 2, padding: 2 }}
    >
      <Icon
        textVariant="body1"
        iconName="warning-2"
      />
      <TextStyle>
        Fasilitas usulan masih memiliki data yang belum lengkap. Mohon segera
        lakukan pengkinian data.
      </TextStyle>
    </RowWrapper>
  );
};

export default AlertFinancingOverview;

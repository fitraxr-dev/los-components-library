import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


interface AlertMIPExpiredProps {
  message?: string | null;
}

const AlertMIPExpired = ({ message }: AlertMIPExpiredProps) => (
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
      {message || 'Alert MIP expired.'}
    </TextStyle>
  </RowWrapper>
);

export default AlertMIPExpired;

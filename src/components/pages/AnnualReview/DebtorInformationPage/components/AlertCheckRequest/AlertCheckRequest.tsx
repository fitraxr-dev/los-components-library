import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


interface AlertCheckRequestProps {
  message?: string | null;
}

const AlertCheckRequest = ({ message }: AlertCheckRequestProps) => (
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
      {message}
    </TextStyle>
  </RowWrapper>
);

export default AlertCheckRequest;

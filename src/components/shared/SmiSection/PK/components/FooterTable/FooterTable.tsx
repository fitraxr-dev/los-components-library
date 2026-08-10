import IconButton from '@/components/shared/IconButton';
import RowWrapper from '@/components/shared/RowWrapper';


const FooterTable = ({ onCLick, isDisable }: { onCLick: () => void; isDisable?: boolean }) => {

  return (
    <RowWrapper sx={{ justifyContent: 'end', mx: 5, py: 3 }}>

      <IconButton
        iconName="add"
        isDisabled={isDisable}
        onClick={onCLick}
      />
    </RowWrapper>
  );
};

export default FooterTable;

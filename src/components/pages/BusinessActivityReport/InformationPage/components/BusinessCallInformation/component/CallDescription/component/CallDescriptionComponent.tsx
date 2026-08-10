import Checkbox from '@/components/shared/CheckBox';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useCallDescriptionComponent from './CallDescriptionComponent.hook';


const CallDescriptionComponent = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const {
    handleCheck,
    checkedList,
    handleCheckOther,
    watchFields,
    canCreateBAR,
    theme,
    register,
    canEditBAR,
    isBarCreation,
    callDescriptionTitle,
  } = useCallDescriptionComponent();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title={`${callDescriptionTitle} Summary`} isOpen>
        <RowWrapper
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(2),
          }}
        >
          {checkedList.map((dt, index) => (
            <RowWrapper
              key={index}
              sx={{ alignItems: 'center' }}
            >
              <Checkbox
                onChange={() => handleCheck(dt.value)}
                checked={watchFields.checklist?.includes(dt.value)}
                disabled={!isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' } }}
              />
              {dt.value === 'OTHER' ?
                <Input
                  {...register('other')}
                  value={watchFields.other}
                  onChange={(e) => handleCheckOther(e)}
                  type="text"
                  placeholder="Other"
                  disabled={!isBarCreation || canCreateBAR === false || canEditBAR === false || !watchFields.checklist?.includes('OTHER') || isViewOnly}
                  containerSx={{ flex: 1 }}
                /> :
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={
                    (canCreateBAR === false || canEditBAR === false || !isBarCreation || isViewOnly)
                      ? theme.palette.custom.gray20
                      : theme.palette.primary.main
                  }
                >
                  {dt.label}
                </TextStyle>}
            </RowWrapper>
          )
          )}

        </RowWrapper>
      </SectionTitle>
    </ColumnWrapper>
  );
};
export default CallDescriptionComponent;

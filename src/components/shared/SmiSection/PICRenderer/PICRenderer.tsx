import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';


interface PICRendererProps {
  data?: any;
}

const PICRenderer = ({ data }: PICRendererProps) => {
  if (!data?.length) {
    return <TextStyle>-</TextStyle>;
  }

  return (
    <ColumnWrapper>
      {data.map((item) => {
        const displayName = item?.prevName && item?.prevPicId
          ? item.prevName
          : item?.name ?? '-';

        const uniqueKey = `${item?.picId}-${item?.prevPicId}`;

        return (
          <TextStyle key={uniqueKey} weight={item?.isLeader ? 600 : 400}>
            {displayName}
          </TextStyle>
        );
      })}
    </ColumnWrapper>
  );
};

export default PICRenderer;

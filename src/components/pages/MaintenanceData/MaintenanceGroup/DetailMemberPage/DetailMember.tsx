'use client';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useDetailMember from './DetailMember.hook';
import MemberInformation from './MemberInformation';


const DetailMember = () => {
  const {
    groupId,
    memberId,
  } = useDetailMember();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <Title
          title="Member Information"
        />
      </RowWrapper>
      <MemberInformation />
    </ColumnWrapper>
  );
};

export default DetailMember;

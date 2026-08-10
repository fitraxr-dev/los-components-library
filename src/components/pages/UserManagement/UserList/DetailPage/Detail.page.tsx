'use client';
import React from 'react';

import { useParams } from 'next/navigation';

import ApprovalDetail from './components/ApprovalDetail';
import UserDetail from './components/UserDetail';


const DetailPage = () => {
  const { id }: {id: string} = useParams();
  const isApproval = id.includes('UM-');
  const processId = isApproval ? id : '';

  return (
    <>
      {isApproval ? (
        <ApprovalDetail processId={processId} />
      ) : (
        <UserDetail id={id} />
      )}
    </>
  );
};

export default DetailPage;

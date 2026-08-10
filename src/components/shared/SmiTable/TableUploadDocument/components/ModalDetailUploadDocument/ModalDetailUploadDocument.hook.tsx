import { useEffect, useState } from 'react';

import useGetDocumentById from '@/hooks/services/useGetDocumentById';


export const useModalDetailUploadDocument = ({ id }: {id: number}) => {

  const { data: detail } = useGetDocumentById({ id });

  return { detail };
};

import { useState } from 'react';


export const useResultList = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const handleToDetailPage = () => {};

  return {
    handleToDetailPage,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};

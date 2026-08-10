import useGetCoBorrower from '../../../hooks/useGetCoBorrower';


const useCoBorrower = () => {

  const page = 1;
  const pageSize = 5;

  const { data } = useGetCoBorrower({
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  return {
    data,
  };
};

export default useCoBorrower;

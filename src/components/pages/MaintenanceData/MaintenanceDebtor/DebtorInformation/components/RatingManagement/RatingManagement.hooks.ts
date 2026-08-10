import useGetRatingManagement from '../../../hooks/useGetRatingManagement';


const useRatingManagement = () => {
  const { data } = useGetRatingManagement({
    page: {
      itemPerPage: 5,
      noPage: 1,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  return {
    data,
  };
};

export default useRatingManagement;

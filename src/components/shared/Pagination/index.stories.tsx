import React, { useState } from 'react';

import Pagination from '.';


export default {
  component: Pagination,
  decorators: [
    (Story) => (
      <div style={{ width: '900px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'components/shared/Pagination',
};

const PaginationTemplate = ({ ...rest }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  return (
    <>
      <Pagination
        {...rest}
        handlePageChange={setPage}
        currentPage={page}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <pre style={{ marginTop: 10 }}>
        {JSON.stringify({ page, pageSize }, null, 2)}
      </pre>
    </>
  );
};

export const Default = PaginationTemplate.bind({});

Default.args = {
  pageSizeOptions: [5, 10, 25, 50, 100],
  totalPage: 10,
};

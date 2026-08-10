import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDownloadTemplate = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await API('master.databaseDk.download', {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], {
        type: res.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = res.headers['content-disposition'];
      let fileName = 'Template_Database_DK.xlsx';

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return res;
    },
  });

  return mutation;
};

export default useDownloadTemplate;

import * as yup from 'yup';


export const CreationAccessMenuSchema = yup.object({
  accessMenu: yup.array().required(),
  accessMenuList: yup.array(),
  accessMenuName: yup.string().required(),
});

export const tableHeaderList = [
  {
    key: 'view',
    label: 'View',
    sx: {
      minWidth: '7vw',
    },
  },
  {
    key: 'create',
    label: 'Create',
    sx: {
      minWidth: '7vw',
    },
  },
  {
    key: 'edit',
    label: 'Edit',
    sx: {
      minWidth: '7vw',
    },
  },
  {
    key: 'delete',
    label: 'Delete',
    sx: {
      minWidth: '7vw',
    },
  },
  {
    key: 'download',
    label: 'Download',
    sx: {
      minWidth: '7vw',
    },
  },
  // {
  //   key: 'showMenu',
  //   label: 'Show Menu',
  //   sx: {
  //     minWidth: '7vw',
  //   },
  // },
];

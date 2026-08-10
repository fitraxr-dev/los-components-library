export const mockTableDataMonitoring = {
  contents: [
    {
      aging: '1 Hari 10 Jam',
      createdAt: '2024-03-02T09:47:05.790Z',
      debtorName: 'Hesoyam',
      division: 'Tesla qqqq',
      dueDate: '13 Januari 2024',
      id: '3122',
      pic: [
        {
          directorate: 'SMI',
          division: 'Finance',
          isLeader: false,
          jobPosition: 'Senior Tinju Analyst',
          name: 'Bred',
          picId: 988,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
        {
          directorate: 'IST',
          division: 'Flutter',
          isLeader: true,
          jobPosition: 'Mobile Engineer',
          name: 'Elon',
          picId: 122,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
      ],
      rmName: 'Bruno Mars',
      status: 'WAITING_APPROVAL_TL',
      statusLabel: 'Waiting Approval TL',
    },
    {
      aging: '1 Hari 4 Jam',
      createdAt: '2024-03-05T09:47:05.790Z',
      debtorName: 'Mark Zuckerberg',
      division: 'Tesla',
      dueDate: '11 Januari 2024',
      id: '4121',
      pic: [
        {
          directorate: 'SMI',
          division: 'Finance',
          isLeader: true,
          jobPosition: 'Senior Finance Analyst',
          name: 'Joy',
          picId: 412,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
        {
          directorate: 'IST',
          division: 'Flutter',
          isLeader: false,
          jobPosition: 'Mobile Engineer',
          name: 'Elon',
          picId: 122,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
      ],
      rmName: 'Bruno Mars',
      status: 'WAITING_APPROVAL_TL',
      statusLabel: 'Waiting Approval TL',
    },
    {
      aging: '2 Hari 8 Jam',
      createdAt: '2024-03-14T09:47:05.790Z',
      debtorName: 'Elon Musk',
      division: 'Tesla',
      dueDate: '11 Januari 2024',
      id: '2345',
      pic: [
        {
          directorate: 'IST',
          division: 'Web Platform',
          isLeader: true,
          jobPosition: 'Software Engineer',
          name: 'Albert',
          picId: 123,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
        {
          directorate: 'IST',
          division: 'Flutter',
          isLeader: false,
          jobPosition: 'Mobile Engineer',
          name: 'Elon',
          picId: 122,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
        {
          directorate: 'IST',
          division: 'Cloud Platform',
          isLeader: false,
          jobPosition: 'Cloud Engineer',
          name: 'Bezos',
          picId: 241,
          reAssignTo: {
            directorate: '',
            division: '',
            endDate: '',
            id: 0,
            isPermanent: false,
            jobPosition: '',
            name: '',
            picId: 0,
            startDate: '',
          },
        },
      ],
      rmName: 'Bruno Mars',
      status: 'WAITING_APPROVAL_TL',
      statusLabel: 'Waiting Approval TL',
    },
  ],
  page: {
    totalPage: 1,
  },
};

export const mockTableDataSelectedTask = [
  {
    debtorName: 'Elon Musk',
    id: '2345',
    pic: 'Gates',
    reAssign: '-',
  },
  {
    debtorName: 'Elon Musk',
    id: '2345',
    pic: 'Gates',
    reAssign: '-',
  },
];

export const mockGetAllUser = {
  data: {
    contents: [
      {
        directorate: [
          {
            description: '',
            id: 1,
            name: 'SMI',
          }
        ],
        division: [
          {
            description: '',
            id: 1,
            name: 'Web Platform',
          }
        ],
        id: 77,
        jobPosition: [
          {
            description: '',
            id: 12,
            name: 'Senior Frontend Engineer',
          }
        ],
        nameLabel: 'Lala',
        user: {
          email: '',
          fullName: '',
          id: 77,
          nickName: '',
          phoneNumber: '',
          status: 0,
          superiorId: 0,
        },
      },
      {
        directorate: [
          {
            description: '',
            id: 1,
            name: 'SMI',
          }
        ],
        division: [
          {
            description: '',
            id: 1,
            name: 'Web Platform',
          }
        ],
        id: 55,
        jobPosition: [
          {
            description: '',
            id: 12,
            name: 'Senior Backend Engineer',
          }
        ],
        nameLabel: 'Maxi',
        user: {
          email: '',
          fullName: '',
          id: 55,
          nickName: '',
          phoneNumber: '',
          status: 0,
          superiorId: 0,
        },
      }
    ],
    page: {
      itemPerPage: 0,
      noPage: 0,
      totalData: 0,
      totalPage: 0,
    },
  },
};

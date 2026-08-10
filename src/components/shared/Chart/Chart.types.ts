export type ChartProps = {
  type: 'PIE_BOTTOM' | 'PIE_RIGHT' | 'GROUPED_BAR' | 'STACKED_BAR';
  data: StackedChartData | GroupedBarChartData | PieChartData[];
}

export type StackedChartData = {
  barData: {
    name: string;
    value: number[];
  }[];
  barLabel: {
    color: string;
    label: string;
  }[];
};

export type GroupedBarChartData = {
  barData: {
    name: string;
    value: number[];
  }[];
  barLabel: {
    color: string;
    label: string;
  }[];
};

export type PieChartData = {
  label: string;
  value: number;
  color: string;
};

export type StackedBarChartProps = {
  chart_data: StackedChartData;
}

export type GroupedBarChartProps = {
  chart_data: GroupedBarChartData;
}

export type PieChartProps = {
  chart_data: PieChartData[];
  direction: 'bottom' | 'right';
}

//////DUMMY DATA////////
export const CHART_DATA = {
  barData: [
    {
      name: 'Jan',
      value: [
        42,
        73,
        15,
        87,
        5,
        61,
        94,
        20,
        38,
        52,
        68,
        9,
        83
      ],
    },
    {
      name: 'Feb',
      value: [
        34,
        56,
        71,
        22,
        49,
        97,
        12,
        63,
        84,
        30,
        45,
        78,
        10
      ],
    },
    {
      name: 'Mar',
      value: [
        17,
        60,
        26,
        88,
        41,
        76,
        3,
        55,
        92,
        14,
        79,
        23,
        95
      ],
    },
    {
      name: 'Apr',
      value: [
        6,
        31,
        64,
        85,
        50,
        27,
        70,
        37,
        67,
        18,
        91,
        48,
        11
      ],
    },
    {
      name: 'Mei',
      value: [
        29,
        62,
        7,
        81,
        36,
        69,
        24,
        43,
        90,
        16,
        75,
        32,
        98
      ],
    },
    {
      name: 'Jun',
      value: [
        53,
        86,
        28,
        47,
        82,
        4,
        77,
        13,
        89,
        21,
        65,
        35,
        50
      ],
    },
    {
      name: 'Jul',
      value: [
        72,
        25,
        54,
        80,
        2,
        57,
        40,
        99,
        19,
        66,
        44,
        96,
        1
      ],
    },
    {
      name: 'Aug',
      value: [
        74,
        27,
        9,
        38,
        61,
        82,
        13,
        45,
        68,
        94,
        20,
        53,
        76
      ],
    },
    {
      name: 'Sep',
      value: [
        86,
        21,
        45,
        79,
        32,
        58,
        15,
        70,
        92,
        10,
        64,
        40,
        94
      ],
    },
    {
      name: 'Oct',
      value: [
        37,
        79,
        8,
        52,
        61,
        17,
        89,
        42,
        75,
        5,
        29,
        96,
        21
      ],
    },
    {
      name: 'Nov',
      value: [
        63,
        23,
        45,
        78,
        13,
        54,
        30,
        81,
        47,
        19,
        92,
        37,
        59
      ],
    },
    {
      name: 'Dec',
      value: [
        15,
        80,
        24,
        59,
        35,
        48,
        76,
        18,
        66,
        3,
        91,
        27,
        71
      ],
    }
  ],
  barLabel: [
    {
      color: '#739072',
      label: 'Pipeline',
    },
    {
      color: '#AC87C5',
      label: 'MIP',
    },
    {
      color: '#756AB6',
      label: 'Annual Review',

    },
    {
      color: '#9BB8CD',
      label: 'MIP Review',
    },
    {
      color: '#FF8080',
      label: 'MIR Review',
    },
    {
      color: '#F1C27B',
      label: 'MIR',
    },
    {
      color: '#82A0D8',
      label: 'MUR',
    },
    {
      color: '#79AC78',
      label: 'MUP',
    },
    {
      color: '#8DDFCB',
      label: 'SPFP',
    },
    {
      color: '#EFB495',
      label: 'Risalah Rapat',
    },
    {
      color: '#B6E2A1',
      label: 'Perikatan Pembiayaan',
    },
    {
      color: '#95BDFF',
      label: 'Loan Processing Summary - BAST',
    },
    {
      color: '#F7C9B0',
      label: 'Loan Processing Summary - Core',
    }
  ],

};

export const CHART_DATA2 = {
  barData: [
    {
      name: 'Jan',
      value: [12, 18, 5, 19, 7, 15],
    },
    {
      name: 'Feb',
      value: [4, 10, 16, 13, 3, 5],
    },
    {
      name: 'Mar',
      value: [19, 7, 4, 8, 2, 13],
    },
    {
      name: 'Apr',
      value: [1, 14, 12, 11, 5, 15],
    },
    {
      name: 'Mei',
      value: [15, 19, 6, 20, 7, 8],
    },
    {
      name: 'Jun',
      value: [8, 15, 11, 17, 20, 6],
    },
    {
      name: 'Jul',
      value: [14, 8, 4, 15, 6, 11],
    },
    {
      name: 'Aug',
      value: [7, 18, 9, 11, 16, 4],
    },
    {
      name: 'Sep',
      value: [20, 6, 5, 15, 3, 12],
    },
    {
      name: 'Oct',
      value: [9, 18, 7, 15, 19, 6],
    },
    {
      name: 'Nov',
      value: [11, 5, 14, 8, 2, 13],
    },
    {
      name: 'Dec',
      value: [1, 20, 3, 12, 17, 6],
    },
  ],
  barLabel: [
    {
      color: '#739072',
      label: 'Divisi A',
    },
    {
      color: '#AC87C5',
      label: 'Divisi B',
    },
    {
      color: '#756AB6',
      label: 'Divisi C',

    },
    {
      color: '#FF8080',
      label: 'Divisi D',
    },
    {
      color: '#F1C27B',
      label: 'Divisi E',
    },
    {
      color: '#79AC78',
      label: 'Divisi F',
    },
  ],

};

export const CHART_DATA3 = {
  barData: [
    {
      name: 'Jan',
      value: [12, 18, 5, 19, 7, 15],
    },
    {
      name: 'Feb',
      value: [4, 10, 16, 13, 3, 5],
    },
    {
      name: 'Mar',
      value: [19, 7, 4, 8, 2, 13],
    },
    {
      name: 'Apr',
      value: [1, 14, 12, 11, 5, 15],
    },
    {
      name: 'Mei',
      value: [15, 19, 6, 20, 7, 8],
    },
    {
      name: 'Jun',
      value: [8, 15, 11, 17, 20, 6],
    },
    {
      name: 'Jul',
      value: [14, 8, 4, 15, 6, 11],
    },
    {
      name: 'Aug',
      value: [7, 18, 9, 11, 16, 4],
    },
    {
      name: 'Sep',
      value: [20, 6, 5, 15, 3, 12],
    },
    {
      name: 'Oct',
      value: [9, 18, 7, 15, 19, 6],
    },
    {
      name: 'Nov',
      value: [11, 5, 14, 8, 2, 13],
    },
    {
      name: 'Dec',
      value: [1, 20, 3, 12, 17, 6],
    },
  ],
  barLabel: [
    {
      color: '#395A7F',
      label: 'Pipeline',
    },
    {
      color: '#6E9FC1',
      label: 'In Progress',
    },
    {
      color: '#A3CAE9',
      label: 'Approve',

    },
    {
      color: '#ACACAC',
      label: 'Partial Efektif',
    },
    {
      color: '#E3E3E3',
      label: 'Efektif Pembiayaan',
    },
    {
      color: '#F57B58',
      label: 'Decline',
    },
  ],

};

export const PIE_CHART_DATA = [
  {
    color: '#395A7F',
    label: 'Pipeline',
    value: 50,
  },
  {
    color: '#6E9FC1',
    label: 'In Progress',
    value: 20,
  },
  {
    color: '#A3CAE9',
    label: 'Approve',
    value: 10,
  },
  {
    color: '#ACACAC',
    label: 'Partial Efektif',
    value: 20,
  },
  {
    color: '#E3E3E3',
    label: 'Efektif Pembiayaan',
    value: 70,
  },
  {
    color: '#F57B58',
    label: 'Decline',
    value: 60,
  },
];

export const PIE_CHART_DATA2 = [
  {
    color: 'cadetblue',
    label: 'Pipeline',
    value: 50,
  },
  {
    color: 'pink',
    label: 'MIP',
    value: 20,
  },
  {
    color: 'green',
    label: 'Credit',
    value: 10,
  },
  {
    color: 'yellow',
    label: 'IDR',
    value: 20,
  },
  {
    color: 'burlywood',
    label: '$',
    value: 70,
  },
  {
    color: 'brown',
    label: 'TEST',
    value: 60,
  },
  {
    color: '#00DF80',
    label: 'TEST4',
    value: 60,
  },
  {
    color: '#242C32',
    label: 'TEST0',
    value: 60,
  },
  {
    color: '#739072',
    label: 'Aspect',
    value: 60,
  },
  {
    color: '#828282',
    label: 'REVIEW',
    value: 60,
  },
  {
    color: '#AC87C5',
    label: 'LEGAL',
    value: 60,
  },
];

const players = [
  // {
  //   pid: 1,
  //   active: true,
  //   name: "Andrew Z.",
  //   placed: null
  // },
  // {
  //   pid: 2,
  //   active: true,
  //   name: "Bernard K.",
  //   placed: null
  // },
  // {
  //   pid: 3,
  //   active: true,
  //   name: "Brandon",
  //   placed: null
  // },
  // {
  //   pid: 4,
  //   active: true,
  //   name: "Chris F.",
  //   placed: null
  // },
  // {
  //   pid: 5,
  //   active: true,
  //   name: "Eric H.",
  //   placed: null
  // },
  // {
  //   pid: 6,
  //   active: true,
  //   name: "Flynn",
  //   placed: null
  // },
  // {
  //   pid: 7,
  //   active: true,
  //   name: "Guy V.",
  //   placed: null
  // },
  // {
  //   pid: 8,
  //   active: true,
  //   name: "Kent",
  //   placed: null
  // },
  // {
  //   pid: 9,
  //   active: true,
  //   name: "Kevin P.",
  //   placed: null
  // },
  // {
  //   pid: 10,
  //   active: true,
  //   name: "Luke H.",
  //   placed: null
  // },
  // {
  //   pid: 11,
  //   active: true,
  //   name: "Matt C.",
  //   placed: null
  // },
  // {
  //   pid: 12,
  //   active: true,
  //   name: "Mike K.",
  //   placed: null
  // },
  // {
  //   pid: 13,
  //   active: true,
  //   name: "Mike O.",
  //   placed: null
  // },
  // {
  //   pid: 14,
  //   active: true,
  //   name: "Scott S.",
  //   placed: null
  // },
  // {
  //   pid: 15,
  //   active: true,
  //   name: "Tom St.",
  //   placed: null
  // }
];

const defaultBlinds = [
  {
    type: 'blind',
    label: 'Level 1',
    sb: 25,
    bb: 50,
    ante: 0,
    time: 0.1
  },
  {
    type: 'blind',
    label: 'Level 2',
    sb: 50,
    bb: 100,
    ante: 0,
    time: 1
  },
  {
    type: 'blind',
    label: 'Level 3',
    sb: 75,
    bb: 150,
    ante: 0,
    time: 1
  },
  {
    type: 'blind',
    label: 'Level 4',
    sb: 100,
    bb: 200,
    ante: 0,
    time: 1
  },
  {
    type: 'break',
    label: 'Break',
    time: 1
  },
  {
    type: 'blind',
    label: 'Level 5',
    sb: 100,
    bb: 200,
    ante: 200,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 6',
    sb: 125,
    bb: 250,
    ante: 250,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 7',
    sb: 150,
    bb: 300,
    ante: 300,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 8',
    sb: 200,
    bb: 400,
    ante: 400,
    time: 15
  },
  {
    type: 'break',
    label: 'Break - Color Up 25s',
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 9',
    sb: 300,
    bb: 600,
    ante: 600,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 10',
    sb: 400,
    bb: 800,
    ante: 800,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 11',
    sb: 500,
    bb: 1000,
    ante: 1000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 12',
    sb: 700,
    bb: 1400,
    ante: 1400,
    time: 15
  },
  {
    type: 'break',
    label: 'Break - Color Up 100s',
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 13',
    sb: 1000,
    bb: 2000,
    ante: 2000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 14',
    sb: 1500,
    bb: 3000,
    ante: 3000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 15',
    sb: 2000,
    bb: 4000,
    ante: 4000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 16',
    sb: 3000,
    bb: 6000,
    ante: 6000,
    time: 15
  },
  {
    type: 'break',
    label: 'Break - Color Up 500s',
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 17',
    sb: 4000,
    bb: 8000,
    ante: 8000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 18',
    sb: 6000,
    bb: 12000,
    ante: 12000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 19',
    sb: 8000,
    bb: 16000,
    ante: 16000,
    time: 15
  },
  {
    type: 'blind',
    label: 'Level 20',
    sb: 10000,
    bb: 20000,
    ante: 20000,
    time: 15
  }
];

const defaultNumPayouts = [
  {
    entries: 4,
    placesPaid: 1
  },
  {
    entries: 5,
    placesPaid: 2
  },
  {
    entries: 6,
    placesPaid: 2
  },
  {
    entries: 7,
    placesPaid: 2
  },
  {
    entries: 8,
    placesPaid: 3
  },
  {
    entries: 9,
    placesPaid: 3
  },
  {
    entries: 10,
    placesPaid: 3
  },
  {
    entries: 11,
    placesPaid: 3
  },
  {
    entries: 12,
    placesPaid: 4
  },
  {
    entries: 13,
    placesPaid: 4
  },
  {
    entries: 14,
    placesPaid: 4
  },
  {
    entries: 15,
    placesPaid: 4
  },
  {
    entries: 16,
    placesPaid: 4
  },
  {
    entries: 17,
    placesPaid: 5
  },
  {
    entries: 18,
    placesPaid: 5
  },
  {
    entries: 19,
    placesPaid: 5
  },
  {
    entries: 20,
    placesPaid: 5
  },
  {
    entries: 21,
    placesPaid: 6
  },
  {
    entries: 22,
    placesPaid: 6
  },
  {
    entries: 23,
    placesPaid: 6
  },
  {
    entries: 24,
    placesPaid: 6
  },
  {
    entries: 25,
    placesPaid: 6
  },
  {
    entries: 26,
    placesPaid: 6
  },
  {
    entries: 27,
    placesPaid: 6
  },
  {
    entries: 28,
    placesPaid: 7
  },
  {
    entries: 29,
    placesPaid: 7
  },
  {
    entries: 30,
    placesPaid: 7
  },
  {
    entries: 31,
    placesPaid: 7
  },
  {
    entries: 32,
    placesPaid: 7
  },
  {
    entries: 33,
    placesPaid: 7
  },
  {
    entries: 34,
    placesPaid: 7
  },
  {
    entries: 35,
    placesPaid: 7
  },
  {
    entries: 36,
    placesPaid: 8
  },
  {
    entries: 37,
    placesPaid: 8
  },
  {
    entries: 38,
    placesPaid: 8
  },
  {
    entries: 39,
    placesPaid: 8
  },
  {
    entries: 40,
    placesPaid: 8
  }
]

const defaultPrizes = [
  {
    placesPaid: 1,
    prizes: [1] 
  },
  {
    placesPaid: 2,
    prizes: [0.6, 0.4] 
  },
  {
    placesPaid: 3,
    prizes: [0.5, 0.3, 0.2] 
  },
  {
    placesPaid: 4,
    prizes: [0.45, 0.25, 0.18, 0.12] 
  },
  {
    placesPaid: 5,
    prizes: [0.435, 0.24, 0.16, 0.1, 0.065] 
  },
  {
    placesPaid: 6,
    prizes: [0.38, 0.22, 0.15, 0.11, 0.08, 0.06] 
  },
  {
    placesPaid: 7,
    prizes: [0.35, 0.21, 0.15, 0.11, 0.08, 0.06, 0.04] 
  },
  {
    placesPaid: 8,
    prizes: [0.27, 0.19, 0.16, 0.13, 0.10, 0.07, 0.05, 0.03] 
  }
];
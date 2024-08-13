const environmentLabels = {
  STG: 'Sandbox',
  DEV: 'Development',
  PRD: 'Production',
};

const transferValues = [
  {
    value: 'L100',
    label: '0 - 100',
  },
  {
    value: 'L1000',
    label: '< 1000',
  },
  {
    value: 'L5000',
    label: '< 5000',
  },
  {
    value: 'G5000',
    label: '5000 +',
  },
];

const requestStatusLabels = {
  PEND: 'Pending',
  APRD: 'Active',
  DENY: 'Inactive',
};

// Need to add other statuses here
const userStatusLabels = {
  CONFD: 'Active',
};

// Need to add other roles here
const userRoleLabels = {
  ADM: 'Admin',
};

export {
  environmentLabels,
  transferValues,
  requestStatusLabels,
  userStatusLabels,
  userRoleLabels,
};

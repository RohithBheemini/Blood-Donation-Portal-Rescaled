export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPATIBILITY = {
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-']
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal recipient
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-']
  },
  'O-': {
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal donor
    canReceiveFrom: ['O-']
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-']
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-']
  }
};

export const INITIAL_INVENTORY = {
  'A+': 14,
  'A-': 4,
  'B+': 18,
  'B-': 3,
  'AB+': 8,
  'AB-': 2,
  'O+': 22,
  'O-': 5
};

export const INITIAL_DONORS = [
  {
    id: 'DON-1001',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    age: 29,
    weight: 72,
    city: 'Bangalore',
    address: 'Indiranagar 100ft Road, Bangalore',
    emergencyContact: '+91 98765 11111',
    healthConditions: 'None',
    medications: 'None',
    isAbove18: true,
    donationsCount: 4,
    lastDonationDate: '2026-07-15',
    status: 'Eligible',
    badge: 'Gold Hero'
  },
  {
    id: 'DON-1002',
    fullName: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    phone: '+91 98123 45678',
    bloodGroup: 'A+',
    age: 26,
    weight: 58,
    city: 'Chennai',
    address: 'Adyar Canal Road, Chennai',
    emergencyContact: '+91 98123 00000',
    healthConditions: 'None',
    medications: 'None',
    isAbove18: true,
    donationsCount: 2,
    lastDonationDate: '2026-06-20',
    status: 'Eligible',
    badge: 'Silver Lifesaver'
  },
  {
    id: 'DON-1003',
    fullName: 'Arjun Verma',
    email: 'arjun.verma@example.com',
    phone: '+91 97654 32109',
    bloodGroup: 'O-',
    age: 34,
    weight: 78,
    city: 'Mumbai',
    address: 'Andheri West, Mumbai',
    emergencyContact: '+91 97654 99999',
    healthConditions: 'None',
    medications: 'None',
    isAbove18: true,
    donationsCount: 7,
    lastDonationDate: '2026-05-10',
    status: 'Eligible',
    badge: 'Platinum Guardian'
  },
  {
    id: 'DON-1004',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 99234 56781',
    bloodGroup: 'B-',
    age: 24,
    weight: 54,
    city: 'Pune',
    address: 'Kothrud, Pune',
    emergencyContact: '+91 99234 88888',
    healthConditions: 'None',
    medications: 'None',
    isAbove18: true,
    donationsCount: 1,
    lastDonationDate: '2026-08-01',
    status: 'Eligible',
    badge: 'Bronze Starter'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-501',
    patientName: 'Sunita Rao',
    bloodGroup: 'O-',
    unitsRequired: 2,
    urgency: 'CRITICAL',
    hospitalName: 'Apollo Speciality Hospital',
    city: 'Bangalore',
    contactPerson: 'Dr. K. Srinivas (ICU Lead)',
    phone: '+91 98450 12345',
    reason: 'Emergency Cardiac Bypass Surgery',
    status: 'Urgent Need',
    createdAt: '2026-10-11T09:30:00Z',
    pledges: 1
  },
  {
    id: 'REQ-502',
    patientName: 'Karthik Menon',
    bloodGroup: 'AB-',
    unitsRequired: 1,
    urgency: 'HIGH',
    hospitalName: 'Fortis Multi-Speciality Clinic',
    city: 'Hyderabad',
    contactPerson: 'Ramesh Menon (Brother)',
    phone: '+91 98840 98765',
    reason: 'Severe Thrombocytopenia treatment',
    status: 'Matching',
    createdAt: '2026-10-10T14:15:00Z',
    pledges: 0
  },
  {
    id: 'REQ-503',
    patientName: 'Meera Patel',
    bloodGroup: 'B+',
    unitsRequired: 3,
    urgency: 'STANDARD',
    hospitalName: 'Manipal Hospital Whitefield',
    city: 'Bangalore',
    contactPerson: 'Sanjay Patel (Father)',
    phone: '+91 97410 54321',
    reason: 'Scheduled Orthopedic Surgery',
    status: 'Fulfilled',
    createdAt: '2026-10-09T11:00:00Z',
    pledges: 3
  }
];

export const INITIAL_CAMPS = [
  {
    id: 'CAMP-301',
    title: 'Metro Tech Park Blood Drive 2026',
    organizer: 'Red Cross Society & Tech Park Welfare',
    date: '2026-10-18',
    time: '09:00 AM - 04:00 PM',
    venue: 'Block 4 Central Atrium, Embassy TechVillage, Outer Ring Rd',
    city: 'Bangalore',
    expectedDonors: 150,
    registeredCount: 88,
    contact: '+91 80 4123 4567',
    status: 'Upcoming'
  },
  {
    id: 'CAMP-302',
    title: 'Youth Lifesaver College Camp',
    organizer: 'National Service Scheme (NSS) Chapter',
    date: '2026-10-24',
    time: '10:00 AM - 03:00 PM',
    venue: 'Auditorium Hall, City Engineering Campus',
    city: 'Chennai',
    expectedDonors: 100,
    registeredCount: 62,
    contact: '+91 44 2876 5432',
    status: 'Upcoming'
  },
  {
    id: 'CAMP-303',
    title: 'Community Health & Blood Camp',
    organizer: 'Rotary Club of Bangalore Midtown',
    date: '2026-11-02',
    time: '08:30 AM - 02:00 PM',
    venue: 'Koramangala Indoor Stadium Gate 2',
    city: 'Bangalore',
    expectedDonors: 200,
    registeredCount: 114,
    contact: '+91 99000 11223',
    status: 'Upcoming'
  }
];

export const FAQS = [
  {
    q: 'How frequently can I donate whole blood?',
    a: 'Healthy male donors can donate every 90 days (3 months), while healthy female donors can donate every 120 days (4 months) to allow adequate iron store replenishment.'
  },
  {
    q: 'How long does a typical blood donation take?',
    a: 'The entire visit takes about 30 to 45 minutes, with the actual blood drawing process taking only 8 to 10 minutes.'
  },
  {
    q: 'Who can receive my donated blood?',
    a: 'O negative donors are universal red cell donors and can help any patient in emergency situations. O positive is the most common blood type in high demand.'
  },
  {
    q: 'Are the needles and equipment sterile and safe?',
    a: 'Yes, 100% sterile, single-use, disposable equipment is used for every donor. There is zero risk of acquiring any infection by donating blood.'
  }
];

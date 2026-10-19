export const alerts = [
  {
    id: 1,
    building: 'Building A',
    title: 'After-hours electricity usage',
    status: 'Investigation needed',
    expected: 8,
    measured: 20,
    tariff: 60,
    confidence: 'Medium',
    evidence: [
      'Building schedule ke mutabiq us waqt occupancy expected nahi thi.',
      'Usage pichhle comparable periods se consistently zyada tha.',
      'Equipment-level readings abnormal consumption ka source narrow down kar sakti hain.',
    ],
    action:
      'Equipment schedules aur meter readings inspect karo. Agar unnecessary usage confirm ho, schedule adjustment ke baad savings verify karo.',
    hourly: [
      { hour: '18:00', expected: 10, actual: 11 },
      { hour: '20:00', expected: 9, actual: 14 },
      { hour: '22:00', expected: 8, actual: 20 },
      { hour: '00:00', expected: 6, actual: 18 },
      { hour: '02:00', expected: 6, actual: 17 },
      { hour: '04:00', expected: 7, actual: 15 },
    ],
  },
  {
    id: 2,
    building: 'Building B',
    title: 'Persistent base load',
    status: 'Monitoring',
    expected: 15,
    measured: 22,
    tariff: 60,
    confidence: 'Low',
    evidence: [
      'Base load weekends par bhi high raha.',
      'Sensor error ka imkan ruled out nahi hua.',
    ],
    action: 'Sub-meter readings check karo aur sensor calibration verify karo.',
    hourly: [
      { hour: '18:00', expected: 15, actual: 20 },
      { hour: '22:00', expected: 15, actual: 22 },
      { hour: '02:00', expected: 14, actual: 21 },
    ],
  },
]

export const summary = {
  verifiedSavings: 0,
}
export const seedActions = [
  {
    id: 1,
    alertId: 1,
    type: 'Operating schedule adjust kiya',
    note: 'Raat ke waqt equipment auto-off set kiya',
    date: '2026-10-10',
  },
]

// Action ke pehle aur baad ke comparable periods ka raat ka usage (kWh)
export const verifications = {
  1: {
    before: [20, 19, 21, 20, 18, 20, 19],
    after: [9, 10, 8, 9, 11, 9, 8],
    checks: [
      'Dono periods mein occupancy schedule same thi.',
      'Temperature ka farq chhota tha, is liye weather adjustment zyada asar nahi dalta.',
      'Usage ab expected level (8 kWh) ke kareeb hai.',
    ],
  },
}
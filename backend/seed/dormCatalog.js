export const dormCatalog = [
  {
    name: 'The Zenith Suite',
    block: 'Block A (North)',
    address: 'Block A, Scholarly Heights Campus',
    description: 'Premium student-focused housing with quiet study zones.',
    rules: 'No loud noise after 10 PM. Keep shared spaces clean.',
    facilities: ['High-speed Wi-Fi', '24/7 Security', 'Laundry Service', 'Study Lounge'],
    totalFloors: 8,
    totalCapacity: 220,
  },
  {
    name: 'The Ivy Sanctuary',
    block: 'Block B (South)',
    address: 'Block B, North Wing',
    description: 'Balanced co-living for focused students.',
    rules: 'Visitors allowed till 8 PM with prior registration.',
    facilities: ['High-speed Wi-Fi', 'Gym', 'Dining Hall'],
    totalFloors: 6,
    totalCapacity: 180,
  },
  {
    name: 'The Metropolitan Loft',
    block: 'Executive Annex',
    address: 'Executive Annex',
    description: 'Modern loft-style residence with collaborative spaces.',
    rules: 'Keep shared floors clean. Quiet hours start at 11 PM.',
    facilities: ['High-speed Wi-Fi', 'AC', 'Laundry', 'Shared Pantry'],
    totalFloors: 6,
    totalCapacity: 140,
  },
  {
    name: 'Scholar Haven',
    block: 'Block A (North)',
    address: 'Block A, South',
    description: 'Affordable shared accommodation with study-friendly environment.',
    rules: 'Maintain shared room discipline and hygiene.',
    facilities: ['High-speed Wi-Fi', 'Laundry', 'Study Hall'],
    totalFloors: 5,
    totalCapacity: 260,
  },
  {
    name: 'Aurora Residence',
    block: 'Block B (South)',
    address: 'Block B, East',
    description: 'Comfort-focused residence for paired occupancy.',
    rules: 'Use shared facilities responsibly.',
    facilities: ['High-speed Wi-Fi', 'Attached Bath', 'Secure Entry'],
    totalFloors: 7,
    totalCapacity: 190,
  },
  {
    name: 'Crest View',
    block: 'Executive Annex',
    address: 'Executive Annex',
    description: 'Single-occupancy rooms with skyline-facing views.',
    rules: 'Noise control and visitor guidelines are strictly enforced.',
    facilities: ['High-speed Wi-Fi', 'Inverter AC', 'Power Backup'],
    totalFloors: 8,
    totalCapacity: 120,
  },
]

export function canonicalDormName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ')
}

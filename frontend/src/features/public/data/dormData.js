export const featuredDorms = [
  {
    id: 'ivy-sanctuary',
    name: 'The Ivy Sanctuary',
    type: 'Premium Studio',
    price: 'BDT 10,500',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'metropolitan-loft',
    name: 'The Metropolitan Loft',
    type: 'Loft Suite',
    price: 'BDT 9,500',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'zenith-suite',
    name: 'The Zenith Suite',
    type: 'Premium Single Room',
    price: 'BDT 8,500',
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  },
]

export const browseDorms = [
  {
    id: 'zenith-suite',
    name: 'The Zenith Suite',
    type: 'Single Room',
    price: 'BDT 8,500',
    location: 'Block A, Scholarly Heights Campus',
    block: 'Block A (North)',
    amenities: ['WiFi', 'AC', 'Bath', 'Laundry'],
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ivy-sanctuary',
    name: 'The Ivy Sanctuary',
    type: 'Studio Suite',
    price: 'BDT 10,500',
    location: 'Block B, North Wing',
    block: 'Block B (South)',
    amenities: ['WiFi', 'AC', 'Bath'],
    status: 'Limited Seats',
    image:
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'metropolitan-loft',
    name: 'The Metropolitan Loft',
    type: 'Loft Suite',
    price: 'BDT 9,500',
    location: 'Executive Annex',
    block: 'Executive Annex',
    amenities: ['WiFi', 'AC', 'Laundry'],
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'scholar-haven',
    name: 'Scholar Haven',
    type: 'Shared (4 Bed)',
    price: 'BDT 5,500',
    location: 'Block A, South',
    block: 'Block A (North)',
    amenities: ['WiFi', 'Laundry'],
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'aurora-residence',
    name: 'Aurora Residence',
    type: 'Double Room',
    price: 'BDT 7,500',
    location: 'Block B, East',
    block: 'Block B (South)',
    amenities: ['WiFi', 'Bath'],
    status: 'Full',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'crest-view',
    name: 'Crest View',
    type: 'Single Room',
    price: 'BDT 8,000',
    location: 'Executive Annex',
    block: 'Executive Annex',
    amenities: ['WiFi', 'AC'],
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  },
]

export const zenithSuite = {
  id: 'zenith-suite',
  name: 'The Zenith Suite',
  type: 'Premium Single Room',
  status: 'Available',
  location: 'Block A, Scholarly Heights Campus',
  rent: 'BDT 8,500',
  specs: [
    { label: 'Type', value: 'Single', icon: 'bedroom_parent' },
    { label: 'Seat Count', value: '1 Person', icon: 'chair_alt' },
    { label: 'Floor', value: '3rd Floor', icon: 'layers' },
    { label: 'Size', value: '180 sqft', icon: 'square_foot' },
    { label: 'Gender', value: 'Co-ed Floor', icon: 'wc' },
    { label: 'Price', value: 'BDT 8,500', icon: 'payments' },
  ],
  amenities: [
    { icon: 'wifi', label: 'High-speed Wi-Fi' },
    { icon: 'ac_unit', label: 'Central AC' },
    { icon: 'bathtub', label: 'Attached Bath' },
    { icon: 'local_laundry_service', label: 'Laundry Service' },
    { icon: 'security', label: '24/7 Security' },
    { icon: 'bolt', label: 'Power Backup' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
  ],
}

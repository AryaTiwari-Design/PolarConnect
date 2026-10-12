import { api, USE_MOCK } from '../../../services/api'

export const indianStations = [
  {
    id: 'maitri',
    name: 'Maitri',
    type: 'Permanent Antarctic research station',
    country: 'India',
    lat: -70.7658,
    lng: 11.737,
    established: '1989',
    status: 'Operational, year-round',
    region: 'Schirmacher Oasis, Queen Maud Land, East Antarctica',
    image: 'https://data.ncpor.res.in/static/images/slider/maitri/IMG_6.JPG',
    imageAlt: 'India’s Maitri research station building in Antarctica',
    imageCredit: 'NCPOR data portal',
    description:
      'India’s second permanent Antarctic base, established after Dakshin Gangotri and built on exposed rock in the Schirmacher Oasis. It supports year-round Indian Antarctic Programme work in a comparatively stable rocky setting.',
    focus: ['Atmospheric science', 'Meteorology', 'Glaciology', 'Earth sciences', 'Biology', 'Human physiology'],
    facts: [
      'Located in the rocky Schirmacher Oasis of East Antarctica.',
      'Built and completed in 1989, shortly before Dakshin Gangotri was abandoned after burial by snow and ice.',
      'Designed to support wintering teams and multidisciplinary field science.',
      'Managed as part of India’s Antarctic programme by NCPOR under the Ministry of Earth Sciences.',
    ],
    logistics: ['Winter accommodation for expedition teams', 'Field support for Schirmacher Oasis research', 'Long-running weather and environmental observations'],
    sourceLabel: 'NCPOR / NPDC Antarctica page',
    sourceUrl: 'https://pdc.ncpor.res.in/npdc/antarctica_home.action',
  },
  {
    id: 'bharati',
    name: 'Bharati',
    type: 'Permanent Antarctic research station',
    country: 'India',
    lat: -69.4078,
    lng: 76.1884,
    established: '2012',
    status: 'Operational, year-round',
    region: 'Larsemann Hills, Prydz Bay sector, East Antarctica',
    image: 'https://www.antarctica.gov.au/site/assets/files/50741/bharati-station.1024x0.jpeg',
    imageAlt: 'Bharati research station raised over rocky Antarctic terrain',
    imageCredit: 'Australian Antarctic Program',
    description:
      'India’s third and newest permanent Antarctic base, located on rocky ground in the Larsemann Hills near Prydz Bay. The elevated modular station supports modern polar research and operations in the eastern Antarctic sector.',
    focus: ['Earth sciences', 'Marine science', 'Southern Ocean studies', 'Environmental monitoring', 'Polar operations'],
    facts: [
      'Situated between the Stornes and Broknes peninsulas in the Larsemann Hills area.',
      'India currently operates Bharati alongside Maitri as one of its two active Antarctic stations.',
      'The station extends India’s field reach roughly 3,000 km east of Maitri.',
      'Its raised, modular architecture helps handle drifting snow and severe polar weather.',
    ],
    logistics: ['Modern station modules', 'Access to Prydz Bay and Larsemann Hills field sites', 'Support for geoscience and marine-linked observations'],
    sourceLabel: 'NCPOR expedition page',
    sourceUrl: 'https://www.ncps.ncpor.res.in/expedition/index.php',
  },
  {
    id: 'dakshin-gangotri',
    name: 'Dakshin Gangotri',
    type: 'Historic Antarctic research base',
    country: 'India',
    lat: -70.0833,
    lng: 12,
    established: '1983-84',
    status: 'Decommissioned; historic/supply-base legacy',
    region: 'Central Dronning Maud Land ice shelf, East Antarctica',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/%E0%A4%A6%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%A3_%E0%A4%97%E0%A4%82%E0%A4%97%E0%A5%8B%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A5%80%2C_%E0%A4%85%E0%A4%82%E0%A4%9F%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%9F%E0%A4%BF%E0%A4%95%E0%A4%BE.jpg',
    imageAlt: 'Dakshin Gangotri huts partly surrounded by Antarctic snow',
    imageCredit: 'Wikimedia Commons',
    description:
      'India’s first permanent Antarctic research base, created during the early Indian Antarctic expeditions. The station was later buried by snow and ice, leading India to establish Maitri on exposed rock.',
    focus: ['Early expedition logistics', 'Meteorology', 'Geophysics', 'Glaciology', 'Indian Antarctic programme history'],
    facts: [
      'Established in 1983 during India’s third Antarctic expedition.',
      'Located at about 70.08 S, 12.00 E on an Antarctic ice shelf.',
      'Abandoned around 1990-91 after being buried by ice and snow.',
      'It remains a landmark in India’s Antarctic science history.',
    ],
    logistics: ['Historic first base', 'Legacy supply and transit role', 'Foundation for later Maitri and Bharati operations'],
    sourceLabel: 'PIB Antarctica Expeditions release',
    sourceUrl: 'https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=123510',
  },
]

const byName = new Map(indianStations.map((station) => [station.name.toLowerCase(), station]))

function mergeStation(record) {
  const match = byName.get(String(record.name || '').toLowerCase())
  if (!match) return null
  return {
    ...match,
    backendId: record.id,
    country: record.country || match.country,
    lat: Number(record.latitude ?? record.lat ?? match.lat),
    lng: Number(record.longitude ?? record.lng ?? match.lng),
    description: match.description || record.description,
  }
}

export async function listStations() {
  if (USE_MOCK) return { items: indianStations, source: 'verified-local' }

  const data = await api.get('/research-stations')
  const records = data.stations || data.items || []
  const items = records.map(mergeStation).filter(Boolean)
  return { items: items.length ? items : indianStations, source: items.length ? 'backend' : 'verified-local' }
}

export async function getStation(id) {
  const { items } = await listStations()
  const station = items.find((item) => item.id === id || String(item.backendId) === String(id))
  if (!station) throw new Error('Station not found.')
  return station
}

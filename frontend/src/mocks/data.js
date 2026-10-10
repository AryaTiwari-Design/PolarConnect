// Demo data used when VITE_USE_MOCK=true. Everything here is sample content
// that mirrors the API shapes in docs/api-contract.md.

export const seedUsers = [
  { id: 'u1', name: 'Admin User', email: 'admin@polarconnect.test', password: 'ChangeMe123', role: 'admin' },
  { id: 'u2', name: 'Dr. Meera Nair', email: 'researcher@polarconnect.test', password: 'ChangeMe123', role: 'researcher' },
  { id: 'u3', name: 'Aarav Student', email: 'student@polarconnect.test', password: 'ChangeMe123', role: 'student' },
]

export const seedPapers = [
  {
    id: 'p1', title: 'Antarctic Ice Shelf Thinning: A Decade of Satellite Altimetry',
    authors: 'M. Nair, R. Iyer', year: 2022, category: 'Glaciology', station: 'Bharati',
    expedition: '39th ISEA', topic: 'Ice shelves', pages: 42, status: 'approved', uploadedBy: 'u2',
    abstract: 'Satellite altimetry records are combined to track how floating ice shelves along the East Antarctic coast have changed in height. Warm ocean water reaching the underside of the shelves is identified as a main driver of thinning.',
  },
  {
    id: 'p2', title: 'Microbial Life in Subglacial Lakes of East Antarctica',
    authors: 'S. Kulkarni, A. Dutta', year: 2021, category: 'Biology', station: 'Maitri',
    expedition: '38th ISEA', topic: 'Extremophiles', pages: 36, status: 'approved', uploadedBy: 'u2',
    abstract: 'Water and sediment sampled near subglacial lakes show that microbial communities survive in permanent darkness and extreme cold, using chemical energy instead of sunlight.',
  },
  {
    id: 'p3', title: 'Sea Ice Extent and Climate Feedbacks in the Southern Ocean',
    authors: 'P. Rao, L. Fernandes', year: 2023, category: 'Climate', station: 'Bharati',
    expedition: '41st ISEA', topic: 'Sea ice', pages: 58, status: 'approved', uploadedBy: 'u2',
    abstract: 'Changes in seasonal sea ice cover are linked to how much sunlight the ocean absorbs. Less ice means a darker surface, more heat absorbed, and further ice loss.',
  },
  {
    id: 'p4', title: 'Antarctic Krill Distribution and Ocean Warming',
    authors: 'T. Menon, J. George', year: 2020, category: 'Marine Biology', station: 'Maitri',
    expedition: '36th ISEA', topic: 'Krill', pages: 31, status: 'approved', uploadedBy: 'u2',
    abstract: 'Net surveys show how krill swarms shift with water temperature and sea ice cover. Krill sit at the centre of the Southern Ocean food web, feeding whales, seals, penguins and fish.',
  },
  {
    id: 'p5', title: 'Ozone Hole Recovery Observed from Antarctic Ground Stations',
    authors: 'K. Bhatt, N. Sinha', year: 2022, category: 'Atmospheric Science', station: 'Maitri',
    expedition: '40th ISEA', topic: 'Ozone', pages: 27, status: 'approved', uploadedBy: 'u2',
    abstract: 'Ground-based ozone measurements over several seasons show slow recovery of the ozone layer after global limits on ozone-depleting chemicals.',
  },
  {
    id: 'p6', title: 'Emperor Penguin Colony Monitoring Using Drone Imagery',
    authors: 'D. Pillai, S. Verma', year: 2023, category: 'Biology', station: 'Bharati',
    expedition: '42nd ISEA', topic: 'Penguins', pages: 24, status: 'approved', uploadedBy: 'u2',
    abstract: 'Drone surveys count colony size without disturbing the birds. Breeding success depends strongly on stable winter sea ice.',
  },
  {
    id: 'p7', title: 'Snow Accumulation Trends in Dronning Maud Land',
    authors: 'M. Nair, A. Joshi', year: 2024, category: 'Glaciology', station: 'Maitri',
    expedition: '43rd ISEA', topic: 'Snow', pages: 33, status: 'pending', uploadedBy: 'u2',
    abstract: 'Firn cores and stake measurements are used to estimate how much snow lands on the ice sheet each year near the Maitri station.',
  },
  {
    id: 'p8', title: 'Geomagnetic Observations at High Latitudes',
    authors: 'R. Chandra', year: 2024, category: 'Geophysics', station: 'Bharati',
    expedition: '43rd ISEA', topic: 'Geomagnetism', pages: 29, status: 'pending', uploadedBy: 'u2',
    abstract: 'Continuous magnetometer records are compared with solar activity to study how the magnetosphere behaves near the pole.',
  },
  {
    id: 'p9', title: 'Preliminary Notes on Wind Speed Logs',
    authors: 'M. Nair', year: 2024, category: 'Climate', station: 'Maitri',
    expedition: '43rd ISEA', topic: 'Wind', pages: 8, status: 'rejected', uploadedBy: 'u2',
    abstract: 'Unreviewed field notes on wind speed. Returned to the author for more complete data.',
  },
]

export const stations = [
  { id: 's1', name: 'Maitri', country: 'India', lat: -70.77, lng: 11.73, established: 1989, status: 'Year-round', description: 'India’s second Antarctic research station, built on a rocky outcrop in the Schirmacher Oasis. It supports studies in glaciology, atmospheric science, and biology.', facts: ['Located in the Schirmacher Oasis, East Antarctica', 'Home to Indian expedition teams every summer'] },
  { id: 's2', name: 'Bharati', country: 'India', lat: -69.41, lng: 76.19, established: 2012, status: 'Year-round', description: 'India’s third and newest Antarctic station, on the Larsemann Hills. Its ship-like design suits heavy wind and cold, and supports marine and geoscience work.', facts: ['Located in the Larsemann Hills, East Antarctica', 'Built from prefabricated container modules'] },
  { id: 's3', name: 'Dakshin Gangotri', country: 'India', lat: -70.08, lng: 12.0, established: 1983, status: 'Retired', description: 'India’s first Antarctic station. It was later buried by snow and ice and replaced by Maitri.', facts: ['Set up during the third Indian expedition', 'Buried under snow and ice and replaced by Maitri'] },
  { id: 's4', name: 'McMurdo', country: 'United States', lat: -77.85, lng: 166.67, established: 1956, status: 'Year-round', description: 'The largest research station in Antarctica, on Ross Island. It is the main logistics hub for the US Antarctic Program.', facts: ['Located on Ross Island', 'Hosts hundreds of people in summer'] },
  { id: 's5', name: 'Vostok', country: 'Russia', lat: -78.46, lng: 106.84, established: 1957, status: 'Year-round', description: 'A high-altitude inland station above a huge subglacial lake. Deep ice cores here recorded hundreds of thousands of years of climate history.', facts: ['Recorded the lowest natural air temperature on Earth in 1983', 'Sits above Lake Vostok'] },
  { id: 's6', name: 'Concordia', country: 'France / Italy', lat: -75.1, lng: 123.33, established: 2005, status: 'Year-round', description: 'A joint French–Italian station on the high Antarctic plateau at Dome C. Used for ice core drilling, astronomy, and human physiology studies.', facts: ['One of the few stations that stays staffed through winter inland', 'Deep ice cores reach back about 800,000 years'] },
  { id: 's7', name: 'Halley VI', country: 'United Kingdom', lat: -75.58, lng: -26.66, established: 2012, status: 'Seasonal', description: 'A British station on the Brunt Ice Shelf, made of modules on skis so it can be moved. Scientists here helped discover the ozone hole.', facts: ['Built on a floating ice shelf', 'Linked to the 1985 ozone hole discovery'] },
  { id: 's8', name: 'Rothera', country: 'United Kingdom', lat: -67.57, lng: -68.13, established: 1975, status: 'Year-round', description: 'The main British base on the Antarctic Peninsula, with a runway and marine laboratory.', facts: ['On Adelaide Island', 'Supports marine biology and glaciology'] },
  { id: 's9', name: 'Neumayer III', country: 'Germany', lat: -70.67, lng: -8.27, established: 2009, status: 'Year-round', description: 'A German station on the Ekström Ice Shelf, raised on stilts so snow drifts pass beneath it. It runs weather, air-chemistry, and geophysical observatories.', facts: ['Built on hydraulic stilts', 'Operated by the Alfred Wegener Institute'] },
  { id: 's10', name: 'Davis', country: 'Australia', lat: -68.58, lng: 77.97, established: 1957, status: 'Year-round', description: 'An Australian station in the Vestfold Hills, close to India’s Bharati station.', facts: ['Located in the Vestfold Hills', 'Supports atmospheric and biological research'] },
]

export const lessons = [
  {
    id: 'l1', title: 'Meet Antarctica', level: 'Beginner', readMinutes: 4, quizId: 'q1', icon: '🧊',
    summary: 'The coldest, driest, windiest continent, and why nobody owns it.',
    content: [
      'Antarctica is the fifth-largest continent and sits almost entirely south of the Antarctic Circle. Around 98% of it is covered by ice, which in places is several kilometres thick.',
      'It is the coldest, driest and windiest continent on Earth. Although it is covered in ice, the interior gets so little snowfall that it counts as a desert.',
      'No country owns Antarctica. The Antarctic Treaty, signed in 1959, sets the continent aside for peaceful use and scientific research. India joined the treaty in 1983.',
      'Researchers from many countries live at stations spread across the continent. Their measurements are shared so the whole world can understand how the planet works.',
    ],
  },
  {
    id: 'l2', title: 'Ice, Oceans and Sea Level', level: 'Beginner', readMinutes: 5, quizId: 'q2', icon: '🌊',
    summary: 'Why ice on land matters more for sea level than ice on the sea.',
    content: [
      'Antarctica holds most of the world’s fresh water, locked up as ice. If all of it melted, global sea level would rise by tens of metres. That is why scientists watch it so closely.',
      'There are two kinds of ice. Land ice (ice sheets and glaciers) sits on rock. Sea ice is frozen ocean water floating on the surface.',
      'When sea ice melts, sea level barely changes, just like an ice cube melting in a full glass. When land ice melts or slides into the ocean, sea level rises.',
      'Ice shelves are thick floating extensions of the ice sheet. They act like a cork, holding back the glaciers behind them. When shelves thin or break up, glaciers can flow faster into the sea.',
    ],
  },
  {
    id: 'l3', title: 'Life at the Bottom of the World', level: 'Intermediate', readMinutes: 5, quizId: 'q3', icon: '🐧',
    summary: 'Penguins, krill and the microbes that survive in permanent darkness.',
    content: [
      'Life in Antarctica is tough but surprisingly rich, especially in the ocean. The Southern Ocean food web is built on tiny plants called phytoplankton.',
      'Krill, small shrimp-like animals, feed on phytoplankton and are food for whales, seals, penguins and fish. If krill numbers fall, the whole food web is affected.',
      'Emperor penguins breed during the Antarctic winter and depend on stable sea ice for their colonies. Changes in sea ice can affect how many chicks survive.',
      'Even beneath kilometres of ice, microbes live in lakes in complete darkness. Studying them helps scientists imagine where life might exist on other icy worlds.',
    ],
  },
  {
    id: 'l4', title: 'India in Antarctica', level: 'Intermediate', readMinutes: 4, quizId: 'q4', icon: '🇮🇳',
    summary: 'From the first expedition to Maitri and Bharati.',
    content: [
      'India launched its first scientific expedition to Antarctica in 1981. The first station, Dakshin Gangotri, was set up in the 1983–84 season.',
      'Dakshin Gangotri was eventually buried by snow and ice. India built Maitri in 1989 in the Schirmacher Oasis, and it is still in use.',
      'The Bharati station was commissioned in 2012 in the Larsemann Hills. It is designed for strong winds and supports research in marine science and geoscience.',
      'Indian expeditions are organised by the National Centre for Polar and Ocean Research (NCPOR) under the Ministry of Earth Sciences.',
    ],
  },
]

// answerIndex stays inside the mock "server". The UI never receives it before submitting.
export const quizzes = {
  q1: { id: 'q1', title: 'Meet Antarctica', questions: [
    { id: 'q1a', text: 'Roughly how much of Antarctica is covered by ice?', options: ['About 10%', 'About 50%', 'About 98%', '100%'], answerIndex: 2, explanation: 'Around 98% of the continent is under ice, with only a few rocky areas exposed.' },
    { id: 'q1b', text: 'Why is Antarctica considered a desert?', options: ['It is very hot', 'It receives very little precipitation', 'It has sand dunes', 'It has no ice'], answerIndex: 1, explanation: 'A desert is defined by low precipitation, and the Antarctic interior gets very little snowfall.' },
    { id: 'q1c', text: 'What does the Antarctic Treaty (1959) say about the continent?', options: ['It belongs to the United States', 'It is reserved for peaceful use and science', 'It is open for mining', 'It is divided equally between countries'], answerIndex: 1, explanation: 'The treaty sets Antarctica aside for peaceful purposes and scientific cooperation.' },
  ] },
  q2: { id: 'q2', title: 'Ice, Oceans and Sea Level', questions: [
    { id: 'q2a', text: 'Which kind of ice melting raises sea level the most?', options: ['Floating sea ice', 'Land ice such as ice sheets', 'Ice in a freezer', 'Ice cubes in a glass'], answerIndex: 1, explanation: 'Land ice adds new water to the ocean. Floating ice already displaces its own weight in water.' },
    { id: 'q2b', text: 'What do ice shelves do for the glaciers behind them?', options: ['They melt them', 'They hold them back like a cork', 'They colour them blue', 'Nothing at all'], answerIndex: 1, explanation: 'Ice shelves buttress glaciers. When they thin or collapse, glaciers can speed up.' },
    { id: 'q2c', text: 'What is sea ice?', options: ['Frozen ocean water floating at the surface', 'Glacier ice that fell into the sea', 'Snow on land', 'Ice from icebergs only'], answerIndex: 0, explanation: 'Sea ice forms when the surface of the ocean freezes.' },
  ] },
  q3: { id: 'q3', title: 'Life at the Bottom of the World', questions: [
    { id: 'q3a', text: 'Which animal is at the centre of the Southern Ocean food web?', options: ['Krill', 'Polar bears', 'Camels', 'Sharks'], answerIndex: 0, explanation: 'Krill feed on phytoplankton and are food for many larger animals.' },
    { id: 'q3b', text: 'When do emperor penguins breed?', options: ['Summer', 'Spring', 'Winter', 'They do not breed'], answerIndex: 2, explanation: 'Emperor penguins breed through the Antarctic winter on sea ice.' },
    { id: 'q3c', text: 'How do microbes in subglacial lakes get energy?', options: ['From sunlight', 'From chemical reactions', 'From eating krill', 'They do not need energy'], answerIndex: 1, explanation: 'In permanent darkness, microbes use chemical energy from minerals and water.' },
  ] },
  q4: { id: 'q4', title: 'India in Antarctica', questions: [
    { id: 'q4a', text: 'Which was India’s first Antarctic station?', options: ['Maitri', 'Bharati', 'Dakshin Gangotri', 'Himadri'], answerIndex: 2, explanation: 'Dakshin Gangotri was set up in the 1983–84 season.' },
    { id: 'q4b', text: 'Which organisation runs Indian Antarctic expeditions?', options: ['ISRO', 'NCPOR', 'DRDO', 'ICMR'], answerIndex: 1, explanation: 'NCPOR, under the Ministry of Earth Sciences, organises the expeditions.' },
    { id: 'q4c', text: 'Where is the Bharati station located?', options: ['Schirmacher Oasis', 'Ross Island', 'Larsemann Hills', 'Brunt Ice Shelf'], answerIndex: 2, explanation: 'Bharati stands in the Larsemann Hills. Maitri is in the Schirmacher Oasis.' },
  ] },
}

export const badgeDefs = [
  { id: 'first-steps', name: 'First Steps', icon: '🧊', description: 'Finish your first quiz' },
  { id: 'sharp-mind', name: 'Sharp Mind', icon: '⭐', description: 'Get a perfect quiz score' },
  { id: 'polar-explorer', name: 'Polar Explorer', icon: '🧭', description: 'Earn 100 XP' },
  { id: 'ice-scholar', name: 'Ice Scholar', icon: '🎓', description: 'Complete every quiz' },
]

// Canned answers for the demo assistant. Each source points at a paper above.
export const chatTopics = [
  { match: /ice shelf|shelves|thin|melt/, answer: 'Ice shelves are thinning mainly because warmer ocean water is reaching their undersides and melting them from below. Thinner shelves hold back the glaciers behind them less effectively, so more land ice can flow into the sea. Falling sea ice cover adds to the problem because a darker ocean absorbs more heat.', sources: [{ paper_id: 'p1', page: 18 }, { paper_id: 'p3', page: 7 }] },
  { match: /penguin/, answer: 'Emperor penguins breed in winter on stable sea ice, so changes in ice conditions directly affect how many chicks survive. Drone surveys let researchers count colonies without disturbing the birds, which makes long-term monitoring possible.', sources: [{ paper_id: 'p6', page: 9 }] },
  { match: /ozone/, answer: 'The ozone layer over Antarctica is slowly recovering. Ground stations show gradual improvement since global limits were placed on ozone-depleting chemicals, though full recovery takes decades.', sources: [{ paper_id: 'p5', page: 5 }] },
  { match: /krill/, answer: 'Krill are small shrimp-like animals that feed on phytoplankton and are food for whales, seals, penguins and fish. Their swarms shift with water temperature and sea ice, so changes in the ocean can ripple through the whole food web.', sources: [{ paper_id: 'p4', page: 12 }] },
  { match: /microb|subglacial|lake|life/, answer: 'Microbes live in subglacial lakes in permanent darkness and extreme cold. Instead of sunlight, they use chemical energy from minerals and water, which shows how life can survive in very harsh places.', sources: [{ paper_id: 'p2', page: 14 }] },
  { match: /sea ice|climate|feedback/, answer: 'Sea ice reflects sunlight. When it shrinks, the dark ocean absorbs more heat, which melts more ice. Scientists call this a feedback loop, and it is one reason polar regions are warming quickly.', sources: [{ paper_id: 'p3', page: 11 }] },
]

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
  {
    id: 'maitri',
    name: 'Maitri',
    country: 'India',
    lat: -70.7658,
    lng: 11.737,
    established: '1989',
    status: 'Operational, year-round',
    region: 'Schirmacher Oasis, Queen Maud Land, East Antarctica',
    description: 'India’s second permanent Antarctic station, built on exposed rock in the Schirmacher Oasis for year-round multidisciplinary field science.',
    image: 'https://data.ncpor.res.in/static/images/slider/maitri/IMG_6.JPG',
    facts: ['Operational Indian station in East Antarctica', 'Supports atmospheric, glaciological, biological and earth-science research'],
  },
  {
    id: 'bharati',
    name: 'Bharati',
    country: 'India',
    lat: -69.4078,
    lng: 76.1884,
    established: '2012',
    status: 'Operational, year-round',
    region: 'Larsemann Hills, Prydz Bay sector, East Antarctica',
    description: 'India’s newest permanent Antarctic station, located in the Larsemann Hills and designed for modern polar operations and research.',
    image: 'https://www.antarctica.gov.au/site/assets/files/50741/bharati-station.1024x0.jpeg',
    facts: ['Operational Indian station near Prydz Bay', 'Supports geoscience, marine-linked and environmental research'],
  },
  {
    id: 'dakshin-gangotri',
    name: 'Dakshin Gangotri',
    country: 'India',
    lat: -70.0833,
    lng: 12,
    established: '1983-84',
    status: 'Decommissioned',
    region: 'Central Dronning Maud Land ice shelf, East Antarctica',
    description: 'India’s first Antarctic base. It was later buried by snow and ice, and its legacy led to the Maitri and Bharati stations.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/%E0%A4%A6%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%A3_%E0%A4%97%E0%A4%82%E0%A4%97%E0%A5%8B%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A5%80%2C_%E0%A4%85%E0%A4%82%E0%A4%9F%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%9F%E0%A4%BF%E0%A4%95%E0%A4%BE.jpg',
    facts: ['Established during India’s third Antarctic expedition', 'Abandoned after burial by snow and ice'],
  },
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
    { id: 'q1a', difficulty: 'Easy', text: 'How much of Antarctica is covered by ice?', options: ['About 10%', 'About 50%', 'About 98%', 'All of it, every single bit'], answerIndex: 2, hint: 'It is almost the whole continent, but a few rocky places are exposed.', explanation: 'Almost all of Antarctica is ice-covered. A few rocky areas still poke through, so it is not exactly 100%.' },
    { id: 'q1b', difficulty: 'Easy', text: 'Why do scientists call Antarctica a desert?', options: ['Because it is hot', 'Because it gets very little snow or rain', 'Because it has sand dunes everywhere', 'Because it has no ice'], answerIndex: 1, hint: 'Deserts are defined by precipitation, not temperature.', explanation: 'Deserts are about low precipitation, not just heat. Antarctica is icy, but the interior gets very little snowfall.' },
    { id: 'q1c', difficulty: 'Medium', text: 'What is the main idea of the Antarctic Treaty?', options: ['One country owns Antarctica', 'Antarctica is for peace and science', 'Antarctica is mainly for mining', 'Every country gets an equal slice'], answerIndex: 1, hint: 'Think cooperation, not ownership.', explanation: 'The treaty keeps Antarctica focused on peaceful use and scientific cooperation.' },
    { id: 'q1d', difficulty: 'Easy', text: 'Which continent is Antarctica by size?', options: ['Smallest', 'Third-largest', 'Fifth-largest', 'Largest'], answerIndex: 2, hint: 'It is larger than Europe and Australia, but not one of the top three.', explanation: 'Antarctica is the fifth-largest continent, bigger than Europe and Australia.' },
    { id: 'q1e', difficulty: 'Medium', text: 'What is unusual about Antarctica’s interior?', options: ['It gets very little snowfall', 'It is covered in forests', 'It has warm rain all year', 'It has many cities'], answerIndex: 0, hint: 'The interior is cold and extremely dry.', explanation: 'The interior is extremely dry, which is why Antarctica can be described as a polar desert.' },
    { id: 'q1f', difficulty: 'Easy', text: 'What do research stations help scientists do?', options: ['Collect long-term measurements', 'Claim land for countries', 'Build tourist cities', 'Mine ice for fuel'], answerIndex: 0, hint: 'Stations support field teams and instruments over many seasons.', explanation: 'Stations let teams live safely and collect long-running observations that help explain Earth systems.' },
    { id: 'q1g', difficulty: 'Medium', text: 'Which circle does Antarctica sit mostly south of?', options: ['Arctic Circle', 'Antarctic Circle', 'Equator', 'Tropic of Cancer'], answerIndex: 1, hint: 'The clue is in the continent name.', explanation: 'Antarctica lies almost entirely south of the Antarctic Circle.' },
    { id: 'q1h', difficulty: 'Medium', text: 'Why are shared Antarctic measurements useful?', options: ['They help the world understand Earth systems', 'They hide data from other countries', 'They replace all fieldwork', 'They prove weather never changes'], answerIndex: 0, hint: 'Science gets stronger when observations are compared across places and time.', explanation: 'Shared measurements help researchers from many countries understand climate, ice, oceans and ecosystems.' },
    { id: 'q1i', difficulty: 'Hard', text: 'Which phrase best describes Antarctica’s climate extremes?', options: ['Cold, dry and windy', 'Warm, wet and calm', 'Hot, sandy and humid', 'Tropical and rainy'], answerIndex: 0, hint: 'The lesson names three extremes together.', explanation: 'Antarctica is the coldest, driest and windiest continent on Earth.' },
    { id: 'q1j', difficulty: 'Hard', text: 'What should a good polar research answer include?', options: ['A source or measurement behind the claim', 'Only a dramatic guess', 'A random map pin', 'A country ownership claim'], answerIndex: 0, hint: 'PolarConnect is built around trust and sources.', explanation: 'Scientific answers are stronger when they point back to evidence, measurements or approved papers.' },
  ] },
  q2: { id: 'q2', title: 'Ice, Oceans and Sea Level', questions: [
    { id: 'q2a', difficulty: 'Easy', text: 'Which melting ice matters most for sea-level rise?', options: ['Floating sea ice', 'Ice sitting on land', 'Ice in a freezer', 'Ice cubes in a drink'], answerIndex: 1, hint: 'Extra water enters the ocean when ice leaves land.', explanation: 'Land ice adds extra water to the ocean. Floating sea ice is already in the ocean, so it works more like an ice cube in a glass.' },
    { id: 'q2b', difficulty: 'Medium', text: 'What do ice shelves do for glaciers?', options: ['They melt glaciers faster', 'They hold glaciers back', 'They turn glaciers blue', 'They do not affect glaciers'], answerIndex: 1, hint: 'The lesson compares ice shelves to a cork or stopper.', explanation: 'Ice shelves act like a stopper. When they weaken, glaciers behind them can move faster toward the sea.' },
    { id: 'q2c', difficulty: 'Easy', text: 'What is sea ice?', options: ['Frozen ocean water floating on top', 'A glacier that fell into the sea', 'Snow sitting on land', 'Only broken iceberg pieces'], answerIndex: 0, hint: 'It forms directly from ocean water.', explanation: 'Sea ice is simply ocean water that froze at the surface.' },
    { id: 'q2d', difficulty: 'Medium', text: 'Why does less sea ice create a warming feedback?', options: ['Dark ocean absorbs more sunlight', 'Snow becomes heavier', 'Clouds stop forming', 'Winds disappear'], answerIndex: 0, hint: 'Bright ice and dark water handle sunlight differently.', explanation: 'Bright ice reflects sunlight. When darker ocean is exposed, it absorbs more heat and can speed up further melt.' },
    { id: 'q2e', difficulty: 'Easy', text: 'What is an ice shelf?', options: ['A floating extension of land ice', 'A mountain made of sea salt', 'A frozen river under a city', 'A type of polar cloud'], answerIndex: 0, hint: 'It is still connected to land ice, but it floats.', explanation: 'Ice shelves are thick floating edges of ice sheets and glaciers.' },
    { id: 'q2f', difficulty: 'Medium', text: 'What can happen when an ice shelf breaks up?', options: ['Glaciers behind it may speed up', 'Sea level instantly drops', 'The ocean freezes solid', 'The Sun becomes weaker'], answerIndex: 0, hint: 'Remove the stopper and the ice behind it can move faster.', explanation: 'Without the shelf holding them back, glaciers can move faster toward the ocean.' },
    { id: 'q2g', difficulty: 'Medium', text: 'Why does melting sea ice barely change sea level?', options: ['It is already floating in the ocean', 'It turns into air', 'It is made of salt only', 'It moves to the mountains'], answerIndex: 0, hint: 'Think about an ice cube floating in a full glass.', explanation: 'Floating sea ice has already displaced water, so melting it does not add much new volume to the ocean.' },
    { id: 'q2h', difficulty: 'Hard', text: 'What happens when darker ocean replaces bright ice?', options: ['More sunlight is absorbed', 'Less heat enters the ocean', 'The ocean turns into land ice', 'Glaciers stop moving'], answerIndex: 0, hint: 'Dark surfaces absorb more energy than bright reflective surfaces.', explanation: 'Darker ocean absorbs more solar energy than bright ice, which can amplify warming.' },
    { id: 'q2i', difficulty: 'Hard', text: 'Which ice type sits on rock?', options: ['Land ice', 'Sea ice', 'Frost smoke', 'Brine ice crystals only'], answerIndex: 0, hint: 'The lesson separates ice by what it rests on.', explanation: 'Ice sheets and glaciers are land ice because they rest on rock.' },
    { id: 'q2j', difficulty: 'Hard', text: 'Why do scientists monitor Antarctic land ice closely?', options: ['It stores enormous amounts of fresh water', 'It has no link to sea level', 'It is warmer than the ocean', 'It disappears every summer'], answerIndex: 0, hint: 'If land ice moves into the ocean, sea level can rise.', explanation: 'Antarctica stores most of the world’s fresh water as ice, so changes in land ice matter for global sea level.' },
  ] },
  q3: { id: 'q3', title: 'Life at the Bottom of the World', questions: [
    { id: 'q3a', difficulty: 'Easy', text: 'Which tiny animal feeds many Antarctic animals?', options: ['Krill', 'Polar bears', 'Camels', 'Sharks'], answerIndex: 0, hint: 'Small animal, huge food-web role.', explanation: 'Krill are small, but they are a huge part of the Southern Ocean food web.' },
    { id: 'q3b', difficulty: 'Medium', text: 'When do emperor penguins breed?', options: ['Summer', 'Spring', 'Winter', 'They do not breed'], answerIndex: 2, hint: 'They choose the harshest season.', explanation: 'Emperor penguins are tough. They breed during the Antarctic winter on sea ice.' },
    { id: 'q3c', difficulty: 'Hard', text: 'How can microbes live in dark lakes under ice?', options: ['They use sunlight', 'They use chemical energy', 'They eat krill', 'They do not need energy'], answerIndex: 1, hint: 'No sunlight reaches lakes beneath thick ice.', explanation: 'There is no sunlight under thick ice, so some microbes use chemical reactions for energy.' },
    { id: 'q3d', difficulty: 'Easy', text: 'What starts much of the Southern Ocean food web?', options: ['Phytoplankton', 'Sand dunes', 'Polar bears', 'Volcano smoke only'], answerIndex: 0, hint: 'Tiny ocean plants capture sunlight.', explanation: 'Tiny phytoplankton use sunlight and become food for krill and other animals.' },
    { id: 'q3e', difficulty: 'Medium', text: 'Why are krill important?', options: ['Many animals depend on them for food', 'They melt ice shelves', 'They build research stations', 'They create ozone'], answerIndex: 0, hint: 'They connect tiny plants to larger animals.', explanation: 'Krill connect tiny ocean plants to larger animals like penguins, seals and whales.' },
    { id: 'q3f', difficulty: 'Easy', text: 'Why use drones to monitor colonies?', options: ['They can count animals with less disturbance', 'They teach penguins to fly', 'They warm the ice', 'They replace all scientists'], answerIndex: 0, hint: 'Less close human contact is better for sensitive colonies.', explanation: 'Drone imagery helps count colonies while keeping people farther from sensitive wildlife.' },
    { id: 'q3g', difficulty: 'Medium', text: 'What can happen if krill numbers fall?', options: ['The whole food web can be affected', 'Glaciers grow instantly', 'Ozone disappears overnight', 'Research stations float away'], answerIndex: 0, hint: 'Many larger animals depend on krill.', explanation: 'Because krill feed so many species, a drop in krill can ripple through the Southern Ocean food web.' },
    { id: 'q3h', difficulty: 'Hard', text: 'Why does stable sea ice matter for emperor penguins?', options: ['It supports breeding colonies and chicks', 'It makes the ocean hotter', 'It removes the need for food', 'It creates fresh water rain'], answerIndex: 0, hint: 'Their colonies form on winter sea ice.', explanation: 'Emperor penguins breed on sea ice, so unstable ice can affect chick survival.' },
    { id: 'q3i', difficulty: 'Medium', text: 'Which animals eat krill in the lesson examples?', options: ['Whales, seals, penguins and fish', 'Camels, lions and goats', 'Only microbes', 'Only flying insects'], answerIndex: 0, hint: 'Think Southern Ocean predators.', explanation: 'Whales, seals, penguins and fish all rely on krill as food.' },
    { id: 'q3j', difficulty: 'Hard', text: 'Why are subglacial microbes interesting beyond Antarctica?', options: ['They hint at how life might survive on icy worlds', 'They prove all planets have oceans', 'They make sea ice reflective', 'They replace satellites'], answerIndex: 0, hint: 'The lesson connects them to other icy places.', explanation: 'Studying life under Antarctic ice helps scientists imagine where life might exist on other icy worlds.' },
  ] },
  q4: { id: 'q4', title: 'India in Antarctica', questions: [
    { id: 'q4a', difficulty: 'Easy', text: 'Which station came first for India in Antarctica?', options: ['Maitri', 'Bharati', 'Dakshin Gangotri', 'Himadri'], answerIndex: 2, hint: 'It was set up in the 1983-84 season.', explanation: 'Dakshin Gangotri was India’s first Antarctic station, built in the 1983-84 season.' },
    { id: 'q4b', difficulty: 'Easy', text: 'Who organises India’s Antarctic expeditions?', options: ['ISRO', 'NCPOR', 'DRDO', 'ICMR'], answerIndex: 1, hint: 'It is India’s polar and ocean research centre.', explanation: 'NCPOR runs India’s polar expeditions under the Ministry of Earth Sciences.' },
    { id: 'q4c', difficulty: 'Medium', text: 'Where is Bharati station?', options: ['Schirmacher Oasis', 'Ross Island', 'Larsemann Hills', 'Brunt Ice Shelf'], answerIndex: 2, hint: 'Bharati is linked with the Larsemann Hills.', explanation: 'Bharati is in the Larsemann Hills. Maitri is the one in the Schirmacher Oasis.' },
    { id: 'q4d', difficulty: 'Medium', text: 'Which Indian station is in the Schirmacher Oasis?', options: ['Bharati', 'Maitri', 'Himadri', 'Dakshin Gangotri'], answerIndex: 1, hint: 'It is India’s second permanent Antarctic station.', explanation: 'Maitri is located in the Schirmacher Oasis in East Antarctica.' },
    { id: 'q4e', difficulty: 'Medium', text: 'Why was Dakshin Gangotri abandoned?', options: ['It was buried by snow and ice', 'It became too hot', 'It floated away', 'It was moved to the Arctic'], answerIndex: 0, hint: 'The problem came from accumulation over time.', explanation: 'Snow and ice burial made the first station unusable, leading India to build Maitri on exposed rock.' },
    { id: 'q4f', difficulty: 'Easy', text: 'What ministry is NCPOR under?', options: ['Ministry of Earth Sciences', 'Ministry of Railways', 'Ministry of Textiles', 'Ministry of Tourism'], answerIndex: 0, hint: 'Its work is polar, ocean and Earth-system science.', explanation: 'NCPOR operates under India’s Ministry of Earth Sciences.' },
    { id: 'q4g', difficulty: 'Medium', text: 'When did India launch its first Antarctic scientific expedition?', options: ['1981', '1947', '2001', '2019'], answerIndex: 0, hint: 'It was before Dakshin Gangotri was built.', explanation: 'India launched its first Antarctic scientific expedition in 1981.' },
    { id: 'q4h', difficulty: 'Hard', text: 'Which station was commissioned in 2012?', options: ['Bharati', 'Maitri', 'Dakshin Gangotri', 'Himadri'], answerIndex: 0, hint: 'It is India’s newest permanent Antarctic station.', explanation: 'Bharati was commissioned in 2012 in the Larsemann Hills.' },
    { id: 'q4i', difficulty: 'Hard', text: 'Why was Maitri built on exposed rock?', options: ['To avoid the burial problem faced by Dakshin Gangotri', 'To make it float on sea ice', 'To keep it hidden from satellites', 'To mine rock for fuel'], answerIndex: 0, hint: 'The first station was lost to snow and ice burial.', explanation: 'Maitri’s exposed-rock location helped avoid the snow-burial issue that affected Dakshin Gangotri.' },
    { id: 'q4j', difficulty: 'Medium', text: 'Which research areas does Bharati support in the lesson?', options: ['Marine science and geoscience', 'Textile design and railways', 'Only astronomy', 'Only farming'], answerIndex: 0, hint: 'Bharati is described as supporting modern polar science.', explanation: 'Bharati supports research including marine science and geoscience.' },
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

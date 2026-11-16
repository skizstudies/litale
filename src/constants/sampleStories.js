// Seed data for the Family Story Tree and the mock AI responses, used until the
// backend is connected. Scene `id`s pick the line-art and icons in the UI
// (see components/illustrate/sceneArt.js and constants/sceneIcons.js).

export const MANGO_TREE_STORY = {
  id: 'sample-mango-tree',
  title: 'The Mango Tree',
  narratorName: 'Lola',
  promptId: 'childhood-game',
  durationSeconds: 94,
  audioUrl: null,
  status: 'illustrated',
  createdAt: '2026-11-14T09:30:00.000Z',
  transcript: [
    'Noong bata pa ako sa Batangas, tuwing umaga ay umaakyat ako sa puno ng mangga sa likod ng bahay namin para kumaway sa araw at maghanap ng hinog na bunga. Ang taas-taas nung puno, pero hindi ako takot — sanay na ako, eh.',
    'Sisilipin ko talaga yung mga dahon, kasi minsan nagtatago yung mga dilaw na mangga sa likod ng mga berde. Pag may nakita ako, ang saya-saya ko!',
    'Tapos bababa ako, at hahatiin ko sa kapatid kong bunso, si Ambo. Uupo kami sa lilim ng puno, and we would eat it with our hands — ang lagkit-lagkit!',
    'Tawa kami nang tawa hanggang tawagin na kami ni Inay para mag-almusal.',
  ],
  scenes: [
    { id: 'sun', title: 'Waving at the sun', text: 'Every morning, Lola climbed the mango tree and waved at the sun.' },
    { id: 'leaves', title: 'Finding mangoes', text: 'She looked closely at the green leaves to find sweet, yellow mangoes.' },
    { id: 'share', title: 'Sharing the fruit', text: 'She shared the juicy fruit with her little brother under the shade.' },
    { id: 'laugh', title: 'Laughing together', text: 'They laughed together until it was time for breakfast.' },
  ],
  illustrations: {},
};

export const PAPAS_BOAT_STORY = {
  id: 'sample-papas-boat',
  title: "Papa's First Boat",
  narratorName: 'Lola',
  promptId: 'family-legend',
  durationSeconds: 81,
  audioUrl: null,
  status: 'illustrated',
  createdAt: '2026-11-10T16:05:00.000Z',
  transcript: [
    'Yung Papa mo, noong binata pa siya, gumawa siya ng maliit na bangka sa tabing-dagat. Kahoy lang, pako, at maraming pasensya — inabot siya ng isang buwan!',
    'Maaga siyang pumalaot, mga alas-singko pa lang, kasi kalmado pa yung dagat noon. Sabi niya, parang salamin daw yung tubig.',
    'Tapos biglang tumalon yung mga isda sa tabi ng bangka — silver na silver, kumikinang sa araw. Natawa siya kasi nabasa siya!',
    'Paglubog ng araw, umuwi siya na puno ang lambat. Proud na proud siya, and that was his very first catch.',
  ],
  scenes: [
    { id: 'build', title: 'Building the boat', text: 'Papa built a little wooden boat on the beach.' },
    { id: 'sail', title: 'Sailing out', text: 'He sailed out early, when the sea was calm.' },
    { id: 'fish', title: 'Jumping fish', text: 'Silver fish jumped and splashed beside the boat.' },
    { id: 'harbor', title: 'Home at sunset', text: 'At sunset, Papa sailed home with a full net.' },
  ],
  illustrations: {},
};

export const SAMPLE_STORIES = [MANGO_TREE_STORY, PAPAS_BOAT_STORY];

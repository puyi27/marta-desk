export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  lyric: string;
  explanation: string;
  audioSrc: string;
  spotifyUrl: string;
}

export interface CorkboardPhoto {
  id: string;
  title: string;
  imageSrc: string;
  backNote: string;
  rotation: number;
}

export const SPOTIFY_PLAYLIST_ID = "4pYLjpZG3iLU0HiTit8aTC";
export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
export const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;

export const playlistTracks: PlaylistTrack[] = [
  {
    id: "track-1",
    title: "Golden Hour",
    artist: "JVKE",
    lyric: "It's your world and I'm just living in it... shine your light on me.",
    explanation:
      "Esta canción me recuerda a los atardeceres contigo en Sevilla, cuando el sol se cuela por la ventana y te veo sonreír. Eres pura luz para mí.",
    audioSrc: "/audio/clair-de-lune.mp3",
    spotifyUrl: SPOTIFY_PLAYLIST_URL,
  },
  {
    id: "track-2",
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    lyric: "I would never fall in love until I found her... until I found you.",
    explanation:
      "Describe con exactitud lo que sentí cuando entraste en mi vida. Todo lo anterior palideció y supe que quería quedarme a tu lado.",
    audioSrc: "/audio/la-vie-en-rose.mp3",
    spotifyUrl: SPOTIFY_PLAYLIST_URL,
  },
  {
    id: "track-3",
    title: "Lover",
    artist: "Taylor Swift",
    lyric: "Can I go where you go? Can we always be this close forever and ever?",
    explanation:
      "Para las tardes de estudio en casa, los cafés compartidos y la complicidad que solo nosotros dos entendemos.",
    audioSrc: "/audio/river-flows.mp3",
    spotifyUrl: SPOTIFY_PLAYLIST_URL,
  },
  {
    id: "track-4",
    title: "Yellow",
    artist: "Coldplay",
    lyric: "Look at the stars, look how they shine for you and everything you do.",
    explanation:
      "Me recuerda a tu esfuerzo con el TFM y lo mucho que brillas incluso en los días donde te sientes cansada. Eres increíble.",
    audioSrc: "/audio/comptine.mp3",
    spotifyUrl: SPOTIFY_PLAYLIST_URL,
  },
  {
    id: "track-5",
    title: "Photograph",
    artist: "Ed Sheeran",
    lyric: "We keep this love in a photograph, we made these memories for ourselves.",
    explanation:
      "Igual que las fotos de nuestro corcho: momentos que quedan grabados para siempre. Contigo cada recuerdo es un tesoro.",
    audioSrc: "/audio/experience.mp3",
    spotifyUrl: SPOTIFY_PLAYLIST_URL,
  },
];

export const corkboardPhotos: CorkboardPhoto[] = [
  {
    id: "photo-dora",
    title: "Dora",
    imageSrc: "/images/corkboard/dora.jpg",
    backNote:
      "Dora, la compañera más fiel. Aunque ya no estés, sigues viviendo en cada rincón de tu corazón y en el nuestro. Te queremos siempre. 🐾",
    rotation: -3,
  },
  {
    id: "photo-primos",
    title: "Los primos",
    imageSrc: "/images/corkboard/primos.jpg",
    backNote:
      "Tu familia es parte de lo que te hace ser tú. Esa alegría tuya viene de aquí, de este amor tan bonito que te rodea.",
    rotation: 2,
  },
  {
    id: "photo-cristo",
    title: "Nuestro Cristo",
    imageSrc: "/images/corkboard/cristo.jpg",
    backNote:
      "Nuestro rincón favorito en Sevilla. El lugar donde el tiempo se paró y yo supe que quería seguir a tu lado para siempre. ❤️",
    rotation: -1.5,
  },
];

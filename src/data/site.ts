import commercial from '../assets/commercial.jpg';
import ring from '../assets/ring.jpg';
import pendants from '../assets/pendants.jpg';
export const isPreview = import.meta.env.SITE_MODE !== 'production';
export const business = {
  name: 'Elektro Prushi',
  phone: '048 484 454',
  phoneHref: 'tel:+38348484454',
  messenger: 'https://m.me/elektroinstaluesprushi',
  facebook: 'https://www.facebook.com/elektroinstaluesprushi',
  location: 'Kaçanik, Kosovë',
};
export const services = [
  {
    title: 'Instalime elektrike',
    text: 'Instalime elektrike për shtëpi dhe biznese, të menduara për nevojat e hapësirës suaj.',
    icon: 'house',
  },
  {
    title: 'Ndriçim',
    text: 'Zgjidhje ndriçimi që i japin funksion dhe karakter çdo ambienti.',
    icon: 'bulb',
  },
  {
    title: 'Mirëmbajtje',
    text: 'Kujdes dhe vëmendje për funksionimin e instalimeve tuaja elektrike.',
    icon: 'tool',
  },
] as const;
export const projects = [
  {
    image: commercial,
    title: 'Ndriçim komercial',
    alt: 'Ndriçues linearë në tavanin e një marketi',
    category: 'AMBIENTE TREGTARE',
    source: 'https://www.facebook.com/photo.php?fbid=576425864505061',
  },
  {
    image: ring,
    title: 'Ndriçim dekorativ',
    alt: 'Ndriçues dekorativ në formë unaze pranë një dritareje',
    category: 'DETAJE QË NDRYSHOJNË AMBIENTIN',
    source: 'https://www.facebook.com/photo.php?fbid=424484873032495',
  },
  {
    image: pendants,
    title: 'Instalime ndriçimi',
    alt: 'Tre ndriçues të varur pranë dritares',
    category: 'NDRIÇUES TË VARUR',
    source: 'https://www.facebook.com/photo.php?fbid=424484853032497',
  },
] as const;

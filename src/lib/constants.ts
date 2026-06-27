export const SALONS = {
  ZAD: {
    id: "zad",
    nom: "RENOI ZAD",
    adresse: "En face du Black Diamond & station ACCESS OIL",
    quartier: "ZAD, Ouagadougou",
    telephone: "+226 67 91 22 22",
    whatsapp: "+22667912222",
    horaires: "7j/7 · 9h00 – 21h00",
    googleMaps: "https://maps.google.com/?q=Renoi+Barberstreet+ZAD+Ouagadougou",
  },
  SAABA: {
    id: "saaba",
    nom: "RENOI SAABA",
    adresse: "Route USTA, en face de la station SHELL",
    quartier: "SAABA, Ouagadougou",
    telephone: "+226 07 95 24 34",
    whatsapp: "+22607952434",
    horaires: "7j/7 · 9h00 – 21h00",
    googleMaps: "https://maps.google.com/?q=Renoi+Barberstreet+Saaba+Ouagadougou",
  },
} as const;

export const BRAND = {
  nom: "RENOI Barberstreet",
  slogan: "La valeur sûre",
  instagram: "@renoi_barberstreet",
  instagramUrl: "https://www.instagram.com/renoi_barberstreet/",
  instagramSaaba: "https://www.instagram.com/renoi_barberstreet_saaba/",
  horaires: "7j/7 · 9h00 – 21h00",
} as const;

export const FIDELITE = {
  coupesParGratuite: 10,
  pointsParCoupe: 50,
  valeurPointEnFCFA: 10,
} as const;

export const CATEGORIES_PRESTATIONS = [
  { id: "tous", label: "Tous" },
  { id: "coupe", label: "Coupe homme" },
  { id: "barbe", label: "Barbe" },
  { id: "enfant", label: "Enfant" },
  { id: "combo", label: "Combo" },
  { id: "soins", label: "Soins" },
] as const;

export const MODES_PAIEMENT = [
  { id: "orange_money", label: "Orange Money", emoji: "🟠" },
  { id: "moov_money", label: "Moov Money", emoji: "🔵" },
  { id: "carte", label: "Carte bancaire", emoji: "💳" },
  { id: "sur_place", label: "Payer sur place", emoji: "🏪" },
] as const;

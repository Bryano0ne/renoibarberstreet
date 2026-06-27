export const PRESTATIONS_DEMO = [
  {
    id: "1",
    nom: "Dégradé Classique",
    categorie: "coupe",
    prix_fcfa: 3000,
    duree_min: 45,
    badge: "populaire",
    description: "Dégradé net et précis, la coupe signature de nos barbiers.",
  },
  {
    id: "2",
    nom: "Afro Sculpté",
    categorie: "coupe",
    prix_fcfa: 4000,
    duree_min: 60,
    badge: "nouveau",
    description: "Mise en valeur de la texture naturelle avec un contour net.",
  },
  {
    id: "3",
    nom: "Coupe Classique",
    categorie: "coupe",
    prix_fcfa: 2500,
    duree_min: 30,
    badge: null,
    description: "La coupe propre et simple, exécutée à la perfection.",
  },
  {
    id: "4",
    nom: "Taille de Barbe",
    categorie: "barbe",
    prix_fcfa: 1500,
    duree_min: 20,
    badge: null,
    description: "Modelage et taille précise de la barbe pour un rendu soigné.",
  },
  {
    id: "5",
    nom: "Rasage Traditionnel",
    categorie: "barbe",
    prix_fcfa: 2000,
    duree_min: 30,
    badge: "populaire",
    description: "Rasage à la serviette chaude et rasoir droit. L'expérience ultime.",
  },
  {
    id: "6",
    nom: "Combo Coupe + Barbe",
    categorie: "combo",
    prix_fcfa: 4500,
    duree_min: 75,
    badge: "bestseller",
    description: "La formule complète : coupe + barbe parfaite en un seul rendez-vous.",
  },
  {
    id: "7",
    nom: "Coupe Enfant",
    categorie: "enfant",
    prix_fcfa: 2000,
    duree_min: 30,
    badge: null,
    description: "Coupe adaptée aux enfants, réalisée avec douceur et patience.",
  },
  {
    id: "8",
    nom: "Soin Cuir Chevelu",
    categorie: "soins",
    prix_fcfa: 2500,
    duree_min: 20,
    badge: null,
    description: "Traitement hydratant pour un cuir chevelu sain et revitalisé.",
  },
];

export const BARBIERS_DEMO = [
  {
    id: "1",
    prenom: "Moussa",
    specialites: ["Dégradé", "Afro sculpté"],
    salon_id: "zad",
    salon_nom: "ZAD",
  },
  {
    id: "2",
    prenom: "Ibrahim",
    specialites: ["Barbe", "Rasage traditionnel"],
    salon_id: "zad",
    salon_nom: "ZAD",
  },
  {
    id: "3",
    prenom: "Seydou",
    specialites: ["Combo", "Coupe classique"],
    salon_id: "saaba",
    salon_nom: "SAABA",
  },
  {
    id: "4",
    prenom: "Hamidou",
    specialites: ["Afro sculpté", "Soins"],
    salon_id: "saaba",
    salon_nom: "SAABA",
  },
];

export const AVIS_DEMO = [
  {
    id: "1",
    prenom: "Kader",
    note: 5,
    salon: "ZAD",
    commentaire:
      "Meilleur barbershop de Ouaga sans hésitation. Mon dégradé était parfait, les gars savent ce qu'ils font. Je reviens chaque semaine.",
    date: "Juin 2026",
  },
  {
    id: "2",
    prenom: "Salif",
    note: 5,
    salon: "SAABA",
    commentaire:
      "Accueil au top, ambiance cool et résultat impeccable. Le rasage traditionnel vaut vraiment le déplacement.",
    date: "Juin 2026",
  },
  {
    id: "3",
    prenom: "Abdoul",
    note: 5,
    salon: "ZAD",
    commentaire:
      "La valeur sûre c'est bien dit. Ça fait 6 mois que je viens, jamais déçu. Le combo coupe + barbe est au top.",
    date: "Mai 2026",
  },
  {
    id: "4",
    prenom: "Issouf",
    note: 4,
    salon: "SAABA",
    commentaire:
      "Très bonne expérience, le barbier a bien pris en compte mes préférences. Salon propre et bien équipé.",
    date: "Mai 2026",
  },
  {
    id: "5",
    prenom: "Romuald",
    note: 5,
    salon: "ZAD",
    commentaire:
      "J'ai emmené mon fils, il a adoré. Coupe enfant impeccable, le barbier était très patient. On reviendra !",
    date: "Avril 2026",
  },
  {
    id: "6",
    prenom: "Daouda",
    note: 5,
    salon: "SAABA",
    commentaire:
      "Artistic job comme ils disent ! L'afro sculpté était exactement ce que je voulais. Equipe professionnelle.",
    date: "Avril 2026",
  },
];

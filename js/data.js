// Contenu de révision — Instructor Prep
//
// IMPORTANT : ce contenu couvre des connaissances générales de plongée
// (physique, physiologie, matériel) communes à tous les organismes de
// formation, ainsi que la structure publique du cursus SSI telle que
// publiée sur divessi.com. Il NE remplace PAS le SSI Instructor Manual,
// le MySSI, ni les indications de ton Instructor Trainer. Les valeurs
// chiffrées précises (ratios encadrant/élèves, procédures d'examen,
// tables RDP/eRDPml) doivent être vérifiées auprès de tes supports
// officiels SSI en vigueur : elles évoluent et ne sont pas reproduites
// ici quand elles sont spécifiques à SSI ou sujettes à changement.

export const CATEGORIES = [
  { id: "physique", label: "Physique", icon: "🌊", color: "#1d6fa5" },
  { id: "physiologie", label: "Physiologie & accidents", icon: "🫁", color: "#c62828" },
  { id: "materiel", label: "Matériel", icon: "🤿", color: "#2e7d32" },
  { id: "planification", label: "Planification & tables", icon: "🧭", color: "#6a4fb6" },
  { id: "environnement", label: "Environnement & sécurité", icon: "🌐", color: "#00838f" },
  { id: "ssi", label: "Parcours & pédagogie SSI", icon: "🎓", color: "#ef6c00" },
];

export const QUESTIONS = [
  // ---------------- PHYSIQUE ----------------
  {
    id: "phy-01", cat: "physique",
    q: "Que dit la loi de Boyle-Mariotte, essentielle pour comprendre la plongée ?",
    choices: [
      "À température constante, le produit pression × volume d'un gaz reste constant (P1V1 = P2V2)",
      "La pression d'un mélange gazeux est la somme des pressions partielles de ses composants",
      "La quantité de gaz dissous dans un liquide est proportionnelle à sa pression partielle",
      "Le volume d'un gaz est proportionnel à sa température en degrés Celsius",
    ],
    correct: 0,
    explanation: "Boyle-Mariotte régit la compression/expansion des gaz avec la profondeur : c'est la base de la flottabilité, de la consommation d'air et des barotraumatismes.",
  },
  {
    id: "phy-02", cat: "physique",
    q: "La loi de Dalton permet d'expliquer directement :",
    choices: [
      "La flottabilité d'un corps immergé",
      "La pression partielle de chaque gaz dans un mélange respiré (ex. calcul de la MOD du nitrox)",
      "La vitesse de propagation du son sous l'eau",
      "La formation de buée dans le masque",
    ],
    correct: 1,
    explanation: "Dalton : la pression totale d'un mélange = somme des pressions partielles. Indispensable pour le calcul de la profondeur maximale d'utilisation (MOD) en nitrox.",
  },
  {
    id: "phy-03", cat: "physique",
    q: "La loi de Henry est à la base de quel phénomène en plongée ?",
    choices: [
      "La narcose à l'azote",
      "La dissolution des gaz dans les tissus et le sang, et donc la théorie de la décompression",
      "La réfraction de la lumière sous l'eau",
      "La perte de chaleur corporelle",
    ],
    correct: 1,
    explanation: "Henry : la quantité de gaz dissous dans un liquide est proportionnelle à la pression partielle de ce gaz — c'est le fondement de toute la théorie de décompression.",
  },
  {
    id: "phy-04", cat: "physique",
    q: "Un plongeur descend en eau de mer. Par rapport à l'eau douce, sa flottabilité est :",
    choices: [
      "Identique, la densité de l'eau ne change pas",
      "Plus négative (il coule davantage)",
      "Plus positive (l'eau salée est plus dense, environ 1,025 kg/L contre 1,000 kg/L)",
      "Imprévisible, cela dépend uniquement de la température",
    ],
    correct: 2,
    explanation: "L'eau salée étant plus dense, elle exerce une poussée d'Archimède plus forte : il faut généralement plus de lest en mer qu'en eau douce.",
  },
  {
    id: "phy-05", cat: "physique",
    q: "En eau de mer, la pression augmente approximativement de :",
    choices: [
      "1 bar tous les 10 mètres",
      "1 bar tous les 20 mètres",
      "0,5 bar tous les 10 mètres",
      "2 bars tous les 10 mètres",
    ],
    correct: 0,
    explanation: "Règle générale largement utilisée dans l'enseignement : environ +1 bar par 10 m d'eau de mer, en plus des 1 bar de pression atmosphérique en surface. Vérifie les valeurs exactes retenues par ton support de cours.",
  },
  {
    id: "phy-06", cat: "physique",
    q: "Pourquoi la consommation d'air (en volume à pression atmosphérique) augmente-t-elle avec la profondeur ?",
    choices: [
      "Le détendeur devient moins performant en profondeur",
      "Le plongeur respire plus vite par réflexe",
      "L'air est plus dense en profondeur : chaque respiration consomme plus de molécules de gaz pour un même volume pulmonaire",
      "L'eau froide réduit la capacité pulmonaire",
    ],
    correct: 2,
    explanation: "À pression plus élevée, l'air est plus dense : un même volume pulmonaire correspond à davantage de gaz prélevé dans le bloc, d'où une consommation accrue en litres/bar.",
  },
  {
    id: "phy-07", cat: "physique",
    q: "Que se passe-t-il pour un ballon de recherche (lift bag) qui remonte en surface sans contrôle ?",
    choices: [
      "Rien, sa flottabilité reste constante",
      "Il se dégonfle automatiquement",
      "L'air qu'il contient se dilate en remontant (Boyle-Mariotte), accélérant sa remontée de façon incontrôlée",
      "Il devient neutre en surface",
    ],
    correct: 2,
    explanation: "C'est un point pédagogique classique pour illustrer les dangers de Boyle-Mariotte en remontée non contrôlée, y compris pour la flottabilité du plongeur lui-même.",
  },

  // ---------------- PHYSIOLOGIE ----------------
  {
    id: "phz-01", cat: "physiologie",
    q: "La narcose à l'azote est principalement causée par :",
    choices: [
      "Une pression partielle élevée d'azote à profondeur",
      "Un manque d'oxygène",
      "Une accumulation de CO2 due à un effort physique",
      "Le froid ressenti en profondeur",
    ],
    correct: 0,
    explanation: "Souvent comparée à une ivresse, la narcose est liée à l'augmentation de la pression partielle d'azote. La sensibilité varie fortement d'un individu à l'autre — ne retiens pas un seuil unique comme absolu.",
  },
  {
    id: "phz-02", cat: "physiologie",
    q: "L'accident de décompression (ADD) résulte principalement de :",
    choices: [
      "Une remontée trop rapide provoquant la formation de bulles d'azote dans les tissus/le sang",
      "Une pression partielle d'oxygène trop faible",
      "Un excès de CO2 par hypoventilation",
      "Une déshydratation avant la plongée",
    ],
    correct: 0,
    explanation: "Une désaturation trop rapide empêche l'azote dissous de repasser en phase gazeuse progressivement, formant des bulles qui peuvent obstruer la circulation ou léser les tissus.",
  },
  {
    id: "phz-03", cat: "physiologie",
    q: "Quel est le risque principal d'une remontée rapide en apnée respiratoire bloquée (poumon plein) ?",
    choices: [
      "La narcose à l'azote",
      "La surpression pulmonaire, pouvant aller jusqu'à l'embolie gazeuse",
      "L'essoufflement",
      "L'hypothermie",
    ],
    correct: 1,
    explanation: "Si l'air ne peut pas s'échapper librement pendant la remontée, l'expansion du gaz dans les poumons (Boyle-Mariotte) peut provoquer une surpression pulmonaire, un accident grave et potentiellement mortel.",
  },
  {
    id: "phz-04", cat: "physiologie",
    q: "La toxicité de l'oxygène (effet SNC / convulsions) est associée à :",
    choices: [
      "Une pression partielle d'O2 trop faible",
      "Une pression partielle d'O2 élevée, typiquement au-delà des seuils utilisés en nitrox/tech",
      "Un excès d'azote uniquement",
      "Une eau trop froide",
    ],
    correct: 1,
    explanation: "C'est pourquoi les formations nitrox insistent sur le calcul de la MOD (profondeur max d'utilisation) pour rester sous un seuil de pression partielle d'O2 donné par les standards de ton organisme.",
  },
  {
    id: "phz-05", cat: "physiologie",
    q: "Un placage de masque (mask squeeze) est un exemple de :",
    choices: [
      "Barotraumatisme de descente",
      "Barotraumatisme de remontée",
      "Accident de décompression",
      "Narcose",
    ],
    correct: 0,
    explanation: "En descente, si l'air à l'intérieur du masque n'est pas rééquilibré, la pression externe croissante peut créer un effet ventouse sur le visage et les yeux.",
  },
  {
    id: "phz-06", cat: "physiologie",
    q: "Un plongeur ne parvient pas à équilibrer ses oreilles en descente et ressent une douleur. Quelle est la bonne conduite ?",
    choices: [
      "Continuer à descendre, la douleur va passer",
      "Forcer une manœuvre de Valsalva plus intense",
      "Remonter légèrement, retenter l'équilibrage en douceur, ne jamais forcer",
      "Retirer son masque pour égaliser plus facilement",
    ],
    correct: 2,
    explanation: "Principe pédagogique fondamental à transmettre aux élèves : ne jamais forcer une équilibration, remonter un peu si besoin, redescendre plus lentement.",
  },
  {
    id: "phz-07", cat: "physiologie",
    q: "L'essoufflement (dyspnée) en plongée est le plus souvent déclenché par :",
    choices: [
      "Un effort physique excessif et une accumulation de CO2",
      "Un froid excessif uniquement",
      "Une pression partielle d'azote élevée",
      "Une déshydratation",
    ],
    correct: 0,
    explanation: "L'effort couplé à une ventilation inadaptée entraîne une accumulation de CO2, créant une sensation d'étouffement qui peut s'auto-entretenir en panique si mal gérée.",
  },
  {
    id: "phz-08", cat: "physiologie",
    q: "En tant que futur instructeur, quelle est la priorité pédagogique face à un élève en début d'essoufflement ?",
    choices: [
      "Le faire remonter en panique le plus vite possible",
      "Le stabiliser, établir un contact visuel et physique, ralentir la respiration, arrêter l'effort avant d'envisager la suite",
      "L'ignorer, cela se résout tout seul",
      "Lui retirer son détendeur pour qu'il respire mieux",
    ],
    correct: 1,
    explanation: "La gestion du stress et de l'essoufflement d'un élève est un point central des modules de gestion de groupe/rescue de la formation instructeur.",
  },

  // ---------------- MATERIEL ----------------
  {
    id: "mat-01", cat: "materiel",
    q: "Quel est le rôle du premier étage d'un détendeur ?",
    choices: [
      "Délivrer l'air à la demande, à la pression ambiante",
      "Réduire la haute pression du bloc à une pression intermédiaire stable",
      "Gonfler le gilet automatiquement",
      "Mesurer la pression restante dans le bloc",
    ],
    correct: 1,
    explanation: "Le 1er étage réduit la HP du bloc (~200 bars) à une pression intermédiaire (~8-10 bars au-dessus de l'ambiante) ; c'est le 2e étage qui délivre l'air à la demande.",
  },
  {
    id: "mat-02", cat: "materiel",
    q: "Le manomètre (SPG) sert à :",
    choices: [
      "Indiquer la profondeur",
      "Indiquer la pression restante dans le bloc",
      "Indiquer le temps de plongée",
      "Indiquer la température de l'eau",
    ],
    correct: 1,
    explanation: "Le SPG (submersible pressure gauge) est relié à la sortie HP du 1er étage et affiche la pression restante dans le bloc.",
  },
  {
    id: "mat-03", cat: "materiel",
    q: "Pourquoi une combinaison néoprène perd-elle en flottabilité et en isolation avec la profondeur ?",
    choices: [
      "Le néoprène se rétracte sous l'effet du froid",
      "Les bulles de gaz emprisonnées dans le néoprène se compriment avec la pression (Boyle-Mariotte)",
      "L'eau s'infiltre systématiquement dans le tissu",
      "Le néoprène devient plus lourd chimiquement",
    ],
    correct: 1,
    explanation: "Le néoprène contient des micro-bulles de gaz qui se compressent en profondeur, réduisant à la fois son épaisseur isolante et la flottabilité qu'il procure.",
  },
  {
    id: "mat-04", cat: "materiel",
    q: "Un gilet stabilisateur (BCD) permet principalement de :",
    choices: [
      "Fournir de l'air de secours en cas de panne",
      "Ajuster la flottabilité en ajoutant ou évacuant de l'air",
      "Réguler la température corporelle",
      "Remplacer le lestage",
    ],
    correct: 1,
    explanation: "Le BCD (Buoyancy Control Device) permet de compenser les variations de flottabilité liées à la profondeur, à l'usure du bloc, etc.",
  },
  {
    id: "mat-05", cat: "materiel",
    q: "Un ordinateur de plongée calcule en continu :",
    choices: [
      "Uniquement la profondeur",
      "La pression restante dans le bloc",
      "L'azote résiduel théorique dans les tissus modélisés, en fonction du profil profondeur/temps",
      "La température de l'eau uniquement",
    ],
    correct: 2,
    explanation: "Il applique un modèle de désaturation (algorithme propre au fabricant) au profil réel de la plongée pour estimer la charge en azote et les paliers éventuels.",
  },

  // ---------------- PLANIFICATION & TABLES ----------------
  {
    id: "pla-01", cat: "planification",
    q: "Qu'appelle-t-on l'azote résiduel après une plongée ?",
    choices: [
      "L'azote encore présent dans les tissus du plongeur après sa remontée, tant qu'il n'a pas été totalement éliminé",
      "L'azote resté dans le bloc de plongée",
      "L'azote produit par l'effort physique",
      "Un terme obsolète qui n'est plus utilisé",
    ],
    correct: 0,
    explanation: "C'est la base du calcul des plongées successives : plus l'intervalle de surface est court, plus l'azote résiduel de la plongée précédente est important au début de la suivante.",
  },
  {
    id: "pla-02", cat: "planification",
    q: "Pourquoi respecter une vitesse de remontée contrôlée et ne jamais remonter trop vite ?",
    choices: [
      "Pour économiser de l'air uniquement",
      "Pour laisser le temps à l'azote dissous de repasser progressivement en phase gazeuse et être éliminé sans former de bulles dangereuses",
      "Pour éviter le froid",
      "Ce n'est qu'une recommandation de confort, sans lien avec la sécurité",
    ],
    correct: 1,
    explanation: "C'est le principe central de la prévention des accidents de décompression. La vitesse exacte recommandée dépend du standard/ordinateur utilisé : réfère-toi à la valeur en vigueur dans ton support SSI.",
  },
  {
    id: "pla-03", cat: "planification",
    q: "Un palier de sécurité (safety stop) sur une plongée sans décompression obligatoire sert à :",
    choices: [
      "Remplacer l'équilibrage des oreilles",
      "Réduire la marge de sécurité en laissant du temps supplémentaire à la désaturation avant la surface",
      "Recharger le bloc en air",
      "Se réchauffer avant la sortie",
    ],
    correct: 1,
    explanation: "Largement recommandé par les organismes de formation (souvent autour de quelques minutes à faible profondeur) comme marge de sécurité supplémentaire — vérifie la durée/profondeur précise préconisée par SSI.",
  },
  {
    id: "pla-04", cat: "planification",
    q: "Pourquoi la plongée en altitude nécessite-t-elle des procédures adaptées ?",
    choices: [
      "L'eau y est toujours plus froide",
      "La pression atmosphérique de référence en surface est plus basse qu'au niveau de la mer, ce qui modifie les calculs de désaturation",
      "Il n'y a pas de différence, les mêmes tables s'appliquent partout",
      "L'oxygène de l'air y est plus concentré",
    ],
    correct: 1,
    explanation: "Une pression de surface plus basse change le rapport de pression entre le fond et la surface : les tables/ordinateurs doivent être adaptés ou réglés en mode altitude.",
  },
  {
    id: "pla-05", cat: "planification",
    q: "Un plus long intervalle de surface entre deux plongées permet :",
    choices: [
      "D'augmenter l'azote résiduel avant la 2e plongée",
      "De réduire davantage l'azote résiduel avant la 2e plongée, laissant plus de marge",
      "De ne plus avoir besoin de palier de sécurité",
      "N'a aucun effet sur la planification",
    ],
    correct: 1,
    explanation: "Plus l'intervalle de surface est long, plus le corps élimine d'azote, ce qui redonne de la marge pour la plongée suivante (plus de temps sans palier, en général).",
  },

  // ---------------- ENVIRONNEMENT & SECURITE ----------------
  {
    id: "env-01", cat: "environnement",
    q: "Face à un courant fort inattendu pendant une plongée encadrée, la priorité de l'instructeur est :",
    choices: [
      "Continuer le programme prévu à l'identique",
      "Regrouper les élèves, garder le contact visuel, et adapter/écourter la plongée si nécessaire pour la sécurité du groupe",
      "Laisser chaque élève se débrouiller seul pour rejoindre la surface",
      "Accélérer la plongée pour finir plus vite",
    ],
    correct: 1,
    explanation: "La gestion de groupe et l'adaptation en temps réel du déroulé sont au cœur des compétences évaluées lors de l'ITC/IE.",
  },
  {
    id: "env-02", cat: "environnement",
    q: "En plongée de nuit, un point de sécurité essentiel à enseigner est :",
    choices: [
      "Ce n'est pas nécessaire d'avoir une lampe de secours",
      "Prévoir un éclairage principal ET un éclairage de secours, et définir des signaux lumineux clairs avant la mise à l'eau",
      "Plonger plus profond qu'en plongée de jour",
      "Se passer de tout signal, la visibilité n'a pas d'importance",
    ],
    correct: 1,
    explanation: "La préparation (matériel de secours, signaux lumineux convenus) est un point pédagogique classique des briefings de plongée de nuit.",
  },
  {
    id: "env-03", cat: "environnement",
    q: "Un thermocline désigne :",
    choices: [
      "Une zone de changement brutal de température dans la colonne d'eau",
      "Un courant de surface uniquement",
      "Un instrument de mesure de la profondeur",
      "Une variation de salinité uniquement",
    ],
    correct: 0,
    explanation: "Utile à expliquer aux élèves pour anticiper l'inconfort thermique et le flou visuel parfois associé au passage d'un thermocline.",
  },
  {
    id: "env-04", cat: "environnement",
    q: "Avant une sortie bateau, un briefing sécurité complet pour des élèves doit notamment couvrir :",
    choices: [
      "Uniquement l'heure de départ",
      "Les procédures de mise à l'eau/remontée à l'échelle, les signaux de rappel, la conduite à tenir en cas de séparation du groupe",
      "Le menu du repas prévu",
      "Rien de particulier, le briefing standard suffit toujours",
    ],
    correct: 1,
    explanation: "Un briefing structuré et complet, adapté au site et aux conditions du jour, est une compétence pédagogique clé évaluée pour un instructeur.",
  },

  // ---------------- SSI : PARCOURS & PEDAGOGIE ----------------
  {
    id: "ssi-01", cat: "ssi",
    q: "D'après le site officiel SSI (divessi.com), quelle est l'étape qui suit généralement le Divemaster / Dive Control Specialist dans le parcours pro ?",
    choices: [
      "Le Try Scuba",
      "L'Instructor Training Course (ITC)",
      "L'Advanced Adventurer",
      "Le Specialty Diver",
    ],
    correct: 1,
    explanation: "Selon divessi.com, l'ITC est l'étape suivante après le niveau Divemaster/Dive Control Specialist, avant l'évaluation instructeur (IE).",
  },
  {
    id: "ssi-02", cat: "ssi",
    q: "Que doit accomplir un candidat après l'ITC pour devenir officiellement SSI Open Water Instructor ?",
    choices: [
      "Rien, la certification est automatique à la fin de l'ITC",
      "Réussir l'Instructor Evaluation (IE)",
      "Attendre 2 ans d'expérience en tant que Dive Guide",
      "Passer directement Instructor Trainer",
    ],
    correct: 1,
    explanation: "SSI décrit une approche en 2 étapes : ITC puis IE (Instructor Evaluation), à l'issue de laquelle le candidat devient Open Water Instructor.",
  },
  {
    id: "ssi-03", cat: "ssi",
    q: "Le niveau Dive Control Specialist (Dive Con) chez SSI correspond globalement à :",
    choices: [
      "Un niveau de plongeur loisir débutant",
      "Le premier niveau d'encadrement, regroupant les compétences Divemaster et Assistant Instructor",
      "Le niveau le plus élevé, au-dessus d'Instructor Trainer",
      "Une spécialité de plongée technique uniquement",
    ],
    correct: 1,
    explanation: "D'après divessi.com, le Dive Control Specialist est le premier niveau du système de leadership SSI, incluant les compétences Divemaster et Assistant Instructor.",
  },
  {
    id: "ssi-04", cat: "ssi",
    q: "Un SSI Instructor Trainer est qualifié pour :",
    choices: [
      "Uniquement enseigner l'Open Water Diver",
      "Former et encadrer les Instructor Training Courses (ITC) ainsi que les Instructor Crossovers",
      "Seulement plonger en exploration, sans encadrement",
      "Uniquement délivrer des spécialités",
    ],
    correct: 1,
    explanation: "Selon SSI, l'Instructor Trainer conduit les ITC et les Instructor Crossovers, en plus de pouvoir enseigner l'ensemble des cours.",
  },
  {
    id: "ssi-05", cat: "ssi",
    q: "Pendant l'ITC, les futurs instructeurs s'entraînent notamment à enseigner quels programmes (selon divessi.com) ?",
    choices: [
      "Uniquement la spéléologie",
      "L'Open Water Diver et des spécialités comme le Nitrox (Enriched Air), le Diver Stress & Rescue, ou le Perfect Buoyancy",
      "Uniquement des cours pour enfants",
      "Aucun programme spécifique n'est mentionné",
    ],
    correct: 1,
    explanation: "D'après le descriptif officiel SSI de l'ITC : sessions académiques, encadrement en eau confinée, et entraînement à l'enseignement de l'Open Water Diver et de spécialités (Nitrox, Stress & Rescue, Perfect Buoyancy...).",
  },
  {
    id: "ssi-06", cat: "ssi",
    q: "En tant que futur instructeur SSI, quelle affirmation sur les ratios encadrant/élèves est correcte ?",
    choices: [
      "Ils sont universels et jamais rappelés dans les standards",
      "Ils sont fixés par les standards SSI en vigueur et doivent être vérifiés dans le manuel officiel / MySSI, car ils peuvent varier selon le cours et l'environnement",
      "Un instructeur peut toujours encadrer un nombre illimité d'élèves",
      "Les ratios n'existent que pour la plongée technique",
    ],
    correct: 1,
    explanation: "Volontairement, cette appli ne donne pas de chiffre précis de ratio : ces valeurs sont propres aux standards SSI en vigueur et doivent être vérifiées dans tes supports officiels à jour.",
  },
  {
    id: "ssi-07", cat: "ssi",
    q: "Quel est, de façon générale, le rôle central d'un instructeur pendant l'évaluation (IE) ?",
    choices: [
      "Démontrer uniquement ses propres compétences de plongée",
      "Démontrer sa capacité à enseigner, encadrer un groupe et gérer la sécurité, pas seulement ses compétences personnelles de plongeur",
      "Réaliser la plongée la plus profonde possible",
      "Battre un record de temps d'immersion",
    ],
    correct: 1,
    explanation: "L'évaluation d'un instructeur porte sur la pédagogie, la gestion de groupe et la sécurité — bien au-delà du simple niveau de plongée personnel.",
  },
];

export const MEMO_CARDS = [
  {
    id: "m-physique",
    cat: "physique",
    title: "Physique — les 3 lois à connaître par cœur",
    bullets: [
      "Boyle-Mariotte : P1·V1 = P2·V2 (température constante) → base de la flottabilité, de la consommation d'air, des barotraumatismes.",
      "Dalton : Ptotale = somme des pressions partielles → base du calcul de MOD en nitrox.",
      "Henry : quantité de gaz dissous ∝ pression partielle → base de toute la théorie de décompression.",
      "Repère usuel : ≈ +1 bar / 10 m d'eau de mer, en plus du bar atmosphérique de surface (à confirmer avec ton support de cours).",
    ],
  },
  {
    id: "m-physiologie",
    cat: "physiologie",
    title: "Physiologie — accidents à connaître",
    bullets: [
      "Narcose à l'azote : liée à la pression partielle d'azote en profondeur, sensibilité très individuelle.",
      "Accident de décompression (ADD) : remontée trop rapide → bulles d'azote dans les tissus/le sang.",
      "Surpression pulmonaire : blocage respiratoire en remontée → risque d'embolie gazeuse, potentiellement mortel.",
      "Toxicité de l'O2 : risque à pression partielle élevée (nitrox/tech) → calcul systématique de la MOD.",
      "Barotraumatismes : oreilles/sinus (descente), masque (descente), poumons (remontée) — ne jamais forcer une équilibration.",
    ],
  },
  {
    id: "m-materiel",
    cat: "materiel",
    title: "Matériel — fonctions clés",
    bullets: [
      "1er étage : réduit la HP du bloc à une pression intermédiaire stable.",
      "2e étage : délivre l'air à la demande, à la pression ambiante.",
      "SPG (manomètre) : pression restante dans le bloc.",
      "BCD : ajuste la flottabilité (ajout/évacuation d'air).",
      "Néoprène : se compresse avec la profondeur → perte de flottabilité et d'isolation thermique.",
      "Ordinateur de plongée : modélise la charge en azote des tissus à partir du profil réel de la plongée.",
    ],
  },
  {
    id: "m-planification",
    cat: "planification",
    title: "Planification — concepts clés",
    bullets: [
      "Azote résiduel : azote encore présent dans le corps après une plongée, tant qu'il n'est pas totalement éliminé.",
      "Intervalle de surface plus long → plus d'azote éliminé → plus de marge pour la plongée suivante.",
      "Vitesse de remontée contrôlée : indispensable pour laisser l'azote repasser en phase gazeuse en douceur.",
      "Palier de sécurité : marge de sécurité supplémentaire en fin de plongée sans décompression obligatoire.",
      "Plongée en altitude : pression de surface plus basse → procédures/tables adaptées nécessaires.",
      "⚠️ Les valeurs précises (durées, profondeurs, vitesses, ratios) doivent être vérifiées dans ton support SSI officiel à jour (manuel, MySSI, ton Instructor Trainer) — volontairement non reproduites ici.",
    ],
  },
  {
    id: "m-environnement",
    cat: "environnement",
    title: "Environnement & sécurité — réflexes d'encadrement",
    bullets: [
      "Courant fort : regrouper le groupe, garder le contact visuel, adapter ou écourter la plongée si besoin.",
      "Plongée de nuit : éclairage principal + secours, signaux lumineux définis avant la mise à l'eau.",
      "Thermocline : anticiper l'inconfort thermique et le flou visuel avec les élèves.",
      "Briefing bateau : procédures de mise à l'eau/remontée, signaux de rappel, conduite en cas de séparation.",
      "Gestion d'un élève en essoufflement : stabiliser, contact visuel/physique, ralentir la respiration, stopper l'effort.",
    ],
  },
  {
    id: "m-ssi",
    cat: "ssi",
    title: "Parcours SSI — repères (source : divessi.com)",
    bullets: [
      "Loisir → pro : Open Water Diver → Advanced Adventurer/spécialités → Dive Guide / Science of Diving → Dive Control Specialist (Divemaster + Assistant Instructor).",
      "Dive Control Specialist → Instructor Training Course (ITC) → Instructor Evaluation (IE) → SSI Open Water Instructor.",
      "Un Open Water Instructor peut ensuite évoluer vers Specialty Instructor, puis Instructor Trainer (habilité à conduire des ITC et Instructor Crossovers).",
      "Pendant l'ITC : sessions académiques, encadrement en eau confinée, entraînement à l'enseignement de l'OWD et de spécialités (Nitrox, Diver Stress & Rescue, Perfect Buoyancy...).",
      "⚠️ Structure générale vérifiée sur le site officiel SSI à la conception de cette appli (2026) — les programmes évoluent : reconfirme toujours sur divessi.com ou auprès de ton centre SSI.",
    ],
  },
  {
    id: "m-disclaimer",
    cat: "ssi",
    title: "⚠️ À lire avant de réviser",
    bullets: [
      "Cette application est un outil de révision PERSONNEL, créé indépendamment. Elle n'est pas éditée, vérifiée ni approuvée officiellement par SSI (Scuba Schools International).",
      "Les questions de physique/physiologie/matériel reflètent des connaissances générales communes à tous les organismes de plongée.",
      "Pour toute donnée chiffrée précise (ratios, procédures d'examen, tables, standards), réfère-toi TOUJOURS à ton SSI Instructor Manual, à MySSI et à ton Instructor Trainer — ce sont les seules sources qui font foi.",
      "En cas de doute sur un point de sécurité, ne te fie jamais uniquement à cette appli.",
    ],
  },
];

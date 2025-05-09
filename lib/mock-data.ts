import type { Formation, ActionFormationParticipant, File, Formateur, Presence, Seance, Theme } from "../types"

// Données de test pour le formateur
export function getMockFormateur(): Formateur {
  return {
    user_id: "f1",
    tarif_heure: 50,
    tarif_jour: 350,
    tarif_seance: 200,
    files: [],
    user: {
      user_id: "f1",
      email: "jean.dupont@example.com",
      nom: "Dupont",
      prenom: "Jean",
      telephone: "0612345678",
      role_id: 3,
      role: {
        role_id: 3,
        role_name: "FORMATEUR",
        users: [],
      },
    },
    seances: [],
  }
}

// Données de test pour les thèmes
const mockThemes: Theme[] = [
  {
    theme_id: 1,
    libelle_theme: "Développement Web Frontend",
    domaine_id: 1,
    actions: [],
    domaine: {
      domaine_id: 1,
      libelle_domaine: "Informatique",
    },
  },
  {
    theme_id: 2,
    libelle_theme: "Développement Web Backend",
    domaine_id: 1,
    actions: [],
    domaine: {
      domaine_id: 1,
      libelle_domaine: "Informatique",
      themes: [],
    },
  },
  {
    theme_id: 3,
    libelle_theme: "Management d'équipe",
    domaine_id: 2,
    actions: [],
    domaine: {
      domaine_id: 2,
      libelle_domaine: "Management",
      themes: [],
    },
  },
  {
    theme_id: 4,
    libelle_theme: "Communication professionnelle",
    domaine_id: 3,
    actions: [],
    domaine: {
      domaine_id: 3,
      libelle_domaine: "Communication",
      themes: [],
    },
  },
]

// Données de test pour les participants
const mockParticipants: ActionFormationParticipant[] = [
  {
    action_id: 1,
    participant_id: "p1",
    date_inscription: new Date("2023-01-15"),
    statut: "Confirmé",
    action: {} as ActionFormation,
    participant: {
      user_id: "p1",
      entreprise: "Tech Solutions",
      poste: "Développeur Frontend",
      actions: [],
      attestations: [],
      user: {
        user_id: "p1",
        email: "sophie.martin@example.com",
        nom: "Martin",
        prenom: "Sophie",
        telephone: "0612345679",
        role_id: 4,
        role: {
          role_id: 4,
          role_name: "PARTICIPANT",
          users: [],
        },
      },
      presences: [],
    },
  },
  {
    action_id: 1,
    participant_id: "p2",
    date_inscription: new Date("2023-01-16"),
    statut: "Confirmé",
    action: {} as ActionFormation,
    participant: {
      user_id: "p2",
      entreprise: "Digital Agency",
      poste: "Designer UI/UX",
      actions: [],
      attestations: [],
      user: {
        user_id: "p2",
        email: "thomas.bernard@example.com",
        nom: "Bernard",
        prenom: "Thomas",
        telephone: "0612345680",
        role_id: 4,
        role: {
          role_id: 4,
          role_name: "PARTICIPANT",
          users: [],
        },
      },
      presences: [],
    },
  },
  {
    action_id: 2,
    participant_id: "p3",
    date_inscription: new Date("2023-02-10"),
    statut: "Confirmé",
    action: {} as ActionFormation,
    participant: {
      user_id: "p3",
      entreprise: "Web Services",
      poste: "Développeur Backend",
      actions: [],
      attestations: [],
      user: {
        user_id: "p3",
        email: "julie.petit@example.com",
        nom: "Petit",
        prenom: "Julie",
        telephone: "0612345681",
        role_id: 4,
        role: {
          role_id: 4,
          role_name: "PARTICIPANT",
          users: [],
        },
      },
      presences: [],
    },
  },
  {
    action_id: 3,
    participant_id: "p4",
    date_inscription: new Date("2023-03-05"),
    statut: "Confirmé",
    action: {} as ActionFormation,
    participant: {
      user_id: "p4",
      entreprise: "Management Consulting",
      poste: "Chef de projet",
      actions: [],
      attestations: [],
      user: {
        user_id: "p4",
        email: "pierre.durand@example.com",
        nom: "Durand",
        prenom: "Pierre",
        telephone: "0612345682",
        role_id: 4,
        role: {
          role_id: 4,
          role_name: "PARTICIPANT",
          users: [],
        },
      },
      presences: [],
    },
  },
]

// Données de test pour les formations
export function getMockFormationsFormateur(): ActionFormation[] {
  const now = new Date()
  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)

  const twoMonthsAgo = new Date(now)
  twoMonthsAgo.setMonth(now.getMonth() - 2)

  const oneMonthLater = new Date(now)
  oneMonthLater.setMonth(now.getMonth() + 1)

  const twoMonthsLater = new Date(now)
  twoMonthsLater.setMonth(now.getMonth() + 2)

  const formations: ActionFormation[] = [
    {
      action_id: 1,
      type_action: "Formation initiale",
      date_debut: twoMonthsAgo,
      date_fin: oneMonthLater,
      duree_jours: 20,
      duree_heures: 140,
      nb_seances: 20,
      prix_unitaire: 1500,
      lieu: "Paris",
      nb_participants_prevu: 10,
      theme_id: 1,
      theme: mockThemes[0],
      formateurs: [],
      participants: [mockParticipants[0], mockParticipants[1]],
      attestations: [],
      files: [],
      seances: [],
    },
    {
      action_id: 2,
      type_action: "Formation continue",
      date_debut: oneMonthAgo,
      date_fin: oneMonthLater,
      duree_jours: 15,
      duree_heures: 105,
      nb_seances: 15,
      prix_unitaire: 1200,
      lieu: "Lyon",
      nb_participants_prevu: 8,
      theme_id: 2,
      theme: mockThemes[1],
      formateurs: [],
      participants: [mockParticipants[2]],
      attestations: [],
      files: [],
      seances: [],
    },
    {
      action_id: 3,
      type_action: "Séminaire",
      date_debut: now,
      date_fin: twoMonthsLater,
      duree_jours: 10,
      duree_heures: 70,
      nb_seances: 10,
      prix_unitaire: 1000,
      lieu: "Marseille",
      nb_participants_prevu: 12,
      theme_id: 3,
      theme: mockThemes[2],
      formateurs: [],
      participants: [mockParticipants[3]],
      attestations: [],
      files: [],
      seances: [],
    },
  ]

  return formations
}

// Récupérer une formation spécifique
export function getMockFormation(id: number): ActionFormation | undefined {
  return getMockFormationsFormateur().find((formation) => formation.action_id === id)
}

// Données de test pour les séances
export function getMockSeancesFormateur(): Seance[] {
  const formations = getMockFormationsFormateur()
  const now = new Date()

  // Créer des dates pour les séances
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)

  const nextWeek = new Date(now)
  nextWeek.setDate(now.getDate() + 7)

  const twoWeeksLater = new Date(now)
  twoWeeksLater.setDate(now.getDate() + 14)

  const seances: Seance[] = [
    {
      seance_id: 1,
      date: yesterday,
      heure: "09:00",
      duree_heures: 7,
      statut: "TERMINEE",
      action_id: 1,
      formateur_id: "f1",
      presences: [],
      action: formations[0],
    },
    {
      seance_id: 2,
      date: now,
      heure: "09:00",
      duree_heures: 7,
      statut: "EN_COURS",
      action_id: 1,
      formateur_id: "f1",
      presences: [],
      action: formations[0],
    },
    {
      seance_id: 3,
      date: tomorrow,
      heure: "09:00",
      duree_heures: 7,
      statut: "EN_ATTENTE",
      action_id: 1,
      formateur_id: "f1",
      presences: [],
      action: formations[0],
    },
    {
      seance_id: 4,
      date: nextWeek,
      heure: "09:00",
      duree_heures: 7,
      statut: "EN_ATTENTE",
      action_id: 2,
      formateur_id: "f1",
      presences: [],
      action: formations[1],
    },
    {
      seance_id: 5,
      date: twoWeeksLater,
      heure: "09:00",
      duree_heures: 7,
      statut: "EN_ATTENTE",
      action_id: 3,
      formateur_id: "f1",
      presences: [],
      action: formations[2],
    },
  ]

  return seances
}

// Récupérer une séance spécifique
export function getMockSeance(id: number): Seance | undefined {
  return getMockSeancesFormateur().find((seance) => seance.seance_id === id)
}

// Données de test pour les présences
export function getMockPresences(sessionId: number): Presence[] {
  const seance = getMockSeance(sessionId)
  if (!seance) return []

  const participants = seance.action.participants

  return participants.map((participant, index) => ({
    presence_id: index + 1,
    status: "PRESENT",
    noted_at: new Date(),
    participant_id: participant.participant_id,
    seance_id: sessionId,
    formateur_id: "f1",
    participant: participant.participant,
    seance: seance,
  }))
}

// Données de test pour les fichiers
export function getMockFichiers(): File[] {
  const formations = getMockFormationsFormateur()

  return [
    {
      file_id: 1,
      file_path: "/uploads/cv/cv_jean_dupont.pdf",
      type: "CV",
      formateur_id: "f1",
      validated: true,
      validated_at: new Date("2023-01-01"),
      title: "CV Jean Dupont",
    },
    {
      file_id: 2,
      file_path: "/uploads/badge/badge_jean_dupont.jpg",
      type: "BADGE",
      formateur_id: "f1",
      validated: true,
      validated_at: new Date("2023-01-02"),
      title: "Badge Jean Dupont",
    },
    {
      file_id: 3,
      file_path: "/uploads/emargement/emargement_formation_1.pdf",
      type: "FEUILLE_EMARGEMENT",
      formateur_id: "f1",
      action_id: 1,
      validated: false,
      validated_at: new Date("2023-02-15"),
      title: "Feuille d'émargement - Formation Web Frontend",
      action: formations[0],
    },
    {
      file_id: 4,
      file_path: "/uploads/formations/support_cours_html_css.pdf",
      type: "FORMATION",
      formateur_id: "f1",
      action_id: 1,
      validated: true,
      validated_at: new Date("2023-02-10"),
      title: "Support de cours HTML/CSS",
      action: formations[0],
    },
    {
      file_id: 5,
      file_path: "/uploads/formations/exercices_javascript.pdf",
      type: "FORMATION",
      formateur_id: "f1",
      action_id: 1,
      validated: true,
      validated_at: new Date("2023-02-12"),
      title: "Exercices JavaScript",
      action: formations[0],
    },
  ] as File[]
}

// Données simulées pour les méthodes du contrôleur

export const mockData = {
  // Demande de formation
  demandTrainings: [
    {
      action_id: 3,
      type_action: "Intra",
      date_debut: "2025-05-10T00:00:00.000Z",
      date_fin: "2025-05-15T00:00:00.000Z",
      duree_jours: 5,
      duree_heures: 30,
      nb_seances: null,
      prix_unitaire: 450,
      lieu: "Lyon",
      nb_participants_prevu: 10,
      theme_id: 1,
      _count: {
        participants: 11,
      },
      theme: {
        theme_id: 1,
        libelle_theme: "Python",
        domaine_id: 2,
      },
    },
    {
      action_id: 8,
      type_action: "Intra",
      date_debut: "2025-06-09T00:00:00.000Z",
      date_fin: "2025-06-14T00:00:00.000Z",
      duree_jours: 6,
      duree_heures: 18,
      nb_seances: null,
      prix_unitaire: 190,
      lieu: "Libero fugit aliqui",
      nb_participants_prevu: 15,
      theme_id: 3,
      _count: {
        participants: 10,
      },
      theme: {
        theme_id: 3,
        libelle_theme: "Angular",
        domaine_id: 1,
      },
    },
    {
      action_id: 1,
      type_action: "Inter",
      date_debut: "2025-04-15T00:00:00.000Z",
      date_fin: "2025-04-20T00:00:00.000Z",
      duree_jours: 5,
      duree_heures: 35,
      nb_seances: null,
      prix_unitaire: 500,
      lieu: "Paris",
      nb_participants_prevu: 12,
      theme_id: 2,
      _count: {
        participants: 8,
      },
      theme: {
        theme_id: 2,
        libelle_theme: "Reactjs",
        domaine_id: 1,
      },
    },
    
  ],

  domainsThemes: [
    {
      theme: "Python",
      domain: "Data Science",
      participants: 11,
    },
    {
      theme: "Angular",
      domain: "Dev Web",
      participants: 10,
    },
    {
      theme: "Reactjs",
      domain: "Dev Web",
      participants: 4,
    },
  ],

  monthlyTrends: [
    {
      month: "2025-04-01T00:00:00.000Z",
      trainings_count: 1,
    },
    {
      month: "2025-05-01T00:00:00.000Z",
      trainings_count: 5,
    },
    {
      month: "2025-06-01T00:00:00.000Z",
      trainings_count: 2,
    },
  ],

  // Revenus
  revenueTrainings: [
    {
      action_id: 1,
      title: "Reactjs",
      participants: 4,
      unit_price: 500,
      revenue: 2000,
    },
    {
      action_id: 2,
      title: "Angular",
      participants: 6,
      unit_price: 450,
      revenue: 2700,
    },
    {
      action_id: 3,
      title: "Python",
      participants: 7,
      unit_price: 420,
      revenue: 2940,
    },
  ],

  revenueMonthly: [
    {
      month: "2025-04-01T00:00:00.000Z",
      revenue: 2000,
    },
    {
      month: "2025-05-01T00:00:00.000Z",
      revenue: 5820,
    },
    {
      month: "2025-06-01T00:00:00.000Z",
      revenue: 1900,
    },
  ],

  revenueFormateurs: [
    {
      formateur_id: "user_2wrKqNaWyBHnkRshR2nq0sLbibW",
      name: "Ahmed Hafsi",
      revenue: 49800,
    },
    {
      formateur_id: "inv_2x88bXcyzoLL2Ctc7EyFgMx5YNh",
      name: "Marie Dupont",
      revenue: 4950,
    },
    {
      formateur_id: "user_3wrKqNaWyBHnkRshR2nq0sLbibW",
      name: "Jean Martin",
      revenue: 3200,
    },
  ],

  // Présence
  attendanceRates: [
    {
      action_id: 3,
      title: "Python",
      attendance_rate: 0.7857142857142857,
    },
    {
      action_id: 1,
      title: "Reactjs",
      attendance_rate: 1,
    },
    {
      action_id: 2,
      title: "Angular",
      attendance_rate: 0.85,
    },
  ],

  topPunctual: [
    {
      action_id: 1,
      title: "Reactjs",
      attendance_rate: 1,
    },
    {
      action_id: 2,
      title: "Angular",
      attendance_rate: 0.85,
    },
    {
      action_id: 3,
      title: "Python",
      attendance_rate: 0.7857142857142857,
    },
  ],

  frequentAbsentees: [
    {
      participant_id: "inv_2xAktsCC8Ct86UOdTj8lEMBZL1A",
      name: "Sophie Leclerc",
      absences: 3,
    },
    {
      participant_id: "inv_2xAktnkI7MJiVvUyiuqOXNXNxK7",
      name: "Thomas Bernard",
      absences: 1,
    },
    {
      participant_id: "inv_3xAktnkI7MJiVvUyiuqOXNXNxK7",
      name: "Lucie Moreau",
      absences: 1,
    },
  ],

  // Performance des formateurs
  trainerPerformance: [
    {
      formateur_id: "user_2wrKqNaWyBHnkRshR2nq0sLbibW",
      name: "Ahmed Hafsi",
      trainingsCount: 4,
      revenue: 49800,
      rating: 4.8,
    },
    {
      formateur_id: "inv_2x88bXcyzoLL2Ctc7EyFgMx5YNh",
      name: "Marie Dupont",
      trainingsCount: 2,
      revenue: 4950,
      rating: 4.5,
    },
    {
      formateur_id: "user_3wrKqNaWyBHnkRshR2nq0sLbibW",
      name: "Jean Martin",
      trainingsCount: 1,
      revenue: 3200,
      rating: 4.2,
    },
  ],

  // Taux d'abandon
  dropoutRates: [
    {
      action_id: 1,
      title: "Reactjs",
      dropout_rate: 0.5,
    },
    {
      action_id: 2,
      title: "Angular",
      dropout_rate: 0.35,
    },
    {
      action_id: 3,
      title: "Python",
      dropout_rate: 0.1,
    },
  ],

  // Statistiques de certification
  certificationStats: {
    totalParticipants: 14,
    certificatesIssued: 7,
    rate: 0.5,
  },
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

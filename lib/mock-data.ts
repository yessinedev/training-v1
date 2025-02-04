// Mock data based on the provided models
export const roles = [
    { role_id: 1, role_name: 'Admin' },
    { role_id: 2, role_name: 'Formateur' },
    { role_id: 3, role_name: 'User' },
  ];
  
  export const users = [
    {
      user_id: 1,
      email: 'admin@example.com',
      password: 'hashed_password',
      nom: 'Dubois',
      prenom: 'Jean',
      telephone: '+33 6 12 34 56 78',
      role_id: 1,
    },
    {
      user_id: 2,
      email: 'formateur@example.com',
      password: 'hashed_password',
      nom: 'Martin',
      prenom: 'Sophie',
      telephone: '+33 6 23 45 67 89',
      role_id: 2,
    },
    {
      user_id: 3,
      email: 'user@example.com',
      password: 'hashed_password',
      nom: 'Bernard',
      prenom: 'Marie',
      telephone: '+33 6 34 56 78 90',
      role_id: 3,
    },
  ];
  
  export const formateurs = [
    {
      formateur_id: 1,
      user_id: 2,
      cv_path: '/cvs/sophie-martin.pdf',
      badge_path: '/badges/sophie-martin.jpg',
    },
  ];
  
  export const domaines = [
    { domaine_id: 1, libelle_domaine: 'Développement Web' },
    { domaine_id: 2, libelle_domaine: 'Design UX/UI' },
    { domaine_id: 3, libelle_domaine: 'DevOps' },
  ];
  
  export const themes = [
    { theme_id: 1, libelle_theme: 'React.js', domaine_id: 1 },
    { theme_id: 2, libelle_theme: 'Node.js', domaine_id: 1 },
    { theme_id: 3, libelle_theme: 'Figma', domaine_id: 2 },
    { theme_id: 4, libelle_theme: 'Docker', domaine_id: 3 },
  ];
  
  export const actions = [
    {
      action_id: 1,
      type_action: 'Formation',
      date_debut: new Date('2024-04-01'),
      date_fin: new Date('2024-04-05'),
      duree_jours: 5,
      duree_heures: 35,
      lieu: 'Paris',
      nb_participants_prevu: 12,
      theme_id: 1,
    },
    {
      action_id: 2,
      type_action: 'Formation',
      date_debut: new Date('2024-05-01'),
      date_fin: new Date('2024-05-05'),
      duree_jours: 5,
      duree_heures: 45,
      lieu: 'Paris',
      nb_participants_prevu: 20,
      theme_id: 1,
    },
    {
      action_id: 3,
      type_action: 'Workshop',
      date_debut: new Date('2024-04-15'),
      date_fin: new Date('2024-04-16'),
      duree_jours: 2,
      duree_heures: 14,
      lieu: 'Lyon',
      nb_participants_prevu: 8,
      theme_id: 3,
    },
  ];
  
  export const participants = [
    {
      participant_id: 1,
      nom: 'Dupont',
      prenom: 'Alice',
      email: 'alice.dupont@example.com',
      telephone: '+33 6 11 22 33 44',
      entreprise: 'TechCorp',
      poste: 'Développeuse Frontend',
    },
    {
      participant_id: 2,
      nom: 'Lefebvre',
      prenom: 'Thomas',
      email: 'thomas.lefebvre@example.com',
      telephone: '+33 6 22 33 44 55',
      entreprise: 'DesignStudio',
      poste: 'UI Designer',
    },
  ];
  
  export const actionFormationParticipants = [
    {
      action_id: 1,
      participant_id: 1,
      date_inscription: new Date('2024-03-15'),
      statut: 'Confirmé',
    },
    {
      action_id: 2,
      participant_id: 2,
      date_inscription: new Date('2024-03-20'),
      statut: 'En attente',
    },
  ];
  
  export const attestations = [
    {
      attestation_id: 1,
      participant_id: 1,
      action_id: 1,
      date_emission: new Date('2024-04-05'),
      qr_code_ref: 'ATT-2024-001',
    },
  ];
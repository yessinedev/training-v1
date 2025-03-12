export type Role = {
  role_id: number;
  role_name: string;
  users: User[];
};
export type User = {
  user_id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role_id: number;
  role: Role;
  created_at?: Date;
  updated_at?: Date;
};

export type FormUser = Omit<
  User,
  "user_id" | "role" | "created_at" | "updated_at"
> & {
  user_id?: number;
};

export type Formateur = {
  user_id: string;
  cv_path?: string;
  badge_path?: string;
  user: User;
};

export type Domain = {
  domaine_id: number;
  libelle_domaine: string;
};

export type Theme = {
  theme_id: number;
  libelle_theme: string;
  domaine_id: number;
  domaine?: Domain;
};

export type Participant = {
  user_id: string;
  entreprise?: string;
  poste?: string;
  user: User;
  actions?: ActionFormationParticipant[];
  attestations?: Attestation[];
};

export type CreateParticipant = {
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  entreprise?: string;
  poste?: string;
};

export type ExcelParticipant = {
  Nom: string;
  Prenom: string;
  Email?: string;
  Telephone: string;
  Entreprise: string;
  Poste?: string;
}

export type Attestation = {
  attestation_id: number;
  participant_id: number;
  action_id: number;
  date_emission?: Date;
  qr_code_ref?: string;
  participant?: Participant;
  action?: Formation;
};

export type ActionFormationParticipant = {
  action_id: number;
  participant_id: number;
  date_inscription?: Date;
  statut?: string;
  action: Formation;
  participant: Participant;
  attestation?: Attestation;
};

export type ActionFormationFormateur = {
  action_id: number;
  formateur_id: number;
  formateur: Formateur;
};

export type Formation = {
  action_id: number;
  type_action: string;
  date_debut: Date;
  date_fin: Date;
  duree_jours: number;
  duree_heures: number;
  lieu: string;
  nb_participants_prevu: number;
  theme_id: number;
  theme?: Theme;
  formateurs: ActionFormationFormateur[];
  participants: ActionFormationParticipant[];
  attestations?: Attestation[];
};

export type FormFormation = Omit<Formation, "action_id" | "formateurs"> & {
  action_id?: number;
  formateur_id?: number;
};

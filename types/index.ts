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
  files: File[];
  user: User;
  seances: Seance[];
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
export type CreateParticipant = {
  user_id: string;
  entreprise: string;
  poste: string;
};

export type Participant = {
  user_id: string;
  entreprise?: string;
  poste?: string;
  user: User;
  actions?: ActionFormationParticipant[];
  attestations?: Attestation[];
  presences?: Presence[];
  seances?: Seance[];
};

export type CreateUserParticipant = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  poste: string;
  role_id: number;
};

export type ExcelParticipant = {
  Nom: string;
  Prenom: string;
  Email?: string;
  Telephone: string;
  Entreprise: string;
  Poste?: string;
};

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
  seances?: Seance[];
  attestations?: Attestation[];
};

export type FormFormation = Omit<Formation, "action_id" | "formateurs"> & {
  action_id?: number;
  formateur_id?: number;
};

export enum SeanceStatut {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
  ANNULEE = "ANNULEE",
}
export type Seance = {
  seance_id: number;
  action_id: number;
  date: Date;
  heure: string;
  duree_heures: number;
  statut: SeanceStatut;
  formateur_id?: string;

  action?: Formation;
  formateur?: Formateur;
  presences?: Presence[];
};

export enum PresenceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  RETARD = "RETARD",
}

export type Presence = {
  presence_id: number;
  status: PresenceStatus;
  noted_at: Date;
  participant_id: string;
  seance_id: number;
  formateur_id?: string;

  participant?: Participant;
  seance?: Seance;
  formateur?: Formateur;
};

export type File = {
  file_id: number;
  file_path: string;
  type: string;
  formateur_id?: string;
  action_id?: number;

  formateur?: Formateur;
  action?: Formation;
};

export type QuestionType = 'text' | 'multiple_choice' | 'checkbox' | 'rating' | 'boolean'

export type Survey = {
  id: string
  title: string
  description?: string
  status: 'draft' | 'published' | 'closed'
  questions: Question[]
}

export type Question = {
  id: string
  surveyId: string
  text: string
  type: QuestionType
  options?: string[]
  required: boolean
}

export type Response = {
  id: string
  surveyId: string
  participantId?: string
  answers: Answer[]
}

export type Answer = {
  id: string
  questionId: string
  responseId: string
  content: any
}


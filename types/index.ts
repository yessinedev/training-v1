export type Role = {
    role_id: number;
    role_name: string;
    users: User[];
}

export type User = {
    user_id: number;
    email: string;
    passowrd: string;
    nom: string;
    prenom: string;
    telephone: string;
    role_id: number;
    role: Role;
}
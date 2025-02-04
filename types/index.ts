export type Role = {
    role_id: number;
    role_name: string;
    users: User[];
}
  export type User = {
    user_id: number;
    email: string;
    password?: string;
    nom: string;
    prenom: string;
    telephone: string;
    role_id: number;
    role: Role;
    created_at?: Date;
    updated_at?: Date;
  };
  
  export type FormUser = Omit<User, 'user_id' | 'role' | 'created_at' | 'updated_at'> & {
    user_id?: number;
  };
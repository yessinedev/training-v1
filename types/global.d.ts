export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
        role: {
            role_name: string;
            role_id: number;
        }
    }
  }
}
import axiosInstance from "@/lib/axios";

export const fetchAttestations = async (actionId: number) => {
  try {
    const response = await axiosInstance.get(
      `/formations/${actionId}/attestations`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Un erreur est survenu lors de la récuperation des attestations."
    );
  }
};

export const createAttestation = async (actionId: number) => {
  try {
    const response = await axiosInstance.post(
      `/formations/${actionId}/attestations`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Un erreur est survenu lors de la création de l'attestation."
    );
  }
};

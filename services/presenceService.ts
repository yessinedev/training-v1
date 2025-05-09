import axios from "axios";
import { Presence, CreatePresenceDto, UpdatePresenceDto } from "@/types";
import axiosInstance from "@/lib/axios";

// Fetch all presences
export async function fetchPresences(): Promise<Presence[]> {
  const res = await axios.get("/api/presences");
  return res.data;
}

// Fetch presences by session (seance) ID
export async function fetchPresencesBySession(
  seanceId: number
): Promise<Presence[]> {
  const res = await axiosInstance.get(`/presences/seance/${seanceId}`);
  return res.data;
}

// Fetch a single presence by ID
export async function fetchPresenceById(id: number): Promise<Presence> {
  const res = await axiosInstance.get(`/presences/${id}`);
  return res.data;
}

// Create a new presence
export async function createPresence(
  data: CreatePresenceDto
): Promise<Presence> {
  try {
    const res = await axiosInstance.post("/presences", {...data});
    return res.data;
  } catch (error) {
    console.error("Error creating presence:", error);
    throw error;
  }
}

// Update an existing presence
export async function updatePresence(
  id: number,
  data: UpdatePresenceDto
): Promise<Presence> {
  const res = await axiosInstance.patch(`/presences/${id}`, data);
  return res.data;
}

// Delete a presence
export async function deletePresence(id: number): Promise<{ message: string }> {
  const res = await axiosInstance.delete(`/presences/${id}`);
  return res.data;
}

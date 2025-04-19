"use client";

import { useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { EventClickArg, DateSelectArg, EventDropArg } from "@fullcalendar/core";
import { SeanceModal } from "./SeanceModal";
import { Formation, Seance, SeanceStatut } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchFormations } from "@/services/formationService";
import {
  fetchSeancesByFormationId,
  createSeance,
  updateSeance,
  deleteSeance,
} from "@/services/seanceService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { formatDate, setHours, setMinutes } from "date-fns";

export function Calendar() {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null
  );
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const queryClient = useQueryClient();
  const queryKey = ["seances", selectedFormation?.action_id];
  const {
    data: formations,
    isLoading: formationsLoading,
    isError: formationsError,
  } = useAuthQuery<Formation[]>(["formations"], fetchFormations);

  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useQuery<Seance[]>({
    queryKey: queryKey,
    queryFn: () => fetchSeancesByFormationId(selectedFormation!.action_id),
    enabled: Boolean(selectedFormation),
  });

  // Create mutation
  const createSeanceMutation = useMutation({
    mutationFn: (seance: Omit<Seance, "seance_id">) => createSeance(seance),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      toast.success("Séance créée avec succès");
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    },
  });

  // Update mutation
  const updateSeanceMutation = useMutation({
    mutationFn: (seance: Seance) => updateSeance(seance),
    onMutate: async (updatedSeance) => {
      await queryClient.cancelQueries({
        queryKey,
      });
      const previousSessions = queryClient.getQueryData<Seance[]>([
        "seances",
        selectedFormation?.action_id,
      ]);
      if (previousSessions) {
        queryClient.setQueryData<Seance[]>(
          queryKey,
          previousSessions.map((session) =>
            session.seance_id === updatedSeance.seance_id
              ? updatedSeance
              : session
          )
        );
      }
      return { previousSessions };
    },
    onError: (error: Error, updatedSeance, context) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
      if (context?.previousSessions) {
        queryClient.setQueryData<Seance[]>(queryKey, context.previousSessions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      toast.success("Séance mise à jour avec succès");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Delete mutation
  const deleteSeanceMutation = useMutation({
    mutationFn: (seanceId: number) => deleteSeance(seanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      toast.success("Séance supprimée avec succès");
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  const handleFormationSelect = useCallback(
    (formationId: number) => {
      const formation =
        formations?.find((f) => f.action_id === formationId) || null;
      setSelectedFormation(formation);
    },
    [formations]
  );

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      setModalMode("create");
      console.log("Selected date:", selectInfo);
      const start = new Date(selectInfo.startStr);
      const end = new Date(selectInfo.endStr);

      const selectedDate = new Date(start.toDateString()); // remove time
      const heure = start.toTimeString().slice(0, 5); // "HH:MM"
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // in hours

      const newSeance: Seance = {
        seance_id: 0,
        action_id: selectedFormation?.action_id ?? 0,
        formateur_id: selectedFormation?.formateurs[0].formateur_id ?? "",
        date: selectedDate,
        heure: heure,
        duree_heures: duration,
        statut: SeanceStatut.EN_ATTENTE,
      };

      setSelectedSeance(newSeance);
      setIsModalOpen(true);
    },
    [selectedFormation]
  );

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      setModalMode("edit");
      const seance = selectedFormation?.seances?.find(
        (s) => s.seance_id === Number(clickInfo.event.id)
      );
      console.log("Clicked event:", seance);
      if (!seance) return;
      setSelectedSeance(seance!);
      setIsModalOpen(true);
    },
    [selectedFormation]
  );

  const handleEventDrop = useCallback(
    (dropInfo: EventDropArg) => {
      const seanceId = Number(dropInfo.event.id);
      const currentSessions = queryClient.getQueryData<Seance[]>(queryKey);
      const seance = currentSessions?.find((s) => s.seance_id === seanceId);

      if (seance && dropInfo.event.start) {
        const updatedSeance: Seance = {
          ...seance,
          date: dropInfo.event.start,
          heure: dropInfo.event.start.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };

        updateSeanceMutation.mutate(updatedSeance);
      } else {
        console.warn(
          "Could not find seance or event start date for drop:",
          dropInfo
        );
        dropInfo.revert();
      }
    },
    [queryClient, updateSeanceMutation, queryKey]
  );

  const handleEventResize = useCallback(
    (resizeInfo: EventDropArg) => {
      const seanceId = Number(resizeInfo.event.id);
      const currentSessions = queryClient.getQueryData<Seance[]>(queryKey);
      const seance = currentSessions?.find((s) => s.seance_id === seanceId);

      if (seance && resizeInfo.event.start && resizeInfo.event.end) {
        const updatedSeance: Seance = {
          ...seance,
          heure: resizeInfo.event.start.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          duree_heures:
            (resizeInfo.event.end.getTime() -
              resizeInfo.event.start.getTime()) /
            (1000 * 60 * 60),
        };
        console.log("Updated seance:", updatedSeance);
        updateSeanceMutation.mutate(updatedSeance);
      } else {
        console.warn(
          "Could not find seance or event end date for resize:",
          resizeInfo
        );
        resizeInfo.revert();
      }
    },
    [queryClient, updateSeanceMutation, queryKey]
  );

  const handleSaveSession = useCallback(
    (session: Seance) => {
      if (modalMode === "create") {
        const { seance_id, ...newSeance } = session;
        createSeanceMutation.mutate(newSeance);
      } else {
        updateSeanceMutation.mutate(session);
      }
    },
    [modalMode, createSeanceMutation, updateSeanceMutation]
  );

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) {
        deleteSeanceMutation.mutate(Number(sessionId));
      }
    },
    [deleteSeanceMutation]
  );

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] bg-white">
      <div className="p-4">
        {/* Formation select */}
        <Select onValueChange={(val) => handleFormationSelect(Number(val))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une formation" />
          </SelectTrigger>
          <SelectContent>
            {formationsLoading ? (
              <SelectItem value="loading">Loading...</SelectItem>
            ) : formations && formations.length > 0 ? (
              formations.map((formation) => (
                <SelectItem
                  key={formation.action_id}
                  value={String(formation.action_id)}
                >
                  {formation.theme?.libelle_theme} -{" "}
                  {formatDate(new Date(formation.date_debut), "dd/MM/yyyy")}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none">Aucune formation</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="calendar-container h-full">
        {sessionsLoading ? (
          <p>Loading sessions...</p>
        ) : sessionsError ? (
          <p>Error loading sessions.</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialDate={
              selectedFormation
                ? new Date(selectedFormation.date_debut)
                : new Date()
            }
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            locale={frLocale}
            events={sessions?.map((session) => ({
              id: String(session.seance_id),
              title: String(session.statut),
              start: setMinutes(
                setHours(session.date, parseInt(session.heure)),
                0
              ),
              date: session.date,
              end: setMinutes(
                setHours(
                  session.date,
                  parseInt(session.heure) + session.duree_heures
                ),
                0
              ),
              backgroundColor: "#f3f4f6",
              borderColor: "#d1d5db",
              textColor: "#1f2937",
              className: "rounded-lg shadow-sm border-l-4",
            }))}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            height="100%"
            stickyHeaderDates={true}
            expandRows={true}
          />
        )}
      </div>
      {isModalOpen && selectedSeance && (
        <SeanceModal
          seance={selectedSeance}
          formation={selectedFormation}
          mode={modalMode}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

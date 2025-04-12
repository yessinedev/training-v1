'use client';

import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { SeanceModal } from './SeanceModal';
import { Formation, Seance } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchFormations } from '@/services/formationService';
import { fetchSeancesByFormationId } from '@/services/seanceService';

// Import the ShadCN UI Select components.
// Adjust the import paths according to your project structure.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { formatDate, setHours, setMinutes } from 'date-fns';

export function Calendar() {
  // States for selected formation and modal/session handling
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedSession, setSelectedSession] = useState<Seance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // First, fetch the available formations.
  const {
      data: formations,
      isLoading: formationsLoading,
      isError: formationsError,
    } = useAuthQuery<Formation[]>(["formations"], fetchFormations);

  // Now, based on the selected formation, fetch its sessions.
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useQuery<Seance[]>({
    queryKey: ['seances', selectedFormation?.action_id],
    queryFn: () =>
      fetchSeancesByFormationId(selectedFormation!.action_id),
    enabled: Boolean(selectedFormation),
  });

  // Callback for when a formation is selected from the dropdown.
  const handleFormationSelect = useCallback((formationId: number) => {
    const formation = formations?.find(f => f.action_id === formationId) || null;
    setSelectedFormation(formation);
    // The sessions query will trigger because of the enabled flag once selectedFormation is set.
  }, [formations]);

  // Callbacks for Calendar events.
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setModalMode('create');
    setSelectedSession({
      id: crypto.randomUUID(),
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      type: 'présentiel',
    });
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    setModalMode('edit');
    setSelectedSession(clickInfo.event.extendedProps as Seance);
    setIsModalOpen(true);
  }, []);

  const handleEventDrop = useCallback((dropInfo: EventDropArg) => {
    // Optionally update the session by re-fetching or applying optimistic updates.
    // For example:
    refetchSessions();
  }, [refetchSessions]);

  const handleSaveSession = useCallback((session: Seance) => {
    // Update the session list here.
    // You might want to use queryClient.setQueryData for optimistic updates.
    // Here, just refetch the sessions after a successful update.
    refetchSessions();
    setIsModalOpen(false);
  }, [refetchSessions]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    // Remove the session and update the list accordingly.
    refetchSessions();
    setIsModalOpen(false);
  }, [refetchSessions]);

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
                <SelectItem key={formation.action_id} value={String(formation.action_id)}>
                  {formation.theme?.libelle_theme} - {formatDate(new Date(formation.date_debut), 'dd/MM/yyyy')}
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
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialDate={selectedFormation ? new Date(selectedFormation.date_debut) : new Date()}
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
              start: setMinutes(setHours(session.date, parseInt(session.heure)), 0),
              date: session.date,
              end: setMinutes(setHours(session.date, parseInt(session.heure) + session.duree_heures), 0),
              // You might convert heure and other properties as needed.
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
              textColor: '#1f2937',
              className: 'rounded-lg shadow-sm border-l-4',
            }))}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            height="100%"
            stickyHeaderDates={true}
            expandRows={true}
          />
        )}
      </div>
      {isModalOpen && selectedSession && (
        <SeanceModal
          session={selectedSession}
          mode={modalMode}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

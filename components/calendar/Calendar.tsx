'use client'

import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { addDays, setHours, setMinutes } from 'date-fns';
import { SeanceModal } from './SeanceModal';
import { Seance, SeanceType } from '@/types';

const sessionColors: Record<SeanceType, { background: string; border: string }> = {
  présentiel: { background: '#bfdbfe', border: '#3b82f6' },
  distanciel: { background: '#bbf7d0', border: '#22c55e' },
  hybride: { background: '#fde68a', border: '#f59e0b' },
};

// Generate mock data for the current week
const today = new Date();
const mockSessions: Seance[] = [
  {
    id: crypto.randomUUID(),
    title: 'Introduction au React',
    start: setMinutes(setHours(today, 9), 0),
    end: setMinutes(setHours(today, 12), 0),
    type: 'présentiel',
    description: 'Formation fondamentale sur React et ses concepts de base',
  },
  {
    id: crypto.randomUUID(),
    title: 'Workshop TypeScript Avancé',
    start: setMinutes(setHours(addDays(today, 1), 14), 0),
    end: setMinutes(setHours(addDays(today, 1), 17), 0),
    type: 'distanciel',
    description: 'Session pratique sur les fonctionnalités avancées de TypeScript',
  },
  {
    id: crypto.randomUUID(),
    title: 'Architecture Microservices',
    start: setMinutes(setHours(addDays(today, 2), 10), 0),
    end: setMinutes(setHours(addDays(today, 2), 16), 0),
    type: 'hybride',
    description: 'Formation complète sur la conception et l\'implémentation de microservices',
  },
  {
    id: crypto.randomUUID(),
    title: 'DevOps & CI/CD',
    start: setMinutes(setHours(addDays(today, 3), 9), 30),
    end: setMinutes(setHours(addDays(today, 3), 15), 30),
    type: 'distanciel',
    description: 'Introduction aux pratiques DevOps et aux pipelines CI/CD',
  },
  {
    id: crypto.randomUUID(),
    title: 'UX/UI Design Principles',
    start: setMinutes(setHours(addDays(today, 4), 13), 0),
    end: setMinutes(setHours(addDays(today, 4), 17), 0),
    type: 'présentiel',
    description: 'Les fondamentaux du design d\'interface utilisateur',
  }
];

export function Calendar() {
  const [sessions, setSessions] = useState<Seance[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<Seance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

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
    setSessions(prev => {
      const sessionId = dropInfo.event.id;
      return prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            start: dropInfo.event.start!,
            end: dropInfo.event.end!,
          };
        }
        return session;
      });
    });
  }, []);

  const handleSaveSession = useCallback((session: Seance) => {
    setSessions(prev => {
      if (modalMode === 'create') {
        return [...prev, session];
      }
      return prev.map(s => (s.id === session.id ? session : s));
    });
    setIsModalOpen(false);
  }, [modalMode]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setIsModalOpen(false);
  }, []);

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] bg-white">
      <div className="calendar-container h-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={false}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
          locale={frLocale}
          events={sessions.map(session => ({
            ...session,
            backgroundColor: sessionColors[session.type].background,
            borderColor: sessionColors[session.type].border,
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
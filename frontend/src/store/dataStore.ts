import { create } from 'zustand';
import { Volunteer, Event, Shift, Task, Message } from '../types/index.js';

interface DataState {
  volunteers: Volunteer[];
  events: Event[];
  shifts: Shift[];
  tasks: Task[];
  messages: Message[];

  setVolunteers: (volunteers: Volunteer[]) => void;
  setEvents: (events: Event[]) => void;
  setShifts: (shifts: Shift[]) => void;
  setTasks: (tasks: Task[]) => void;
  setMessages: (messages: Message[]) => void;

  addVolunteer: (volunteer: Volunteer) => void;
  addEvent: (event: Event) => void;
  addTask: (task: Task) => void;

  updateVolunteer: (id: string, data: Partial<Volunteer>) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;

  removeVolunteer: (id: string) => void;
  removeEvent: (id: string) => void;
  removeTask: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  volunteers: [],
  events: [],
  shifts: [],
  tasks: [],
  messages: [],

  setVolunteers: (volunteers) => set({ volunteers }),
  setEvents: (events) => set({ events }),
  setShifts: (shifts) => set({ shifts }),
  setTasks: (tasks) => set({ tasks }),
  setMessages: (messages) => set({ messages }),

  addVolunteer: (volunteer) => set((state) => ({ volunteers: [...state.volunteers, volunteer] })),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateVolunteer: (id, data) =>
    set((state) => ({
      volunteers: state.volunteers.map((v) => (v.id === id ? { ...v, ...data } : v)),
    })),
  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
    })),
  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  removeVolunteer: (id) =>
    set((state) => ({
      volunteers: state.volunteers.filter((v) => v.id !== id),
    })),
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));

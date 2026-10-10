import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken, refreshToken });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  loadFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');

    if (accessToken && refreshToken && user) {
      set({
        accessToken,
        refreshToken,
        user: JSON.parse(user),
      });
    }
  },
}));

export const useAquariumStore = create((set) => ({
  aquariums: [],
  loading: false,

  setAquariums: (aquariums) => set({ aquariums }),
  setLoading: (loading) => set({ loading }),

  addAquarium: (aquarium) =>
    set((state) => ({
      aquariums: [...state.aquariums, aquarium],
    })),

  updateAquarium: (id, updates) =>
    set((state) => ({
      aquariums: state.aquariums.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  deleteAquarium: (id) =>
    set((state) => ({
      aquariums: state.aquariums.filter((a) => a.id !== id),
    })),
}));

export const useScheduleStore = create((set) => ({
  schedules: [],
  loading: false,

  setSchedules: (schedules) => set({ schedules }),
  setLoading: (loading) => set({ loading }),

  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),

  updateSchedule: (id, updates) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  deleteSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
}));

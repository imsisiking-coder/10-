import { create } from 'zustand';

const GUEST_EMAIL = 'guest@fishcare.app';
const GUEST_USERNAME = '게스트 사용자';
const GUEST_ACCESS_TOKEN = 'guest_access_token';
const GUEST_REFRESH_TOKEN = 'guest_refresh_token';

const isExplicitGuestSession = (user, accessToken, refreshToken) => {
  return (
    user &&
    accessToken === GUEST_ACCESS_TOKEN &&
    refreshToken === GUEST_REFRESH_TOKEN &&
    (user.email === GUEST_EMAIL || user.username === GUEST_USERNAME)
  );
};

const isSuspiciousGuestSession = (user, accessToken, refreshToken) => {
  const guestTokens = [GUEST_ACCESS_TOKEN, GUEST_REFRESH_TOKEN];

  return (
    guestTokens.includes(accessToken) ||
    guestTokens.includes(refreshToken) ||
    (user && (user.email === GUEST_EMAIL || user.username === GUEST_USERNAME))
  ) && !isExplicitGuestSession(user, accessToken, refreshToken);
};

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    if (isSuspiciousGuestSession(user, accessToken, refreshToken)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, accessToken: null, refreshToken: null });
      return;
    }

    set({ user, accessToken, refreshToken });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  },

  updateProfile: (updates) => {
    set((state) => {
      const nextUser = { ...(state.user || {}), ...updates };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return { user: nextUser };
    });
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

    if (!accessToken || !refreshToken || !user) {
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (isSuspiciousGuestSession(parsedUser, accessToken, refreshToken)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, accessToken: null, refreshToken: null });
        return;
      }

      set({
        accessToken,
        refreshToken,
        user: parsedUser,
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, accessToken: null, refreshToken: null });
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

  addFishToAquarium: (aquariumId, fish) =>
    set((state) => ({
      aquariums: state.aquariums.map((a) =>
        a.id === aquariumId
          ? {
              ...a,
              Fish: [...(a.Fish || []), fish],
            }
          : a
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

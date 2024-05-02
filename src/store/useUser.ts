import { LoggedInUser } from '@/types/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the state structure
interface UserState {
  user: LoggedInUser;
  isLoggedIn: boolean;
}

// Define the actions
interface UserActions {
  loginUser: (values: LoggedInUser) => void;
  logoutUser: () => void;
}

// Combine state and actions for the complete store type
type UserStore = UserState & UserActions;

const initialUser: LoggedInUser = {
  email: '',
  userID: '',
  userDoc: '',
  credit: 0,
};

const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      user: initialUser,
      isLoggedIn: false,

      loginUser: (values: LoggedInUser) => {
        set({ user: values, isLoggedIn: true });
      },
      logoutUser: () => {
        set({ user: initialUser, isLoggedIn: false });
      },
    }),
    {
      name: 'ocriginal-user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUser;

// stores/callStore.ts
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

export interface CommonState {
  isLoading: boolean;
}

export interface CommonActions {
  setLoading: (loading: boolean) => void;
}

export type CommonStore = CommonState & CommonActions;

const initialState: CommonState = {
  isLoading: false,
};

export const useCommonStore = create<CommonStore>()((set, get) => ({
  ...initialState,
  setLoading(loading) {
    set({ isLoading: loading });
  },
}));

export const useLoading = () => useCommonStore(state => state);

import { create } from 'zustand';

const useText = create((set) => ({
  textJSON: [],
  setTextJSON: (textJSON: any) => set({ textJSON }),
  removeTextJSON: () => set({ textJSON: [] }),
}));

export default useText;

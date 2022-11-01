import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      (set) => ({
        sharedData: {},
        updateSharedData: (newSharedData) =>
          set((state) => ({
            ...state,
            sharedData: newSharedData
          }))
      }),
      {
        name: 'shared-storage', // unique name
        getStorage: () => sessionStorage // (optional) by default, 'localStorage' is used
      }
    )
  )
);

import { create } from "zustand";

interface FavoritesState {
  favoriteIds: number[];
  toggleFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favoriteIds: [],
  toggleFavorite: (productId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(productId)
        ? state.favoriteIds.filter((id) => id !== productId)
        : [...state.favoriteIds, productId],
    })),
  removeFavorite: (productId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.filter((id) => id !== productId),
    })),
  clearFavorites: () => set({ favoriteIds: [] }),
}));

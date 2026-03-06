import create from 'zustand';

// Zustand store for managing media, recommendations, and ads.
const useMediaStore = create((set) => ({
  media: [],
  recommendations: [],
  ads: [],

  // Method to set media
  setMedia: (newMedia) => set({ media: newMedia }),

  // Method to set recommendations
  setRecommendations: (newRecommendations) => set({ recommendations: newRecommendations }),

  // Method to set ads
  setAds: (newAds) => set({ ads: newAds }),
}));

export default useMediaStore;

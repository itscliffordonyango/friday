
import { Ad, AdType, Genre, Media } from "../types";
import { MOCK_ADS } from "../constants";

class AdEngine {
  private impressionCount: Record<string, number> = {};

  public getAdForPlacement(
    type: AdType,
    media?: Media,
    sessionTime: number = 0
  ): Ad | null {
    const candidates = MOCK_ADS.filter(ad => {
      // Basic type match
      if (ad.type !== type) return false;

      // Frequency capping (example: max 3 views per session for same ad)
      if ((this.impressionCount[ad.id] || 0) >= 3) return false;

      // Targeting rules
      if (ad.targeting.genres && media && !ad.targeting.genres.includes(media.genre)) {
        return false;
      }

      if (ad.targeting.minSessionTime && sessionTime < ad.targeting.minSessionTime) {
        return false;
      }

      return true;
    });

    if (candidates.length === 0) return null;

    // Random selection from candidates
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    return selected;
  }

  public recordImpression(adId: string, completed: boolean) {
    this.impressionCount[adId] = (this.impressionCount[adId] || 0) + 1;
    console.log(`[AdEngine] Recorded ${completed ? 'completed' : 'partial'} impression for ${adId}`);
  }
}

export const adEngine = new AdEngine();

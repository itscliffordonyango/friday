
export enum Genre {
  SITCOM = 'Sitcom',
  ACTION = 'Action',
  SCI_FI = 'Sci-Fi',
  CARTOON = 'Cartoon',
  DRAMA = 'Drama',
  THRILLER = 'Thriller',
  HORROR = 'Horror'
}

export enum AdType {
  PRE_ROLL = 'PRE_ROLL',
  MID_ROLL = 'MID_ROLL',
  BANNER = 'BANNER',
  SPONSORED_ROW = 'SPONSORED_ROW'
}

export interface Media {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  hlsUrl: string;
  duration: number; // seconds
  genre: Genre;
  year: number;
  rating: string;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  watchHistory: string[];
  preferences: {
    theme: 'dark' | 'light' | 'retro';
    language: string;
  };
}

export interface Ad {
  id: string;
  name: string;
  type: AdType;
  videoUrl?: string;
  imageUrl?: string;
  linkUrl: string;
  skippable: boolean;
  duration: number; // for video ads
  campaignId: string;
  targeting: {
    genres?: Genre[];
    minSessionTime?: number;
  };
}

export interface AdCampaign {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
  totalImpressions: number;
  maxImpressions: number;
}

export interface Impression {
  id: string;
  adId: string;
  userId: string;
  timestamp: string;
  completed: boolean;
}

export interface DownloadRecord {
  mediaId: string;
  expiryDate: string;
  licenseKey: string;
}

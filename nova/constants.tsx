
import React from 'react';
import { Media, Genre, Ad, AdType, AdCampaign } from './types';

export const MOCK_MEDIA: Media[] = [
  {
    id: 'm1',
    title: 'The Great Outdoors (1988)',
    description: 'A family vacation turns into a disaster when unwanted relatives show up.',
    thumbnail: 'https://picsum.photos/seed/outdoors/800/450',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 5460,
    genre: Genre.SITCOM,
    year: 1988,
    rating: 'PG',
    isFeatured: true
  },
  {
    id: 'm2',
    title: 'Retro Galaxy Voyager',
    description: 'Classic space opera from the golden age of sci-fi.',
    thumbnail: 'https://picsum.photos/seed/galaxy/800/450',
    hlsUrl: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-911d-472c-9b5c-f383e472e7e8.m3u8',
    duration: 7200,
    genre: Genre.SCI_FI,
    year: 1977,
    rating: 'G'
  },
  {
    id: 'm3',
    title: 'Neon Nights: 1984',
    description: 'A detective in a neon-drenched city tracks a phantom killer.',
    thumbnail: 'https://picsum.photos/seed/neon/800/450',
    hlsUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    duration: 3600,
    genre: Genre.THRILLER,
    year: 1984,
    rating: 'R'
  },
  {
    id: 'm4',
    title: 'Classic Toon Adventures',
    description: 'Saturday morning cartoons at their finest.',
    thumbnail: 'https://picsum.photos/seed/toon/800/450',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 1200,
    genre: Genre.CARTOON,
    year: 1992,
    rating: 'TV-Y7'
  },
  {
    id: 'm5',
    title: 'The Office Pranksters',
    description: 'Original workplace comedy pilot.',
    thumbnail: 'https://picsum.photos/seed/office/800/450',
    hlsUrl: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-911d-472c-9b5c-f383e472e7e8.m3u8',
    duration: 1800,
    genre: Genre.SITCOM,
    year: 1998,
    rating: 'TV-14'
  }
];

export const MOCK_ADS: Ad[] = [
  {
    id: 'ad1',
    name: 'Vintage Soda Ad',
    type: AdType.PRE_ROLL,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    linkUrl: 'https://example.com/soda',
    skippable: true,
    duration: 15,
    campaignId: 'c1',
    targeting: { genres: [Genre.SITCOM] }
  },
  {
    id: 'ad2',
    name: 'Cyber Monday 1999',
    type: AdType.MID_ROLL,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    linkUrl: 'https://example.com/cyber',
    skippable: false,
    duration: 10,
    campaignId: 'c2',
    targeting: { minSessionTime: 300 }
  },
  {
    id: 'ad3',
    name: 'Retro Tech Expo',
    type: AdType.BANNER,
    imageUrl: 'https://picsum.photos/seed/techad/600/100',
    linkUrl: 'https://example.com/expo',
    skippable: false,
    duration: 0,
    campaignId: 'c1',
    targeting: {}
  }
];

export const MOCK_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'c1',
    name: 'Summer Retro Blast',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalImpressions: 1240,
    maxImpressions: 10000
  },
  {
    id: 'c2',
    name: 'Holiday Nostalgia',
    status: 'active',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    totalImpressions: 450,
    maxImpressions: 5000
  }
];

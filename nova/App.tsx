import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Media, Genre } from './types';
import { MOCK_MEDIA } from './constants';
import { PlayIcon, HomeIcon, SearchIcon, HistoryIcon, UserIcon, DownloadIcon } from './components/Icons';
import VideoPlayer from './components/VideoPlayer';
import AdminPanel from './components/AdminPanel';
import { getPersonalizedRecommendations } from './services/geminiService';
import { fetchAds } from './src/services/api';
import { fetchMedia } from './src/services/mediaService';

const MOCK_USER: User = {
  id: 'u1',
  email: 'viewer@rewind.tv',
  name: 'RetroFan99',
  avatar: 'https://picsum.photos/seed/avatar/200/200',
  watchHistory: ['m1', 'm3'],
  preferences: { theme: 'dark', language: 'en' }
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-zinc-100 overflow-hidden">
      <nav className="w-20 md:w-64 border-r border-zinc-800 flex flex-col items-center md:items-stretch p-4 gap-8 bg-[#0a0a0c]">
        <Link to="/" className="flex items-center gap-3 px-2 md:px-4 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-display font-bold text-xl text-white shadow-lg shadow-indigo-600/20">R</div>
          <span className="hidden md:block font-display font-bold text-2xl tracking-tight">REWIND</span>
        </Link>

        <div className="flex flex-col gap-2">
          <SidebarItem icon={<HomeIcon />} label="Home" to="/" active={location.pathname === '/'} />
          <SidebarItem icon={<SearchIcon />} label="Browse" to="/browse" active={location.pathname === '/browse'} />
          <SidebarItem icon={<HistoryIcon />} label="History" to="/history" active={location.pathname === '/history'} />
          <SidebarItem icon={<DownloadIcon />} label="Offline" to="/downloads" active={location.pathname === '/downloads'} />
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-zinc-800 pt-8">
          <SidebarItem icon={<UserIcon />} label="Profile" to="/profile" active={location.pathname === '/profile'} />
          <SidebarItem icon={<SettingsIcon />} label="Admin" to="/admin" active={location.pathname === '/admin'} />
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
    </div>
  );
};

const SettingsIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
);

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, to: string, active?: boolean }> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50'}`}>
    {icon}
    <span className="hidden md:block font-medium">{label}</span>
  </Link>
);

const MovieCard: React.FC<{ media: Media, onPlay: (m: Media) => void }> = ({ media, onPlay }) => (
  <div className="flex-shrink-0 w-64 group relative cursor-pointer" onClick={() => onPlay(media)}>
    <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800 group-hover:border-indigo-500/50 transition-all duration-300 shadow-xl group-hover:shadow-indigo-500/10">
      <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
        <div className="flex-1">
          <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">{media.title}</h4>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{media.year} • {media.genre}</p>
        </div>
        <div className="p-2 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
          <PlayIcon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  </div>
);

const Home: React.FC<{ onPlay: (m: Media) => void }> = ({ onPlay }) => {
  const [recs, setRecs] = useState<Media[]>([]);
  const [catalog, setCatalog] = useState<Media[]>(MOCK_MEDIA);
  const [adBanner, setAdBanner] = useState<any | null>(null);

  useEffect(() => {
    getPersonalizedRecommendations(MOCK_USER.watchHistory).then(setRecs);

    fetchMedia()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setCatalog(items);
        }
      })
      .catch((err) => {
        console.error('Failed to load media, using local fallback:', err);
      });

    fetchAds()
      .then((ads) => {
        if (Array.isArray(ads) && ads.length > 0) {
          setAdBanner(ads[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load ads:', err);
      });
  }, []);

  const featured = catalog.find((m) => m.isFeatured) || catalog[0];

  if (!featured) {
    return <div className="p-8 text-zinc-400">No media available yet. Add media from backend.</div>;
  }

  return (
    <div className="p-8 space-y-12">
      <section className="relative h-[60vh] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group">
        <img src={featured.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-10000" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/40 p-12 flex flex-col justify-end">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-600/30">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Featured Classic
          </div>
          <h1 className="text-6xl font-display font-bold text-white mb-4 drop-shadow-lg">{featured.title}</h1>
          <p className="text-xl text-zinc-300 max-w-2xl mb-8 leading-relaxed line-clamp-2">{featured.description}</p>
          <div className="flex gap-4">
            <button onClick={() => onPlay(featured)} className="px-8 py-4 bg-white text-black font-bold rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl">
              <PlayIcon className="w-5 h-5" />
              Watch Now
            </button>
            <button className="px-8 py-4 bg-zinc-800/80 text-white font-bold rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors">
              Details
            </button>
          </div>
        </div>
      </section>

      <MediaRow title="Trending Throwbacks" items={catalog} onPlay={onPlay} />

      {recs.length > 0 && (
        <MediaRow title={`Because you watched ${catalog.find(m => m.id === MOCK_USER.watchHistory[0])?.title || 'classics'}`} items={recs} onPlay={onPlay} />
      )}

      {adBanner && (
        <section className="py-8">
          <div className="block relative h-24 rounded-xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5 group">
            <video src={adBanner.media_url} className="w-full h-full object-cover opacity-60" autoPlay muted loop />
            <div className="absolute inset-0 flex items-center justify-between px-12 bg-indigo-900/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Sponsored</span>
                <span className="text-xl font-display font-bold text-white">{adBanner.title}</span>
              </div>
              <div className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm">Learn More</div>
            </div>
          </div>
        </section>
      )}

      <MediaRow title="Original Sitcoms" items={catalog.filter((m) => m.genre === Genre.SITCOM)} onPlay={onPlay} />
      <MediaRow title="Sci-Fi Anthology" items={catalog.filter((m) => m.genre === Genre.SCI_FI)} onPlay={onPlay} />
    </div>
  );
};

const MediaRow: React.FC<{ title: string, items: Media[], onPlay: (m: Media) => void }> = ({ title, items, onPlay }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-2">
      <h2 className="text-xl font-display font-bold uppercase tracking-wider text-zinc-400">{title}</h2>
      <button className="text-sm font-bold text-indigo-500 hover:text-indigo-400">View All</button>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-2">
      {items.map((m) => (
        <MovieCard key={m.id} media={m} onPlay={onPlay} />
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeMedia, setActiveMedia] = useState<Media | null>(null);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home onPlay={setActiveMedia} />} />
          <Route path="/admin" element={<div className="p-8"><AdminPanel /></div>} />
          <Route path="/profile" element={
            <div className="p-12 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-600 mb-6 shadow-2xl shadow-indigo-600/30">
                <img src={MOCK_USER.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">{MOCK_USER.name}</h2>
              <p className="text-zinc-500 mb-8">{MOCK_USER.email}</p>

              <div className="w-full max-w-md space-y-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Theme</span>
                  <span className="font-bold text-indigo-500 capitalize">{MOCK_USER.preferences.theme}</span>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Content Language</span>
                  <span className="font-bold">English (US)</span>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Auto-Play Next</span>
                  <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="*" element={<div className="p-12 text-center text-zinc-500 uppercase tracking-widest font-bold">Page coming soon in v1.2</div>} />
        </Routes>
      </Layout>

      {activeMedia && (
        <VideoPlayer media={activeMedia} onClose={() => setActiveMedia(null)} />
      )}
    </Router>
  );
};

export default App;

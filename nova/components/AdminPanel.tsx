
import React, { useState } from 'react';
import { MOCK_CAMPAIGNS, MOCK_ADS } from '../constants';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics'>('campaigns');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex border-b border-zinc-800">
        <button 
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'campaigns' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          Campaigns
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          Analytics
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'campaigns' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">Active Ad Campaigns</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500">+ New Campaign</button>
            </div>
            
            <div className="space-y-4">
              {MOCK_CAMPAIGNS.map(c => (
                <div key={c.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/30">Active</span>
                    </div>
                    <p className="text-zinc-500 text-sm">Ends: {c.endDate} • {c.totalImpressions.toLocaleString()} / {c.maxImpressions.toLocaleString()} views</p>
                  </div>
                  <div className="w-48 h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${(c.totalImpressions / c.maxImpressions) * 100}%` }} />
                  </div>
                  <button className="text-zinc-400 hover:text-white">
                    <SettingsIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-display font-bold mb-8">Platform Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Active Users', value: '42,901', delta: '+12%' },
                { label: 'Avg Watch Time', value: '1h 24m', delta: '+5%' },
                { label: 'Ad Revenue (Sim)', value: '$12,402', delta: '+21%' }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-zinc-800 rounded-xl border border-zinc-700">
                  <p className="text-zinc-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-display font-bold">{stat.value}</p>
                  <span className="text-xs font-bold text-green-400">{stat.delta} this month</span>
                </div>
              ))}
            </div>
            
            <div className="h-48 bg-zinc-950 rounded-xl border border-zinc-800 flex items-end justify-between p-6 gap-2">
              {[40, 60, 45, 90, 80, 55, 70, 65, 85, 95, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-600/40 rounded-t hover:bg-indigo-500 transition-all cursor-help" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="text-center text-zinc-600 text-xs mt-4 uppercase tracking-widest font-bold">Watch Time Heatmap (Last 12 Hours)</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Re-using icon for admin
const SettingsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
);

export default AdminPanel;

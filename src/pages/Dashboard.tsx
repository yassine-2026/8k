import { Clock, Image as ImageIcon, Video, Trash2, RotateCw, Server, Activity, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ProviderStats {
  name: string;
  successCount: number;
  failureCount: number;
  lastUsed: string | null;
  status: 'active' | 'inactive';
}

export default function Dashboard() {
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        if (data.providers) {
          setProviderStats(data.providers);
        }
      })
      .catch(err => console.error("Failed to fetch stats:", err))
      .finally(() => setLoadingStats(false));
  }, []);

  // Demo data to represent user's recent history
  const recentFiles = [
    { id: 1, name: "portrait_low_res.jpg", type: "image", date: "2 mins ago", status: "Completed", size: "2.4 MB" },
    { id: 2, name: "drone_footage_720p.mp4", type: "video", date: "1 hour ago", status: "Completed", size: "45.1 MB" },
    { id: 3, name: "old_family_photo.png", type: "image", date: "Yesterday", status: "Completed", size: "1.1 MB" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, User</h1>
        <p className="text-white/60">Manage your enhanced files and view your usage statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Images Enhanced</p>
              <h3 className="text-2xl font-bold text-white mt-1">128</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Videos Enhanced</p>
              <h3 className="text-2xl font-bold text-white mt-1">12</h3>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl border border-green-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Time Saved</p>
              <h3 className="text-2xl font-bold text-white mt-1">14h 20m</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden mb-12">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">AI Provider Health</h2>
          </div>
          {loadingStats && <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Provider</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Success</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Failed</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {providerStats.map((provider, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-white font-medium">{provider.name}</td>
                  <td className="p-4">
                    {provider.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Inactive / Missing Key
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      {provider.successCount}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-4 h-4" />
                      {provider.failureCount}
                    </div>
                  </td>
                  <td className="p-4 text-white/60 text-sm">
                    {provider.lastUsed ? new Date(provider.lastUsed).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
              {providerStats.length === 0 && !loadingStats && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">No provider data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Operations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">File Name</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentFiles.map((file) => (
                <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {file.type === "image" ? <ImageIcon className="w-4 h-4 text-white/40" /> : <Video className="w-4 h-4 text-white/40" />}
                      <span className="text-white font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 capitalize">{file.type}</td>
                  <td className="p-4 text-white/60">{file.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      {file.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/60">{file.size}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Re-enhance">
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

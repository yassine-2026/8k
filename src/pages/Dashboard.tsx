import { Clock, Image as ImageIcon, Video, Trash2, RotateCw } from "lucide-react";

export default function Dashboard() {
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-white/60 font-medium">Images Enhanced</p>
              <h3 className="text-2xl font-bold text-white">128</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-white/60 font-medium">Videos Enhanced</p>
              <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-white/60 font-medium">Processing Time Saved</p>
              <h3 className="text-2xl font-bold text-white">14h 20m</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Operations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-sm font-medium text-white/60">File Name</th>
                <th className="p-4 text-sm font-medium text-white/60">Type</th>
                <th className="p-4 text-sm font-medium text-white/60">Date</th>
                <th className="p-4 text-sm font-medium text-white/60">Status</th>
                <th className="p-4 text-sm font-medium text-white/60">Size</th>
                <th className="p-4 text-sm font-medium text-white/60 text-right">Actions</th>
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

import { useState, useEffect } from 'react';
import { fileTree, apiEndpoints, features, FileNode } from './data/fileContents';
import CodeEditor from './components/CodeEditor';

function FloatingParticle({ delay, size, x }: { delay: number; size: number; x: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-20px',
        background: `radial-gradient(circle, rgba(139,92,246,0.3), transparent)`,
        animation: `floatUp ${8 + Math.random() * 6}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function FileTreeItem({
  node,
  depth = 0,
  onFileClick,
}: {
  node: FileNode;
  depth?: number;
  onFileClick: (node: FileNode) => void;
}) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const [hovered, setHovered] = useState(false);

  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('Controller.java')) return '🎮';
    if (name.endsWith('Service.java')) return '⚙️';
    if (name.endsWith('Repository.java')) return '🗃️';
    if (name.includes('Request') || name.includes('Response')) return '📨';
    if (name.endsWith('Config.java') || name.endsWith('SecurityConfig.java')) return '🔧';
    if (name.endsWith('Handler.java')) return '🛡️';
    if (name.endsWith('Application.java')) return '🚀';
    if (name.endsWith('.java')) return '☕';
    if (name.endsWith('.xml')) return '📄';
    if (name.endsWith('.yml')) return '⚙️';
    return '📁';
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg transition-all duration-200 group ${
          hovered ? 'bg-white/10' : 'hover:bg-white/5'
        } ${node.name === 'OrderResponse.java' ? 'ring-1 ring-amber-500/30 bg-amber-500/5' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {isFolder ? (
          <span
            className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          >
            ▶
          </span>
        ) : (
          <span className="text-sm">{getFileIcon(node.name)}</span>
        )}

        <span
          className={`text-sm font-mono ${
            isFolder
              ? 'text-blue-300 font-semibold'
              : node.name === 'OrderResponse.java'
              ? 'text-amber-300 font-semibold'
              : 'text-gray-300 group-hover:text-white'
          } transition-colors`}
        >
          {node.name}
        </span>

        {node.badge && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto ${
              node.badge === '⭐ DTO'
                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                : node.badge === 'REST'
                ? 'bg-green-500/20 text-green-300'
                : node.badge === 'Entity'
                ? 'bg-blue-500/20 text-blue-300'
                : node.badge === 'JPA'
                ? 'bg-purple-500/20 text-purple-300'
                : node.badge === 'Service'
                ? 'bg-cyan-500/20 text-cyan-300'
                : node.badge === 'Security'
                ? 'bg-red-500/20 text-red-300'
                : node.badge === 'DTO'
                ? 'bg-pink-500/20 text-pink-300'
                : 'bg-gray-500/20 text-gray-300'
            }`}
          >
            {node.badge}
          </span>
        )}

        {node.name === 'OrderResponse.java' && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold ml-1 animate-bounce">
            CLICK ME
          </span>
        )}
      </div>

      {isFolder && isOpen && node.children && (
        <div
          className="overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          {node.children.map((child, i) => (
            <FileTreeItem
              key={`${child.path}-${i}`}
              node={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApiCard({
  endpoint,
  index,
}: {
  endpoint: (typeof apiEndpoints)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500',
    POST: 'bg-green-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-default ${
        hovered
          ? 'bg-white/10 border-white/20 shadow-lg shadow-purple-500/5 -translate-y-0.5'
          : 'bg-white/[0.02] border-white/5'
      }`}
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-md text-white ${
          methodColors[endpoint.method] || 'bg-gray-500'
        }`}
      >
        {endpoint.method}
      </span>
      <code className="text-sm text-gray-300 font-mono flex-1">{endpoint.path}</code>
      <span className="text-xs text-gray-500 hidden sm:block">{endpoint.desc}</span>
    </div>
  );
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<'explorer' | 'api' | 'features' | 'postman'>('explorer');
  const [loaded, setLoaded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    setLoaded(true);
    setTimeout(() => setHeaderVisible(true), 200);
  }, []);

  const handleFileClick = (node: FileNode) => {
    if (node.content) {
      setSelectedFile(node);
    }
  };

  const tabs = [
    { id: 'explorer' as const, label: '📂 Explorer', desc: 'Browse Files' },
    { id: 'api' as const, label: '🔌 API', desc: 'Endpoints' },
    { id: 'features' as const, label: '✅ Features', desc: 'Checklist' },
    { id: 'postman' as const, label: '🧪 Postman', desc: 'Testing' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #7c3aed, transparent)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #06b6d4, transparent)',
            animation: 'pulse 10s ease-in-out 2s infinite',
          }}
        />
        {[...Array(12)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.8}
            size={4 + Math.random() * 6}
            x={Math.random() * 100}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className={`relative z-10 border-b border-white/5 transition-all duration-1000 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
                  🍕
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a] animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Food Delivery API
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Spring Boot 3.2 • JWT • MySQL • Swagger
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                ✓ Production Ready
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-lg shadow-purple-500/10'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
                style={{
                  animation: loaded ? `fadeInUp 0.4s ease-out ${i * 0.1}s both` : 'none',
                }}
              >
                {tab.label}
                <span className="text-[10px] text-gray-600 hidden sm:block">{tab.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Explorer Tab */}
        {activeTab === 'explorer' && (
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            style={{ animation: 'fadeInUp 0.5s ease-out' }}
          >
            {/* File Tree */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📁</span>
                    <h2 className="text-sm font-semibold text-gray-300">Project Structure</h2>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-500 font-mono">
                    com.foodapp
                  </span>
                </div>
                <div className="p-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {fileTree.map((node, i) => (
                    <FileTreeItem
                      key={`${node.path}-${i}`}
                      node={node}
                      onFileClick={handleFileClick}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              {/* Architecture */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  🏗️ Architecture
                </h3>
                <div className="space-y-2">
                  {[
                    { layer: 'Controller', color: 'from-green-500 to-emerald-600', desc: 'REST API endpoints' },
                    { layer: 'Service', color: 'from-cyan-500 to-blue-600', desc: 'Business logic' },
                    { layer: 'Repository', color: 'from-purple-500 to-indigo-600', desc: 'Data access (JPA)' },
                    { layer: 'Model', color: 'from-pink-500 to-rose-600', desc: 'Entity definitions' },
                  ].map((item, i) => (
                    <div
                      key={item.layer}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/5 transition-colors"
                      style={{ animation: `fadeInRight 0.4s ease-out ${i * 0.1}s both` }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xs font-bold`}>
                        {item.layer[0]}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-300">{item.layer}</div>
                        <div className="text-[10px] text-gray-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <span className="text-xs">↕</span>
                    <span className="text-[10px]">Clean Layered</span>
                  </div>
                </div>
              </div>

              {/* Quick Tip */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  💡 Quick Tip
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Click on <span className="text-amber-300 font-semibold">OrderResponse.java</span> in
                  the file tree to open the code editor and see the API response DTO that powers the
                  order placement endpoint.
                </p>
              </div>

              {/* Tech Stack */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">🧰 Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['Spring Boot 3.2', 'Spring Security', 'JPA/Hibernate', 'MySQL', 'JWT', 'Lombok', 'Swagger', 'Maven'].map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5 hover:border-purple-500/30 hover:text-purple-300 transition-all cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  🔌 REST API Endpoints
                </h2>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-500">
                  {apiEndpoints.length} endpoints
                </span>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {apiEndpoints.map((endpoint, i) => (
                  <ApiCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} index={i} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  ✅ Feature Checklist — 100% Complete
                </h2>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div
                    key={feature.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-300 group"
                    style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm text-gray-300 flex-1">{feature.name}</span>
                    <span className="text-green-500 text-lg group-hover:scale-125 transition-transform">✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Postman Tab */}
        {activeTab === 'postman' && (
          <div className="space-y-4" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            {[
              {
                title: '1. Register User',
                method: 'POST',
                url: 'http://localhost:8080/auth/register',
                body: `{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "password": "123456"
}`,
                response: `{
  "id": 1,
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "role": "USER"
}`,
              },
              {
                title: '2. Login → Get JWT',
                method: 'POST',
                url: 'http://localhost:8080/auth/login',
                body: `{
  "email": "rahul@gmail.com",
  "password": "123456"
}`,
                response: `"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bEBnbWFpbC5jb20iLCJpYXQiOjE3MDk..."`,
              },
              {
                title: '3. Place Order',
                method: 'POST',
                url: 'http://localhost:8080/orders',
                headers: 'Authorization: Bearer <jwt-token>',
                body: `{
  "userId": 1,
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 3, "quantity": 1 }
  ]
}`,
                response: `{
  "orderId": 101,
  "totalAmount": 549.0,
  "status": "PENDING",
  "orderDate": "2024-03-01T10:30:00"
}`,
              },
              {
                title: '4. Mark as Paid',
                method: 'PUT',
                url: 'http://localhost:8080/orders/101/pay',
                body: null,
                response: `{
  "id": 101,
  "totalAmount": 549.0,
  "status": "PAID",
  "orderDate": "2024-03-01T10:30:00"
}`,
              },
            ].map((example, i) => (
              <div
                key={example.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md text-white ${
                      example.method === 'POST' ? 'bg-green-500' : example.method === 'PUT' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                  >
                    {example.method}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-300">{example.title}</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 block">URL</label>
                    <code className="text-xs text-cyan-300 font-mono bg-black/30 px-3 py-1.5 rounded-lg block">
                      {example.url}
                    </code>
                  </div>
                  {example.headers && (
                    <div>
                      <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 block">Headers</label>
                      <code className="text-xs text-yellow-300 font-mono bg-black/30 px-3 py-1.5 rounded-lg block">
                        {example.headers}
                      </code>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {example.body && (
                      <div>
                        <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 block">Request Body</label>
                        <pre className="text-xs text-green-300 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">
                          {example.body}
                        </pre>
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 block">Response</label>
                      <pre className="text-xs text-purple-300 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">
                        {example.response}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍕</span>
              <span className="text-sm text-gray-500">
                Food Delivery API — Built with Spring Boot 3.2
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">Swagger UI: http://localhost:8080/swagger-ui.html</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Code Editor Modal */}
      {selectedFile && selectedFile.content && (
        <CodeEditor
          content={selectedFile.content}
          fileName={selectedFile.name}
          language={selectedFile.language || 'java'}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.15; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.15);
        }
        * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        code, pre, .font-mono {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }
      `}</style>
    </div>
  );
}

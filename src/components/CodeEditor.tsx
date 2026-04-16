import { useState, useEffect, ReactNode } from 'react';

interface CodeEditorProps {
  content: string;
  fileName: string;
  language: string;
  onClose: () => void;
}

function highlightJava(line: string): ReactNode {
  const keywords = [
    'package', 'import', 'public', 'private', 'protected', 'class', 'interface',
    'record', 'extends', 'implements', 'return', 'new', 'final', 'static',
    'void', 'if', 'else', 'for', 'while', 'throw', 'throws', 'try', 'catch',
    'this', 'super', 'abstract', 'default', 'enum', 'boolean', 'int', 'long',
    'double', 'float', 'String', 'true', 'false', 'null',
  ];

  const trimmed = line.trim();
  if (trimmed.startsWith('//')) {
    return <span className="text-gray-500 italic">{line}</span>;
  }

  const parts: ReactNode[] = [];
  let key = 0;

  const tokens = line.split(/(\s+|[{}();<>,.\[\]@"])/);
  
  for (const token of tokens) {
    if (token.startsWith('@')) {
      parts.push(<span key={key++} className="text-yellow-300">{token}</span>);
    } else if (token.startsWith('"') && token.endsWith('"')) {
      parts.push(<span key={key++} className="text-green-300">{token}</span>);
    } else if (keywords.includes(token)) {
      parts.push(<span key={key++} className="text-purple-400 font-semibold">{token}</span>);
    } else if (['List', 'Map', 'Optional', 'Long', 'Integer', 'Double', 'Date', 'LocalDateTime', 'ArrayList', 'HashMap'].includes(token)) {
      parts.push(<span key={key++} className="text-cyan-300">{token}</span>);
    } else if (token.endsWith('Exception') || token.endsWith('Error')) {
      parts.push(<span key={key++} className="text-red-400">{token}</span>);
    } else if (token.match(/^[A-Z][a-zA-Z]*$/)) {
      parts.push(<span key={key++} className="text-teal-300">{token}</span>);
    } else {
      parts.push(<span key={key++} className="text-gray-200">{token}</span>);
    }
  }

  return <>{parts}</>;
}

function highlightXml(line: string): ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith('<!--')) {
    return <span className="text-gray-500 italic">{line}</span>;
  }
  if (trimmed.startsWith('<?')) {
    return <span className="text-gray-400">{line}</span>;
  }
  
  const parts = line.split(/(<\/?[^>]+>)/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('<')) {
          return <span key={i} className="text-blue-400">{part}</span>;
        }
        return <span key={i} className="text-green-300">{part}</span>;
      })}
    </>
  );
}

function highlightYaml(line: string): ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith('#')) {
    return <span className="text-gray-500 italic">{line}</span>;
  }
  
  const colonIndex = line.indexOf(':');
  if (colonIndex > -1) {
    const keyPart = line.substring(0, colonIndex);
    const valuePart = line.substring(colonIndex);
    return (
      <>
        <span className="text-cyan-300">{keyPart}</span>
        <span className="text-gray-200">{valuePart}</span>
      </>
    );
  }
  return <span className="text-gray-200">{line}</span>;
}

export default function CodeEditor({ content, fileName, language, onClose }: CodeEditorProps) {
  const [visible, setVisible] = useState(false);
  const [typedLines, setTypedLines] = useState(0);
  const lines = content.split('\n');

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (typedLines < lines.length) {
      const timer = setTimeout(() => {
        setTypedLines(prev => Math.min(prev + 3, lines.length));
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [typedLines, lines.length]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const highlightLine = (line: string): ReactNode => {
    switch (language) {
      case 'java': return highlightJava(line);
      case 'xml': return highlightXml(line);
      case 'yaml': return highlightYaml(line);
      default: return <span className="text-gray-200">{line}</span>;
    }
  };

  const langIcon = language === 'java' ? '☕' : language === 'xml' ? '📄' : '⚙️';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-500 ${
          visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
        }`}
      >
        <div className="bg-[#1e1e2e] border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors group flex items-center justify-center"
              >
                <span className="text-[8px] opacity-0 group-hover:opacity-100 text-red-900 font-bold">✕</span>
              </button>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-lg">{langIcon}</span>
              <span className="text-sm font-medium text-gray-300 font-mono">{fileName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">{lines.length} lines</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono uppercase">{language}</span>
          </div>
        </div>

        <div className="bg-[#11111b] overflow-auto max-h-[calc(85vh-52px)] custom-scrollbar">
          <pre className="p-0 m-0">
            <code className="font-mono text-sm leading-6 block">
              {lines.slice(0, typedLines).map((line, i) => (
                <div
                  key={i}
                  className="flex hover:bg-white/[0.03] transition-colors group"
                  style={{
                    animation: `fadeSlideIn 0.15s ease-out ${Math.min(i * 0.02, 0.5)}s both`,
                  }}
                >
                  <span className="select-none w-14 text-right pr-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 border-r border-white/5 py-px">
                    {i + 1}
                  </span>
                  <span className="pl-4 py-px flex-1 whitespace-pre">
                    {highlightLine(line)}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}

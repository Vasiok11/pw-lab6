import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ShieldCheck, LogOut, Key, RefreshCw } from 'lucide-react';

const ROLES = [
  {
    value: 'admin',
    label: 'ADMIN',
    description: 'Full CRUD',
    color: 'text-neon-pink',
    border: 'border-neon-pink',
    bg: 'bg-pink-500/10',
  },
  {
    value: 'writer',
    label: 'WRITER',
    description: 'Read + Write',
    color: 'text-yellow-400',
    border: 'border-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    value: 'visitor',
    label: 'VISITOR',
    description: 'Read only',
    color: 'text-green-400',
    border: 'border-green-400',
    bg: 'bg-green-400/10',
  },
];

export default function TokenPanel() {
  const token = useStore((s) => s.token);
  const role = useStore((s) => s.role);
  const username = useStore((s) => s.username);
  const login = useStore((s) => s.login);
  const logout = useStore((s) => s.logout);

  const [selectedRole, setSelectedRole] = useState('visitor');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const getSecondsLeft = (jwt) => {
    if (!jwt) return 0;
    try {
      const { exp } = JSON.parse(atob(jwt.split('.')[1]));
      return Math.max(0, Math.floor(exp - Date.now() / 1000));
    } catch {
      return 0;
    }
  };

  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsLeft(token));

  // Countdown timer — starts from actual JWT expiry, not a hardcoded 60
  useEffect(() => {
    if (!token) return;
    setSecondsLeft(getSecondsLeft(token));
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogin = async () => {
    if (!name.trim()) {
      setError('Username required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(name.trim(), selectedRole);
      setName('');
    } catch {
      setError('Failed — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await login(username, role);
    } catch {
      // silent
    } finally {
      setRefreshing(false);
    }
  };

  if (token && role) {
    const roleConfig = ROLES.find((r) => r.value === role) || ROLES[2];
    const isExpired = secondsLeft === 0;
    return (
      <div className="border border-[var(--border-accent)] p-3 font-mono text-xs">
        <div className={`flex items-center gap-2 mb-2 ${isExpired ? 'text-red-400' : roleConfig.color}`}>
          <ShieldCheck size={13} />
          <span className="font-bold tracking-wider uppercase">
            {isExpired ? 'JWT EXPIRED' : 'JWT Active'}
          </span>
        </div>
        <div className="opacity-60 mb-0.5 truncate">USER: {username}</div>
        <div className={`font-bold uppercase ${roleConfig.color}`}>ROLE: {role}</div>
        <div className={`text-[10px] mt-0.5 font-bold ${isExpired ? 'text-red-400' : 'opacity-40'}`}>
          {isExpired ? 'TOKEN EXPIRED — refresh below' : `expires in ${secondsLeft}s`}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-2 flex items-center gap-2 w-full px-2 py-1 border border-[var(--border-accent)] hover:border-neon-pink hover:text-neon-pink transition-colors uppercase tracking-wider text-[10px] font-bold disabled:opacity-40"
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'REFRESHING...' : 'REFRESH TOKEN'}
        </button>
        <button
          onClick={logout}
          className="mt-1 flex items-center gap-2 w-full px-2 py-1 border border-[var(--border-accent)] hover:border-red-500 hover:text-red-500 transition-colors uppercase tracking-wider text-[10px] font-bold"
        >
          <LogOut size={11} />
          REVOKE TOKEN
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border-accent)] p-3 font-mono text-xs">
      <div className="flex items-center gap-2 mb-3 text-neon-pink">
        <Key size={13} />
        <span className="font-bold tracking-wider uppercase">Get JWT Token</span>
      </div>

      <input
        type="text"
        placeholder="USERNAME"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] px-2 py-1 mb-2 text-[var(--text-primary)] outline-none focus:border-neon-pink placeholder-opacity-40 uppercase text-[10px] tracking-wider"
      />

      <div className="flex flex-col gap-1 mb-3">
        {ROLES.map((r) => (
          <button
            key={r.value}
            onClick={() => setSelectedRole(r.value)}
            className={`flex items-center justify-between px-2 py-1 border transition-colors text-left ${
              selectedRole === r.value
                ? `${r.border} ${r.bg} ${r.color}`
                : 'border-[var(--border-accent)] opacity-50 hover:opacity-90'
            }`}
          >
            <span className="font-bold uppercase">{r.label}</span>
            <span className="opacity-60">{r.description}</span>
          </button>
        ))}
      </div>

      {error && <div className="text-red-400 mb-2 text-[10px]">{error}</div>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full border border-[var(--border-accent)] hover:border-neon-pink hover:text-neon-pink py-1 uppercase tracking-widest font-bold transition-colors disabled:opacity-40 text-[10px]"
      >
        {loading ? 'GENERATING...' : 'GENERATE TOKEN'}
      </button>
    </div>
  );
}

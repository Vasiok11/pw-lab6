import { TriangleAlert } from 'lucide-react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="cyber-panel border-l-[4px] border-l-red-500 p-6 max-w-sm w-full mx-4 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
        <div className="flex items-center gap-3 mb-4">
          <TriangleAlert size={20} className="text-red-500 shrink-0" />
          <h3 className="font-black uppercase tracking-widest text-sm text-red-500">Confirm Delete</h3>
        </div>
        <p className="font-mono text-xs opacity-80 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-[var(--border-accent)] text-xs font-bold uppercase tracking-widest hover:border-[var(--text-primary)] transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-red-500 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

import { X } from 'lucide-react';
export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold text-stone-800">{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

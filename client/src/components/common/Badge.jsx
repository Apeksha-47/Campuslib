const styles = {
  active:    'bg-green-100 text-green-700',
  returned:  'bg-stone-100 text-stone-600',
  overdue:   'bg-red-100 text-red-700',
  available: 'bg-green-100 text-green-700',
  borrowed:  'bg-amber-100 text-amber-700',
  reserved:  'bg-blue-100 text-blue-700',
  paid:      'bg-green-100 text-green-700',
  unpaid:    'bg-red-100 text-red-700',
  admin:     'bg-purple-100 text-purple-700',
  librarian: 'bg-blue-100 text-blue-700',
  student:   'bg-stone-100 text-stone-600',
};
export default function Badge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status] || 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  );
}

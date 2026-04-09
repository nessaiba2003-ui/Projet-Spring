export default function Badge({ label, type = 'info' }) {
  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[type]}`}>
      {label}
    </span>
  );
}
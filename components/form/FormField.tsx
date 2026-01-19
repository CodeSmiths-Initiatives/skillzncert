type Props = {
  label: string;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
};

export function FormField({ label, error, success, children }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div
        className={`rounded-md transition
          ${
            error
              ? "ring-1 ring-red-500"
              : success
              ? "ring-1 ring-green-500"
              : "ring-1 ring-gray-300"
          }`}
      >
        {children}
      </div>

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}

      {!error && success && (
        <p className="text-xs text-green-600">Looks good ✓</p>
      )}
    </div>
  );
}

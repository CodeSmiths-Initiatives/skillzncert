function Steps({
  label,
  step,
  status,
}: {
  label: string;
  step: string;
  status: "done" | "pending";
}) {
  return (
    <li className="flex items-center justify-between border-b pb-2">
      <span>{label}</span>
      <span
        className={
          status === "done"
            ? "text-green-600 font-semibold"
            : "text-red-500 font-semibold"
        }
      >
        {step}
      </span>
    </li>
  );
}
export { Steps };

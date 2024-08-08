export default function Spinner() {
  return (
    <svg
      className="flex h-full items-center justify-center"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="origin-center animate-spin"
        cx="100"
        cy="100"
        fill="none"
        r="90"
        strokeWidth="10"
        stroke="#7C3AED"
        strokeDasharray="477 1400"
        strokeLinecap="round"
        strokeDashoffset="0"
      />
    </svg>
  );
}

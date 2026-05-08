"use client";

export default function LiveTacticalLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-[-20%] top-1/3 h-px w-[140%] animate-[scan_8s_linear_infinite] bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        <div className="absolute left-1/4 top-0 h-full w-px animate-[scanY_11s_linear_infinite] bg-gradient-to-b from-transparent via-emerald-300 to-transparent" />
      </div>

      <div className="absolute left-[18%] top-[28%] h-2 w-2 animate-pulse rounded-full bg-blue-300 shadow-[0_0_18px_rgba(0,229,255,.8)]" />
      <div className="absolute right-[22%] top-[42%] h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.8)]" />
      <div className="absolute bottom-[24%] left-[42%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-200 shadow-[0_0_14px_rgba(0,229,255,.7)]" />

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-220px);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(520px);
            opacity: 0;
          }
        }

        @keyframes scanY {
          0% {
            transform: translateX(-320px);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(520px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
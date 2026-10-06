import Image from "next/image";

export default function LoadingSpinner({ fullScreen = true, label = "Loading" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center bg-[#fdf7f2] text-[#1c1109] ${
        fullScreen ? "fixed inset-0 z-[100] h-screen w-screen" : "min-h-[42vh] w-full py-16"
      }`}
    >
      <style>{`
        @keyframes logoFade {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes barSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        <div className="w-40 sm:w-48" style={{ animation: "logoFade 2.4s ease-in-out infinite" }}>
          <Image
            src="/navbar-logo.png"
            alt="Zaylune"
            width={160}
            height={100}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div className="relative h-px w-32 overflow-hidden bg-[#a8451a]/15">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#c04a1c] to-transparent"
            style={{ animation: "barSlide 1.6s ease-in-out infinite" }}
          />
        </div>

        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

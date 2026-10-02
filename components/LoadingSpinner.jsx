import Image from "next/image";

export default function LoadingSpinner({ fullScreen = true, label = "Loading" }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#0b0a0a] ${
        fullScreen ? "min-h-screen" : "min-h-[40vh] py-20"
      }`}
    >
      {/* Deep ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/8 blur-[80px]" />
      </div>

      {/* Spinner rings */}
      <div className="relative flex h-28 w-28 sm:h-44 sm:w-44 items-center justify-center">

        {/* Outermost slow ring */}
        <span
          className="absolute inset-0 rounded-full border border-gold-400/8 animate-spin"
          style={{ animationDuration: "8s" }}
        />

        {/* Middle dashed-style ring */}
        <span
          className="absolute inset-2 rounded-full border border-dashed border-gold-400/15 animate-spin"
          style={{ animationDuration: "5s", animationDirection: "reverse" }}
        />

        {/* Main spinning arc */}
        <span
          className="absolute inset-4 rounded-full border-2 border-transparent border-t-gold-300 border-r-gold-400/50 animate-spin"
          style={{ animationDuration: "1.2s" }}
        />

        {/* Inner static ring */}
        <span className="absolute inset-4 rounded-full border border-gold-400/10" />

        {/* Pulsing core glow */}
        <span
          className="absolute h-12 w-12 sm:h-18 sm:w-18 rounded-full bg-gold-400/15 blur-2xl animate-pulse"
          style={{ animationDuration: "2s" }}
        />

        {/* Logo — large, no circle clip */}
        <div className="relative w-16 sm:w-28 animate-floatSlow z-10">
          <Image
            src="/navbar-logo.png"
            alt="Zaylune"
            width={144}
            height={90}
            className="h-auto w-full object-contain drop-shadow-[0_0_16px_rgba(212,163,89,0.45)]"
            priority
          />
        </div>
      </div>

      {/* Label with shimmer dots */}
      <div className="relative mt-6 sm:mt-10 flex flex-col items-center gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-300/60 animate-pulse">
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-gold-400/50 animate-pulse"
              style={{ animationDelay: `${i * 0.25}s`, animationDuration: "1.2s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

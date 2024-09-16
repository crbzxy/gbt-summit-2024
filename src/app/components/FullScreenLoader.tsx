// components/FullScreenLoader.tsx

export default function FullScreenLoader() {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-gradient-to-tr from-[#006ecf3b] via-[#00175a48] to-[#006ecf42] z-[9999]">
        <div className="w-16 h-16 border-8 border-t-white border-white/30 rounded-full animate-spin"></div>
      </div>
    );
  }
  
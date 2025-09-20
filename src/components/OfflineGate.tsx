import { useEffect, useState, ReactNode } from "react";

export default function OfflineGate({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return <>{children}</>;

  // Block the app & show a full-screen message when offline
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-2xl font-semibold">No Internet Connection</div>
        <p className="text-gray-600">
          You’re offline. Please reconnect to use the app.  
          Any changes made while offline won’t be saved.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

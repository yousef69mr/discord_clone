import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <Loader2
        size="5em"
        className="text-indigo-500 animate-spin repeat-infinite"
      />
    </div>
  );
}

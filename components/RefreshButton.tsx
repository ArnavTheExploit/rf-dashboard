import React from "react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type Props = { loading: boolean; onClick: () => void };

export default function RefreshButton({ loading, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white/90 p-2 rounded-md shadow text-sm hover:bg-white"
    >
      <ArrowsRightLeftIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
      <span>{loading ? "Refreshing..." : "Refresh"}</span>
    </button>
  );
}

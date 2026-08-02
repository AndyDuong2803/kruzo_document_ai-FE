import PreviousResults from "@/components/history/PreviousResults";
import { Suspense } from "react";

export const metadata = {
  title: "History | Kruzo Document AI",
  description: "Open and download your saved document processing results.",
};

export default function ResultsPage() {
  return <Suspense fallback={<div className="px-5 pb-16 pt-28 text-center text-muted">Loading previous results…</div>}><PreviousResults /></Suspense>;
}

import ExcelDemoWorkspace from "@/components/demo/ExcelDemoWorkspace";
import { documentPresets, type DocumentPresetId } from "@/config/document-presets";

export const metadata = {
  title: "Process Documents | Kruzo Document AI",
  description: "Choose a document type, add your files, and download structured Excel results.",
};

export default function UploadPage({
  searchParams,
}: {
  searchParams?: { preset?: string | string[] };
}) {
  const rawPreset = Array.isArray(searchParams?.preset) ? searchParams?.preset[0] : searchParams?.preset;
  const initialPresetId = documentPresets.some((preset) => preset.id === rawPreset)
    ? rawPreset as DocumentPresetId
    : undefined;
  return <ExcelDemoWorkspace initialPresetId={initialPresetId} />;
}

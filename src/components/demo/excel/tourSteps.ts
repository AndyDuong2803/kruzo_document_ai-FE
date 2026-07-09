import type { TourStep } from "./types";

export const tourSteps: TourStep[] = [
  {
    target: "upload",
    title: "Add documents",
    description: "Choose one or more files, or drag files into the upload area.",
  },
  {
    target: "fileList",
    title: "Review selected documents",
    description: "Remove anything you do not want to process.",
  },
  {
    target: "submit",
    title: "Submit files",
    description: "Kruzo sends the selected files with the active extraction template.",
  },
  {
    target: "settings",
    title: "Choose a template",
    description: "Pick a preset or define custom fields before submitting documents.",
  },
  {
    target: "history",
    title: "Check history",
    description: "Track each file status and open results from here.",
  },
  {
    target: "modalPreview",
    title: "View and download",
    description: "Open a result in a modal and download CSV when it is ready.",
  },
];

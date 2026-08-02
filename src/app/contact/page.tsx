import { FiArrowUpRight, FiCheck } from "react-icons/fi";

import Container from "@/components/Container";
import { telegramContactUrl, telegramCreditsUrl, telegramHigherLimitUrl } from "@/data/product";

export const metadata = {
  title: "Contact | Kruzo Document AI",
  description: "Tell Kruzo what documents and Excel output your business needs.",
};

export default function ContactPage() {
  return (
    <section className="px-5 pb-16 pt-28">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold md:text-4xl">Tell us what you need</h1>
          <p className="mt-4 max-w-xl leading-7 text-muted">
            Send us a sample document or spreadsheet. We’ll help you choose the information to collect and arrange the Excel output.
          </p>
          <ul className="mt-7 grid gap-3 border-y border-border py-6">
            {[
              "What type of documents do you process?",
              "Which information do you need?",
              "What should the final Excel file look like?",
            ].map((prompt) => (
              <li key={prompt} className="flex gap-3 text-sm font-medium">
                <FiCheck className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                {prompt}
              </li>
            ))}
          </ul>
          <a href={telegramContactUrl} target="_blank" rel="noreferrer" className="brand-button brand-button-primary mt-7 gap-2 px-5 py-3">
            Chat on Telegram
            <FiArrowUpRight aria-hidden="true" />
          </a>
          <div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm">
            <p className="font-semibold">Account help</p>
            <a href={telegramCreditsUrl} target="_blank" rel="noreferrer" className="nav-link">Buy more document credits</a>
            <a href={telegramHigherLimitUrl} target="_blank" rel="noreferrer" className="nav-link">Process more files in each run</a>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

import { faqs } from "@/data/faq";

const FAQ: React.FC = () => (
  <section id="faq" className="section-anchor border-t border-border py-12 md:py-16">
    <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
      <div>
        <h2 className="text-2xl font-semibold md:text-3xl">Questions</h2>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <Disclosure key={faq.question}>
            {({ open }) => (
              <div>
                <DisclosureButton className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold">
                  {faq.question}
                  <FiChevronDown className={open ? "rotate-180" : ""} aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel className="pb-4 pr-8 text-sm leading-6 text-muted">
                  {faq.answer}
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;

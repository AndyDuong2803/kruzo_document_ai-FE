import Link from "next/link";

import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { createMetadata, seoRoutes } from "@/lib/seo";

export const metadata = createMetadata(seoRoutes.terms);

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    content: <><p>These Terms of Use (&quot;Terms&quot;) govern access to Kruzo Document AI, including its website, account features, document-processing tools, and API (together, the &quot;Service&quot;). By creating an account or using the Service, you agree to these Terms and acknowledge our <Link href="/privacy">Privacy Policy</Link>. If you use the Service for an organization, you confirm that you have authority to bind that organization.</p><p>When you create an account or accept updated terms, we may record the acceptance time and the policy versions presented to you. The acceptance box is not selected in advance, and the linked documents remain available for review before you continue.</p></>,
  },
  {
    id: "eligibility",
    title: "Eligibility and accounts",
    content: <><p>You must be at least 18 years old and legally able to enter into these Terms.</p><p>Provide accurate account information and keep your password, access token, and API keys confidential. You are responsible for activity performed through your account and for promptly reporting suspected unauthorized access. You may not share an account in a way that defeats security, credit, or usage controls.</p></>,
  },
  {
    id: "service",
    title: "The Service",
    content: <p>Kruzo uses automated document processing and third-party AI models to extract requested information from supported files and return structured data or spreadsheet-ready results. Features, supported file types, limits, models, and availability may change as the Service develops. API documentation and interface guidance form part of the operating instructions for the Service.</p>,
  },
  {
    id: "your-content",
    title: "Your documents and instructions",
    content: <><p>You retain ownership of documents, schemas, corrections, and other material you submit (&quot;Your Content&quot;). You grant Kruzo a limited, non-exclusive right to host, transmit, transform, and process Your Content only as needed to provide, secure, support, and legally operate the Service.</p><p>You represent that you have all rights and permissions needed to submit Your Content, including personal, confidential, copyrighted, or regulated information. Do not submit material when processing it through Kruzo or its AI providers would violate law, contract, confidentiality, or another person&apos;s rights.</p></>,
  },
  {
    id: "outputs",
    title: "AI-generated results",
    content: <><p>Extraction results are generated automatically and may be incomplete, inaccurate, duplicated, or formatted incorrectly. You must review results before relying on them or using them in accounting, legal, medical, compliance, safety-critical, or other consequential workflows.</p><p>Kruzo does not provide legal, tax, accounting, medical, or other professional advice. You are responsible for decisions, records, exports, and downstream actions based on the results.</p></>,
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: <><p>You must not use the Service to:</p><ul><li>break applicable law or violate privacy, intellectual-property, confidentiality, or contractual rights;</li><li>upload malware, exploit vulnerabilities, bypass authentication, probe infrastructure, or disrupt the Service;</li><li>evade credit, file-size, rate, account, or access restrictions;</li><li>use another person&apos;s account, token, or API key without authorization;</li><li>process content intended to facilitate fraud, identity theft, abuse, or other harmful conduct; or</li><li>resell or provide access to the Service in a misleading way or without written permission.</li></ul><p>We may investigate suspected misuse and limit access where reasonably necessary to protect the Service or others.</p></>,
  },
  {
    id: "api",
    title: "API use",
    content: <p>API keys are credentials tied to your account. Store them securely, do not expose them in public client-side code, and revoke them if compromised. You must follow published request formats and reasonable rate or usage limits. We may change or retire API behavior with reasonable notice where practicable, but urgent security or reliability changes may take effect immediately.</p>,
  },
  {
    id: "credits",
    title: "Credits and purchases",
    content: <><p>Credits are usage units for the Service, not money, stored value, or a transferable financial instrument. The product interface describes when a processing attempt consumes or refunds a credit. Promotional or starting credits may expire or change for future accounts.</p><p>Any price, quantity, payment method, refund eligibility, tax, or expiry term for purchased credits will be disclosed when the purchase is arranged. Except where required by law or expressly agreed at purchase, consumed credits are not refundable. Contact us promptly if you believe credits were charged incorrectly.</p></>,
  },
  {
    id: "intellectual-property",
    title: "Kruzo intellectual property",
    content: <p>The Service, including its software, design, documentation, branding, and original content, is owned by Kruzo or its licensors and is protected by applicable law. These Terms grant you a limited, revocable, non-exclusive, non-transferable right to use the Service for its intended purpose. They do not transfer ownership of the Service or permit copying, reverse engineering, or creation of competing services except where such restrictions are prohibited by law.</p>,
  },
  {
    id: "third-parties",
    title: "Third-party services",
    content: <p>The Service relies on third parties, including Google for optional sign-in, OpenRouter and model providers for AI inference, and infrastructure providers. Their services and data practices are governed by their own terms. Kruzo is not responsible for a third party&apos;s independent systems, acts, or availability, but we select and use providers as reasonably necessary to operate the Service.</p>,
  },
  {
    id: "availability",
    title: "Availability and changes",
    content: <p>We aim to keep the Service available but do not guarantee uninterrupted or error-free operation. Maintenance, provider outages, security incidents, capacity, or events outside our control may affect access. We may modify, suspend, or discontinue features and will try to provide reasonable notice when a change materially affects normal use.</p>,
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    content: <p>You may stop using the Service at any time. We may suspend or terminate access when reasonably necessary because of a material breach, unlawful or harmful use, security risk, unpaid obligation, or legal requirement. Where appropriate, we will provide notice and an opportunity to resolve the issue. Provisions that by their nature should survive termination will remain effective.</p>,
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: <p>To the maximum extent permitted by law, the Service is provided &quot;as is&quot; and &quot;as available.&quot; Kruzo disclaims implied warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy. Nothing in these Terms excludes warranties or consumer rights that cannot lawfully be excluded.</p>,
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: <p>To the maximum extent permitted by law, Kruzo will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, business, data, goodwill, or opportunities arising from use of the Service. Kruzo&apos;s aggregate liability for claims relating to the Service will not exceed the amount you paid Kruzo for the Service during the six months before the event giving rise to the claim. These limits do not apply where liability cannot lawfully be limited.</p>,
  },
  {
    id: "disputes",
    title: "Disputes and applicable law",
    content: <p>Please contact us first so we can try to resolve a concern informally. These Terms are governed by applicable law, without limiting mandatory rights you may have under the laws where you live. If a concern cannot be resolved informally, it may be brought before a court with lawful jurisdiction.</p>,
  },
  {
    id: "changes-and-contact",
    title: "Changes and contact",
    content: <><p>We may update these Terms to reflect product, provider, or legal changes. Revised Terms apply from the date posted above. If a change materially affects existing users, we will provide additional notice when reasonably practicable. Continued use after the effective date means you accept the revised Terms.</p><p>Questions about these Terms can be submitted through our <Link href="/contact">Contact page</Link>.</p></>,
  },
];

export default function TermsOfUsePage() {
  return <LegalDocument eyebrow="Legal" title="Terms of Use" summary="These terms set the rules for using Kruzo Document AI, including accounts, document processing, API access, credits, and AI-generated results." updatedAt="August 5, 2026" sections={sections} />;
}

import Link from "next/link";

import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { createMetadata, seoRoutes } from "@/lib/seo";

export const metadata = createMetadata(seoRoutes.privacy);

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Scope and who we are",
    content: <><p>This Privacy Policy explains how Kruzo Service (&quot;Kruzo,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) handles personal information when you use Kruzo Document AI, including its website, account features, document-processing tools, and API (together, the &quot;Service&quot;).</p><p>Kruzo determines how personal information is used to operate the Service. If you use Kruzo for an organization, that organization may separately control the information contained in the documents it submits.</p></>,
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: <><p>We collect information needed to provide and secure the Service:</p><ul><li><strong>Account information:</strong> email address and a hashed password. If you use Google Sign-In, we may receive your Google account identifier, email address, name, and profile image.</li><li><strong>Document and extraction information:</strong> files you submit for processing, file name, file type and size, requested fields or schema, extracted results, corrections, and export preferences.</li><li><strong>Usage and account records:</strong> credit balance and transactions, monthly usage, request identifiers, API key name and non-secret identifying details, processing status, model used, provider attempts, token counts, and cost metadata.</li><li><strong>Communications:</strong> information you choose to provide when you contact us for support, workflow advice, or credit purchases.</li><li><strong>Browser storage:</strong> the website uses local storage to keep your session token and theme preference. Google Sign-In may use Google-controlled cookies or browser storage under Google&apos;s policies.</li></ul><p>Please do not submit information that you are not authorized to process.</p></>,
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    content: <><p>We use information to:</p><ul><li>create and authenticate accounts;</li><li>process documents and produce structured data or spreadsheet exports;</li><li>maintain extraction history, API keys, credits, and usage limits;</li><li>provide support and respond to requests;</li><li>prevent fraud, abuse, unauthorized access, and technical failures;</li><li>monitor reliability, troubleshoot errors, and improve the Service; and</li><li>comply with legal obligations and enforce our <Link href="/terms">Terms of Use</Link>.</li></ul><p>Depending on applicable law, these activities are based on performing our agreement with you, our legitimate interests in operating and protecting the Service, your consent where requested, or compliance with law.</p></>,
  },
  {
    id: "document-processing",
    title: "Document processing and AI providers",
    content: <><p>To produce an extraction, Kruzo transmits the submitted file content and requested output structure to an AI inference provider. The current service routes these requests through OpenRouter and a selected model provider. Those providers process the material under their own terms and data practices. You can review <a href="https://openrouter.ai/privacy" target="_blank" rel="noreferrer">OpenRouter&apos;s Privacy Policy</a> for more information.</p><p>Kruzo does not use submitted documents to train a Kruzo-owned AI model. Uploaded file bytes are processed for the request and are not retained by Kruzo as stored files after processing. When history features apply, we may retain the original file name, technical metadata, requested schema, extracted result, corrections, status, and error details. Provider retention or training practices may vary, so avoid submitting highly sensitive information unless you have assessed the provider terms and have authority to do so.</p></>,
  },
  {
    id: "sharing",
    title: "How information is shared",
    content: <><p>We disclose information only as reasonably necessary for the following purposes:</p><ul><li><strong>Authentication:</strong> Google supports optional Google Sign-In.</li><li><strong>AI processing:</strong> OpenRouter and model providers receive document inputs needed to return extraction results.</li><li><strong>Infrastructure:</strong> hosting, database, networking, security, and support providers process information for us.</li><li><strong>Legal and safety:</strong> we may disclose information when required by law or reasonably necessary to protect users, the public, or the Service.</li><li><strong>Business changes:</strong> information may transfer as part of a merger, financing, acquisition, reorganization, or sale of assets, subject to applicable safeguards.</li></ul><p>We do not sell personal information or document content.</p></>,
  },
  {
    id: "retention",
    title: "Retention and deletion",
    content: <><p>We retain account, credit, API key, extraction-history, and operational records while needed to provide the Service, maintain security and financial records, resolve disputes, and meet legal obligations. Retention depends on the record type and why it is needed; we do not promise a fixed period where the product does not currently enforce one.</p><p>Uploaded file bytes are not retained by Kruzo as stored files after the processing request. Deleting an account or revoking Google access does not automatically delete information already held by separate third-party providers. You may request account or data deletion through our <Link href="/contact">Contact page</Link>; we may verify your identity and retain limited records where legally required.</p></>,
  },
  {
    id: "security",
    title: "Security",
    content: <p>We use measures designed to protect information, including hashed passwords, hashed API keys, authenticated access, scoped account records, and encrypted network transport. No internet service can guarantee absolute security. Keep your password, access token, and API keys confidential, and notify us if you suspect unauthorized access.</p>,
  },
  {
    id: "rights",
    title: "Your choices and privacy rights",
    content: <><p>Depending on where you live, you may have rights to request access, correction, deletion, restriction, objection, or portability of personal information, and to withdraw consent where processing relies on consent. You may also review or remove Kruzo&apos;s access in your <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer">Google Account connections</a>.</p><p>Submit a request through our <Link href="/contact">Contact page</Link>. We may ask for information needed to verify that the request relates to your account. You may also have the right to complain to your local data-protection authority.</p></>,
  },
  {
    id: "international-transfers",
    title: "International processing",
    content: <p>Kruzo and its providers may process information in countries other than your own. Where required, we rely on lawful transfer mechanisms and provider safeguards. Privacy protections may differ between jurisdictions.</p>,
  },
  {
    id: "children",
    title: "Children",
    content: <p>The Service is intended for business users and is not directed to children under 18. Do not create an account or submit a child&apos;s personal information unless you are legally authorized to do so. Contact us if you believe a child has provided information without appropriate authorization.</p>,
  },
  {
    id: "changes-and-contact",
    title: "Changes and contact",
    content: <><p>We may update this policy as the Service or legal requirements change. We will post the revised policy here and update the date above. Material changes may also be communicated through the Service when appropriate.</p><p>For privacy questions or requests, use the <Link href="/contact">Kruzo Contact page</Link> and identify your request as a privacy matter.</p></>,
  },
];

export default function PrivacyPolicyPage() {
  return <LegalDocument eyebrow="Legal" title="Privacy Policy" summary="This policy describes what information Kruzo Document AI handles, why it is needed, when it is shared, and the choices available to you." updatedAt="August 3, 2026" sections={sections} />;
}

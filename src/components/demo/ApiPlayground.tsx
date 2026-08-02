"use client";

import Container from "@/components/Container";
import ApiExamples from "./api/ApiExamples";
import ApiRequestForm from "./api/ApiRequestForm";
import ApiResponsePanel from "./api/ApiResponsePanel";
import { useApiPlayground } from "./api/useApiPlayground";

const ApiPlayground: React.FC = () => {
  const playground = useApiPlayground();

  return (
    <section className="px-5 pb-14 pt-24 md:pt-28">
      <Container>
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-semibold text-secondary">Developer API playground</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Test one extraction request</h1>
            <p className="mt-3 text-muted">Upload a document, edit the JSON template, and inspect the raw response.</p>
          </div>

          <div className="grid min-w-0 items-start gap-5 lg:grid-cols-2">
            <ApiRequestForm
              apiKey={playground.apiKey}
              canSend={playground.canSend}
              endpoint={playground.endpoint}
              file={playground.file}
              schemaSample={playground.schemaSample}
              schemaTemplates={playground.schemaTemplates}
              schemaTemplateId={playground.schemaTemplateId}
              schemaValidation={playground.schemaValidation}
              sendDisabledReason={playground.sendDisabledReason}
              sendState={playground.sendState}
              onApiKeyChange={playground.setApiKey}
              onFileChange={playground.handleFileChange}
              onFormatSchema={playground.formatSchema}
              onSchemaSampleChange={playground.setSchemaSample}
              onSchemaTemplateChange={playground.selectSchemaTemplate}
              onSubmit={playground.sendRequest}
              onRestoreSample={playground.restoreSchema}
            />
            <ApiResponsePanel
              content={playground.responseContent}
              copied={playground.copiedLabel === "response"}
              message={playground.message}
              sendState={playground.sendState}
              onCopy={playground.copyResponse}
            />
          </div>

          <ApiExamples
            activeTab={playground.activeExampleTab}
            content={playground.exampleContent}
            copied={playground.copiedLabel === `example-${playground.activeExampleTab}`}
            onChange={playground.setActiveExampleTab}
            onCopy={playground.copyExample}
          />
        </div>
      </Container>
    </section>
  );
};

export default ApiPlayground;

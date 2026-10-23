import { VERTICAL_TEMPLATES } from "@/lib/data";
import { PhotographyDemo } from "@/components/templates/PhotographyDemo";
import { CaseStudyIntro } from "@/components/templates/CaseStudyIntro";

const template = VERTICAL_TEMPLATES[0];

export const metadata = {
  title: template.seo.title,
  description: template.seo.description,
};

export default function Home() {
  return (
    <>
      <CaseStudyIntro template={template} />
      <div id="live-demo">
        <PhotographyDemo />
      </div>
    </>
  );
}

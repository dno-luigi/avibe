import { Page } from "@wron/kit";
import Workbench from "../components/home/Workbench";
import SmallOnPurpose from "../components/home/SmallOnPurpose";
import Process from "../components/home/Process";
import Guide from "../components/home/Guide";
import VibeSampler from "../components/home/VibeSampler";
import Plans from "../components/home/Plans";
import Questions from "../components/home/Questions";
import Contact from "../components/home/Contact";
import { FAQ_JSONLD } from "../data/content";

export default function Home() {
  return (
    <Page
      title="Describe a page. Get a small site"
      description="Turn plain words into Markdown, HTML and CSS. Pick a vibe, edit every line, push the styling, then export a single file or publish a small site."
      jsonLd={FAQ_JSONLD}
    >
      <Workbench />
      <SmallOnPurpose />
      <Process />
      <Guide />
      <VibeSampler />
      <Plans />
      <Questions />
      <Contact />
    </Page>
  );
}

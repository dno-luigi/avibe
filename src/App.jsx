import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const Builder = lazy(() => import("./pages/Builder"));
const Vibes = lazy(() => import("./pages/Vibes"));
const MySites = lazy(() => import("./pages/MySites"));
const PublishedSite = lazy(() => import("./pages/PublishedSite"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

function Later({ children }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/builder" element={<Later><Builder /></Later>} />
        <Route path="/vibes" element={<Later><Vibes /></Later>} />
        <Route path="/my-sites" element={<Later><MySites /></Later>} />
        <Route path="/s/:slug" element={<Later><PublishedSite /></Later>} />
        <Route path="/privacy" element={<Later><Privacy /></Later>} />
        <Route path="/terms" element={<Later><Terms /></Later>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

import { expectType } from "tsd";
import * as cmark from "..";

expectType<string>(cmark.cmark_version());
expectType<void>(cmark.renderHtml("<h1>Acme String</h1>", (err, html) => {}));
expectType<Promise<string>>(cmark.renderHtml("<h1>Acme String</h1>") as Promise<string>);
expectType<string>(await cmark.renderHtml("<h1>Acme String</h1>"));
expectType<string>(cmark.renderHtmlSync("<h1>Acme String</h1>"));

await cmark.cmark_version();
await cmark.createStreamingParser();
await cmark.renderHtml("<h1>Acme String</h1>", {
  extensions: {
    autolink: true,
    strikethrough: true,
    table: true,
    tagfilter: true,
    tasklist: true,
  },
  footnotes: true,
  fullInfoString: true,
  githubPreLang: true,
  hardbreaks: true,
  liberalHtmltag: true,
  nobreaks: true,
  smart: true,
  sourcerepos: true,
  strikethroughDoubleTilde: true,
  unsafe: true,
  validateUtf8: true,
});

cmark.renderHtml(
  "<h1>Acme String</h1>",
  {
    extensions: {
      autolink: true,
      strikethrough: true,
      table: true,
      tagfilter: true,
      tasklist: true,
    },
    footnotes: true,
    fullInfoString: true,
    githubPreLang: true,
    hardbreaks: true,
    liberalHtmltag: true,
    nobreaks: true,
    smart: true,
    sourcerepos: true,
    strikethroughDoubleTilde: true,
    unsafe: true,
    validateUtf8: true,
  },
  (err, html) => {}
);

cmark.renderHtmlSync("<h1>Acme String</h1>", {
  extensions: {
    autolink: true,
    strikethrough: true,
    table: true,
    tagfilter: true,
    tasklist: true,
  },
  footnotes: true,
  fullInfoString: true,
  githubPreLang: true,
  hardbreaks: true,
  liberalHtmltag: true,
  nobreaks: true,
  smart: true,
  sourcerepos: true,
  strikethroughDoubleTilde: true,
  unsafe: true,
  validateUtf8: true,
});

cmark.renderHtmlSync("<h1>Acme String</h1>");

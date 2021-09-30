declare namespace cmark {
  export interface IExtensions {
    readonly table: boolean;
    readonly strikethrough: boolean;
    readonly tagfilter: boolean;
    readonly autolink: boolean;
    readonly tasklist: boolean;
  }

  export interface IOptions {
    readonly sourcerepos: boolean;
    readonly hardbreaks: boolean;
    readonly nobreaks: boolean;
    readonly validateUtf8: boolean;
    readonly smart: boolean;
    readonly githubPreLang: boolean;
    readonly liberalHtmltag: boolean;
    readonly footnotes: boolean;
    readonly strikethroughDoubleTilde: boolean;
    readonly fullInfoString: boolean;
    readonly unsafe: boolean;
    readonly extensions: Partial<IExtensions>;
  }

  function renderHtml(
    markdown: string,
    options?: Partial<cmark.IOptions>
  ): Promise<string>;
  function renderHtml(
    markdown: string,
    options?: Partial<cmark.IOptions>,
    callback?: (error: Error, html: string) => void
  ): void;
  function renderHtml(
    markdown: string,
    callback?: (error: Error, html: string) => void
  ): void;

  function renderHtmlSync(
    markdown: string,
    options?: Partial<cmark.IOptions>
  ): string;

  function createStreamingParser(options?: Partial<cmark.IOptions>): any;

  function cmark_version(): string;
}

export = cmark;

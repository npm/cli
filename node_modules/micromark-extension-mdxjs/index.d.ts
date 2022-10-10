/**
 * @param {Options} [options]
 * @returns {Extension}
 */
export function mdxjs(
  options?:
    | import('micromark-extension-mdx-expression/dev/lib/syntax').Options
    | undefined
): Extension
export type Extension = import('micromark-util-types').Extension
export type Options = import('micromark-extension-mdx-expression').Options

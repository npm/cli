#include "napi.h"

#include "cmark-gfm.h"
#include "markdown.h"
#include "sync.h"
#include "streaming_parser.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  node_cmark_init();

  exports.Set("renderHtmlSync", Napi::Function::New(env, render_html_sync));
  exports.Set("cmark_version", Napi::String::New(env, cmark_version_string()));
  StreamingParser::Init(env, exports);

  return exports;
}

NODE_API_MODULE(binding, Init)

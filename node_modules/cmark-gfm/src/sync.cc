#include "napi.h"

#include "cmark-gfm.h"
#include "markdown.h"
#include "sync.h"

using std::string;
using std::vector;

Napi::Value render_html_sync(const Napi::CallbackInfo& args) {
  if (args.Length() < 1) {
    Napi::Error::New(args.Env(), "Missing argument 'markdown'").ThrowAsJavaScriptException();
    return args.Env().Undefined();
  }

  if (!args[0].IsString()) {
    Napi::Error::New(args.Env(), "Expected argument 'markdown' to be a string").ThrowAsJavaScriptException();
    return args.Env().Undefined();
  }

  int options = CMARK_OPT_DEFAULT;
  vector<string>* extension_names = new vector<string>;
  if (args.Length() >= 2 && args[1].IsObject()) {
    Napi::Object opts_obj = args[1].As<Napi::Object>();
    options = parse_options(opts_obj);
    populate_extension_names(opts_obj, extension_names);
  }

  string markdown = args[0].As<Napi::String>().Utf8Value();
  char* result = markdown_to_html(markdown.c_str(), markdown.length(), options, extension_names);
  Napi::String ret = Napi::String::New(args.Env(), result);
  free(result);
  delete extension_names;
  return ret;
}

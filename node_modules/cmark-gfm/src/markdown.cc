#include "napi.h"

#include "cmark-gfm.h"
#include "markdown.h"
#include "parser.h"
#include "registry.h"
#include "syntax_extension.h"
#include "cmark-gfm-core-extensions.h"

using std::vector;
using std::string;

void node_cmark_init() {
  cmark_gfm_core_extensions_ensure_registered();
}

void populate_extension_names(Napi::Object options_obj, vector<string>* extension_names) {
  Napi::Env env = options_obj.Env();
  Napi::Value name = Napi::String::New(env, "extensions");
  Napi::Value val = options_obj.Get(name);
  if (val.IsEmpty() || val.IsNull() || val.IsUndefined()) return;
  if (!val.IsObject()) {
    string err_msg = "The 'extensions' property should be an object";
    Napi::Error::New(env, err_msg.c_str()).ThrowAsJavaScriptException();
    return;
  }

  Napi::Object exts = val.As<Napi::Object>();
  Napi::Array exts_keys = exts.GetPropertyNames();
  for(uint32_t i = 0; i < exts_keys.Length(); i++) {
    Napi::Value ext_name = exts_keys.Get(i);
    bool ext_enabled = exts.Get(ext_name).ToBoolean().Value();
    if (!ext_enabled) {
      continue;
    }
    if (!ext_name.IsString()) {
      string bad_ext_name(ext_name.ToString());
      string err_msg = "'" + bad_ext_name + "' is not a valid extension name.";
      Napi::Error::New(env, err_msg.c_str()).ThrowAsJavaScriptException();
      return;
    }
    string ext = ext_name.ToString().Utf8Value();
    cmark_syntax_extension* stx_ext = cmark_find_syntax_extension(ext.c_str());
    if (stx_ext == NULL) {
      string err_msg = "'" + ext + "' is not a valid extension name.";
      Napi::Error::New(env, err_msg.c_str()).ThrowAsJavaScriptException();
      return;
    }
    extension_names->push_back(ext);
  }
}

int get_option(Napi::Object options_obj, const char* option_name, int option_mask) {
  Napi::Value val = options_obj.Get(option_name);
  if (val.IsEmpty()) return 0;

  bool bool_val = val.ToBoolean().Value();
  return bool_val ? option_mask : 0;
}

int parse_options(Napi::Object options_obj) {
  int result = CMARK_OPT_DEFAULT;
  // rendering options
  result |= get_option(options_obj, "sourcepos", CMARK_OPT_SOURCEPOS);
  result |= get_option(options_obj, "hardbreaks", CMARK_OPT_HARDBREAKS);
  result |= get_option(options_obj, "nobreaks", CMARK_OPT_NOBREAKS);
  // parsing options
  result |= get_option(options_obj, "validateUtf8", CMARK_OPT_VALIDATE_UTF8);
  result |= get_option(options_obj, "smart", CMARK_OPT_SMART);
  result |= get_option(options_obj, "githubPreLang", CMARK_OPT_GITHUB_PRE_LANG);
  result |= get_option(options_obj, "liberalHtmlTag", CMARK_OPT_LIBERAL_HTML_TAG);
  result |= get_option(options_obj, "footnotes", CMARK_OPT_FOOTNOTES);
  result |= get_option(options_obj, "strikethroughDoubleTilde", CMARK_OPT_STRIKETHROUGH_DOUBLE_TILDE);
  result |= get_option(options_obj, "tablePreferStyleAttributes", CMARK_OPT_TABLE_PREFER_STYLE_ATTRIBUTES);
  result |= get_option(options_obj, "fullInfoString", CMARK_OPT_FULL_INFO_STRING);
  result |= get_option(options_obj, "unsafe", CMARK_OPT_UNSAFE);
  return result;
}

cmark_parser* prepare_parser(const int options, vector<string>* extension_names) {
  cmark_parser* parser = cmark_parser_new(options);

  for(vector<string>::size_type i = 0; i < extension_names->size(); i++) {
    string ext_name = extension_names->at(i);
    cmark_syntax_extension* ext = cmark_find_syntax_extension(ext_name.c_str());
    if (ext != NULL) {
      cmark_parser_attach_syntax_extension(parser, ext);
    }
  }

  return parser;
}

char* markdown_to_html(const char* markdown, const int len, const int options, vector<string>* extension_names) {
  cmark_parser* parser = prepare_parser(options, extension_names);
  cmark_parser_feed(parser, markdown, len);
  cmark_node* document = cmark_parser_finish(parser);
  char* html = cmark_render_html(document, options, parser->syntax_extensions);
  cmark_parser_free(parser);
  return html;
}

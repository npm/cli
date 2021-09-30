#include "napi.h"
#include "markdown.h"
#include "streaming_parser.h"

#include "syntax_extension.h"
#include "cmark-gfm-core-extensions.h"
#include "parser.h"

using std::string;
using std::vector;

class ConversionWorker : public Napi::AsyncWorker {
public:
  ConversionWorker(Napi::Function& callback, cmark_parser* parser, const string input)
    : Napi::AsyncWorker(callback), parser(parser), input(input) {}

  void Execute() {
    cmark_parser_feed(parser, input.c_str(), input.length());
  }

  void OnOK() {
    Napi::HandleScope scope(Env());
    Callback().Call({ Env().Null() });
  }

private:
  cmark_parser* parser;
  const string input;
};

class FinalizationWorker : public Napi::AsyncWorker {
public:
  FinalizationWorker(Napi::Function& callback, cmark_parser* parser, int options)
    : Napi::AsyncWorker(callback), parser(parser), options(options) {}

  ~FinalizationWorker() {
    free(html);
  }

  void Execute() {
    cmark_node* document = cmark_parser_finish(parser);
    html = cmark_render_html(document, options, parser->syntax_extensions);
  }

  void OnOK() {
    Napi::HandleScope scope(Env());
    Callback().Call({ Napi::String::New(Env(), html) });
  }

private:
  cmark_parser* parser;
  int options;
  char* html;
};

Napi::FunctionReference StreamingParser::constructor;

Napi::Object StreamingParser::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "StreamingParser", {
    InstanceMethod("isFinished", &StreamingParser::IsFinished),
    InstanceMethod("write", &StreamingParser::Write),
    InstanceMethod("finalize", &StreamingParser::FinalizeMethod),
    InstanceMethod("destroy", &StreamingParser::Destroy)
  });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();
  exports.Set("Parser", func);
  return exports;
}

StreamingParser::StreamingParser(const Napi::CallbackInfo& info) :
 Napi::ObjectWrap<StreamingParser>(info) {
  this->options = CMARK_OPT_DEFAULT;
  vector<string> extension_names;
  if (info.Length() > 0 && info[0].IsObject()) {
    Napi::Object opts_obj = info[0].As<Napi::Object>();
    this->options = parse_options(opts_obj);
    populate_extension_names(opts_obj, &extension_names);
  }

  this->finished = false;
  this->parser = prepare_parser(this->options, &extension_names);
}

StreamingParser::~StreamingParser() {}

Napi::Value StreamingParser::IsFinished(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), this->finished);
}

Napi::Value StreamingParser::Write(const Napi::CallbackInfo& info) {
  string input = info[0].As<Napi::String>().Utf8Value();
  Napi::Function callback = info[1].As<Napi::Function>();

  ConversionWorker* worker = new ConversionWorker(callback, parser, input);
  worker->Queue();

  return info.Env().Undefined();
}

Napi::Value StreamingParser::FinalizeMethod(const Napi::CallbackInfo& info) {
  this->finished = true;
  Napi::Function callback = info[0].As<Napi::Function>();

  FinalizationWorker* worker = new FinalizationWorker(callback, parser, options);
  worker->Queue();

  return info.Env().Undefined();
}

Napi::Value StreamingParser::Destroy(const Napi::CallbackInfo& info) {
  if (this->parser) {
    cmark_parser_free(this->parser);
    this->parser = nullptr;
  }

  info[0].As<Napi::Function>().Call({ info.Env().Null() });

  return info.Env().Undefined();
}

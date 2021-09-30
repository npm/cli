#include "napi.h"
#include "cmark-gfm.h"

class StreamingParser : public Napi::ObjectWrap<StreamingParser> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  StreamingParser(const Napi::CallbackInfo& info);
  ~StreamingParser();
  Napi::Value IsFinished(const Napi::CallbackInfo& info);
  Napi::Value Write(const Napi::CallbackInfo& info);
  Napi::Value FinalizeMethod(const Napi::CallbackInfo& info);
  Napi::Value Destroy(const Napi::CallbackInfo& info);

 private:
  static Napi::FunctionReference constructor;
  bool finished;
  int options;
  cmark_parser* parser;
};

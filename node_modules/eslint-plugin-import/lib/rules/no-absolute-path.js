'use strict';var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _importType = require('../core/importType');
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-absolute-path') },

    schema: [(0, _moduleVisitor.makeOptionsSchema)()] },


  create: function () {function create(context) {
      function reportIfAbsolute(source) {
        if (typeof source.value === 'string' && (0, _importType.isAbsolute)(source.value)) {
          context.report(source, 'Do not import modules using an absolute path');
        }
      }

      var options = Object.assign({ esmodule: true, commonjs: true }, context.options[0]);
      return (0, _moduleVisitor2['default'])(reportIfAbsolute, options);
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hYnNvbHV0ZS1wYXRoLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0IiwicmVwb3J0SWZBYnNvbHV0ZSIsInNvdXJjZSIsInZhbHVlIiwicmVwb3J0Iiwib3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsImVzbW9kdWxlIiwiY29tbW9uanMiXSwibWFwcGluZ3MiOiJhQUFBLGtFO0FBQ0E7QUFDQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsa0JBQVIsQ0FERCxFQUZGOztBQUtKQyxZQUFRLENBQUUsdUNBQUYsQ0FMSixFQURTOzs7QUFTZkMsdUJBQVEsZ0JBQVVDLE9BQVYsRUFBbUI7QUFDekIsZUFBU0MsZ0JBQVQsQ0FBMEJDLE1BQTFCLEVBQWtDO0FBQ2hDLFlBQUksT0FBT0EsT0FBT0MsS0FBZCxLQUF3QixRQUF4QixJQUFvQyw0QkFBV0QsT0FBT0MsS0FBbEIsQ0FBeEMsRUFBa0U7QUFDaEVILGtCQUFRSSxNQUFSLENBQWVGLE1BQWYsRUFBdUIsOENBQXZCO0FBQ0Q7QUFDRjs7QUFFRCxVQUFNRyxVQUFVQyxPQUFPQyxNQUFQLENBQWMsRUFBRUMsVUFBVSxJQUFaLEVBQWtCQyxVQUFVLElBQTVCLEVBQWQsRUFBa0RULFFBQVFLLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FBbEQsQ0FBaEI7QUFDQSxhQUFPLGdDQUFjSixnQkFBZCxFQUFnQ0ksT0FBaEMsQ0FBUDtBQUNELEtBVEQsaUJBVGUsRUFBakIiLCJmaWxlIjoibm8tYWJzb2x1dGUtcGF0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2R1bGVWaXNpdG9yLCB7IG1ha2VPcHRpb25zU2NoZW1hIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9tb2R1bGVWaXNpdG9yJztcbmltcG9ydCB7IGlzQWJzb2x1dGUgfSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbm8tYWJzb2x1dGUtcGF0aCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbIG1ha2VPcHRpb25zU2NoZW1hKCkgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgZnVuY3Rpb24gcmVwb3J0SWZBYnNvbHV0ZShzb3VyY2UpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlLnZhbHVlID09PSAnc3RyaW5nJyAmJiBpc0Fic29sdXRlKHNvdXJjZS52YWx1ZSkpIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoc291cmNlLCAnRG8gbm90IGltcG9ydCBtb2R1bGVzIHVzaW5nIGFuIGFic29sdXRlIHBhdGgnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGVzbW9kdWxlOiB0cnVlLCBjb21tb25qczogdHJ1ZSB9LCBjb250ZXh0Lm9wdGlvbnNbMF0pO1xuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKHJlcG9ydElmQWJzb2x1dGUsIG9wdGlvbnMpO1xuICB9LFxufTtcbiJdfQ==
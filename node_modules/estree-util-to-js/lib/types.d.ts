export type Node = import('estree-jsx').Node
export type Program = import('estree-jsx').Program
export type State = Omit<import('astring').State, 'write'> & {
  write: (code: string, node?: Node) => void
}
export type NodeType = Node['type']
export type Generator = {
  CatchClause: Handler
  ClassBody: Handler
  Identifier: Handler
  Literal: Handler
  MethodDefinition: Handler
  PrivateIdentifier: Handler
  Program: Handler
  Property: Handler
  PropertyDefinition: Handler
  SpreadElement: Handler
  Super: Handler
  SwitchCase: Handler
  TemplateElement: Handler
  VariableDeclarator: Handler
  JSXIdentifier: Handler
  JSXNamespacedName: Handler
  JSXMemberExpression: Handler
  JSXEmptyExpression: Handler
  JSXExpressionContainer: Handler
  JSXSpreadAttribute: Handler
  JSXAttribute: Handler
  JSXOpeningElement: Handler
  JSXOpeningFragment: Handler
  JSXClosingElement: Handler
  JSXClosingFragment: Handler
  JSXElement: Handler
  JSXFragment: Handler
  JSXText: Handler
  ArrayExpression: Handler
  ArrowFunctionExpression: Handler
  AssignmentExpression: Handler
  AwaitExpression: Handler
  BinaryExpression: Handler
  CallExpression: Handler
  ChainExpression: Handler
  ClassExpression: Handler
  ConditionalExpression: Handler
  FunctionExpression: Handler
  ImportExpression: Handler
  LogicalExpression: Handler
  MemberExpression: Handler
  MetaProperty: Handler
  NewExpression: Handler
  ObjectExpression: Handler
  SequenceExpression: Handler
  TaggedTemplateExpression: Handler
  TemplateLiteral: Handler
  ThisExpression: Handler
  UnaryExpression: Handler
  UpdateExpression: Handler
  YieldExpression: Handler
  ClassDeclaration: Handler
  FunctionDeclaration: Handler
  ImportDeclaration: Handler
  ExportNamedDeclaration: Handler
  ExportDefaultDeclaration: Handler
  ExportAllDeclaration: Handler
  ImportSpecifier: Handler
  ImportDefaultSpecifier: Handler
  ImportNamespaceSpecifier: Handler
  ExportSpecifier: Handler
  ObjectPattern: Handler
  ArrayPattern: Handler
  RestElement: Handler
  AssignmentPattern: Handler
  ExpressionStatement: Handler
  BlockStatement: Handler
  StaticBlock: Handler
  EmptyStatement: Handler
  DebuggerStatement: Handler
  WithStatement: Handler
  ReturnStatement: Handler
  LabeledStatement: Handler
  BreakStatement: Handler
  ContinueStatement: Handler
  IfStatement: Handler
  SwitchStatement: Handler
  ThrowStatement: Handler
  TryStatement: Handler
  WhileStatement: Handler
  DoWhileStatement: Handler
  ForStatement: Handler
  ForInStatement: Handler
  ForOfStatement: Handler
  VariableDeclaration: Handler
}
export type Handlers = Partial<Generator>
export type Handler = (this: Generator, node: any, state: State) => void

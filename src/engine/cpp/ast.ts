/** 教学子集里支持的 C++ 类型 */
export type TypeName = 'int' | 'double' | 'float' | 'bool' | 'char' | 'string' | 'void'

export interface SourceLocation {
  line: number
}

export interface Program {
  statements: Statement[]
}

export type Statement =
  | VarDeclStatement
  | ExpressionStatement
  | IfStatement
  | WhileStatement
  | ForStatement
  | BlockStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | FunctionStatement
  | EmptyStatement

export interface Declarator {
  name: string
  /** 数组长度表达式，普通变量为 undefined */
  arraySize?: Expression
  /** 数组初始化列表 {1, 2, 3} */
  arrayItems?: Expression[]
  /** 普通赋初值 */
  init?: Expression
}

export interface VarDeclStatement extends SourceLocation {
  kind: 'varDecl'
  typeName: TypeName
  declarators: Declarator[]
}

export interface ExpressionStatement extends SourceLocation {
  kind: 'exprStmt'
  expression: Expression
}

export interface IfStatement extends SourceLocation {
  kind: 'if'
  condition: Expression
  thenBranch: Statement
  elseBranch?: Statement
}

export interface WhileStatement extends SourceLocation {
  kind: 'while'
  condition: Expression
  body: Statement
}

export interface ForStatement extends SourceLocation {
  kind: 'for'
  init?: Statement
  condition?: Expression
  update?: Expression
  body: Statement
}

export interface BlockStatement extends SourceLocation {
  kind: 'block'
  body: Statement[]
}

export interface ReturnStatement extends SourceLocation {
  kind: 'return'
  value?: Expression
}

export interface BreakStatement extends SourceLocation {
  kind: 'break'
}

export interface ContinueStatement extends SourceLocation {
  kind: 'continue'
}

export interface FunctionParameter {
  name: string
  typeName: TypeName
}

export interface FunctionStatement extends SourceLocation {
  kind: 'function'
  returnType: TypeName
  name: string
  params: FunctionParameter[]
  body: BlockStatement
}

export interface EmptyStatement extends SourceLocation {
  kind: 'empty'
}

export type Expression =
  | NumberLiteral
  | StringLiteral
  | CharLiteral
  | BoolLiteral
  | IdentifierExpression
  | BinaryExpression
  | UnaryExpression
  | AssignmentExpression
  | UpdateExpression
  | CallExpression
  | IndexExpression

export interface NumberLiteral extends SourceLocation {
  kind: 'number'
  value: number
  /** 源码里是否写了小数点，用来区分整数除法和小数除法 */
  isFloat: boolean
}

export interface StringLiteral extends SourceLocation {
  kind: 'string'
  value: string
}

export interface CharLiteral extends SourceLocation {
  kind: 'char'
  value: string
}

export interface BoolLiteral extends SourceLocation {
  kind: 'bool'
  value: boolean
}

export interface IdentifierExpression extends SourceLocation {
  kind: 'identifier'
  name: string
}

export interface BinaryExpression extends SourceLocation {
  kind: 'binary'
  operator: string
  left: Expression
  right: Expression
}

export interface UnaryExpression extends SourceLocation {
  kind: 'unary'
  operator: string
  operand: Expression
}

export interface AssignmentExpression extends SourceLocation {
  kind: 'assign'
  operator: string
  target: Expression
  value: Expression
}

export interface UpdateExpression extends SourceLocation {
  kind: 'update'
  operator: '++' | '--'
  prefix: boolean
  target: Expression
}

export interface CallExpression extends SourceLocation {
  kind: 'call'
  callee: string
  args: Expression[]
}

export interface IndexExpression extends SourceLocation {
  kind: 'index'
  target: Expression
  index: Expression
}

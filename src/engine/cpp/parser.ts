import type {
  BlockStatement,
  Declarator,
  Expression,
  FunctionParameter,
  FunctionStatement,
  Program,
  Statement,
  TypeName,
} from './ast.ts'
import { CppSyntaxError, tokenize, type Token } from './lexer.ts'

const TYPE_NAMES: TypeName[] = ['int', 'double', 'float', 'bool', 'char', 'string', 'void']
const SPECIAL_NAMES = new Set(['cout', 'cin', 'endl'])

class Parser {
  tokens: Token[]
  position: number

  constructor(tokens: Token[]) {
    this.tokens = tokens
    this.position = 0
  }

  peek(offset = 0): Token {
    return this.tokens[Math.min(this.position + offset, this.tokens.length - 1)]
  }

  at(value: string): boolean {
    return this.peek().value === value
  }

  atAny(values: string[]): boolean {
    return values.includes(this.peek().value)
  }

  isTypeToken(token: Token = this.peek()): boolean {
    return token.type === 'keyword' && TYPE_NAMES.includes(token.value as TypeName)
  }

  advance(): Token {
    const token = this.peek()
    if (token.type !== 'eof') this.position += 1
    return token
  }

  match(value: string): boolean {
    if (!this.at(value)) return false
    this.position += 1
    return true
  }

  expect(value: string, message: string, hint?: string): Token {
    if (!this.at(value)) {
      const token = this.peek()
      throw new CppSyntaxError(message, token.line, hint)
    }
    return this.advance()
  }

  /** 报错时定位到语句开始的那一行，孩子更好找 */
  expectAt(value: string, line: number, message: string, hint?: string): Token {
    if (!this.at(value)) throw new CppSyntaxError(message, line, hint)
    return this.advance()
  }

  expectName(what: string): { name: string; line: number } {
    const token = this.peek()
    if (token.type === 'identifier') {
      this.advance()
      return { name: token.value, line: token.line }
    }
    throw new CppSyntaxError(`${what}需要一个名字`, token.line, '比如 int score = 10;')
  }

  parseProgram(): Program {
    const statements: Statement[] = []
    while (this.peek().type !== 'eof') {
      statements.push(this.parseStatement())
    }
    return { statements }
  }

  parseStatement(): Statement {
    const token = this.peek()
    const line = token.line

    if (this.at(';')) {
      this.advance()
      return { kind: 'empty', line }
    }

    if (this.at('{')) {
      return this.parseBlock()
    }

    if (this.at('using')) {
      // using namespace std; 直接跳过
      while (!this.at(';') && this.peek().type !== 'eof') this.advance()
      this.match(';')
      return { kind: 'empty', line }
    }

    if (this.at('if')) return this.parseIf()
    if (this.at('while')) return this.parseWhile()
    if (this.at('for')) return this.parseFor()

    if (this.at('do')) {
      throw new CppSyntaxError('do-while 还没有教到', line, '先用 while 或者 for 试试')
    }

    if (this.at('return')) {
      this.advance()
      if (this.at(';')) {
        this.advance()
        return { kind: 'return', line }
      }
      const value = this.parseExpression()
      this.expectAt(';', line, 'return 后面少了一个分号', '每一句代码末尾都要写分号')
      return { kind: 'return', line, value }
    }

    if (this.at('break')) {
      this.advance()
      this.expectAt(';', line, 'break 后面少了一个分号')
      return { kind: 'break', line }
    }

    if (this.at('continue')) {
      this.advance()
      this.expectAt(';', line, 'continue 后面少了一个分号')
      return { kind: 'continue', line }
    }

    if (this.at('const')) {
      this.advance()
    }

    // 声明 / 函数定义
    if (this.isTypeToken()) {
      const next = this.peek(1)
      const afterNext = this.peek(2)
      const isFunction = next.type === 'identifier' && afterNext.value === '('
      if (isFunction) return this.parseFunction()
      const typeName = this.advance().value as TypeName
      const declaration = this.parseVarDecl(typeName, line)
      this.expectAt(';', line, '这一行少了一个分号「;」', '声明变量后要写分号，比如 int score = 10;')
      return declaration
    }

    const expression = this.parseExpression()
    this.expectAt(';', line, '这一行少了一个分号「;」', '每一句代码末尾都要写分号')
    return { kind: 'exprStmt', line, expression }
  }

  parseBlock(): BlockStatement {
    const line = this.peek().line
    this.expect('{', '这里需要一个大括号「{」')
    const body: Statement[] = []
    while (!this.at('}') && this.peek().type !== 'eof') {
      body.push(this.parseStatement())
    }
    if (!this.at('}')) {
      throw new CppSyntaxError('大括号没有配对，少了一个「}」', line, '每个 { 都要有一个 } 收尾')
    }
    this.advance()
    return { kind: 'block', line, body }
  }

  parseVarDecl(typeName: TypeName, line: number): Statement {
    const declarators: Declarator[] = []

    while (true) {
      const { name } = this.expectName('变量')
      const declarator: Declarator = { name }

      if (this.match('[')) {
        if (!this.at(']')) {
          declarator.arraySize = this.parseExpression()
        }
        this.expect(']', '方括号没有配对', '数组要写成 int a[3]; 这样')
      }

      if (this.match('=')) {
        if (this.at('{')) {
          this.advance()
          const items: Expression[] = []
          while (!this.at('}') && this.peek().type !== 'eof') {
            items.push(this.parseExpression())
            if (!this.match(',')) break
          }
          this.expect('}', '大括号没有配对', '一组数字要写成 {1, 2, 3}')
          declarator.arrayItems = items
        } else {
          declarator.init = this.parseExpression()
        }
      }

      declarators.push(declarator)
      if (!this.match(',')) break
    }

    return { kind: 'varDecl', line, typeName, declarators }
  }

  parseFunction(): FunctionStatement {
    const line = this.peek().line
    const returnType = this.advance().value as TypeName
    const { name } = this.expectName('函数')
    this.expect('(', '函数名后面要有圆括号')

    const params: FunctionParameter[] = []
    while (!this.at(')') && this.peek().type !== 'eof') {
      if (this.at(',')) {
        this.advance()
        continue
      }
      if (!this.isTypeToken()) {
        throw new CppSyntaxError('函数参数要写类型', this.peek().line, '比如 int add(int a, int b)')
      }
      const paramType = this.advance().value as TypeName
      const param = this.expectName('参数')
      params.push({ name: param.name, typeName: paramType })
    }
    this.expect(')', '圆括号没有配对', '参数写完后别忘了「)」')

    if (!this.at('{')) {
      throw new CppSyntaxError('函数体要用大括号包起来', this.peek().line, '在函数名后面写 { 开始，} 结束')
    }
    const body = this.parseBlock()
    return { kind: 'function', line, returnType, name, params, body }
  }

  parseIf(): Statement {
    const line = this.peek().line
    this.advance()
    this.expect('(', 'if 后面要有圆括号', '写法是 if (条件) { ... }')
    const condition = this.parseExpression()
    this.expect(')', 'if 的圆括号没有配对')
    const thenBranch = this.parseStatement()
    const elseBranch = this.match('else') ? this.parseStatement() : undefined
    return { kind: 'if', line, condition, thenBranch, elseBranch }
  }

  parseWhile(): Statement {
    const line = this.peek().line
    this.advance()
    this.expect('(', 'while 后面要有圆括号')
    const condition = this.parseExpression()
    this.expect(')', 'while 的圆括号没有配对')
    const body = this.parseStatement()
    return { kind: 'while', line, condition, body }
  }

  parseFor(): Statement {
    const line = this.peek().line
    this.advance()
    this.expect('(', 'for 后面要有圆括号', '写法是 for (int i = 0; i < 3; i++) { ... }')

    let init: Statement | undefined
    if (!this.at(';')) {
      if (this.at('const')) this.advance()
      if (this.isTypeToken()) {
        const typeName = this.advance().value as TypeName
        init = this.parseVarDecl(typeName, this.peek().line)
      } else {
        const expression = this.parseExpression()
        init = { kind: 'exprStmt', line: this.peek().line, expression }
      }
    }
    this.expect(';', 'for 里的第一段后面要有分号')

    let condition: Expression | undefined
    if (!this.at(';')) condition = this.parseExpression()
    this.expect(';', 'for 里的第二段后面要有分号')

    let update: Expression | undefined
    if (!this.at(')')) update = this.parseExpression()
    this.expect(')', 'for 的圆括号没有配对')

    const body = this.parseStatement()
    return { kind: 'for', line, init, condition, update, body }
  }

  parseExpression(): Expression {
    return this.parseAssignment()
  }

  parseAssignment(): Expression {
    const left = this.parseLogicalOr()
    const token = this.peek()

    if (['=', '+=', '-=', '*=', '/=', '%='].includes(token.value)) {
      if (left.kind !== 'identifier' && left.kind !== 'index') {
        throw new CppSyntaxError('等号左边要是一个变量', token.line, '比如 score = score + 1;')
      }
      this.advance()
      const value = this.parseAssignment()
      return { kind: 'assign', line: token.line, operator: token.value, target: left, value }
    }

    return left
  }

  parseLogicalOr(): Expression {
    return this.parseBinaryLevel(() => this.parseLogicalAnd(), ['||'])
  }

  parseLogicalAnd(): Expression {
    return this.parseBinaryLevel(() => this.parseEquality(), ['&&'])
  }

  parseEquality(): Expression {
    return this.parseBinaryLevel(() => this.parseRelational(), ['==', '!='])
  }

  parseRelational(): Expression {
    return this.parseBinaryLevel(() => this.parseShift(), ['<', '>', '<=', '>='])
  }

  parseShift(): Expression {
    return this.parseBinaryLevel(() => this.parseAdditive(), ['<<', '>>'])
  }

  parseAdditive(): Expression {
    return this.parseBinaryLevel(() => this.parseMultiplicative(), ['+', '-'])
  }

  parseMultiplicative(): Expression {
    return this.parseBinaryLevel(() => this.parseUnary(), ['*', '/', '%'])
  }

  parseBinaryLevel(next: () => Expression, operators: string[]): Expression {
    let left = next()
    while (this.atAny(operators)) {
      const token = this.advance()
      const right = next()
      left = { kind: 'binary', line: token.line, operator: token.value, left, right }
    }
    return left
  }

  parseUnary(): Expression {
    const token = this.peek()

    if (['-', '!'].includes(token.value)) {
      this.advance()
      return { kind: 'unary', line: token.line, operator: token.value, operand: this.parseUnary() }
    }

    if (token.value === '++' || token.value === '--') {
      this.advance()
      const target = this.parseUnary()
      return { kind: 'update', line: token.line, operator: token.value, prefix: true, target }
    }

    return this.parsePostfix()
  }

  parsePostfix(): Expression {
    let expression = this.parsePrimary()

    while (true) {
      const token = this.peek()

      if (token.value === '(') {
        throw new CppSyntaxError('这里不能直接调用', token.line, '只有函数名后面才能写圆括号')
      }

      if (token.value === '[') {
        this.advance()
        const index = this.parseExpression()
        this.expect(']', '方括号没有配对', '数组的写法是 a[0]')
        expression = { kind: 'index', line: token.line, target: expression, index }
        continue
      }

      if (token.value === '++' || token.value === '--') {
        if (expression.kind !== 'identifier' && expression.kind !== 'index') {
          throw new CppSyntaxError('自增自减只能用在变量上', token.line, '比如 i++ 或 ++i')
        }
        this.advance()
        expression = {
          kind: 'update',
          line: token.line,
          operator: token.value as '++' | '--',
          prefix: false,
          target: expression,
        }
        continue
      }

      break
    }

    return expression
  }

  parsePrimary(): Expression {
    const token = this.peek()

    if (token.type === 'number') {
      this.advance()
      return {
        kind: 'number',
        line: token.line,
        value: Number(token.value),
        isFloat: token.value.includes('.'),
      }
    }

    if (token.type === 'string') {
      this.advance()
      return { kind: 'string', line: token.line, value: token.value }
    }

    if (token.type === 'char') {
      this.advance()
      return { kind: 'char', line: token.line, value: token.value }
    }

    if (token.value === 'true' || token.value === 'false') {
      this.advance()
      return { kind: 'bool', line: token.line, value: token.value === 'true' }
    }

    if (SPECIAL_NAMES.has(token.value)) {
      this.advance()
      return { kind: 'identifier', line: token.line, name: token.value }
    }

    if (token.type === 'identifier') {
      this.advance()
      let name = token.value
      let line = token.line

      // 兼容 std::cout 这样的写法
      if (this.at('::')) {
        this.advance()
        const member = this.peek()
        if (member.type === 'identifier' || SPECIAL_NAMES.has(member.value)) {
          this.advance()
          name = member.value
          line = member.line
        }
      }

      if (this.at('(')) {
        this.advance()
        const args: Expression[] = []
        while (!this.at(')') && this.peek().type !== 'eof') {
          args.push(this.parseExpression())
          if (!this.match(',')) break
        }
        this.expect(')', '圆括号没有配对', '函数调用的写法是 add(1, 2)')
        return { kind: 'call', line, callee: name, args }
      }

      return { kind: 'identifier', line, name }
    }

    if (token.value === '(') {
      this.advance()
      const expression = this.parseExpression()
      this.expect(')', '圆括号没有配对', '每个 ( 都要有一个 ) 收尾')
      return expression
    }

    if (token.type === 'eof') {
      throw new CppSyntaxError('代码好像还没有写完', token.line, '检查一下是不是少了一个右大括号「}」')
    }

    throw new CppSyntaxError(`这里看不懂「${token.value}」`, token.line, '检查一下有没有写错字')
  }
}

export function parseCpp(source: string): Program {
  return new Parser(tokenize(source)).parseProgram()
}

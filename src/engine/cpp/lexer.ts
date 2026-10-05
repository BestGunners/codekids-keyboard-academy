export type TokenType = 'number' | 'string' | 'char' | 'identifier' | 'keyword' | 'punct' | 'eof'

export interface Token {
  type: TokenType
  value: string
  line: number
  column: number
}

/** 语法错误：带上行号，方便界面高亮那一行 */
export class CppSyntaxError extends Error {
  readonly line: number
  readonly hint?: string

  constructor(message: string, line: number, hint?: string) {
    super(message)
    this.name = 'CppSyntaxError'
    this.line = line
    this.hint = hint
  }
}

/** 运行时错误：同样带行号 */
export class CppRuntimeError extends Error {
  readonly line: number
  readonly hint?: string

  constructor(message: string, line: number, hint?: string) {
    super(message)
    this.name = 'CppRuntimeError'
    this.line = line
    this.hint = hint
  }
}

const KEYWORDS = new Set([
  'int',
  'double',
  'float',
  'bool',
  'char',
  'string',
  'void',
  'if',
  'else',
  'for',
  'while',
  'do',
  'return',
  'break',
  'continue',
  'true',
  'false',
  'using',
  'namespace',
  'const',
  'endl',
  'cout',
  'cin',
])

/** 多字符运算符要先匹配，否则 << 会被拆成两个 < */
const OPERATORS = [
  '<<',
  '>>',
  '<=',
  '>=',
  '==',
  '!=',
  '&&',
  '||',
  '++',
  '--',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '::',
  '+',
  '-',
  '*',
  '/',
  '%',
  '=',
  '<',
  '>',
  '!',
  '(',
  ')',
  '{',
  '}',
  '[',
  ']',
  ';',
  ',',
  '.',
  ':',
]

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

function isIdentifierStart(char: string): boolean {
  return /[A-Za-z_]/.test(char)
}

function isIdentifierPart(char: string): boolean {
  return /[A-Za-z0-9_]/.test(char)
}

/**
 * 词法分析：把源码切成记号。
 * 教学上有两处宽容处理——
 * 1. 以 # 开头的预处理行（#include <iostream>）整行跳过；
 * 2. // 与 /* *\/ 注释忽略。
 */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let index = 0
  let line = 1
  let column = 1

  const advance = (count = 1) => {
    for (let step = 0; step < count; step += 1) {
      if (source[index] === '\n') {
        line += 1
        column = 1
      } else {
        column += 1
      }
      index += 1
    }
  }

  while (index < source.length) {
    const char = source[index]

    // 换行与空白
    if (char === '\n' || char === ' ' || char === '\t' || char === '\r') {
      advance()
      continue
    }

    // 预处理指令：整行跳过
    if (char === '#' && tokens.length >= 0) {
      while (index < source.length && source[index] !== '\n') advance()
      continue
    }

    // 行注释
    if (char === '/' && source[index + 1] === '/') {
      while (index < source.length && source[index] !== '\n') advance()
      continue
    }

    // 块注释
    if (char === '/' && source[index + 1] === '*') {
      advance(2)
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        advance()
      }
      advance(2)
      continue
    }

    const startLine = line
    const startColumn = column

    // 字符串
    if (char === '"') {
      advance()
      let value = ''
      while (index < source.length && source[index] !== '"') {
        if (source[index] === '\\') {
          const escape = source[index + 1]
          value += escape === 'n' ? '\n' : escape === 't' ? '\t' : (escape ?? '')
          advance(2)
          continue
        }
        if (source[index] === '\n') {
          throw new CppSyntaxError('字符串没有写完整，少了一个双引号', startLine, '引号要成对出现，比如 "你好"')
        }
        value += source[index]
        advance()
      }
      if (index >= source.length) {
        throw new CppSyntaxError('字符串没有写完整，少了一个双引号', startLine, '引号要成对出现，比如 "你好"')
      }
      advance()
      tokens.push({ type: 'string', value, line: startLine, column: startColumn })
      continue
    }

    // 字符
    if (char === "'") {
      advance()
      let value = ''
      while (index < source.length && source[index] !== "'") {
        if (source[index] === '\\') {
          const escape = source[index + 1]
          value += escape === 'n' ? '\n' : escape === 't' ? '\t' : (escape ?? '')
          advance(2)
          continue
        }
        value += source[index]
        advance()
      }
      if (index >= source.length) {
        throw new CppSyntaxError('字符没有写完整，少了一个单引号', startLine, "一个字符用单引号，比如 'a'")
      }
      advance()
      tokens.push({ type: 'char', value, line: startLine, column: startColumn })
      continue
    }

    // 数字
    if (isDigit(char)) {
      let value = ''
      while (index < source.length && (isDigit(source[index]) || source[index] === '.')) {
        value += source[index]
        advance()
      }
      tokens.push({ type: 'number', value, line: startLine, column: startColumn })
      continue
    }

    // 标识符与关键字
    if (isIdentifierStart(char)) {
      let value = ''
      while (index < source.length && isIdentifierPart(source[index])) {
        value += source[index]
        advance()
      }
      tokens.push({
        type: KEYWORDS.has(value) ? 'keyword' : 'identifier',
        value,
        line: startLine,
        column: startColumn,
      })
      continue
    }

    // 运算符与标点
    const matched = OPERATORS.find((operator) => source.startsWith(operator, index))
    if (matched) {
      advance(matched.length)
      tokens.push({ type: 'punct', value: matched, line: startLine, column: startColumn })
      continue
    }

    throw new CppSyntaxError(
      `看不懂这个符号「${char}」`,
      startLine,
      '检查一下有没有中文标点，代码里要用英文标点',
    )
  }

  tokens.push({ type: 'eof', value: '', line, column })
  return tokens
}

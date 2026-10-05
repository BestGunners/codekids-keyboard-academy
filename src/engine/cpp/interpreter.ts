import type {
  BlockStatement,
  Declarator,
  Expression,
  FunctionStatement,
  Program,
  Statement,
  TypeName,
} from './ast.ts'
import { CppRuntimeError, CppSyntaxError } from './lexer.ts'
import { parseCpp } from './parser.ts'

/** 舞台上的一个动作（画图关卡会用到） */
export type SceneCommand =
  | { type: 'clear' }
  | { type: 'color'; color: string }
  | { type: 'star'; x: number; y: number; color: string }
  | { type: 'circle'; x: number; y: number; radius: number; color: string }
  | { type: 'rect'; x: number; y: number; width: number; height: number; color: string }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color: string }
  | { type: 'text'; text: string; x: number; y: number; color: string }
  | { type: 'wait'; seconds: number }

/** 舞台坐标：左上角是 (0, 0)，x 向右、y 向下 */
export const STAGE_WIDTH = 320
export const STAGE_HEIGHT = 200

/** 可以用的颜色名字 */
export const STAGE_COLORS = [
  'orange',
  'red',
  'pink',
  'purple',
  'blue',
  'sky',
  'green',
  'yellow',
  'brown',
  'black',
]

export type SceneCounts = Partial<Record<SceneCommand['type'], number>>

/** 中文颜色名，孩子可以直接写 color("绿色") */
export const COLOR_ALIASES: Record<string, string> = {
  橙色: 'orange',
  红色: 'red',
  粉色: 'pink',
  紫色: 'purple',
  蓝色: 'blue',
  天蓝: 'sky',
  绿色: 'green',
  黄色: 'yellow',
  棕色: 'brown',
  黑色: 'black',
}

export const COLOR_LABELS: Record<string, string> = {
  orange: '橙色',
  red: '红色',
  pink: '粉色',
  purple: '紫色',
  blue: '蓝色',
  sky: '天蓝',
  green: '绿色',
  yellow: '黄色',
  brown: '棕色',
  black: '黑色',
}

/** 数一数舞台上各种图形分别画了几个（自动判定用） */
export function countSceneKinds(scene: SceneCommand[]): SceneCounts {
  const counts: SceneCounts = {}
  scene.forEach((command) => {
    counts[command.type] = (counts[command.type] ?? 0) + 1
  })
  return counts
}

export interface SceneFrame {
  /** 这一帧上的图形（颜色已经解析好） */
  commands: SceneCommand[]
  /** 这一帧之后要停多久（秒），来自 wait() */
  duration: number
}

/**
 * 把舞台指令切成一帧一帧的画面：wait() 表示「这一帧画完了，停一下」。
 * 没有 wait 的程序只有一帧，也就是一张静态画面。
 */
export function resolveFrames(scene: SceneCommand[]): SceneFrame[] {
  const frames: SceneFrame[] = []
  let canvas: SceneCommand[] = []
  let changedSinceLastFrame = false

  scene.forEach((command) => {
    if (command.type === 'clear') {
      canvas = []
      changedSinceLastFrame = true
      return
    }
    if (command.type === 'color') return
    if (command.type === 'wait') {
      frames.push({ commands: canvas, duration: command.seconds })
      canvas = [...canvas]
      changedSinceLastFrame = false
      return
    }
    canvas.push(command)
    changedSinceLastFrame = true
  })

  // 没有 wait 的程序也要有一帧；wait 之后又画了新东西，再补一帧收尾
  if (frames.length === 0 || changedSinceLastFrame) {
    frames.push({ commands: canvas, duration: 0 })
  }

  return frames
}

function pushSceneCommand(state: State, command: SceneCommand, line: number): void {
  if (state.scene.length >= state.sceneLimit) {
    throw new CppRuntimeError(
      '舞台上的图形太多了，画不下啦',
      line,
      '检查一下循环是不是在不停地画',
    )
  }
  state.scene.push(command)
}

function stageCoordinate(value: number, axis: 'x' | 'y', line: number): number {
  const max = axis === 'x' ? STAGE_WIDTH : STAGE_HEIGHT
  if (value < -60 || value > max + 60) {
    throw new CppRuntimeError(
      `坐标 ${value} 跑到舞台外面去了`,
      line,
      `舞台的 ${axis} 方向是 0 到 ${max}`,
    )
  }
  return Math.round(value)
}

export interface ArrayValue {
  kind: 'array'
  elementType: TypeName
  items: Value[]
}

export interface OutputStream {
  kind: 'cout'
}

export interface InputStream {
  kind: 'cin'
}

export type Value = number | string | boolean | ArrayValue | OutputStream | InputStream

export interface TraceEntry {
  line: number
  /** 执行到这一步时，屏幕上已经输出了多少字符 */
  outputLength: number
  /** 执行到这一步时，舞台上已经有多少条指令（用来回放画面） */
  sceneLength: number
  variables: Record<string, string>
}

export interface RunCppOptions {
  /** 程序要读的输入，按空格或换行分开 */
  input?: string[]
  /** 最多执行多少步，用来发现停不下来的循环 */
  maxSteps?: number
  /** 输出最多多少个字符 */
  maxOutput?: number
  /** 最多记录多少步执行轨迹（给"逐行演示"用） */
  maxTrace?: number
  /** 舞台最多画多少个图形 */
  maxSceneCommands?: number
}

export interface RunCppError {
  kind: 'syntax' | 'runtime'
  message: string
  hint?: string
  line: number
}

export interface RunCppResult {
  ok: boolean
  output: string
  error?: RunCppError
  steps: number
  trace: TraceEntry[]
  variables: Record<string, string>
  /** 舞台上的图形（画图关卡） */
  scene: SceneCommand[]
}

interface Variable {
  value: Value
  typeName: TypeName
}

interface Scope {
  variables: Map<string, Variable>
  parent: Scope | null
}

type Signal =
  | { type: 'normal' }
  | { type: 'break' }
  | { type: 'continue' }
  | { type: 'return'; value: Value }

const COUT: Value = { kind: 'cout' }
const CIN: Value = { kind: 'cin' }

interface State {
  functions: Map<string, FunctionStatement>
  scene: SceneCommand[]
  currentColor: string
  sceneLimit: number
  waitCount: number
  totalWaitSeconds: number
  output: string[]
  outputLength: number
  inputTokens: string[]
  inputIndex: number
  steps: number
  maxSteps: number
  maxOutput: number
  maxTrace: number
  trace: TraceEntry[]
  callDepth: number
}

function isArray(value: Value): value is ArrayValue {
  return typeof value === 'object' && value !== null && (value as ArrayValue).kind === 'array'
}

function isOutputStream(value: Value): value is OutputStream {
  return typeof value === 'object' && value !== null && (value as OutputStream).kind === 'cout'
}

function isInputStream(value: Value): value is InputStream {
  return typeof value === 'object' && value !== null && (value as InputStream).kind === 'cin'
}

function createScope(parent: Scope | null): Scope {
  return { variables: new Map(), parent }
}

function lookupVariable(scope: Scope, name: string): { scope: Scope; variable: Variable } | null {
  let current: Scope | null = scope
  while (current) {
    const variable = current.variables.get(name)
    if (variable) return { scope: current, variable }
    current = current.parent
  }
  return null
}

/** 打印格式：整数不带小数点，true/false 按 C++ 打印成 1/0 */
export function formatValue(value: Value): string {
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return String(value)
    return String(Math.round(value * 1e6) / 1e6)
  }
  if (typeof value === 'string') return value
  if (isArray(value)) return value.items.map((item) => formatValue(item)).join(' ')
  return ''
}

function truthy(value: Value): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value.length > 0
  return true
}

function toNumber(value: Value, line: number, what: string): number {
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string') {
    const parsed = Number(value.trim())
    if (Number.isFinite(parsed)) return parsed
    throw new CppRuntimeError(`${what}需要数字，但拿到的是文字「${value}」`, line, '数字不要加引号')
  }
  throw new CppRuntimeError(`${what}不能用一排格子来算`, line, '要用里面的某一个，比如 a[0]')
}

function coerceValue(value: Value, typeName: TypeName, line: number, name: string): Value {
  switch (typeName) {
    case 'int':
      return Math.trunc(toNumber(value, line, `变量「${name}」`))
    case 'double':
    case 'float':
      return toNumber(value, line, `变量「${name}」`)
    case 'bool':
      return truthy(value)
    case 'char': {
      const text = formatValue(value)
      if (text.length === 0) {
        throw new CppRuntimeError(`变量「${name}」只能装一个字符`, line, "比如 char c = 'a';")
      }
      return text[0]
    }
    case 'string':
      return formatValue(value)
    default:
      return value
  }
}

function typeLabel(typeName: TypeName): string {
  const labels: Record<string, string> = {
    int: '整数',
    double: '小数',
    float: '小数',
    bool: '对错',
    char: '字符',
    string: '文字',
  }
  return labels[typeName] ?? '值'
}

function snapshotVariables(scope: Scope): Record<string, string> {
  const snapshot: Record<string, string> = {}
  const seen = new Set<string>()
  let current: Scope | null = scope

  while (current) {
    current.variables.forEach((variable, name) => {
      if (seen.has(name)) return
      seen.add(name)
      snapshot[name] = formatValue(variable.value)
    })
    current = current.parent
  }

  return snapshot
}

function recordTrace(state: State, line: number, scope: Scope): void {
  if (state.trace.length >= state.maxTrace) return
  state.trace.push({
    line,
    outputLength: state.outputLength,
    sceneLength: state.scene.length,
    variables: snapshotVariables(scope),
  })
}

function countStep(state: State, line: number): void {
  state.steps += 1
  if (state.steps > state.maxSteps) {
    throw new CppRuntimeError(
      '程序跑了太多步，可能是有一个循环停不下来',
      line,
      '检查循环里的条件有没有机会变成不成立，比如别忘了写 i = i + 1;',
    )
  }
}

function appendOutput(state: State, text: string, line: number): void {
  state.output.push(text)
  state.outputLength += text.length
  if (state.outputLength > state.maxOutput) {
    throw new CppRuntimeError(
      '输出的内容太多了，程序可能停不下来',
      line,
      '检查循环是不是会一直打印',
    )
  }
}

function readInput(state: State, line: number): string {
  if (state.inputIndex >= state.inputTokens.length) {
    throw new CppRuntimeError(
      '程序在等你输入内容，但输入框里是空的',
      line,
      '在运行前先把要输入的数字或文字填进「输入」框，例如：7',
    )
  }
  const token = state.inputTokens[state.inputIndex]
  state.inputIndex += 1
  return token
}

function assignTarget(
  state: State,
  scope: Scope,
  target: Expression,
  value: Value,
  line: number,
): void {
  if (target.kind === 'identifier') {
    const found = lookupVariable(scope, target.name)
    if (!found) {
      throw new CppRuntimeError(
        `还没有一个叫「${target.name}」的盒子`,
        target.line,
        `先用 int ${target.name} = 0; 把它建出来`,
      )
    }
    found.variable.value = coerceValue(value, found.variable.typeName, line, target.name)
    return
  }

  if (target.kind === 'index') {
    const container = evaluate(state, scope, target.target)
    if (!isArray(container)) {
      throw new CppRuntimeError('只有一排格子才能用方括号', target.line, '比如 scores[0] = 10;')
    }
    const index = Math.trunc(toNumber(evaluate(state, scope, target.index), target.line, '方括号里'))
    if (index < 0 || index >= container.items.length) {
      throw new CppRuntimeError(
        `这一排只有 ${container.items.length} 个格子，从 0 数到 ${container.items.length - 1}`,
        target.line,
        '第一个格子的编号是 0 哦',
      )
    }
    container.items[index] = coerceValue(value, container.elementType, line, '格子')
    return
  }

  throw new CppRuntimeError('等号左边要是一个变量', line, '比如 score = 10;')
}

function readTarget(state: State, scope: Scope, target: Expression, text: string, line: number): void {
  let value: Value = text

  if (target.kind === 'identifier') {
    const found = lookupVariable(scope, target.name)
    if (!found) {
      throw new CppRuntimeError(
        `还没有一个叫「${target.name}」的盒子`,
        target.line,
        `先用 int ${target.name}; 把它建出来再读输入`,
      )
    }
    const typeName = found.variable.typeName
    if (typeName === 'int' || typeName === 'double' || typeName === 'float') {
      const parsed = Number(text.trim())
      if (!Number.isFinite(parsed)) {
        throw new CppRuntimeError(
          `输入的内容「${text}」不是数字，装不进${typeLabel(typeName)}盒子`,
          line,
          '检查一下输入框里是不是填了文字',
        )
      }
      value = parsed
    }
    found.variable.value = coerceValue(value, typeName, line, target.name)
    return
  }

  assignTarget(state, scope, target, value, line)
}

function evaluateBinary(state: State, scope: Scope, expression: Expression): Value {
  if (expression.kind !== 'binary') throw new Error('unreachable')

  const left = evaluate(state, scope, expression.left)

  // cout << ... ：把内容说出来
  if (expression.operator === '<<' && isOutputStream(left)) {
    const value = evaluate(state, scope, expression.right)
    if (isArray(value)) {
      throw new CppRuntimeError(
        '一整排格子不能直接打印',
        expression.line,
        '要一个一个打印，比如 cout << scores[0];',
      )
    }
    appendOutput(state, formatValue(value), expression.line)
    return COUT
  }

  // cin >> ... ：把输入收进盒子
  if (expression.operator === '>>' && isInputStream(left)) {
    const text = readInput(state, expression.line)
    readTarget(state, scope, expression.right, text, expression.line)
    return CIN
  }

  if (expression.operator === '&&') {
    if (!truthy(left)) return false
    return truthy(evaluate(state, scope, expression.right))
  }

  if (expression.operator === '||') {
    if (truthy(left)) return true
    return truthy(evaluate(state, scope, expression.right))
  }

  const right = evaluate(state, scope, expression.right)
  const floatOperands =
    isFloatExpression(state, scope, expression.left) ||
    isFloatExpression(state, scope, expression.right)
  return computeBinary(expression.operator, left, right, expression.line, floatOperands)
}

function computeBinary(
  operator: string,
  left: Value,
  right: Value,
  line: number,
  floatOperands = false,
): Value {
  switch (operator) {
    case '+':
      if (typeof left === 'string' || typeof right === 'string') {
        return formatValue(left) + formatValue(right)
      }
      return toNumber(left, line, '加法') + toNumber(right, line, '加法')
    case '-':
      return toNumber(left, line, '减法') - toNumber(right, line, '减法')
    case '*':
      return toNumber(left, line, '乘法') * toNumber(right, line, '乘法')
    case '/': {
      const divisor = toNumber(right, line, '除法')
      if (divisor === 0) {
        throw new CppRuntimeError('不能除以 0', line, '检查一下除号右边的数字')
      }
      const dividend = toNumber(left, line, '除法')
      // 和真实的 C++ 一样：两个整数相除，结果还是整数（7 / 2 得 3；7 / 2.0 得 3.5）
      if (!floatOperands && Number.isInteger(dividend) && Number.isInteger(divisor)) {
        return Math.trunc(dividend / divisor)
      }
      return dividend / divisor
    }
    case '%': {
      const divisor = Math.trunc(toNumber(right, line, '取余数'))
      if (divisor === 0) {
        throw new CppRuntimeError('不能对 0 取余数', line, '检查一下百分号右边的数字')
      }
      return Math.trunc(toNumber(left, line, '取余数')) % divisor
    }
    case '==':
      return compareValues(left, right) === 0
    case '!=':
      return compareValues(left, right) !== 0
    case '<':
      return compareValues(left, right) < 0
    case '>':
      return compareValues(left, right) > 0
    case '<=':
      return compareValues(left, right) <= 0
    case '>=':
      return compareValues(left, right) >= 0
    default:
      throw new CppRuntimeError(`还不支持「${operator}」这个符号`, line)
  }
}

function compareValues(left: Value, right: Value): number {
  if (typeof left === 'number' || typeof right === 'number') {
    const a = typeof left === 'number' ? left : Number(formatValue(left))
    const b = typeof right === 'number' ? right : Number(formatValue(right))
    if (Number.isFinite(a) && Number.isFinite(b)) return a === b ? 0 : a < b ? -1 : 1
  }

  const a = formatValue(left)
  const b = formatValue(right)
  return a === b ? 0 : a < b ? -1 : 1
}

function evaluateCall(state: State, scope: Scope, expression: Expression): Value {
  if (expression.kind !== 'call') throw new Error('unreachable')

  const args = expression.args.map((arg) => evaluate(state, scope, arg))
  const line = expression.line

  const argNumber = (index: number, axis: 'x' | 'y' | 'plain' = 'plain') =>
    axis === 'plain'
      ? Math.round(toNumber(args[index] ?? 0, line, '这个数字'))
      : stageCoordinate(toNumber(args[index] ?? 0, line, '坐标'), axis, line)

  switch (expression.callee) {
    case 'rand':
      return Math.floor(Math.random() * 32768)
    case 'abs':
      return Math.abs(toNumber(args[0] ?? 0, line, 'abs'))
    case 'max':
      return Math.max(toNumber(args[0] ?? 0, line, 'max'), toNumber(args[1] ?? 0, line, 'max'))
    case 'min':
      return Math.min(toNumber(args[0] ?? 0, line, 'min'), toNumber(args[1] ?? 0, line, 'min'))
    case 'sqrt':
      return Math.sqrt(toNumber(args[0] ?? 0, line, 'sqrt'))
    case 'pow':
      return Math.pow(toNumber(args[0] ?? 0, line, 'pow'), toNumber(args[1] ?? 0, line, 'pow'))
    case 'clear':
      state.scene.push({ type: 'clear' })
      return 0
    case 'color': {
      const raw = formatValue(args[0] ?? '').trim()
      const name = COLOR_ALIASES[raw] ?? raw
      if (!STAGE_COLORS.includes(name)) {
        throw new CppRuntimeError(
          `不认识「${raw}」这种颜色`,
          line,
          `可以用的颜色：${STAGE_COLORS.map((item) => COLOR_LABELS[item]).join('、')}`,
        )
      }
      state.currentColor = name
      return 0
    }
    case 'star':
      pushSceneCommand(
        state,
        { type: 'star', x: argNumber(0, 'x'), y: argNumber(1, 'y'), color: state.currentColor },
        line,
      )
      return 0
    case 'circle':
      pushSceneCommand(
        state,
        {
          type: 'circle',
          x: argNumber(0, 'x'),
          y: argNumber(1, 'y'),
          radius: argNumber(2),
          color: state.currentColor,
        },
        line,
      )
      return 0
    case 'rect':
      pushSceneCommand(
        state,
        {
          type: 'rect',
          x: argNumber(0, 'x'),
          y: argNumber(1, 'y'),
          width: argNumber(2),
          height: argNumber(3),
          color: state.currentColor,
        },
        line,
      )
      return 0
    case 'line':
      pushSceneCommand(
        state,
        {
          type: 'line',
          x1: argNumber(0, 'x'),
          y1: argNumber(1, 'y'),
          x2: argNumber(2, 'x'),
          y2: argNumber(3, 'y'),
          color: state.currentColor,
        },
        line,
      )
      return 0
    case 'text':
      pushSceneCommand(
        state,
        {
          type: 'text',
          text: formatValue(args[0] ?? ''),
          x: argNumber(1, 'x'),
          y: argNumber(2, 'y'),
          color: state.currentColor,
        },
        line,
      )
      return 0

    case 'wait': {
      const seconds = toNumber(args[0] ?? 0, line, '等待时间')
      if (seconds <= 0 || seconds > 5) {
        throw new CppRuntimeError(
          '等待时间要写在 0 到 5 秒之间',
          line,
          '比如 wait(0.2); 表示这一帧停 0.2 秒',
        )
      }
      state.waitCount += 1
      state.totalWaitSeconds += seconds
      if (state.waitCount > 300 || state.totalWaitSeconds > 30) {
        throw new CppRuntimeError(
          '动画加起来太长了（超过 30 秒）',
          line,
          '把等待时间调小一点，或者少画几帧',
        )
      }
      state.scene.push({ type: 'wait', seconds })
      return 0
    }
    case 'key':
      // 游戏里按的键写在界面的输入框里，一行一个
      return readInput(state, line)

    default:
      break
  }

  const fn = state.functions.get(expression.callee)
  if (!fn) {
    throw new CppRuntimeError(
      `还没有一个叫「${expression.callee}」的函数`,
      line,
      '检查一下函数名有没有打错，比如 add(1, 2)',
    )
  }

  if (args.length !== fn.params.length) {
    throw new CppRuntimeError(
      `函数「${fn.name}」需要 ${fn.params.length} 个材料，但给了 ${args.length} 个`,
      line,
      '看看圆括号里的数字是不是少写了',
    )
  }

  if (state.callDepth > 40) {
    throw new CppRuntimeError('函数调用太深了，可能是函数一直在调用自己', line)
  }

  const localScope = createScope(null)
  fn.params.forEach((param, index) => {
    localScope.variables.set(param.name, {
      value: coerceValue(args[index], param.typeName, line, param.name),
      typeName: param.typeName,
    })
  })

  state.callDepth += 1
  const signal = runBlock(state, localScope, fn.body)
  state.callDepth -= 1

  if (signal.type === 'return') return signal.value
  return 0
}

function evaluate(state: State, scope: Scope, expression: Expression): Value {
  switch (expression.kind) {
    case 'number':
      return expression.value
    case 'string':
      return expression.value
    case 'char':
      return expression.value
    case 'bool':
      return expression.value
    case 'identifier': {
      if (expression.name === 'cout') return COUT
      if (expression.name === 'cin') return CIN
      if (expression.name === 'endl') return '\n'

      const found = lookupVariable(scope, expression.name)
      if (!found) {
        throw new CppRuntimeError(
          `还没有一个叫「${expression.name}」的盒子`,
          expression.line,
          `先用 int ${expression.name} = 0; 把它建出来`,
        )
      }
      return found.variable.value
    }
    case 'binary':
      return evaluateBinary(state, scope, expression)
    case 'unary': {
      const value = evaluate(state, scope, expression.operand)
      if (expression.operator === '-') return -toNumber(value, expression.line, '负号')
      return !truthy(value)
    }
    case 'assign': {
      const value = evaluate(state, scope, expression.value)

      if (expression.operator === '=') {
        assignTarget(state, scope, expression.target, value, expression.line)
        return value
      }

      const current = evaluate(state, scope, expression.target)
      const operator = expression.operator.slice(0, 1)
      const floatOperands =
        isFloatExpression(state, scope, expression.target) ||
        isFloatExpression(state, scope, expression.value)
      const computed = computeBinary(operator, current, value, expression.line, floatOperands)
      assignTarget(state, scope, expression.target, computed, expression.line)
      return computed
    }
    case 'update': {
      const current = toNumber(evaluate(state, scope, expression.target), expression.line, '自增自减')
      const next = expression.operator === '++' ? current + 1 : current - 1
      assignTarget(state, scope, expression.target, next, expression.line)
      return expression.prefix ? next : current
    }
    case 'call':
      return evaluateCall(state, scope, expression)
    case 'index': {
      const container = evaluate(state, scope, expression.target)
      if (!isArray(container)) {
        throw new CppRuntimeError('只有一排格子才能用方括号', expression.line, '比如 scores[0]')
      }
      const index = Math.trunc(toNumber(evaluate(state, scope, expression.index), expression.line, '方括号里'))
      if (index < 0 || index >= container.items.length) {
        throw new CppRuntimeError(
          `这一排只有 ${container.items.length} 个格子，从 0 数到 ${container.items.length - 1}`,
          expression.line,
          '第一个格子的编号是 0 哦',
        )
      }
      return container.items[index]
    }
    default:
      throw new CppRuntimeError('这一句还看不懂', 1)
  }
}

function declareFromDeclarator(
  state: State,
  scope: Scope,
  typeName: TypeName,
  declarator: Declarator,
  line: number,
): void {
  if (declarator.arraySize || declarator.arrayItems) {
    let size = 0
    if (declarator.arraySize) {
      size = Math.trunc(toNumber(evaluate(state, scope, declarator.arraySize), line, '方括号里'))
    }
    if (size < 0) {
      throw new CppRuntimeError('一排格子的数量不能是负数', line)
    }
    if (size > 1000) {
      throw new CppRuntimeError('格子的数量太多了', line, '先试试 3 个或者 5 个')
    }

    const items: Value[] = Array.from({ length: size }, () => coerceValue(0, typeName, line, declarator.name))

    if (declarator.arrayItems) {
      if (!declarator.arraySize) {
        items.length = 0
      }
      if (declarator.arrayItems.length > items.length && declarator.arraySize) {
        throw new CppRuntimeError('大括号里的数字比格子还多', line, '数一数是不是多写了')
      }
      declarator.arrayItems.forEach((item, index) => {
        const value = evaluate(state, scope, item)
        if (index < items.length) {
          items[index] = coerceValue(value, typeName, line, declarator.name)
        } else {
          items.push(coerceValue(value, typeName, line, declarator.name))
        }
      })
    }

    scope.variables.set(declarator.name, {
      value: { kind: 'array', elementType: typeName, items },
      typeName,
    })
    return
  }

  const value = declarator.init
    ? coerceValue(evaluate(state, scope, declarator.init), typeName, line, declarator.name)
    : defaultFor(typeName)

  scope.variables.set(declarator.name, { value, typeName })
}

function defaultFor(typeName: TypeName): Value {
  switch (typeName) {
    case 'bool':
      return false
    case 'string':
      return ''
    case 'char':
      return ''
    default:
      return 0
  }
}

function runBlock(state: State, scope: Scope, block: BlockStatement): Signal {
  const blockScope = createScope(scope)
  for (const statement of block.body) {
    const signal = runStatement(state, blockScope, statement)
    if (signal.type !== 'normal') return signal
  }
  return { type: 'normal' }
}

/** 判断一个表达式是不是「小数类型」——决定除法要不要取整 */
function isFloatExpression(state: State, scope: Scope, expression: Expression): boolean {
  switch (expression.kind) {
    case 'number':
      return expression.isFloat
    case 'identifier': {
      const found = lookupVariable(scope, expression.name)
      if (!found) return false
      return found.variable.typeName === 'double' || found.variable.typeName === 'float'
    }
    case 'char':
    case 'bool':
    case 'string':
      return false
    case 'unary':
      return isFloatExpression(state, scope, expression.operand)
    case 'binary':
      if (['==', '!=', '<', '>', '<=', '>=', '&&', '||'].includes(expression.operator)) return false
      return (
        isFloatExpression(state, scope, expression.left) ||
        isFloatExpression(state, scope, expression.right)
      )
    case 'assign':
      return isFloatExpression(state, scope, expression.target)
    case 'update':
      return false
    case 'index': {
      if (expression.target.kind !== 'identifier') return false
      const found = lookupVariable(scope, expression.target.name)
      if (!found) return false
      return found.variable.typeName === 'double' || found.variable.typeName === 'float'
    }
    case 'call': {
      if (expression.callee === 'sqrt' || expression.callee === 'pow') return true
      const fn = state.functions.get(expression.callee)
      if (fn) return fn.returnType === 'double' || fn.returnType === 'float'
      return expression.args.some((arg) => isFloatExpression(state, scope, arg))
    }
    default:
      return false
  }
}

/** 复合语句本身不记轨迹：不然循环行会拖到循环结束才出现 */
const COMPOUND_KINDS = new Set(['if', 'while', 'for', 'block'])

function runStatement(state: State, scope: Scope, statement: Statement): Signal {
  countStep(state, statement.line)

  if (COMPOUND_KINDS.has(statement.kind)) {
    return executeStatement(state, scope, statement)
  }

  try {
    const signal = executeStatement(state, scope, statement)
    // 记录「这一行执行完之后」的变量状态，方便逐行演示
    recordTrace(state, statement.line, scope)
    return signal
  } catch (error) {
    // 出错的那一行也要留下轨迹，这样逐行演示能停在出问题的地方
    recordTrace(state, statement.line, scope)
    throw error
  }
}

function executeStatement(state: State, scope: Scope, statement: Statement): Signal {
  switch (statement.kind) {
    case 'empty':
      return { type: 'normal' }

    case 'block':
      return runBlock(state, scope, statement)

    case 'varDecl':
      statement.declarators.forEach((declarator) => {
        declareFromDeclarator(state, scope, statement.typeName, declarator, statement.line)
      })
      return { type: 'normal' }

    case 'exprStmt':
      evaluate(state, scope, statement.expression)
      return { type: 'normal' }

    case 'if': {
      const condition = evaluate(state, scope, statement.condition)
      if (truthy(condition)) return runStatement(state, scope, statement.thenBranch)
      if (statement.elseBranch) return runStatement(state, scope, statement.elseBranch)
      return { type: 'normal' }
    }

    case 'while': {
      while (truthy(evaluate(state, scope, statement.condition))) {
        countStep(state, statement.line)
        const signal = runStatement(state, scope, statement.body)
        if (signal.type === 'break') break
        if (signal.type === 'return') return signal
      }
      return { type: 'normal' }
    }

    case 'for': {
      const loopScope = createScope(scope)
      if (statement.init) runStatement(state, loopScope, statement.init)

      while (statement.condition ? truthy(evaluate(state, loopScope, statement.condition)) : true) {
        countStep(state, statement.line)
        const signal = runStatement(state, loopScope, statement.body)
        if (signal.type === 'break') break
        if (signal.type === 'return') return signal
        if (statement.update) evaluate(state, loopScope, statement.update)
      }
      return { type: 'normal' }
    }

    case 'return': {
      const value = statement.value ? evaluate(state, scope, statement.value) : 0
      return { type: 'return', value }
    }

    case 'break':
      return { type: 'break' }

    case 'continue':
      return { type: 'continue' }

    case 'function':
      throw new CppSyntaxError('函数要写在最外面', statement.line, '把函数定义放到其他代码的上方')

    default:
      return { type: 'normal' }
  }
}

export function runProgram(program: Program, options: RunCppOptions = {}): RunCppResult {
  const functions = new Map<string, FunctionStatement>()
  const topLevel: Statement[] = []

  program.statements.forEach((statement) => {
    if (statement.kind === 'function') functions.set(statement.name, statement)
    else topLevel.push(statement)
  })

  const state: State = {
    functions,
    scene: [],
    currentColor: 'orange',
    sceneLimit: options.maxSceneCommands ?? 600,
    waitCount: 0,
    totalWaitSeconds: 0,
    output: [],
    outputLength: 0,
    inputTokens: (options.input ?? []).flatMap((line) => line.split(/\s+/)).filter((token) => token.length > 0),
    inputIndex: 0,
    steps: 0,
    maxSteps: options.maxSteps ?? 100_000,
    maxOutput: options.maxOutput ?? 8_000,
    maxTrace: options.maxTrace ?? 400,
    trace: [],
    callDepth: 0,
  }

  const globalScope = createScope(null)

  try {
    const main = functions.get('main')

    if (main) {
      if (main.params.length > 0) {
        throw new CppRuntimeError('main 后面不用写参数', main.line, '写成 int main() { ... } 就可以')
      }
      runBlock(state, globalScope, main.body)
    } else {
      topLevel.forEach((statement) => {
        runStatement(state, globalScope, statement)
      })
    }

    return {
      ok: true,
      output: state.output.join(''),
      steps: state.steps,
      trace: state.trace,
      variables: snapshotVariables(globalScope),
      scene: state.scene,
    }
  } catch (error) {
    const isKnown = error instanceof CppSyntaxError || error instanceof CppRuntimeError
    const line = isKnown ? (error as CppSyntaxError).line : 1
    const hint = isKnown ? (error as CppSyntaxError).hint : undefined
    const message = error instanceof Error ? error.message : '程序出错了'

    return {
      ok: false,
      output: state.output.join(''),
      error: {
        kind: error instanceof CppSyntaxError ? 'syntax' : 'runtime',
        message,
        hint,
        line,
      },
      steps: state.steps,
      trace: state.trace,
      variables: snapshotVariables(globalScope),
      scene: state.scene,
    }
  }
}

export function runCpp(source: string, options: RunCppOptions = {}): RunCppResult {
  try {
    return runProgram(parseCpp(source), options)
  } catch (error) {
    const isKnown = error instanceof CppSyntaxError || error instanceof CppRuntimeError
    return {
      ok: false,
      output: '',
      error: {
        kind: error instanceof CppSyntaxError ? 'syntax' : 'runtime',
        message: error instanceof Error ? error.message : '程序出错了',
        hint: isKnown ? (error as CppSyntaxError).hint : undefined,
        line: isKnown ? (error as CppSyntaxError).line : 1,
      },
      steps: 0,
      trace: [],
      variables: {},
      scene: [],
    }
  }
}

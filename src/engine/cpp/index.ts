export { tokenize, CppSyntaxError, CppRuntimeError } from './lexer.ts'
export { parseCpp } from './parser.ts'
export {
  runCpp,
  runProgram,
  formatValue,
  countSceneKinds,
  resolveFrames,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  STAGE_COLORS,
  COLOR_ALIASES,
  COLOR_LABELS,
} from './interpreter.ts'
export type {
  RunCppOptions,
  RunCppResult,
  RunCppError,
  TraceEntry,
  SceneCommand,
  SceneCounts,
  SceneFrame,
} from './interpreter.ts'
export type { Program, Statement, Expression, TypeName } from './ast.ts'
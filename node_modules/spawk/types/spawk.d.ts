import { spawn as realSpawn, ChildProcess } from "child_process"

type CommandType = Parameters<typeof realSpawn>[0]
type ArgsType = Parameters<typeof realSpawn>[1]
type OptionsType = Parameters<typeof realSpawn>[2]

/**
 * Intercept and mock a call to child_process.spawn. Returns a Interceptor object, see below for more info. Parameters
 * are defined as follows:
 *
 * @param command Command to intercept and mock. Can either be a string, a RegExp, or a function. The interceptor will
 *   mock a given call if the string matches exactly, or the RegExp matches, or the function returns true. The function
 *   will be passed three parameters: the command, args, and options passed to `child_process.spawn`. The function will
 *   be called under the context of the Interceptor, so you will have access to the methods and attributes described below.
 * @param arguments Optional arguments that must accompany the given command in order to be mocked. Can either be an
 *   array or a function. The interceptor will mock a given call if the array matches exactly, or if the function
 *   returns true. The function will be passed one parameter: the args passed to `child_process.spawn`. The function
 *   will be called under the context of the Interceptor, so you will have access to the methods and attributes described below.
 * @param options Optional options that must accompany the given command in order to be mocked. Can either be an object
 *   or a function. The interceptor will mock a given call if all of the attributes in these options match, or if the
 *   function returns true. If an object, only the attributes you give are matched, others do not affect whether or not
 *   it matches. If a function, it will be passed one parameter: the options passed to `child_process.spawn`. The
 *   function will be called under the context of the Interceptor, so you will have access to the methods and attributes
 *   described below. When generating stdin/stdin/stdout streams for the interceptor, if the call to spawn specifies
 *   inherit for their modes they will be mapped to process.stdin etc.
 *
 *   By default, any calls to spawn that do not match an existing mock will pass through to the original spawn. See
 *   `preventUnmatched` for more info on how to change this. Each intercepted call will only be used once, so if you
 *   want to intercept multiple calls to the same command you need to call spawk.spawn for each call you want to be
 *   intercepted. They will be used in the order that they were created.
 */
export function spawn(
  command:
    | CommandType
    | RegExp
    | ((commandToCheck: CommandType, argsToCheck?: ArgsType, optionsToCheck?: OptionsType) => boolean),
  args?: ArgsType | ((argsToCheck?: ArgsType) => boolean),
  options?: OptionsType | ((optionsToCheck?: OptionsType) => boolean)
): Interceptor

/**
 * Allow calls to `child_process.spawn` that do not match any interceptor to pass through to node's implementation. This
 * is the default state.
 */
export function allowUnmatched(): void

/**
 * Allow calls to `child_process.spawn` that do not match any interceptor from passing through to node's implementation.
 * An unmatched call will cause an exception to be thrown.
 */
export function preventUnmatched(): void

/**
 * Ensure that all configured interceptors have been called. If they have this will return true. If they have not this
 * will throw an exception.
 */
export function done(): boolean

/** Remove any currently configured interceptors. */
export function clean(): void

/**
 * Unloads spawk from intercepting `child_process.spawn` calls completely. This also removes any currently configured
 * interceptors.
 */
export function unload(): void

/**
 * Loads spawk for intercepting `child_process.spawn` calls. This is called by default, you should only need to call
 * this if you have previously called spawk.unload() for some reason.
 */
export function load(): void

declare class Interceptor {
  /** Boolean that denotes whether or not this interceptor has been called yet */
  called: boolean

  /** Helpful string representation of the interceptor. */
  description: string

  /**
   * When the interceptor has been called, this will be an object that contains the command, args, and options that were
   * actually called.
   */
  calledWith: { command: CommandType; args: ArgsType; options: OptionsType }

  /**
   * Tells the interceptor what status code to exit with. Defaults to 0. This can be either a number or a function that
   * returns a number. The function can also be async or return a Promise. The function will be called with `this` set
   * to the interceptor.
   *
   * @default `0`
   */
  exit(code?: number | (() => number | Promise<number>)): Interceptor

  /**
   * Tells the interceptor what signal to exit with. Defaults to null (exit with no signal). This can be either a string
   * or a function that returns a string. The function can also be async or return a Promise. The function will be
   * called with `this` set to the interceptor.
   *
   * @default `null`
   */
  signal(signal?: null | string | (() => string | Promise<string>)): Interceptor

  /**
   * Tells the interceptor what to write to stdout before exit. This can be either a string, buffer, or a function that
   * returns a string or buffer. The function can also be async or return a Promise. The function will be called with
   * `this` set to the interceptor.
   */
  stdout(data: string | Buffer | (() => string | Buffer | Promise<string> | Promise<Buffer>)): Interceptor

  /**
   * Tells the interceptor what to write to stderr before exit. This can be either a string, buffer, or a function that
   * returns a string or buffer. The function can also be async or return a Promise. The function will be called with
   * `this` set to the interceptor.
   */
  strerr(data: string | Buffer | (() => string | Buffer | Promise<string> | Promise<Buffer>)): Interceptor

  private child: ChildProcess

  private match: typeof spawn

  private run: typeof spawn

  private toString(): string
}

export type CtxMapper<T = unknown> = (
  fn: (ctx: T) => void | Promise<void>
) => void | Promise<void>;

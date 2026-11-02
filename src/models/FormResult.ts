export type FormResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; title: string; message: string };

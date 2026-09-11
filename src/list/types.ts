import type { Streamable } from "../stream/index.ts";
import type { Display, IntoIterator, IterableLike } from "../types.ts";

interface List<E> extends IterableLike<E>, Display, Streamable<E>, IntoIterator<E> {
  toArray: () => E[];
}

export type { List };

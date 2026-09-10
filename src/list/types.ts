import type { Streamable } from "../stream/index.ts";
import type { Display, IntoIterator } from "../types.ts";

interface List<E>
  extends Iterable<E, void, E | undefined>, Display, Streamable<E>, IntoIterator<E> {
  toArray: () => E[];
}

export type { List };

import type { ArrayList, LinkedList } from "../list/index.ts";
import type { Mapper, Predicate, Reducer, Consumer, IterableLike } from "../types.ts";

interface Streamable<E> extends IterableLike<E> {
  stream: () => Stream<E>;
}

enum Collectors {
  ArrayList,
  LinkedList,
}

interface Stream<E> {
  map: <T>(mapper: Mapper<E, T>) => Stream<T>;
  filter: (predicate: Predicate<E>) => Stream<E>;
  reduce: {
    (reducer: Reducer<E>): E;
    (reducer: Reducer<E>, initialValue: E): E;
  };
  reduceRight: {
    (reducer: Reducer<E>): E;
    (reducer: Reducer<E>, initialValue: E): E;
  };
  forEach: (consumer: Consumer<E>) => void;
  limit: (count: number) => Stream<E>;
  collect: {
    (): ArrayList<E>;
    (collectors: Collectors.ArrayList): ArrayList<E>;
    (collectors: Collectors.LinkedList): LinkedList<E>;
  };
}

export type { Stream, Streamable };
export { Collectors };

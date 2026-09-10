import type { Consumer, Predicate, Mapper, Reducer } from "../types.ts";
import { ArrayList, LinkedList } from "../list/index.ts";
import { Collectors, type Stream as S } from "./types.ts";

class Stream<E> implements S<E> {
  constructor(private iterable: Iterable<E, void, E | undefined>) {}

  map<T>(mapFn: Mapper<E, T>): Stream<T> {
    return new Stream<T>([...this.iterable].map((e) => mapFn(e)));
  }

  filter(predicate: Predicate<E>): S<E> {
    return new Stream<E>([...this.iterable].filter((e) => predicate(e)));
  }

  reduce(reducer: Reducer<E>): E;
  reduce(reducer: Reducer<E>, initialValue: E): E;
  reduce(reducer: Reducer<E>, initialValue?: E): E {
    if (initialValue) {
      return [...this.iterable].reduce((pv, cv) => reducer(pv, cv), initialValue);
    }
    return [...this.iterable].reduce((pv, cv) => reducer(pv, cv));
  }

  reduceRight(reducer: Reducer<E>): E;
  reduceRight(reducer: Reducer<E>, initialValue: E): E;
  reduceRight(reducer: Reducer<E>, initialValue?: E): E {
    if (initialValue) {
      return [...this.iterable].reduceRight((pv, cv) => reducer(pv, cv), initialValue);
    }
    return [...this.iterable].reduceRight((pv, cv) => reducer(pv, cv));
  }

  forEach(consumer: Consumer<E>): void {
    [...this.iterable].forEach((element) => consumer(element));
  }

  limit(count: number): S<E> {
    return new Stream<E>([...this.iterable].slice(0, count));
  }

  collect(): ArrayList<E>;
  collect(collector: Collectors.ArrayList): ArrayList<E>;
  collect(collector: Collectors.LinkedList): LinkedList<E>;
  collect(collector?: Collectors) {
    switch (collector) {
      case Collectors.LinkedList: {
        return new LinkedList(this.iterable);
      }
      case Collectors.ArrayList:
      default: {
        return new ArrayList(this.iterable);
      }
    }
  }
}

export default Stream;

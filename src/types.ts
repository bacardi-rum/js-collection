interface Clonable<E> {
  clone(): E;
}

interface Display {
  toString(): string;
}

interface IntoIterator<E> {
  descendingIterator: () => IterableIteratorLike<E>;
  iterator: () => IterableIteratorLike<E>;
}

type IterableLike<E> = Iterable<E, void, E | undefined>;

type IteratorLike<E> = Iterator<E, void, E | undefined>;

type IterableIteratorLike<E> = IterableIterator<E, void, E | undefined>;

type UnaryOperator<E> = (element: E) => E;

type Comparator<E> = (e1: E, e2: E) => number;

type Predicate<E> = (element: E) => boolean;

type Consumer<E> = (element: E) => void;

type Mapper<E, T> = (element: E) => T;

type Reducer<E> = (previousValue: E, currentValue: E) => E;

export type {
  Clonable,
  Comparator,
  Display,
  UnaryOperator,
  Predicate,
  Consumer,
  Mapper,
  Reducer,
  IntoIterator,
  IterableLike,
  IterableIteratorLike,
  IteratorLike,
};

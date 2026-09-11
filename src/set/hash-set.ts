import Stream, { type Stream as S, type Streamable } from "../stream/index.ts";
import type {
  Clonable,
  Display,
  IntoIterator,
  IterableIteratorLike,
  IterableLike,
  IteratorLike,
} from "../types.ts";

class HashSet<E>
  implements IntoIterator<E>, IterableLike<E>, Display, Clonable<HashSet<E>>, Streamable<E>
{
  private set = new Set<E>();

  constructor(iterable?: IterableLike<E>) {
    this.addAll(iterable ?? []);
  }

  public add(element: E): boolean {
    if (this.set.has(element)) return false;
    this.set.add(element);
    return true;
  }

  public remove(element: E): boolean {
    if (!this.set.has(element)) return false;
    this.set.delete(element);
    return true;
  }

  public contains(element: E): boolean {
    return this.set.has(element);
  }

  public size(): number {
    return this.set.size;
  }

  public isEmpty(): boolean {
    return this.set.size === 0;
  }

  public clear(): void {
    this.set.clear();
  }

  public *iterator(): IterableIteratorLike<E> {
    for (const value of this.set.values()) {
      yield value;
    }
  }

  /**
   * @description Despite its name, returns the same as iterator().
   */
  public descendingIterator = this.iterator.bind(this);

  public toArray(): E[] {
    return [...this.set.values()];
  }

  public addAll(iterable: IterableLike<E>): boolean {
    const array = [...iterable];
    const hasChanged = array.some((element) => !this.set.has(element));
    array.forEach((element) => this.set.add(element));
    return hasChanged;
  }

  public retainAll(iterable: IterableLike<E>): boolean {
    const array = [...iterable];
    const intersection = array.filter((element) => this.set.has(element));
    const hasChanged = intersection.length > 0 && intersection.length < this.set.size;
    intersection.forEach((element) => {
      if (!this.set.has(element)) {
        this.set.delete(element);
      }
    });
    return hasChanged;
  }

  public removeAll(iterable: IterableLike<E>): boolean {
    const array = [...iterable];
    const hasChanged = array.some((element) => this.set.has(element));
    array.forEach((element) => {
      if (this.set.has(element)) {
        this.set.delete(element);
      }
    });
    return hasChanged;
  }

  public toString(): string {
    return [...this].toString();
  }

  *[Symbol.iterator](): IteratorLike<E> {
    for (const value of this.set.values()) {
      yield value;
    }
  }

  public clone(): HashSet<E> {
    return new HashSet(this);
  }

  public static of<E>(iterable?: IterableLike<E>): HashSet<E> {
    return new HashSet(iterable);
  }

  public stream(): S<E> {
    return new Stream(this);
  }
}

export default HashSet;

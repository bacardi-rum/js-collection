import type { Clonable, Comparator, Consumer, Predicate, UnaryOperator } from "../types.ts";
import Stream, { type Stream as S } from "../stream/index.ts";
import type { List } from "./types.ts";

class ArrayList<E> implements List<E>, Clonable<ArrayList<E>> {
  private array: E[] = [];

  constructor(iterable?: Iterable<E, void, E | undefined>) {
    this.array.push(...(iterable ?? []));
  }

  stream(): S<E> {
    return new Stream<E>(this.array);
  }

  *[Symbol.iterator](): Iterator<E, void, E | undefined> {
    for (const element of this.array) {
      yield element;
    }
  }

  public clone(): ArrayList<E> {
    return new ArrayList<E>(this.array);
  }

  public add(element: E, index = this.array.length): boolean {
    if (index < 0 || index > this.array.length) return false;
    this.array.splice(index, 0, element);
    return true;
  }

  public addAll(iterable: Iterable<E, void, E | undefined>, index = this.array.length): boolean {
    if (index < 0 || index > this.array.length) return false;
    this.array.splice(index, 0, ...iterable);
    return true;
  }

  public clear(): void {
    this.array.length = 0;
  }

  public contains(element: E): boolean {
    return this.array.indexOf(element) >= 0;
  }

  public get(index: number): E | undefined {
    return this.array.at(index);
  }

  public indexOf(element: E): number {
    return this.array.indexOf(element);
  }

  public removeAll(iterable: Iterable<E, void, E | undefined>): boolean {
    const set = new Set<E>(iterable);
    const newArr = this.array.filter((element) => !set.has(element));
    const hasChanged = newArr.length !== this.array.length;
    this.array.splice(0, this.array.length, ...newArr);
    return hasChanged;
  }

  public remove(index: number): E | undefined;
  public remove(element: E): boolean;
  public remove(indexOrElement: number | E): boolean | E | undefined {
    if (typeof indexOrElement === "number") {
      const index = indexOrElement;
      if (index < 0 || index >= this.array.length) return undefined;
      const [removed] = this.array.splice(index, 1);
      return removed;
    }
    const index = this.array.indexOf(indexOrElement);
    if (index < 0) return false;
    this.array.splice(index, 1);
    return true;
  }

  public size(): number {
    return this.array.length;
  }

  public isEmpty(): boolean {
    return this.array.length === 0;
  }

  public subList(fromIndex: number, toIndex: number): ArrayList<E> {
    if (toIndex <= fromIndex) return new ArrayList<E>();
    return new ArrayList<E>(
      this.array.slice(Math.max(0, fromIndex), Math.min(this.array.length, toIndex)),
    );
  }

  public set(index: number, element: E): E | undefined {
    if (index < 0 || index >= this.array.length) return undefined;
    const original = this.array[index];
    this.array[index] = element;
    return original;
  }

  public sort(comparator: Comparator<E>): void {
    this.array.sort(comparator);
  }

  public toArray(): E[] {
    return [...this.array];
  }

  public toString(): string {
    return `[${this.array.toString()}]`;
  }

  public lastIndexOf(element: E): number {
    return this.array.lastIndexOf(element);
  }

  public retainAll(iterable: Iterable<E, void, E | undefined>): boolean {
    const set = new Set<E>(iterable);
    const newArr = this.array.filter((element) => set.has(element));
    const hasChanged = newArr.length !== this.array.length;
    this.array.splice(0, this.array.length, ...newArr);
    return hasChanged;
  }

  public containsAll(iterable: Iterable<E, void, E | undefined>): boolean {
    const set = new Set<E>(this.array);
    return [...iterable].every((element) => set.has(element));
  }

  public removeRange(fromIndex: number, toIndex: number): ArrayList<E> {
    if (toIndex <= fromIndex) return new ArrayList<E>();
    return new ArrayList<E>(
      this.array.splice(Math.max(0, fromIndex), Math.min(this.array.length, toIndex - fromIndex)),
    );
  }

  public replaceAll(operator: UnaryOperator<E>): void {
    this.array.splice(0, this.array.length, ...this.array.map((element) => operator(element)));
  }

  public removeIf(filter: Predicate<E>): boolean {
    const newArr = this.array.filter((element) => !filter(element));
    const hasChanged = newArr.length !== this.array.length;
    this.array.splice(0, this.array.length, ...newArr);
    return hasChanged;
  }

  public forEach(action: Consumer<E>): void {
    this.array.forEach((element) => action(element));
  }

  public static of<E>(iterable?: Iterable<E, void, E | undefined>) {
    return new ArrayList(iterable);
  }

  public *iterator(): IterableIterator<E, void, E | undefined> {
    for (const item of this.array) {
      yield item;
    }
  }

  public *descendingIterator(): IterableIterator<E, void, E | undefined> {
    for (let i = this.array.length - 1; i >= 0; i--) {
      yield this.array[i];
    }
  }
}

export default ArrayList;

import HashSet from "../set/index.ts";
import Stream, { type Stream as S, type Streamable } from "../stream/index.ts";
import type {
  Clonable,
  Consumer,
  Display,
  IntoIterator,
  IterableIteratorLike,
  IterableLike,
  IteratorLike,
  Mapper,
  Reducer,
} from "../types.ts";

type HashMapEntry<K, V> = [K, V];

class HashMap<K, V>
  implements
    IntoIterator<HashMapEntry<K, V>>,
    IterableLike<HashMapEntry<K, V>>,
    Display,
    Clonable<HashMap<K, V>>,
    Streamable<HashMapEntry<K, V>>
{
  private map = new Map<K, V>();

  constructor(iterable?: IterableLike<HashMapEntry<K, V>>) {
    for (const [key, value] of iterable ?? []) {
      this.put(key, value);
    }
  }

  *descendingIterator(): IterableIteratorLike<HashMapEntry<K, V>> {
    const entries = [...this.map.entries()];
    for (let i = entries.length - 1; i >= 0; i--) {
      yield entries[i];
    }
  }

  *iterator(): IterableIteratorLike<HashMapEntry<K, V>> {
    for (const entry of this.map.entries()) {
      yield entry;
    }
  }

  *[Symbol.iterator](): IteratorLike<HashMapEntry<K, V>> {
    yield* this.map.entries();
  }

  public clear(): void {
    this.map.clear();
  }

  public clone(): HashMap<K, V> {
    return new HashMap(this);
  }

  public isEmpty(): boolean {
    return this.map.size === 0;
  }

  public size(): number {
    return this.map.size;
  }

  public put(key: K, value: V): V | undefined {
    const replaced = this.map.get(key);
    this.map.set(key, value);
    return replaced;
  }

  public putAll(map: HashMap<K, V>): void {
    for (const [key, value] of map) {
      this.put(key, value);
    }
  }

  public putIfAbsent(key: K, value: V): V | undefined {
    if (this.map.has(key)) return this.map.get(key);
    this.map.set(key, value);
  }

  public remove(key: K): V | undefined;
  public remove(key: K, value: V): boolean;
  public remove(key: K, value?: V): boolean | V | undefined {
    if (typeof value === "undefined") {
      const removed = this.map.get(key);
      this.map.delete(key);
      return removed;
    }
    if (this.map.has(key) && this.map.get(key) === value) {
      this.map.delete(key);
      return true;
    }
    return false;
  }

  public containsKey(key: K): boolean {
    return this.map.has(key);
  }

  public containsValue(value: V): boolean {
    return [...this.map.values()].includes(value);
  }

  public replace(key: K, newValue: V): V | undefined;
  public replace(key: K, oldValue: V, newValue: V): boolean;
  public replace(key: K, value: V, newValue?: V): boolean | V | undefined {
    if (typeof newValue === "undefined") {
      if (this.map.has(key)) {
        const replaced = this.map.get(key);
        this.map.set(key, value);
        return replaced;
      }
      return;
    }
    const oldValue = value;
    if (this.map.has(key) && this.map.get(key) === oldValue) {
      this.map.set(key, newValue);
      return true;
    }
    return false;
  }

  public replaceAll(mapper: Mapper<HashMapEntry<K, V>, V>): void {
    for (const [key, value] of this.map.entries()) {
      this.map.set(key, mapper([key, value]));
    }
  }

  public get(key: K, defaultValue?: V): V | undefined {
    if (this.map.has(key)) return this.map.get(key);
    return defaultValue;
  }

  public forEach(action: Consumer<HashMapEntry<K, V>>): void {
    for (const entry of this.map.entries()) {
      action(entry);
    }
  }

  public entrySet(): HashSet<HashMapEntry<K, V>> {
    return HashSet.of<HashMapEntry<K, V>>(this.map.entries());
  }

  public keySet(): HashSet<K> {
    return HashSet.of<K>(this.map.keys());
  }

  public valueSet(): HashSet<V> {
    return HashSet.of<V>(this.map.values());
  }

  public merge(key: K, value: V, mapper: Reducer<V>): V {
    const newValue = this.map.has(key) ? mapper(this.map.get(key)!, value) : value;
    this.map.set(key, newValue);
    return newValue;
  }

  public compute(key: K, mapper: Mapper<HashMapEntry<K, V>, V>): V | undefined {
    if (this.map.has(key)) {
      const value = mapper([key, this.map.get(key)!]);
      this.map.set(key, value);
      return value;
    }
    return;
  }

  public computeIfAbsent(key: K, mapper: Mapper<K, V>): V {
    if (this.map.has(key)) return this.map.get(key)!;
    const value = mapper(key);
    this.map.set(key, value);
    return value;
  }

  public computeIfPresent(key: K, mapper: Mapper<HashMapEntry<K, V>, V>): V | undefined {
    if (this.map.has(key)) {
      const value = mapper([key, this.map.get(key)!]);
      this.map.set(key, value);
      return value;
    }
    return;
  }

  toString(): string {
    return `{${[...this.map.entries()].map(([key, value]) => `${key}=${value}`).join(",")}}`;
  }

  public static of<K, V>(iterable?: IterableLike<HashMapEntry<K, V>>): HashMap<K, V> {
    return new HashMap(iterable);
  }

  stream(): S<HashMapEntry<K, V>> {
    return new Stream(this);
  }
}

export default HashMap;

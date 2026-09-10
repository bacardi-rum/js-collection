import ArrayList from "./array-list.ts";
import type { Clonable } from "../types.ts";
import type { List } from "./types.ts";
import Stream, { type Stream as S } from "../stream/index.ts";

interface LinkedListNode<E> {
  element?: E;
  next: LinkedListNode<E> | null;
  prev: LinkedListNode<E> | null;
}

class LinkedList<E> implements List<E>, Clonable<LinkedList<E>> {
  private head: LinkedListNode<E>;
  private tail: LinkedListNode<E>;
  private length: number = 0;

  constructor(iterable?: Iterable<E, void, E | undefined>) {
    this.head = {
      next: null,
      prev: null,
    };
    this.tail = {
      next: null,
      prev: null,
    };
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.addAll(iterable ?? []);
  }

  *[Symbol.iterator](): Iterator<E, void, E | undefined> {
    let p = this.head.next!; // must be tail or LinkedListNode
    // must be LinkedListNode
    while (p.next && p.prev) {
      // element exists
      yield p.element!;
      p = p.next;
    }
  }

  public toString(): string {
    return new ArrayList([...this]).toString();
  }

  public stream(): S<E> {
    return new Stream<E>([...this]);
  }

  public add(element: E, index = this.length): boolean {
    if (index < 0 || index > this.length) return false;
    let p = this.head;
    while (index--) p = p.next!;
    const node: LinkedListNode<E> = {
      element,
      prev: p,
      next: p.next,
    };
    p.next!.prev = node;
    p.next = node;
    this.length++;
    return true;
  }

  public addAll(iterable: Iterable<E, void, E | undefined>, index = this.length): boolean {
    if (index < 0 || index > this.length) return false;
    const list = ArrayList.of(iterable);
    if (list.isEmpty()) return false;
    let p = this.head;
    while (index--) p = p.next!; // must be head or LinkedListNode
    // create a new linked list
    const dummyHead: LinkedListNode<E> = {
      next: null,
      prev: null,
    };
    const tail = list
      .stream()
      .map<LinkedListNode<E>>((element) => ({ element, next: null, prev: null }))
      .reduce((p, node) => {
        p.next = node;
        node.prev = p;
        return node;
      }, dummyHead);
    const head = dummyHead.next!;
    dummyHead.next = null; // 解除引用，dummyHead 失效
    const next = p.next!; // 先保留 p.next
    // 重新连接
    p.next = head;
    head.prev = p;
    tail.next = next;
    next.prev = tail;
    this.length += list.size();
    return true;
  }

  public addFirst(element: E): boolean {
    return this.add(element, 0);
  }

  public addLast(element: E): boolean {
    return this.add(element);
  }

  public clear(): void {
    if (this.length === 0) return;
    let p: LinkedListNode<E> | null = this.head,
      q = p.next;
    // 解除所有引用
    while (p) {
      p.next = null;
      p.prev = null;
      p.element = undefined;
      p = q;
      q = q?.next ?? null;
    }
    // 重新连接 head 和 tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.length = 0;
  }

  public removeFirst(): E | undefined {
    if (this.length === 0) return;
    const node = this.head.next!;
    this.head.next = node.next;
    node.next!.prev = this.head;
    node.next = null;
    node.prev = null;
    this.length--;
    return node.element;
  }

  public removeLast(): E | undefined {
    if (this.length === 0) return;
    const node = this.tail.prev!;
    this.tail.prev = node.prev;
    node.prev!.next = this.tail;
    node.next = null;
    node.prev = null;
    this.length--;
    return node.element;
  }

  public remove(): E | undefined;
  public remove(index: number): E | undefined;
  public remove(element: E): boolean;
  public remove(indexOrElement?: E | number): boolean | E | undefined {
    if (typeof indexOrElement === "number" || typeof indexOrElement === "undefined") {
      if (this.length === 0) return;
      let index = indexOrElement ?? 0;
      if (index < 0 || index > this.length) return;
      let p = this.head;
      while (index--) p = p.next!;
      const removed = p.next!;
      p.next = removed.next;
      removed.next!.prev = p;
      removed.next = null;
      removed.prev = null;
      this.length--;
      return removed.element;
    }
    if (this.length === 0) return false;
    let p = this.head,
      i = 0;
    while (p.next && p.next.element !== indexOrElement) {
      p = p.next;
      i++;
    }
    if (i >= this.length) return false;
    this.remove(i);
    return true;
  }

  public contains(element: E): boolean {
    if (this.length === 0) return false;
    let p = this.head.next!;
    while (p.prev && p.next) {
      if (element === p.element) return true;
      p = p.next;
    }
    return false;
  }

  public get(index: number): E | undefined {
    if (index < 0 || index >= this.length) return;
    if (this.length === 0) return;
    let p = this.head;
    while (index--) p = p.next!;
    return p.next!.element;
  }

  public getFirst(): E | undefined {
    if (this.length === 0) return;
    return this.head.next!.element;
  }

  public getLast(): E | undefined {
    if (this.length === 0) return;
    return this.tail.prev!.element;
  }

  public indexOf(element: E): number {
    if (this.length === 0) return -1;
    let p = this.head,
      index = -1;
    do {
      p = p.next!;
      index++;
      if (p.element === element) return index;
    } while (p.next && p.prev);
    return -1;
  }

  public lastIndexOf(element: E): number {
    if (this.length === 0) return -1;
    let p = this.tail,
      index = this.length;
    do {
      p = p.prev!;
      index--;
      if (p.element === element) return index;
    } while (p.next && p.prev);
    return -1;
  }

  public set(index: number, element: E): E | undefined {
    if (this.length === 0) return;
    if (index < 0 || index >= this.length) return;
    let p = this.head;
    while (index--) p = p.next!;
    const replaced = p.next!.element;
    p.next!.element = element;
    return replaced;
  }

  public clone(): LinkedList<E> {
    return new LinkedList(this);
  }

  public toArray(): E[] {
    return [...this];
  }

  public *iterator(): IterableIterator<E, void, E | undefined> {
    let p = this.head.next!; // must be tail or LinkedListNode
    // must be LinkedListNode
    while (p.next && p.prev) {
      // element exists
      yield p.element!;
      p = p.next;
    }
  }

  public *descendingIterator(): IterableIterator<E, void, E | undefined> {
    let p = this.tail.prev!; // must be tail or LinkedListNode
    // must be LinkedListNode
    while (p.next && p.prev) {
      // element exists
      yield p.element!;
      p = p.prev;
    }
  }

  public size(): number {
    return this.length;
  }

  public static of<E>(iterable?: Iterable<E, void, E | undefined>): LinkedList<E> {
    return new LinkedList(iterable);
  }
}

export default LinkedList;

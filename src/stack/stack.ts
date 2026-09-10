import { LinkedList } from "../list/index.ts";

class Stack<E> {
  private stack = new LinkedList<E>();

  constructor(iterable?: Iterable<E, void, E | undefined>) {
    this.stack.addAll(iterable ?? []);
  }

  public get top(): E | undefined {
    return this.stack.getLast();
  }

  public get size(): number {
    return this.stack.size();
  }

  public get isEmpty(): boolean {
    return this.stack.size() === 0;
  }

  public pop(): E | undefined {
    return this.stack.removeLast();
  }

  public push(element: E): void {
    this.stack.add(element);
  }
}

export default Stack;

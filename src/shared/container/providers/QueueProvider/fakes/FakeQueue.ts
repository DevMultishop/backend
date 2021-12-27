import IQueue from '../models/IQueue';

class FakeQueue implements IQueue {
  public async add<T>(): Promise<T> {
    return 'done' as unknown as T;
  }
}
export default FakeQueue;

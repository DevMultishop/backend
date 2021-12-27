export default interface ICacheProvider {
  save(key: string, value: any, minutes_to_live?: number): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(key: string): Promise<void>;
}

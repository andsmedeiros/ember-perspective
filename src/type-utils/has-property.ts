type Type = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined'
type Constructor = new(...args: never[]) => unknown

export function hasProperty<T extends object>(
  model: T,
  property: PropertyKey,
  type: Type | Constructor
): property is keyof T {
  if (property in model) {
    const value = model[property as keyof T];
    if (typeof type === 'string') {
      return typeof value === type;
    } else {
      return value instanceof type;
    }
  }

  return false;
}

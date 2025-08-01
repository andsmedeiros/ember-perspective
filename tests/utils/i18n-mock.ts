import type { I18nHandler, I18nTranslationOptions } from '#src/common.ts'
import { get } from '@ember/object'

/**
 * A value in the registry is either a string (a leaf)
 * or an object (a node)
 */
type RegistryValue = string | RegistryNode

/**
 * A node is a collection of string entries and registry
 * values, which can be either strings or nested nodes.
 * @see RegistryValue
 */
type RegistryNode = {
  [key: string]: RegistryValue
}

/**
 * The registry root is a parentless registry node
 * @see RegistryNode
 */
type Registry = RegistryNode

/**
 * This gets called if a translation is requested but the
 * registry does not contain a message under the provided key.
 */
export class I18nMockEngineError extends Error {}

/**
 * This is a mock translation engine that implements a minimal
 * translation interface and should correctly mimic `ember-intl`'s
 * service for what we care.
 * It gets a constant key-value mapping during construction and
 * supports querying nested entries.
 */
export class I18nMockEngine implements I18nHandler {
  /**
   * Stores the collection of translation messages stored
   * in a recursive tree structure
   * @private
   */
  private readonly registry: Registry

  /**
   * Constructs a new mock engine for the given registry
   * @param registry A dictionary mapping message keys to
   * messages. This is represented by a recursive tree structure
   * where all leaves are strings.
   * @example
   * const mockEngine = new I18nMockEngine({
   *   anEntry: 'this is a value',
   *   anotherEntry: 'this is another value',
   *   nestedEntry: {
   *     aChild: 'this is a child',
   *     anotherChild: 'this is another child',
   *     anotherNested: {
   *       remember: 'all leaves must be strings'
   *     }
   *   }
   * })
   */
  constructor(registry: Registry) {
    this.registry = registry
  }

  exists(errorKey: string): boolean {
    let currentEntry: RegistryValue = this.registry
    for (const member of errorKey.split('.')) {
      if (typeof currentEntry === 'object' && member in currentEntry) {
        currentEntry = currentEntry[member]!;
        continue;
      }
      return false;
    }
    return typeof currentEntry === 'string'
  }

  t<Options extends I18nTranslationOptions>(errorKey: string, options: Options): string {
    const message = this.getTranslationValue(errorKey)
    return mockTranslation(message, options.constraint, options.field, options.value)
  }

  /**
   * Fetches a translation from the registry.
   * Will throw an exception if the requested key is
   * not found withing the registry.
   * @param key A key representing the requested message
   * withing the registry.
   * Messages withing nested keys can be queried through
   * dot notation (e.g: `validation.user.address.format`)
   * @private
   */
  private getTranslationValue(key: string) {
    const entry = get(this.registry, key)

    if(typeof entry !== 'string') {
      throw new Error(`Could not find message for key ${key}.`)
    }

    return entry
  }

}

/**
 * Returns the canonical translation for a set of parameters.
 * This is also invoked internally by the mock engine to provide a
 * translated message.
 * @param message The translated message
 * @param constraint The name of the failing constraint
 * @param field The name of the failing field
 * @param value The value of the failing field
 */
export function mockTranslation(message: string, constraint: string, field: string | symbol, value: unknown) {
  return [ message, constraint, field, value ]
    .join('|')
}

import type { I18nHandler, I18nTranslationOptions } from '#src/common.ts'

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
    return [errorKey, options.constraint, options.field, options.value]
      .join('|')
  }
}

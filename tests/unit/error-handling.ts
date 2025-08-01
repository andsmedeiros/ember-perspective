import { module, test } from 'qunit'
import { I18nMockEngine, mockTranslation } from '../utils/i18n-mock.ts'
import { messageForError } from '#src/error-handling.ts'

const translationEntry = 'I am translated'
const registry = {
  anEntry: 'this is a value',
  anotherEntry: 'this is another value',
  nestedEntry: {
    aChild: 'this is a child',
    anotherChild: 'this is another child',
    anotherNested: {
      remember: 'all leaves must be strings'
    }
  },
  validation: {
    constraint: translationEntry
  }
}
const mockEngine = new I18nMockEngine(registry)

module('Unit | Error Handling | messageForError', function() {
  test('if present, options.message is always returned', function(assert) {
    const message = 'I am always returned'
    const notMessage = 'I am not returned'

    const withDefaultMessage = messageForError(
      'constraint',
      'field',
      'value',
      notMessage,
      { message },
    )
    assert.equal(withDefaultMessage, message)

    const withI18nAndNoKey = messageForError(
      'constraint',
      'field',
      'value',
      notMessage,
      {
        message,
        i18n: { handler: mockEngine },
      },
    )
    assert.equal(withI18nAndNoKey, message)

    const withI18nAndKey = messageForError(
      'constraint',
      'field',
      'value',
      notMessage,
      {
        message,
        i18n: { handler: mockEngine, key: 'anEntry' },
      },
    )
    assert.equal(withI18nAndKey, message)
  })


  test('messages are fetched from the internationalisation engine', function(assert) {
    const notMessage = 'I am not returned'
    const options = {
      constraint: 'constraint',
      field: 'field',
      value: 'value',
    }

    const withNoKey = messageForError(
      'constraint',
      'field',
      'value',
      notMessage,
      { i18n: { handler: mockEngine } },
    )
    assert.equal(
      withNoKey,
      mockTranslation(registry.validation.constraint, options),
    )

    const withKey = messageForError(
      'constraint',
      'field',
      'value',
      notMessage,
      {
        i18n: {
          handler: mockEngine,
          key: 'anEntry',
        },
      },
    )
    assert.equal(withKey, mockTranslation(registry.anEntry, options))

    const extraOptions = {
      x: 100,
      y: false,
      z: 'true'
    }
    const withKeyAndOptions = messageForError(
      'constraint',
      'field',
      'value',
      notMessage,
      {
        i18n: { handler: mockEngine, key: 'anEntry' },
        ...extraOptions,
      },
    )
    assert.equal(
      withKeyAndOptions,
      mockTranslation(registry.anEntry, {
        ...options,
        ...extraOptions,
      }),
    )
  })

  test('without other options, default message is returned', function(assert) {
    const defaultMessage = 'I am always returned'

    const withOnlyDefaultMessage = messageForError(
      'constraint',
      'field',
      'value',
      defaultMessage,
      {},
    )
    assert.equal(withOnlyDefaultMessage, defaultMessage)

    const withI18nAndUnregisteredConstraint = messageForError(
      'unknown-constraint',
      'field',
      'value',
      defaultMessage,
      { i18n: { handler: mockEngine } },
    )
    assert.equal(withI18nAndUnregisteredConstraint, defaultMessage)

    const withI18nAndUnregisteredKey = messageForError(
      'constraint',
      'field',
      'value',
      defaultMessage,
      {
        i18n: {
          handler: mockEngine,
          key: 'notAnEntry',
        },
      },
    )
    assert.equal(withI18nAndUnregisteredKey, defaultMessage)
  })
})

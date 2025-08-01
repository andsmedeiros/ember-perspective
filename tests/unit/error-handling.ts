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
      'value',
      'field',
      { message },
      'constraint',
      notMessage
    )
    assert.equal(withDefaultMessage, message)

    const withI18nAndNoKey = messageForError(
      'value',
      'field',
      { message, i18n: { handler: mockEngine } },
      'constraint',
      notMessage
    )
    assert.equal(withI18nAndNoKey, message)

    const withI18nAndKey = messageForError(
      'value',
      'field',
      { message, i18n: { handler: mockEngine, key: 'anEntry' } },
      'constraint',
      notMessage
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
      'value',
      'field',
      { i18n: { handler: mockEngine } },
      'constraint',
      notMessage
    )
    assert.equal(
      withNoKey,
      mockTranslation(registry.validation.constraint, options)
    )

    const withKey = messageForError(
      'value',
      'field',
      { i18n: { handler: mockEngine, key: 'anEntry' } },
      'constraint',
      notMessage
    )
    assert.equal(
      withKey,
      mockTranslation(registry.anEntry, options)
    )

    const extraOptions = {
      x: 100,
      y: false,
      z: 'true'
    }
    const withKeyAndOptions = messageForError(
      'value',
      'field',
      {
        i18n: { handler: mockEngine, key: 'anEntry' },
        ...extraOptions
      },
      'constraint',
      notMessage
    )
    assert.equal(
      withKeyAndOptions,
      mockTranslation(registry.anEntry, {
        ...options,
        ...extraOptions
      }),
    );
  })

  test('without other options, default message is returned', function(assert) {
    const defaultMessage = 'I am always returned'

    const withOnlyDefaultMessage = messageForError(
      'value',
      'field',
      { },
      'constraint',
      defaultMessage
    )
    assert.equal(withOnlyDefaultMessage, defaultMessage)

    const withI18nAndUnregisteredConstraint = messageForError(
      'value',
      'field',
      { i18n: { handler: mockEngine } },
      'unknown-constraint',
      defaultMessage
    )
    assert.equal(withI18nAndUnregisteredConstraint, defaultMessage)

    const withI18nAndUnregisteredKey = messageForError(
      'value',
      'field',
      { i18n: { handler: mockEngine, key: 'notAnEntry' } },
      'constraint',
      defaultMessage
    )
    assert.equal(withI18nAndUnregisteredKey, defaultMessage)
  })
})

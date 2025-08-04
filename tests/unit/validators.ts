import { module, test } from 'qunit'
import {
  validatePresence,
  validateAbsence,
  validateType,
  validateInstance,
  validateLength,
  validateEmail,
  validateFormat,
  validateConfirmation,
  validateInclusion,
  validateExclusion,
  validateUUID,
  validateCustom,
} from '#src/validators.ts'
import { InvalidValueForConstraintError } from '#src/error.ts'

module('Unit | Validators | validatePresence', function() {
  test('passes when value is present', function(assert) {
    const model = { name: 'Test' }

    assert.equal(validatePresence(model, 'name', 'test', {}), undefined)
    assert.equal(validatePresence(model, 'name', 0, {}), undefined)
    assert.equal(validatePresence(model, 'name', false, {}), undefined)
    assert.equal(validatePresence(model, 'name', '', {}), undefined)
    assert.equal(validatePresence(model, 'name', [], {}), undefined)
    assert.equal(validatePresence(model, 'name', {}, {}), undefined)
  })

  test('fails when value is absent', function(assert) {
    const model = { name: null }

    assert.notEqual(validatePresence(model, 'name', null, {}), undefined)
    assert.notEqual(validatePresence(model, 'name', undefined, {}), undefined)
  })
})

module('Unit | Validators | validateAbsence', function() {
  test('passes when value is absent', function(assert) {
    const model = { name: null }

    assert.equal(validateAbsence(model, 'name', null, {}), undefined)
    assert.equal(validateAbsence(model, 'name', undefined, {}), undefined)
  })

  test('fails when value is present', function(assert) {
    const model = { name: 'test' }

    assert.notEqual(validateAbsence(model, 'name', 'test', {}), undefined)
    assert.notEqual(validateAbsence(model, 'name', 0, {}), undefined)
    assert.notEqual(validateAbsence(model, 'name', false, {}), undefined)
    assert.notEqual(validateAbsence(model, 'name', '', {}), undefined)
  })
})

module('Unit | Validators | validateType', function() {
  test('passes when type matches', function(assert) {
    const model = { name: 'test' }

    assert.equal(validateType(model, 'name', 'test', { type: 'string' }), undefined)
    assert.equal(validateType(model, 'age', 25, { type: 'number' }), undefined)
    assert.equal(validateType(model, 'active', true, { type: 'boolean' }), undefined)
    assert.equal(validateType(model, 'data', {}, { type: 'object' }), undefined)
    assert.equal(validateType(model, 'fn', () => {}, { type: 'function' }), undefined)
    assert.equal(validateType(model, 'id', Symbol('id'), { type: 'symbol' }), undefined)
    assert.equal(validateType(model, 'big', BigInt(123), { type: 'bigint' }), undefined)
    assert.equal(validateType(model, 'undef', undefined, { type: 'undefined' }), undefined)
  })

  test('fails when type does not match', function(assert) {
    const model = { name: 123 }

    assert.notEqual(validateType(model, 'name', 123, { type: 'string' }), undefined)
    assert.notEqual(validateType(model, 'name', 'test', { type: 'number' }), undefined)
    assert.notEqual(validateType(model, 'name', true, { type: 'string' }), undefined)
  })
})

module('Unit | Validators | validateInstance', function() {
  test('passes when value is instance of constructor', function(assert) {
    const model = { date: new Date() }

    assert.equal(validateInstance(model, 'date', new Date(), { Constructor: Date }), undefined)
    assert.equal(validateInstance(model, 'arr', [], { Constructor: Array }), undefined)
    assert.equal(validateInstance(model, 'err', new Error(), { Constructor: Error }), undefined)
  })

  test('fails when value is not instance of constructor', function(assert) {
    const model = { date: 'not a date' }

    assert.notEqual(validateInstance(model, 'date', 'not a date', { Constructor: Date }), undefined)
    assert.notEqual(validateInstance(model, 'date', 123, { Constructor: Date }), undefined)
    assert.notEqual(validateInstance(model, 'arr', 'not array', { Constructor: Array }), undefined)
  })
})

module('Unit | Validators | validateLength', function() {
  test('throws error when value does not have length property', function(assert) {
    const model = { data: 123 }

    assert.throws(() => {
      validateLength(model, 'data', 123, { minimum: 1 })
    }, InvalidValueForConstraintError)

    assert.throws(() => {
      validateLength(model, 'data', null, { maximum: 5 })
    }, InvalidValueForConstraintError)
  })

  test('passes when length is within bounds', function(assert) {
    const model = { name: 'test' }

    assert.equal(validateLength(model, 'name', 'test', { minimum: 2, maximum: 10 }), undefined)
    assert.equal(validateLength(model, 'name', 'test', { minimum: 4 }), undefined)
    assert.equal(validateLength(model, 'name', 'test', { maximum: 5 }), undefined)
    assert.equal(validateLength(model, 'items', [1, 2, 3], { minimum: 2, maximum: 5 }), undefined)
    assert.equal(validateLength(model, 'empty', '', {}), undefined) // no constraints
  })

  test('fails when length is below minimum', function(assert) {
    const model = { name: 'ab' }

    assert.notEqual(validateLength(model, 'name', 'ab', { minimum: 3 }), undefined)
    assert.notEqual(validateLength(model, 'items', [], { minimum: 1 }), undefined)
  })

  test('fails when length is above maximum', function(assert) {
    const model = { name: 'toolong' }

    assert.notEqual(validateLength(model, 'name', 'toolong', { maximum: 5 }), undefined)
    assert.notEqual(validateLength(model, 'items', [1, 2, 3, 4, 5, 6], { maximum: 5 }), undefined)
  })

  test('fails when length is outside interval', function(assert) {
    const model = { name: 'a' }

    assert.notEqual(validateLength(model, 'name', 'a', { minimum: 2, maximum: 5 }), undefined)
    assert.notEqual(validateLength(model, 'name', 'toolongname', { minimum: 2, maximum: 5 }), undefined)
  })
})

module('Unit | Validators | validateEmail', function() {
  test('throws error when value is not a string', function(assert) {
    const model = { email: 123 }

    assert.throws(() => {
      validateEmail(model, 'email', 123, {})
    }, InvalidValueForConstraintError)

    assert.throws(() => {
      validateEmail(model, 'email', null, {})
    }, InvalidValueForConstraintError)
  })

  test('passes for valid email addresses', function(assert) {
    const model = { email: 'test@example.com' }

    assert.equal(validateEmail(model, 'email', 'test@example.com', {}), undefined)
    assert.equal(validateEmail(model, 'email', 'user.name@domain.co.uk', {}), undefined)
    assert.equal(validateEmail(model, 'email', 'test+tag@example.org', {}), undefined)
  })

  test('fails for invalid email addresses', function(assert) {
    const model = { email: 'invalid' }

    assert.notEqual(validateEmail(model, 'email', 'invalid', {}), undefined)
    assert.notEqual(validateEmail(model, 'email', '@example.com', {}), undefined)
    assert.notEqual(validateEmail(model, 'email', 'test@', {}), undefined)
    assert.notEqual(validateEmail(model, 'email', '', {}), undefined)
  })
})

module('Unit | Validators | validateFormat', function() {
  test('throws error when value is not a string', function(assert) {
    const model = { code: 123 }

    assert.throws(() => {
      validateFormat(model, 'code', 123, { pattern: /^\d+$/ })
    }, InvalidValueForConstraintError)

    assert.throws(() => {
      validateFormat(model, 'code', null, { pattern: /^\d+$/ })
    }, InvalidValueForConstraintError)
  })

  test('passes when format matches', function(assert) {
    const model = { code: '12345' }

    assert.equal(validateFormat(model, 'code', '12345', { pattern: /^\d+$/ }), undefined)
    assert.equal(validateFormat(model, 'name', 'John', { pattern: /^[A-Z][a-z]+$/ }), undefined)
    assert.equal(validateFormat(model, 'any', 'anything', { pattern: /.*/ }), undefined)
  })

  test('fails when format does not match', function(assert) {
    const model = { code: 'abc123' }

    assert.notEqual(validateFormat(model, 'code', 'abc123', { pattern: /^\d+$/ }), undefined)
    assert.notEqual(validateFormat(model, 'name', 'john', { pattern: /^[A-Z][a-z]+$/ }), undefined)
    assert.notEqual(validateFormat(model, 'empty', '', { pattern: /^.+$/ }), undefined)
  })
})

module('Unit | Validators | validateConfirmation', function() {
  test('passes when values match', function(assert) {
    const model = { password: 'secret', passwordConfirmation: 'secret' }

    assert.equal(validateConfirmation(model, 'passwordConfirmation', 'secret', { on: 'password' }), undefined)

    const model2 = { field1: 123, field2: 123 }
    assert.equal(validateConfirmation(model2, 'field2', 123, { on: 'field1' }), undefined)
  })

  test('fails when values do not match', function(assert) {
    const model = { password: 'secret', passwordConfirmation: 'different' }

    assert.notEqual(validateConfirmation(model, 'passwordConfirmation', 'different', { on: 'password' }), undefined)

    const model2 = { field1: 'value', field2: 'othervalue' }
    assert.notEqual(validateConfirmation(model2, 'field2', 'othervalue', { on: 'field1' }), undefined)
  })
})

module('Unit | Validators | validateInclusion', function() {
  test('passes when value is included', function(assert) {
    const model = { status: 'active' }
    const allowedValues = ['active', 'inactive', 'pending']

    assert.equal(validateInclusion(model, 'status', 'active', { in: allowedValues }), undefined)
    assert.equal(validateInclusion(model, 'status', 'pending', { in: allowedValues }), undefined)
  })

  test('fails when value is not included', function(assert) {
    const model = { status: 'unknown' }
    const allowedValues = ['active', 'inactive', 'pending']

    assert.notEqual(validateInclusion(model, 'status', 'unknown', { in: allowedValues }), undefined)
    assert.notEqual(validateInclusion(model, 'status', 'deleted', { in: allowedValues }), undefined)
  })

  test('works with different data types', function(assert) {
    const model = { count: 5 }
    const allowedNumbers = [1, 2, 3, 4, 5]

    assert.equal(validateInclusion(model, 'count', 5, { in: allowedNumbers }), undefined)
    assert.notEqual(validateInclusion(model, 'count', 6, { in: allowedNumbers }), undefined)
  })
})

module('Unit | Validators | validateExclusion', function() {
  test('passes when value is not excluded', function(assert) {
    const model = { username: 'john' }
    const bannedNames = ['admin', 'root', 'system']

    assert.equal(validateExclusion(model, 'username', 'john', { from: bannedNames }), undefined)
    assert.equal(validateExclusion(model, 'username', 'user', { from: bannedNames }), undefined)
  })

  test('fails when value is excluded', function(assert) {
    const model = { username: 'admin' }
    const bannedNames = ['admin', 'root', 'system']

    assert.notEqual(validateExclusion(model, 'username', 'admin', { from: bannedNames }), undefined)
    assert.notEqual(validateExclusion(model, 'username', 'root', { from: bannedNames }), undefined)
  })

  test('works with different data types', function(assert) {
    const model = { port: 80 }
    const reservedPorts = [22, 80, 443]

    assert.equal(validateExclusion(model, 'port', 8080, { from: reservedPorts }), undefined)
    assert.equal(validateExclusion(model, 'port', null, { from: reservedPorts }), undefined)
    assert.equal(validateExclusion(model, 'port', undefined, { from: reservedPorts }), undefined)
    assert.equal(validateExclusion(model, 'port', {}, { from: reservedPorts }), undefined)
    assert.equal(validateExclusion(model, 'port', 'wrong-type', { from: reservedPorts }), undefined)
    assert.notEqual(validateExclusion(model, 'port', 80, { from: reservedPorts }), undefined)
  })
})

module('Unit | Validators | validateUUID', function() {
  test('throws error when value is not a string', function(assert) {
    const model = { id: 123 }

    assert.throws(() => {
      validateUUID(model, 'id', 123, {})
    }, InvalidValueForConstraintError)

    assert.throws(() => {
      validateUUID(model, 'id', null, {})
    }, InvalidValueForConstraintError)
  })

  test('passes for valid UUIDs', function(assert) {
    const model = { id: '123e4567-e89b-12d3-a456-426614174000' }

    assert.equal(validateUUID(model, 'id', '123e4567-e89b-12d3-a456-426614174000', {}), undefined)
    assert.equal(validateUUID(model, 'id', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', {}), undefined)
  })

  test('fails for invalid UUIDs', function(assert) {
    const model = { id: 'not-a-uuid' }

    assert.notEqual(validateUUID(model, 'id', 'not-a-uuid', {}), undefined)
    assert.notEqual(validateUUID(model, 'id', '123', {}), undefined)
    assert.notEqual(validateUUID(model, 'id', '', {}), undefined)
    assert.notEqual(validateUUID(model, 'id', '123e4567-e89b-12d3-a456', {}), undefined) // too short
    assert.notEqual(validateUUID(model, 'id', 'f47ac10b-58cc-0372-a567-0e02b2c3d479', {}), undefined) // wrong version
    assert.notEqual(validateUUID(model, 'id', 'f47ac10b-58cc-4372-c567-0e02b2c3d479', {}), undefined) // wrong variant
  })
})

module('Unit | Validators | validateCustom', function() {
  test('calls the custom validator function and returns its result', function(assert) {
    const model = { value: 'test' }
    let called = false

    const passingValidator = () => {
      called = true
    }

    const result = validateCustom(model, 'value', 'test', { with: passingValidator })

    assert.true(called, 'Custom validator was called')
    assert.equal(result, undefined)
  })

  test('returns custom validator failure result', function(assert) {
    const model = { value: 'test' }

    const failingValidator = () => 'Custom validation failed'

    const result = validateCustom(model, 'value', 'test', { with: failingValidator })
    assert.notEqual(result, undefined)
  })

  test('passes correct arguments to custom validator', async function(assert) {
    const model = { value: 'test' }
    let receivedArgs: unknown[] = []

    const options = {
      with(...args: unknown[]) {
        receivedArgs = args
      }
    }
    await validateCustom(model, 'value', 'test', options)

    assert.deepEqual(receivedArgs, [model, 'value', 'test', options])
  })
})

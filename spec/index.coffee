sinon = require 'sinon'
chai = require 'chai'
chai.use require('sinon-chai')
chai.should()

maypop = require '../index'

describe 'the module', ->
  it 'should be a function', ->
    maypop.should.be.a 'function'

describe 'AOP on a function', ->
  it 'should require a parameter', ->
    maypop.bind(undefined).should.throw()
    maypop.bind(undefined, ->).should.not.throw()
  it 'should return a function', ->
    maypop(->).should.be.a 'function'
  describe 'the returned function', ->
    beforeEach ->
      @returnValue = {}
      @original = sinon.spy( -> @returnValue)
      @maypop = maypop(@original)
    it 'should have a "before" and "after" property', ->
      @maypop.should.contain.keys ['before', 'after']
    it 'should return the same value as the original function', ->
      @maypop().should.equal @original()
    it 'should pass the parameters to the original function', ->
      @maypop {}, true, "123"
      @original.should.have.been.calledWith {}, true, "123"

  describe 'Before', ->
    beforeEach ->
      @returnValue = {in: "credible"}
      @original = sinon.spy(-> @returnValue)
      @maypop = maypop(@original)
    it 'should only accept functions as arguments', ->
      @maypop.before.bind(undefined).should.throw(Error)
      @maypop.before.bind(undefined, ->).should.not.throw()
    it 'should run the function passed to "before" before the original function', ->
      spy = sinon.spy()
      @maypop.before spy
      @maypop()
      spy.should.have.been.calledBefore(@original)
    describe 'arguments', ->
      it 'should receive the arguments of the original function', ->
        beforeSpy = sinon.spy()
        @maypop.before(beforeSpy)
        @maypop {}, true, "123"
        beforeSpy.should.have.been.calledWith {}, true, "123"
    describe 'multiple calls to aspects', ->
      it 'should be possible to call "before" multiple times', ->
        @maypop.before(->)
        @maypop.before.bind(undefined, ->).should.not.throw
      it 'should execute the functions in the order they are added', ->
        spy1 = sinon.spy()
        spy2 = sinon.spy()
        @maypop.before spy1
        @maypop.before spy2
        @maypop()
        spy1.should.have.been.calledBefore spy2
        spy2.should.have.been.calledBefore @original

  describe 'After', ->
    beforeEach ->
      @returnValue = {in: "credible"}
      @original = sinon.spy(-> @returnValue)
      @maypop = maypop(@original)
    it 'should only accept functions as arguments', ->
      @maypop.after.bind(undefined).should.throw()
      @maypop.after.bind(undefined, ->).should.not.throw()
    it 'should run the function passed after the original function', ->
      spy = sinon.spy()
      @maypop.after spy
      @maypop()
      spy.should.have.been.calledAfter(@original)
    describe 'arguments', ->
      it 'should receive the returned value of the original function on "after"', ->
        afterSpy = sinon.spy()
        @maypop.after(afterSpy)
        @maypop {}, true, "123"
        afterSpy.should.have.been.calledWith @returnValue
    describe 'multiple calls to aspects', ->
      it 'should be possible to call "after" multiple times', ->
        @maypop.after(->)
        @maypop.after.bind(undefined, ->).should.not.throw
      it 'should execute the functions in the order they are added', ->
        spy1 = sinon.spy()
        spy2 = sinon.spy()
        @maypop.after spy1
        @maypop.after spy2
        @maypop()
        @original.should.have.been.calledBefore spy1
        spy1.should.have.been.calledBefore spy2

  describe 'scope of aspects', ->
    it 'should not be the scope of the original function', ->
      scope = {}
      scopedFn = (->).bind(scope)
      fnWithAspects = maypop(scopedFn)
      beforeFn = sinon.spy ->
      afterFn = sinon.spy ->
      fnWithAspects.before beforeFn
      fnWithAspects.after afterFn
      fnWithAspects()
      beforeFn.should.not.have.been.calledOn scope
      afterFn.should.not.have.been.calledOn scope
  xdescribe "Adding multiple aspects at once", ->
  xdescribe "exceptions", ->



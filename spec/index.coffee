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
      @original = -> @returnValue
      @maypop = maypop(@original)
    it 'should have a "before" and "after" property', ->
      @maypop.should.contain.keys ['before', 'after']
    it 'should return the same value as the original function', ->
      @maypop().should.equal @original()
  describe 'adding aspects', ->
    beforeEach ->
      @returnValue = {in: "credible"}
      @original = sinon.spy(-> @returnValue)
      @maypop = maypop(@original)
    it 'should only accept functions as arguments', ->
      @maypop.before.bind(undefined).should.throw(Error)
      @maypop.after.bind(undefined).should.throw()
      @maypop.before.bind(undefined, ->).should.not.throw()
      @maypop.after.bind(undefined, ->).should.not.throw()
    it 'should run the function passed to "before" before the original function', ->
      spy = sinon.spy()
      @maypop.before spy
      @maypop()
      spy.should.have.been.calledBefore(@original)
    it 'should run the function passed to "after" after the original function', ->
      spy = sinon.spy()
      @maypop.before spy
      @maypop()
      spy.should.have.been.calledAfter(@original)
    describe 'arguments of aspects', ->
      it 'should receive the arguments of the original function on "before"', ->
        beforeSpy = sinon.spy()
        @maypop.before(beforeSpy)
        @maypop {}, true, "123"
        beforeSpy.should.have.been.calledWith {}, true, "123"
      it 'should pass the parameters to the original function', ->
        @maypop {}, true, "123"
        @original.should.have.been.calledWith {}, true, "123"
      it 'should receive the returned value of the original function on "after"', ->
        afterSpy = sinon.spy()
        @maypop.after(afterSpy)
        @maypop {}, true, "123"
        afterSpy.should.have.been.calledWith @returnValue
    xdescribe 'scope of aspects', ->
    describe 'multiple calls to aspects', ->
      it 'should be possible to call "before" and "after" multiple times', ->
        @maypop.before(->)
        @maypop.before.bind(undefined, ->).should.not.throw
        @maypop.after(->)
        @maypop.after.bind(undefined, ->).should.not.throw
      it 'should execute the functions in the order they are added', ->
        spy1 = sinon.spy()
        spy2 = sinon.spy()
        @maypop.before spy1
        @maypop.before spy2
        @maypop()
        spy1.should.have.been.calledBefore spy2
        spy2.should.have.been.calledBefore @original

        spy1 = sinon.spy()
        spy2 = sinon.spy()
        @maypop.after spy1
        @maypop.after spy2
        @maypop()
        @original.should.have.been.calledBefore spy1
        @spy1.should.have.been.calledBefore spy2
    xdescribe "Adding multiple aspects at once", ->
    xdescribe "exceptions", ->




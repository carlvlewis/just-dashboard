import Component from './base_component'
import sinon from 'sinon'
var jsdom = require('mocha-jsdom')

describe("Component", function() {
  jsdom({'useEach': true})

  it("should require a render function", () => {
    (() => {Component({})}).should.throw("A render() function is required")
  })

  it("should not complain about render function if it\'s provided", () => {
    (() => {Component({"render": () => 0})}).should.not.throw("A render() function is required")
  })

  it("should return a function", () => {
    Component({"render": () => 0}).should.be.a.Function()
  })

  it("returned component should call args validator", () => {
    const my_validator = sinon.spy()
    const my_component = Component({
      "render": () => 0,
      "validators": [my_validator],
    })

    my_component()
    my_validator.should.be.called()
  })

  it("returned component should call args validator with the correct arguments", () => {
    const my_validator = sinon.spy()
    const my_component = Component({
      "render": () => 0,
      "validators": [my_validator],
    })

    my_component(42)
    my_validator.should.be.calledWith(42)
  })

  it("every validator should be called", () => {
    const my_validator = sinon.spy()
    const my_validator2 = sinon.spy()
    const my_component = Component({
      "render": () => 0,
      "validators": [my_validator, my_validator2],
    })

    my_component({"title": 42})
    my_validator.should.be.calledWith({"title": 42})
    my_validator2.should.be.calledWith({"title": 42})
  })

  it("validation fail should not be caught", () => {
    (() => {
      const my_component = Component({
        "render": () => 0, "validators": [() => {throw new Error("Foo bar")}],
      })

      my_component({"title": 42})
      my_validator.should.be.calledWith({"title": 42})
      my_validator2.should.be.calledWith({"title": 42})
    }).should.throw("Foo bar")
  })

  it("there should be a bind function", () => {
    const my_component = Component({
      "render": () => 0, "validators": [],
    })

    const bind = my_component({"title": 42})
    bind.should.be.a.Function()
  })

  it('bind function should throw when called without arguments', () => {
    (() => {
      const my_component = Component({
        "render": () => 0, "validators": []
      })
      const bind = my_component({"title": 42})
      bind()
    }).should.throw('A d3 selection is required')
  })

  it('bind function should not throw selection error if selection is supplied', () => {
    (() => {
      const my_component = Component({
        "render": () => 0, "validators": []
      })
      const bind = my_component({"title": 42})
      const d3 = require('d3')
      bind(d3.selection())
    }).should.not.throw('A d3 selection is required')
  })

  it('bind function should throw selection error if bad selection is supplied', () => {
    (() => {
      const my_component = Component({
        "render": () => 0, "validators": []
      })
      const bind = my_component({"title": 42})
      const bad_selection = "not a selection"
      bind(bad_selection)
    }).should.throw('A d3 selection is required')
  })

  it('render() is called when the component is rendered', () => {
    const my_render = sinon.spy()
    const my_component = Component({
      "render": my_render, "validators": []
    })
    const bind = my_component({"title": 42})
    const d3 = require('d3')
    const render = bind(d3.selection())
    render()
    my_render.should.be.called()
  })

  it('render() is called with correct arguments', () => {
    const my_render = sinon.spy()
    const my_component = Component({
      "render": my_render, "validators": []
    })
    const bind = my_component({"title": 42})
    const d3 = require('d3')
    const my_selection = d3.selection()
    const render = bind(my_selection)
    render("almafa")
    my_render.should.be.calledWith({"title": 42}, my_selection, "almafa")
  })


  it('render() is called with correct arguments 2', () => {
    const my_render = sinon.spy()
    const my_component = Component({
      "render": my_render, "validators": []
    })
    const bind = my_component({})
    const d3 = require('d3')
    const my_selection = d3.selection()
    const render = bind(my_selection)
    render([1])
    my_render.should.be.calledWith({}, my_selection, [1])
  })

})
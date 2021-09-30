const chai = require('chai')
const assert = require('chai').assert
const chaiHtml = require('chai-html')

chai.use(chaiHtml)

assert.htmlEqual = function(val, exp, msg) {
  new chai.Assertion(val, msg).html.to.equal(exp)
}

'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var esprima = require('esprima');
var walker = require('../src');

suite('AST Walker', function () {

    test('string literal', function () {
        var tree = esprima.parse('"test"');
        var nodeStub = sinon.stub();

        walker.walk( tree, {}, {
            processNode: nodeStub,
            createScope: sinon.stub(),
            popScope: sinon.stub()
        });

        var expressionNode = nodeStub.firstCall.args[0];
        assert.strictEqual(expressionNode.type, 'ExpressionStatement');

        var literalNode = nodeStub.secondCall.args[0];
        assert.strictEqual(literalNode.type, 'Literal');
        assert.strictEqual(literalNode.value, 'test');
    });

    test('number literal', function () {
        var tree = esprima.parse('7');
        var nodeStub = sinon.stub();

        walker.walk( tree, {}, {
            processNode: nodeStub,
            createScope: sinon.stub(),
            popScope: sinon.stub()
        });

        var expressionNode = nodeStub.firstCall.args[0];
        assert.strictEqual(expressionNode.type, 'ExpressionStatement');

        var literalNode = nodeStub.secondCall.args[0];
        assert.strictEqual(literalNode.type, 'Literal');
        assert.strictEqual(literalNode.value, 7);
    })

    test('var declaration', function () {
        var tree = esprima.parse('var a = 1');
        var nodeStub = sinon.stub();

        walker.walk( tree, {}, {
            processNode: nodeStub,
            createScope: sinon.stub(),
            popScope: sinon.stub()
        });

        var actualNode = nodeStub.firstCall.args[0];
        assert.strictEqual(actualNode.type, 'VariableDeclaration');
        assert.strictEqual(actualNode.kind, 'var');
        assert.strictEqual(actualNode.declarations.length, 1);
    });

    test('let declaration', function () {
        var tree = esprima.parse('let a = 1');
        var nodeStub = sinon.stub();

        walker.walk( tree, {}, {
            processNode: nodeStub,
            createScope: sinon.stub(),
            popScope: sinon.stub()
        });

        var actualNode = nodeStub.firstCall.args[0];
        assert.strictEqual(actualNode.type, 'VariableDeclaration');
        assert.strictEqual(actualNode.kind, 'let');
        assert.strictEqual(actualNode.declarations.length, 1);
    });

});
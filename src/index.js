/*globals exports, require */

'use strict';

var check, syntaxDefinitions, syntaxes, callbacks;

check = require('check-types');
syntaxDefinitions = require('./syntax');

exports.walk = walk;

function initialise (settings, callbacksArg) {
    syntaxes = syntaxDefinitions.get(settings);
    check.verifyObject(callbacks, 'Invalid callbacks');
    check.verifyFunction(callbacks.processNode, 'Invalid processNode callback');
    check.verifyFunction(callbacks.createScope, 'Invalid createScope callback');
    callbacks = callbacksArg;
}

function walk (tree, assignedName) {
    check.isObject(syntaxes, 'Uninitialised');
    check.isObject(callbacks, 'Uninitialised');
    check.verifyArray(tree, 'Invalid syntax tree');

    tree.forEach(function (node) {
        visitNode(node, assignedName);
    });
}

function visitNode (node, assignedName) {
    var syntax;

    if (check.isObject(node)) {
        syntax = syntaxes[node.type];

        if (check.isObject(syntax)) {
            callbacks.processNode(node, syntax);

            if (syntax.newScope) {
                callbacks.createScope(node.id, assignedName, node.loc, node.params.length);
            }

            visitChildren(node);
        }
    }
}

function visitChildren (node) {
    var syntax = syntaxes[node.type];

    if (check.isArray(syntax.children)) {
        syntax.children.forEach(function (child) {
            visitChild(
                node[child],
                check.isFunction(syntax.assignableName) ? syntax.assignableName(node) : '',
                currentReport
            );
        });
    }
}

function visitChild (child, assignedName) {
    var visitor = check.isArray(child) ? walk : visitNode;
    visitor(child, assignedName);
}


/*globals exports, require */

'use strict';

var check, syntaxDefinitions;

check = require('check-types');
safeName = require('./safeName');
syntaxDefinitions = require('./syntax');

exports.walk = walk;

function walk (tree, settings, callbacks) {
    var syntaxes

    check.verifyObject(tree, 'Invalid syntax tree');
    check.verifyArray(tree.body, 'Invalid syntax tree body');
    check.verifyObject(settings, 'Invalid settings');
    check.verifyObject(callbacks, 'Invalid callbacks');
    check.verifyFunction(callbacks.processNode, 'Invalid processNode callback');
    check.verifyFunction(callbacks.createScope, 'Invalid createScope callback');

    syntaxes = syntaxDefinitions.get(settings);

    visitNodes(tree.body);

    function visitNodes (nodes, assignedName) {
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
                    callbacks.createScope(safeName(node.id, assignedName), node.loc, node.params.length);
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
        var visitor = check.isArray(child) ? visitNodes : visitNode;
        visitor(child, assignedName);
    }
}


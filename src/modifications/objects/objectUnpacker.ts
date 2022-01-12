import Modification from "../../modification";
import * as Shift from 'shift-ast';
import { traverse } from '../../helpers/traverse';
import ObjectArray from "./object";
import Scope from "./scope";
import TraversalHelper from "../../helpers/traversalHelper";

export default class ObjectUnpacker extends Modification {
    private readonly scopeTypes = new Set(['Block', 'FunctionBody']);
    private shouldRemoveObjects: boolean;
    private globalScope: Scope;

    /**
     * Creates a new modification.
     * @param ast The AST.
     * @param shouldRemoveObjects Whether the objects should be removed.
     */
    constructor(ast: Shift.Script, removeObjects: boolean) {
        super('Unpack objects', ast);
        this.globalScope = new Scope(this.ast);
        this.shouldRemoveObjects = removeObjects;
    }

    /**
     * Executes the modification.
     */
    execute(): void {
        this.findObjects();
        this.unpackObjects();
     
        if (this.shouldRemoveObjects) {
            this.removeObject(this.globalScope);
        }
    }

    /**
     * Finds all literal objects and stores them in the according scope.
     */
    private findObjects(): void {
        const self = this;
        let scope = this.globalScope;

        traverse(this.ast, {
            enter(node: Shift.Node, parent: Shift.Node) {
                if (self.scopeTypes.has(node.type)) {
                    scope = new Scope(node, scope);
                }
                else if (self.isLiteralObjectArrayDeclaration(node)) {
                    const name = (node as any).binding.name;
                    const elements = (node as any).init;

                    const objectArray = new ObjectArray(node, parent, name, elements);
                    scope.addObjectArray(objectArray);
                }
            },
            leave(node: Shift.Node) {
                if (node == scope.node && scope.parent) {
                    scope = scope.parent;
                }
            }
        });
    }

    /**
     * Replaces all usages of literal objects.
     */
    private unpackObjects(): void {
        const self = this;
        let scope = this.globalScope;

        traverse(this.ast, {
            enter(node: Shift.Node, parent: Shift.Node) {
                if (self.scopeTypes.has(node.type)) {
                    scope = scope.children.get(node) as Scope;
                }
                else if (self.isSimpleObjectArrayAccess(node)) {
                    const name = (node as any).object.name;
                    const objectArray = scope.findObjectArray(name);

                    if (objectArray) {
                        var index = ""
                        if (node.type == 'ComputedMemberExpression') {
                            index = (node as any).expression.value;
                        } else {
                            index = (node as any).property;
                        }

                        const replacement = objectArray.elements.properties.find(e => e && e.type == 'DataProperty' && e.name.type == 'StaticPropertyName' && e.name.value == index);
                        var expression = (replacement as any).expression

                        if (expression) {
                            if ((expression as any).type == "LiteralStringExpression" || (expression as any).type == 'BinaryExpression') {
                                    scope.addNodeRemoval((replacement as any), objectArray.elements)
                                    objectArray.replaceCount++;
                                    TraversalHelper.replaceNode(parent, node, expression);
                            }
                        }
                    }
                }
            },
            leave(node: Shift.Node) {
                if (node == scope.node && scope.parent) {
                    scope = scope.parent;
                }
            }
        });
    }

    /**
     * Removes all the (suitable) objects in a scope and its children.
     * @param scope The scope to remove objects from.
     */
    private removeObject(scope: Scope): void {
        for (const element of scope.remove) {
            TraversalHelper.removeNode(element[1], element[0]);
        }
    }

    /**
     * Returns whether a node is a literal object declaration.
     * @param node The AST node.
     */
    private isLiteralObjectArrayDeclaration(node: Shift.Node): boolean {
        return node.type == 'VariableDeclarator' && node.binding.type == 'BindingIdentifier'
            && node.init != null && node.init.type == 'ObjectExpression'
            && node.init.properties.find(e => e && !e.type.startsWith('Data')) == undefined;
    }

    /**
     * Returns whether a node is accessing an index of an object.
     * @param node The AST node.
     */
    private isSimpleObjectArrayAccess(node: Shift.Node): boolean {
        return (node.type == 'ComputedMemberExpression' && node.object.type == 'IdentifierExpression'
            && node.expression.type == 'LiteralStringExpression') || (node.type == 'StaticMemberExpression'
            && node.object.type == 'IdentifierExpression');
    }
}
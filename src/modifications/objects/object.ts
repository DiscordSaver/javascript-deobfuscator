import * as Shift from 'shift-ast';

export default class ObjectArray {
    node: Shift.Node;
    parentNode: Shift.Node;
    name: string;
    elements: Shift.ObjectExpression;
    replaceCount: number;

    /**
     * Creates a new ObjectArray.
     * @param node The declaration node.
     * @param parentNode The parent node.
     * @param name The name of the ObjectArray.
     * @param elements The elements in the ObjectArray.
     */
    constructor(node: Shift.Node, parentNode: Shift.Node, name: string, elements: Shift.ObjectExpression) {
        this.name = name;
        this.elements = elements;
        this.node = node;
        this.parentNode = parentNode;
        this.replaceCount = 0;
    }
}
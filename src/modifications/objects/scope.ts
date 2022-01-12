import * as Shift from 'shift-ast';
import ObjectArray from './object';

export default class Scope {
    node: Shift.Node;
    parent?: Scope;
    children: Map<Shift.Node, Scope>;
    objects: Map<string, ObjectArray>;
    remove:  Map<Shift.Node, Shift.Node>;

    /**
     * Creates a new scope.
     * @param node The node that created the scope.
     * @param parent The parent scope (optional).
     */
    constructor(node: Shift.Node, parent?: Scope) {
        this.node = node;
        this.parent = parent;
        this.children = new Map<Shift.Node, Scope>();
        this.objects = new Map<string, ObjectArray>();
        this.remove = new Map<Shift.Node, Shift.Node>();

        if (this.parent) {
            this.parent.children.set(this.node, this);
        }
    }

    /**
     * Searches for an object by name.
     * @param name The name of the object.
     */
    findObjectArray(name: string): ObjectArray | null {
        // console.log(this.objects)
        if (this.objects.has(name)) {
            return this.objects.get(name) as ObjectArray;
        }

        return this.parent
            ? this.parent.findObjectArray(name)
            : null;
    }

    /**
     * Adds an ObjectArray.
     * @param object The object to be added.
     */
    addObjectArray(object: ObjectArray): void {
        this.objects.set(object.name, object);
    }

    addNodeRemoval(node: Shift.Node, parent: Shift.Node) {
        this.remove.set(node, parent);
    }
}
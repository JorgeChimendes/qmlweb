/*
 * Exports:
 *
 * - QMLBinding(src, tree) to pass qml bindings along.
 */

/**
 * Create QML binding.
 * @param {Variant} val Sourcecode or function representing the binding
 * @param {Array} tree Parser tree of the binding
 * @return {Object} Object representing the binding
 */
function QMLBinding(val, tree) {
    // this.function states whether the binding is a simple js statement or a function containing a
    // return statement. We decide this on whether it is a code block or not. If it is, we require a
    // return statement. If it is a code block it could though also be a object definition, so we
    // need to check that as well (it is, if the content is labels).
    this.function = tree && tree[0] == "block" && tree[1][0] && tree[1][0][0] !== "label";
    this.src = val;
}

QMLBinding.prototype.toJSON = function() {
    return {src: this.src,
        deps: JSON.stringify(this.deps),
        tree: JSON.stringify(this.tree) };
}

/**
 * Compile binding. Afterwards you may call binding.eval to evaluate.
 */
QMLBinding.prototype.compile = function() {
    this.eval = new Function('__executionObject', '__executionContext', "with(__executionContext) with(__executionObject) " + ( this.function ? "" : "return " ) + this.src);
}

module.exports.QMLBinding = QMLBinding;

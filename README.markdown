# FluentDOM

FluentDOM is a fluent API for DOM manipulation that hides the details of element spawning and appending,
attribute setting, modifications in loops etc.


----

## Example

Below example is a simple, yet shows the range of methods available:

```
(new FluentDOM())
    .withNode(document.getElementById('...')
    .removeChildren()
    .spawn('p')
    .toSpawned()
    .appendText('Hello World!')
    .toNode()
    .appendChild();
```

Line by line explanation:

0.  `(new FluentDOM())` - create new instance of the `FluentDOM` object,
1.  `.withNode(document.getElementById('...')` - attach main node for this instance,
2.  `.removeChildren()` - remove all children of selected node,
3.  `.spawn('p')` - spawn new element `p` and put it on the stack,
4.  `.toSpawned()` - switch context from *node* to *top-of-stack*,
5.  `.appendText('Hello World!')` - append text node to current context node,
6.  `.toNode()` - switch context from *top-of-stack* to *node*,
7.  `.appendChild()` - pop top element from stack and
    append it current context element,


----

## Concepts

FluentDOM operates on few underlying concepts which are explained below.


### Node

The Node is main DOM node that is used by the instance.
It can be set with `.withNode(node)` method.
Once set, the Node can be set to another object during instances lifetime.


### Stack

The Stack is a simple LIFO stack of elements spawned using `.spawn(node-type)` method.
For example, the following chain would spawn `h1`, `h2` and `h3` elements with `h3` being the top
element: `.spawn('h1').spawn('h2').spawn('h3')`.


### Context and Context Node

The context can be set into one of two states: *node* or *top-of-stack*.


#### Node context

When set to *node*, methods such as `.setAttr()` or `.appendChild()` modify the Node of given instance.


#### Top-of-stack context

When set to *top-of-stack*, methods such as `.setAttr()` modify the top element of stack.
The `.appendChild()` works a bit differently than when in *node* context; it first
pops the top element from the stack and appends it to the element which became the top one.
Such behaviour ensures that chains like `.appendChild().appendChild().appendChild()` work as expected.
For example:

```
var fdom = (new FluentDOM());
// some code...
fdom.spawn('ul')
    .spawn('li')
    .spawn('a')
    .setAttr('href', '/home')
    .spawn('b')
    .appendText('HOME')
    .appendChild()  // appends 'b' to 'a'
    .appendChild()  // appends 'a' to 'li'
    .appendChild()  // appends 'li' to 'ul'
```

----

## Method chaining

FluentDOM provides an interface built specifically for method chaining.
There are three methods provided that allow the chain not to be broken even if a looping construct or
an if-statement is needed.


### The for-each loop

The loop used to perform a task on each element of a sequence.

```
(new FluentDOM())
    .forEach(sequence, function (element, index, array) {
    });
```

The `.forEach()` method requires two parameters: a sequence to iterate over, and a callback function.
It is a very thin wrapper over the `Array.forEach()`.
Refer to the `Array.forEach()` documentation for details on the callback function parameters.
When the callback function is called, `this` referes to the `FluentDOM` instance the `.forEach()` was called on.


### The for-each-of loop

The loop used to perform a task on each element of an object.

```
(new FluentDOM())
    .forEachOf(object, function (value, key, object, index) {
    });
```

The `.forEachOf()` method requires two parameters: an object whose keys are iterated over, and a callback function.
The keys are obtained using `Object.keys()` function.
The callback function is given four parameters:

0.  `value` - value in the object for given key,
1.  `key` - the key used to obtain the value,
2.  `object` - object the value has been obtained from,
3.  `index` - index of the key on the array returned by `Object.keys()`,

When the callback function is called, `this` referes to the `FluentDOM` instance the `.forEach()` was called on.


### The if-statement

The function used to emulate a conditional statement.

```
(new FluentDOM())
    .callIf(condition[, callback_if_true[, callback_if_false]]);
```

The `.callIf()` method requires three parameters: a condition variable that is used in the if-statement, a function to call when the condition evaluates to `true`, and a function to call when the condition evaluates to `false`.
Both callbacks are optional, but in order to pass a false-callback the true-callback must also be passed
(can be passed as an `undefined` or `null` value if there should be no action performed when the condition is true).
Callback functions in this method receive no parameters.
When the callback function is called, `this` referes to the `FluentDOM` instance the `.forEach()` was called on.

## Python Functions

A deep dive into the building blocks.

---
## Defining Functions

A function that does nothing:

```python
def void_function():
    """This does nothing!"""
```

The "hello, world" function:

```python
def hello_function():
    """This string documents the function's purpose."""
    print('Hello, world!')
```
___
## Function Signature

The function's _signature_ begins with the `def` keyword, followed by
the function name, a paranthetical list of inputs, and a colon:

```python
def example(arg1, arg2):
```
___
## Function Body

```python [2-3]
def hello_function():
    """This string documents the function's purpose."""
    print('Hello, world!')
```

Any code indented to the same level under the function definition is
part of the function's _body_.

The standard indentation is 4 spaces, though 2, 8 and `<TAB>`
characters are also perfectly valid.

---
## Input Arguments

**(Parameters) and (arguments) are used synonymously.**

```python
def function_with_arg(arg1):
    """f-strings can be used to embed variables inside {...}."""
    print(f'I got an input: {arg1}')
```

`arg1` here can by any kind of datum - string, integer, etc.

___
## Typed Arguments

```python
import math

def integer_square_root(arg1: int):
    """The input value's square root is displayed."""
    print(math.sqrt(arg1))
```

By adding a colon after the variable name, followed by a _type_, you can
constrain what shape the `arg1` variable can take. In this case, `arg1`
can only be an integer
___
## Optional Arguments

```python
def greet(subject: str = 'world'):
    """Greet the given subject, or 'world' by default"""
    print(f'Hello, {subject}!')
```

When you call this function, you can omit the argument to leave it at
its default value.

```python
greet()             # -> Hello, world!
greet('sunshine')   # -> Hello, sunshine!
```

---
## Output Return Values

Not only can functions accept inputs, they can also return outputs!

```
def add1(x: int) -> int:
    """
    This function transforms its input into an output.
    """
    return x + 1
```

The `-> <TYPE>` syntax is used to constrain the output value's type.

___
## Return Value Types

The return value of a function can be anything - a simple value, an
object of a specific class, or even another function.

---
## Calling Functions

To call a function, refer to it by name and add `(...)`, where `...` can
be any number of input arguments.

```python [3]
# `sum(...)`    is a built-in function to add things
# `print(...)`  is also a built-in function
sum([1, 2, 3, 4, 5])  # -> 15
```

___
## Function Help

If you want to use a function, but not sure what input args or output
values it has, you can use the interactive Python interpreter to run:

```python
help(sum)  # Displays:

# Help on built-in function sum in module builtins:
#
# sum(iterable, /, start=0)
#     Return the sum of a 'start' value (default: 0) plus an iterable of numbers
#
#     When the iterable is empty, return the start value.
#     This function is intended specifically for use with numeric values and may
#     reject non-numeric types.

```

---
## Lexical Scope

Scope means: the area over which something is relevant.

Lexical means: related to reading, as by the Python interpreter (it
reads your code)

Lexical scope means: where is your variable, class or function defined?

___
## Lexical Scope Visualization

![Python_Scope](./img/scope.webp)

---
## Factorial Example

Let's look at some more complex functions and break them down, by
implementing the `factorial`!

___
## Factorial Definition

The factorial of a natural number (non-negative integer) is defined as:

<div data-markdown>
  $$ n! = n \times (n - 1) \times (n - 2) \times \dots \times 3 \times 2 \times 1 $$
</div>

Alternatively:

<div data-markdown>
  $$ n! = \prod_{i=1}^n i $$
</div>

___
## Factorial Signature

We can express the factorial function's signature as follows:

```python [1]
def factorial(n: int) -> int:
    """Return the factorial of the given input."""
    ...
```

___
## Iterative Factorial

```python
def factorial(n: int) -> int:
    """Return the factorial of the given input."""
    # Check that input is non-negative
    assert n >= 0, 'undefined for negative inputs'
    # Define the return value accumulator
    result: int = 1
    # For example when n = 4, range(1, 4 + 1) == [1, 2, 3, 4]
    for x in range(1, n + 1):
        # a *= b is the same as a = a * b
        result *= x
    return result
```
___
## Iterative Factorial - Subtractive

```python [8-11]
def factorial(n: int) -> int:
    """Return the factorial of the given input."""
    # Check that input is non-negative
    assert n >= 0, 'undefined for negative inputs'
    # Define the return value accumulator
    result: int = 1
    # Instead, start with n and subtract to 1
    while(n > 0):
        # [a *= b] is the same as [a = a * b]
        result *= n
        n -= 1
    return result
```

___
## Recursive Factorial

```python [5-10]
def factorial(n: int) -> int:
    """Return the factorial of the given input."""
    assert n >= 0, 'undefined for negative inputs'

    def _factorial(m: int, accumulator: int = 1) -> int:
        """Inner function!"""
        if m == 0:
            return accumulator
        else:
            return _factorial(m - 1, accumulator * m)

    return _factorial(n)
```

Note: Pause here to experiment with recursion.

---
## Higher Order Functions

A higher order function is any function that either receives another
function as an input value, or returns a function as its return value.

___
## Wrapper Function

Let's define a function that does something before and after whatever
other function you want.

```python
from typing import Callable

def logging_wrapper(func: Callable) -> Callable:
    def _inner_function(*args, **kwargs):
        print("Before calling func()")
        func_return_value = func(*args, **kwargs)
        print("After calling func()")
        return func_return_value
    return _inner_function
```

___
## Wrapper Function

Now, we can use it like this:

```python
# Use the greet function from before
wrapped_greet: Callable = logging_wrapper(greet)
wrapped_greet('wrapper')


```

---
## Classes and their Functions

Functions that are defined inside of a class are usually called methods.

```python
class FunctionContainer:
    def __init__(self, *, value):
        """
        Create an instance of this class.

        The *, in the arguments list means `value`
        must be passed as a keyword argument, and
        not as a positional argument.
        """
        self.value = value
```

```python
container = FunctionContainer(value=123)
container.value         # -> 123
container.value = 456   # update the value
```

---
## Anonymous Functions

Anonymous functions are the unimportant cousins of regular
functions.

```python
(lambda arg: arg + 1)(3)  # -> 4
```

They are useful when you don't need to reuse the function, and it is
short enough to express in one line:

```python
filter(lambda num: num > 3, [1, 2, 3, 4, 5])  # -> [4, 5]
```

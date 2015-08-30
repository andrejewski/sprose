# Sprose

Sprose is an embeddable programming language for plain text.
Essentially, a given text file is parsed into a series of expressions.
These expressions (S-expressions) are evaluated and their results are
  are inserted into the text in place of the expressions.
The cool thing is that is all Sprose does. Literally everything else is
  completely customizable.
Sprose expressions can be nested, create variables and namespaces, define
  functions, and anything else really.

```bash
npm install sprose
```

## Example

A Sprose program needs two files, the text file which contains the expressions
 to evaluate and a JavaScript module which contains the functions and variables
 accessible by the text file.

```
This is a text file.
I can use (uppercase words in here).
```

```js
module.exports = {
  uppercase: function(scope, args) {
    return sprose.util.stringify(args).toUpperCase();
  }
};
```

```
This is a text file.
I can use WORDS IN HERE.
```



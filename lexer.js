const input = "77 7   8 2 1 232 ";

function* lexer(str) {
  let cursor = 0;
  let chr = str[cursor];

  //especial  insise iterator
  function next() {
    cursor++;
    chr = str[cursor];
  }
  function number() {
    let buffer = "";
    while (/^\d+$/.test(chr)) {
      buffer += chr;
      next();
    }
    if (buffer.length >= 1) {
      return { type: "number", buffer };
    }
    return null;
  }
  function eof() {
    chr = str[cursor];
    if (chr === undefined) {
      cursor++;
      return {
        type: "EOF",
      };
    }
    return null;
  }
  function whiteSpace() {
    let buffer = "";
    while (chr === " " || chr === "\t") {
      next();
    }

    return null;
  }

  //version corta de while(true) que no requiere optimización
  for (;;) {
    whiteSpace();
    const token = number() || eof();
    if (token) {
      yield token;
      if (token.type === "EOF") {
        break;
      }
    } else {
      throw new SyntaxError(`Caracter no reconocido : "${chr}" at ${cursor + 1}`);
    }
  }
}

console.log("Inicio");
for (const token of lexer(input)) {
  console.log(token);
}
//console.log([...lexer(input)]);
console.log("Final");

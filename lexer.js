import { readFileSync } from "fs";
const fileName = "./test.js";

const input = String(readFileSync(fileName));
console.log("nuestro puto texto", input);

function isNumeric(c) {
  return /^\d+$/.test(c);
}

function* lexer(str) {
  let line = 1;
  let column = 1;
  let cursor = 0;
  let chr = str[cursor];

  //especial  insise iterator
  function next() {
    cursor++;
    chr = str[cursor];
    column++;
  }
  function newLine() {
    line++;
    column = 1;
  }
  function number() {
    let buffer = "";
    while (isNumeric(chr)) {
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
  function eol() {
    //es un whiteSpace?
    if (chr === "\n") {
      next();
      newLine();
    } else {
      //sino es     return null;
    }

    while (chr === "\n") {
      next();
      newLine();
    }

    return true;
  }

  function whiteSpace() {
    //es un whiteSpace?
    if (chr === " " || chr === "\t") {
    } else {
      //sino es
      return null;
    }

    while (chr === " " || chr === "\t") {
      next();
    }

    return true;
  }

  //version corta de while(true) que no requiere optimización
  for (;;) {
    const token = whiteSpace() || number() || eol() || eof();
    if (token) {
      if (token === true) {
        continue;
      }
      yield token;
      if (token.type === "EOF") {
        break;
      }
    } else {
      throw new SyntaxError(`Caracter no reconocido : "${chr}" at ${fileName} ${line} : ${column}`);
    }
  }
}

console.log("Inicio");
for (const token of lexer(input)) {
  console.log(token);
}
//console.log([...lexer(input)]);
console.log("Final");

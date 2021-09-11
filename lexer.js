import { readFileSync } from "fs";

const filename = "./test.js"
const input = String(readFileSync(filename))

/*const input= `123
4`;*/
function isNumeric(c) {
  return /^\d+$/.test(c);
}

function* lexer(str) {
  let line = 1
  let column = 1
  let cursor = 0
  let chr = str[cursor]

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
    let buffer = ""
    while (isNumeric(chr)) {
      buffer += chr
      next()
    }
    if (buffer.length >= 1) {
      return { type: "number", buffer };
    }
    return null
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
    if (chr === "\n"|| chr === "\r" ) {
      next();
      newLine();
    } else {
      //sino es     
      return null;
    }

    while (chr === "\n"|| chr === "\r") {
      next();
      newLine();
    }

    return true
  }

  function whiteSpace() {
    //es un whiteSpace?
    if (chr === " " || chr === "\t") {
      next();
    } else {
      return null
    }

    while (chr === " " || chr === "\t") {
      next();
    }

    return true
  }

  //version corta de while(true) que no requiere optimización
  for (;;) {
    const token = whiteSpace() || number() || eol() || eof()

    if (token) {
      if (token === true) {
        continue;
      }

      yield token;

      if (token.type === "EOF") {
        break;
      }
    } else {
      console.log("error", chr)
      throw new SyntaxError(
        `Caracter no reconocido"${chr}" en ${filename}: ${line}:${column}`
      );
    }
  }
}


console.log("Inicio");
for (const token of lexer(input)) {
  console.log(token);
}
console.log("Final");

import { readFileSync } from "fs";

const filename = "./test.js"
const input = String(readFileSync(filename))

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

  function newline() {
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
      return { 
        type: "number", 
        value: Number(buffer) 
      };
    }
    return null
  }

  function isWhiteSpace(c){
    return c === ' ' || c === '\t'
  }

  function whiteSpace() {
    //es un whiteSpace?
    if (isWhiteSpace(chr)) {
      next()
    } else {
      //sino es
      return null
    }

    while (isWhiteSpace(chr)) {
      next()
    }

    return true
  }

  function eol() {
    console.log("test",chr)
    if (chr === '\n'.charCodeAt()) {
      next()
      newline()
    } else {
      return null
    }

    while (chr === '\n'.charCodeAt()) {
      next()
      newline()
    }

    return true
  }

  function eof() {
    if (chr === undefined) {
      return {
        type: "EOF",
      };
    }
    return null;
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

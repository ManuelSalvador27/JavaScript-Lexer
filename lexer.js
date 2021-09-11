/*
BEFORE: Input of code like a string
const input= `1234`;
*/ 

function isNumeric(c) {
  return /^\d+$/.test(c);
}

export function* lexer(filename, str) {
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
      return { type: "Numeric", buffer };
    }
    return null
  }

  function operator() {
    if (chr === '+') {
      next()
      return { type: "PlusToken" };
    }
    return null
  }

  function eof() {
    chr = str[cursor];
    if (chr === undefined) {
      cursor++;
      return { type: "EOF" }
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
    const token = whiteSpace() || operator() || number() || eol()

    if (token) {
      if (token === true) {
        continue;
      }

      yield token;

      continue;
    } 

    const EndOfFile = eof()
    if(EndOfFile){
      break;
    }

    throw new SyntaxError(
      `Caracter no reconocido"${chr}" en ${filename}: ${line}:${column}`
    );

  }
}

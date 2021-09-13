function isNumeric(c) {
  return /^\d+$/.test(c);
}

function isLetter(c) {
  return /^[A-Za-z]+$/.test(c);
}

export function* lexer(filename, str) {
  let line = 1
  let column = 1
  let cursor = 0
  let chr = str[cursor]

  function next() {
    cursor++
    chr = str[cursor]
    column++
  }

  function newLine() {
    line++
    column = 1
  }

  function number() {
    let buffer = ""
    while (isNumeric(chr)) {
      buffer += chr
      next()
    }
    if (buffer.length >= 1) {
      return { type: "Numeric", buffer }
    }
    return null
  }

  function operator() {
    if (chr === '+') {
      next()
      return { type: "PlusToken" }
    }

    if (chr === '-') {
      next()
      return { type: "SubstractionToken" }
    }
    
    if (chr === '*') {
      next()
      return { type: "MulToken" }
    }

    if (chr === '/') {
      next()
      return { type: "DivToken" }
    }

    return null
  }

  const KEYWORDS = {
    break:"Break",
    case: "Case",
    catch: "Catch",
    class: "Class",
    const: "Const",
    continue: "Continue",
    debugger: "Debugger",
    default: "Default",
    delete: "Delete",
    do: "Do",
    else: "Else",
    export: "Export",
    extends: "Extends",
    finally: "Finally",
    for: "For",
    function: "Function",
    if: "If",
    import: "Import",
    in: "In",
    instanceof:"InstanceOf",
    new: "New",
    return: "Return",
    super: "Super",
    switch: "Switch",
    this: "This",
    throw: "Throw",
    try:"Try",
    typeof: "TypeOf",
    var:"Var",
    void:"Void",
    while:"While",
    with:"With",
    yield:"Yield",
    let:"Let",
  }

  function id() {
    let buffer = ""

    if (!isLetter(chr)){ return null } 
    buffer += chr
    next()

    while (isNumeric(chr) || isLetter(chr)) {
      buffer += chr
      next()
    }

    const type = KEYWORDS[buffer];
    if (type) {
      return { type }
    }

    return { type: "Id", value: buffer }

  }

  function whiteSpace() {
    if (chr === " " || chr === "\t") {
      next()
    } else {
      return null
    }

    while (chr === " " || chr === "\t") {
      next()
    }

    return true
  }

  function semicolon() {
    if (chr !== ";"){ return null }

    next()

    return { type: "SemicolonToken" }
  }

  function comma() {
    if (chr !== ",") { return null }

    next()

    return { type: "ColonToken" }
  }

  function parents() {
    if (chr === "(") {
      next()
      return { type: "OpenParent" }
    }

    if (chr === ")") {
      next()
      return { type: "CloseParent" }
    }

    if (chr === "{") {
      next()
      return { type: "OpenCurly" }
    }

    if (chr === "}") {
      next()
      return { type: "CloseCurly" }
    }

    return null
  }


  function eol() {
    if (chr === "\n"|| chr === "\r" ) {
      next()
      newLine()
    } else {
      return null
    }

    while (chr === "\n"|| chr === "\r") {
      next()
      newLine()
    }

    return true
  }


  function eof() {
    chr = str[cursor]

    if (chr === undefined) {
      cursor++
      return {type: "EOF" }
    }

    return null;
  }

  //version corta de while(true) que no requiere optimización
  for (;;) {
    const token = 
    whiteSpace() || 
    operator() || 
    semicolon() || 
    comma() ||
    number() || 
    id() ||
    parents() || 
    eol()

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
      `Caracter no reconocido "${chr}" en ${filename}: ${line}:${column}`
    )

  }
}

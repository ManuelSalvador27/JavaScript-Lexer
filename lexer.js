function isNumeric(c) {
  return /^\d+$/.test(c);
}

function isLetter(c) {
  return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");
}


export function* lexer(filename, str) {
  let line = 1;
  let column = 1;
  let cursor = 0;
  let chr = str[cursor];

  function next() {
    cursor++;
    chr = str[cursor];
    column++;
  }

  function newLine() {
    line++;
    column = 1;
  }

  function stringOfType(delimiter) {
    if (chr !== delimiter) {
      return null;
    }
    next();
    while (chr !== delimiter) {
      next();
    }

    // Busca el ultimo delimitador para ver si es una cdena literal
    next();
    return { type: "String" };
  }

  function string() {
    return stringOfType('"') || stringOfType("'");
  }

  function hashComment() {
    for (;;) {
      if (chr === "\r" || chr === "\n") {
        newLine();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "HashbangToken" };
  }

  function hashBang() {
    if (chr === "#" && line === 1) {
      next();
      if (chr === "!") {
        next();
        return hashComment();
      }
    }

    return null;
  }

  function number() {
    let buffer = "";
    if (chr == 0) {
      next();
      if (chr == "B" || chr == "b") {
        next();
        return isBinary();
      }
      if (chr == "O" || chr == "o") {
        next();
        return isOctal();
      }
      if (chr == "X" || chr == "x") {
        next();
        return isHexadecimal();
      }
      if(chr=="e"){
        next()
        return isExponential();
      }
    }
    while (isNumeric(chr)) {
      buffer += chr;
      next();
    }
    if (buffer.length >= 1) {
      return { type: "Numeric", buffer };
    }
    return null;
  }
  function isBinary() {
    for (;;) {
      if (chr === "\r" || chr === "\n") {
        newLine();
        next();
        break;
      }
      if (chr === ";") {
        semicolon();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "Binary" };
  }
  function isOctal() {
    for (;;) {
      if (chr === "\r" || chr === "\n") {
        newLine();
        next();
        break;
      }
      if (chr === ";") {
        semicolon();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "Octal" };
  }
  function isHexadecimal() {
    for (;;) {
      if (chr === "\r" || chr === "\n") {
        newLine();
        next();
        break;
      }
      if (chr === ";") {
        semicolon();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "Hexadecimal" };
  }
  function isExponential() {
    for (;;) {
      if (chr === "\r" || chr === "\n") {
        newLine();
        next();
        break;
      }
      if (chr === ";") {
        semicolon();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "Exponential" };

  }

  function operator() {
    if (chr === "="||chr===":") {
      next();
      return { type: "EqualToken" };
    }
    if (chr === "+") {
      next();
      return { type: "PlusToken" };
    }

    if (chr === "-") {
      next();
      return { type: "SubstractionToken" };
    }

    if (chr === "*") {
      next();
      if (chr === "/") {
        next();
        return doubleSlash();
      }
      return { type: "MulToken" };
    }

    if (chr === "=") {
      next();
      return { type: "AllocationToken" };
    }

    if (chr === "/") {
      next();
      if (chr === "*") {
        next();
        return endOfComment();
      }
      if (chr === "/") {
        next();
        return doubleSlash();
      }
      return { type: "DivToken" };
    }

    return null;
  }

  function regexp() {
    if (chr === "/") {
      next();
      if (chr === "/") {
        next();
        return doubleSlash();
      }
      if (chr === "*") {
        next();
        return endOfComment();
      }
      next();
      while (chr !== "/") {
        next();
      }

      // Buscar al final de la cadena match con '/' nuevamente
      next();

      return { type: "RegExpToken" };
    }
  }

  function doubleSlash() {
    for (;;) {
      if (chr === "\r" || chr === "\n") {
        newLine();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "CommentToken" };
  }

  function endOfComment() {
    for (;;) {
      if (chr === "*" || chr === "/") {
        operator();
        next();
        break;
      }

      if (chr === undefined) {
        break;
      }

      next();
    }

    return { type: "LargeCommentToken" };
  }

  const KEYWORDS = {
    break: "Break",
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
    instanceof: "InstanceOf",
    new: "New",
    return: "Return",
    super: "Super",
    switch: "Switch",
    this: "This",
    throw: "Throw",
    try: "Try",
    typeof: "TypeOf",
    var: "Var",
    void: "Void",
    while: "While",
    with: "With",
    yield: "Yield",
    let: "Let",
    null: "Null",
    true: "True",
    false: "False",
    set: "Set",
    get: "Get",
    arguments: "Arguments",
  };

  function id() {
    let buffer = "";
    if (!isLetter(chr)) {
      return null;
    }
    buffer += chr;
    next();

    while (isLetter(chr) || isNumeric(chr)) {
      buffer += chr;
      next();
    }

    const type = KEYWORDS[buffer];
    if (type) {
      return { type };
    }

    return { type: "Id", value: buffer };

    return null;
  }

  function whiteSpace() {
    if (chr === " " || chr === "\t") {
      next();
    } else {
      return null;
    }

    while (chr === " " || chr === "\t") {
      next();
    }

    return true;
  }

  function semicolon() {
    if (chr !== ";") {
      return null;
    }

    next();

    return { type: "SemicolonToken" };
  }

  function comma() {
    if (chr !== ",") {
      return null;
    }

    next();

    return { type: "CommaToken" };
  }
  function colon() {
    if (chr !== ":") {
      return null;
    }

    next();

    return { type: "ColonToken" };
  }

  function parents() {
    if (chr === "(") {
      next();
      return { type: "OpenParent" };
    }

    if (chr === ")") {
      next();
      return { type: "CloseParent" };
    }

    if (chr === "{") {
      next();
      return { type: "OpenCurly" };
    }

    if (chr === "}") {
      next();
      return { type: "CloseCurly" };
    }

    if (chr === "[") {
      next();
      return { type: "OpenBracket" };
    }

    if (chr === "]") {
      next();
      return { type: "CloseBracket" };
    }

    return null;
  }

  function eol() {
    if (chr === "\n" || chr === "\r") {
      next();
      newLine();
    } else {
      return null;
    }

    while (chr === "\n" || chr === "\r") {
      next();
      newLine();
    }

    return true;
  }

  function eof() {
    chr = str[cursor];

    if (chr === undefined) {
      cursor++;
      return { type: "End" };
    }

    return null;
  }

  //version corta de while(true) que no requiere optimización
  for (;;) {
    const token =
      whiteSpace() ||
      operator() ||
      regexp() ||
      semicolon() ||
      comma() ||
      number() ||
      hashBang() ||
      id() ||
      parents() ||
      string() ||
      eol();

    if (token) {
      if (token === true) {
        continue;
      }

      yield token;

      continue;
    }

    const EndOfFile = eof();
    if (EndOfFile) {
      break;
    }

    throw new SyntaxError(`Caracter no reconocido "${chr}" en ${filename}: ${line}:${column}`);
  }
}

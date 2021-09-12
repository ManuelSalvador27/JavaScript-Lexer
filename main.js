import { readFileSync } from "fs"
import { lexer } from "./lexer.js"
import { parser } from "./decompose.js"

const filename = "./test.js"
const input = String(readFileSync(filename))

console.log("Lexer trabajando");
const tokens = parser (lexer(filename, input))
console.log(tokens)

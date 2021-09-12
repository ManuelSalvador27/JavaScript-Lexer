import { readFileSync } from "fs"
import { lexer } from "./lexer.js"

/*
BEFORE: Input of code like a string
const input= `1234`;
*/ 
const filename = "./test.js"
const input = String(readFileSync(filename))

console.log("Lexer trabajando");
const tokens = lexer(filename, input)
for (const token of tokens) {
  console.log(token);
}

import { readFileSync } from "fs"
import { lexer } from "./lexer.js"

const filename = "./test.js"
const input = String(readFileSync(filename))

console.log("Inicio");
for (const token of lexer(filename, input)) {
  console.log(token);
}
console.log("Final");

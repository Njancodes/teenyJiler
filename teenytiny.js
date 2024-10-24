import Lexer from "./lex.js";
import Parser from "./parse.js";
import {readFileSync} from "fs"

if(process.argv.length != 3){
    console.log("Error: Compiler needs source file as argument.")
    process.exit(0);
}
let source = readFileSync(process.argv[2],"utf8");

let lexer = new Lexer(source);
let parser = new Parser(lexer);
parser.program();

console.log('Parsing Completed');
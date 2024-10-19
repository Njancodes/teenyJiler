import Lexer from "./lex.js";
import { TOKENTYPE } from "./lex.js";

let source = 'IF+-123 foo*THEN/';
let lexer = new Lexer(source);
let token = lexer.getToken();

while(token.kind != TOKENTYPE.EOF){
    console.log(token.kind);
    token = lexer.getToken();
}
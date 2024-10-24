import { TOKENTYPE } from "./lex.js";

export default class Parser{
    constructor(lexer){
        this.lexer = lexer;
        this.curToken = null;
        this.peekToken = null;
        this.nextToken();
        this.nextToken()
    }
    checkToken(kind){
        return kind === this.curToken.kind;
    }
    checkPeek(kind){
        return kind === this.peekToken.kind;
    }
    match(kind){
        if(!this.checkToken(kind)){
            this.abort("Expected " + kind + ", got "+ this.curToken.kind);
        }
        this.nextToken()
    }
    nextToken(){
        this.curToken = this.peekToken;
        this.peekToken = this.lexer.getToken();
    }
    abort(message){
        console.log("Parsing error. " + message)
        process.exit(0);
    }
    program(){
        console.log("PROGRAM");
        while(this.checkToken(TOKENTYPE.NEWLINE)){
            this.nextToken();
        }
        while(!this.checkToken(TOKENTYPE.EOF)){
            this.statement();
        }
    }
    statement(){
        if(this.checkToken(TOKENTYPE.PRINT)){
            console.log("STATEMENT-PRINT");
            this.nextToken()

            if(this.checkToken(TOKENTYPE.STRING)){
                this.nextToken()
            }else{
                this.expression()
            }
        }else if(this.checkToken(TOKENTYPE.IF)){
            console.log("STATEMENT-IF");
            this.nextToken();
            this.comparision();
            this.match(TOKENTYPE.THEN)
            this.nl()

            while(!this.checkToken(TOKENTYPE.ENDIF)){
                this.statement();
            }
            this.match(TOKENTYPE.ENDIF);
        }else if(this.checkToken(TOKENTYPE.WHILE)){
            console.log("STATEMENT-WHILE");
            this.nextToken();
            this.comparision();
            this.nextToken()
            this.match(TOKENTYPE.REPEAT);
            this.nl();
            while(!this.checkToken(TOKENTYPE.ENDWHILE)){
                this.statement()
            }
            this.match(TOKENTYPE.ENDWHILE);
        }else if(this.checkToken(TOKENTYPE.LABEL)){
            console.log('STATEMENT-LABEL');
            this.nextToken();
            this.match(TOKENTYPE.IDENT);
        }else if(this.checkToken(TOKENTYPE.GOTO)){
            console.log("STATEMENT-GOTO");
            this.nextToken();
            this.match(TOKENTYPE.IDENT);
        }else if(this.checkToken(TOKENTYPE.LET)){
            console.log("STATEMENT-LET");
            this.nextToken();
            this.match(TOKENTYPE.IDENT);
            this.nextToken();
            this.match(TOKENTYPE.EQ);
            this.expression();
        }else if(this.checkToken(TOKENTYPE.INPUT)){
            console.log("STATEMENT-INPUT");
            this.nextToken();
            this.match(TOKENTYPE.IDENT)
        }else{
            this.abort("Invalid statement at " + this.curToken.text + " (" + this.curToken.kind + ") ");
        }
        this.nl();
    }
    comparision(){
        console.log("COMPARISON");
        this.expression();
        if(this.isComparisonOperator()){
            this.nextToken();
            this.expression();
        }else{
            this.abort("Expected comparison operator at: "+ this.curToken.text);
        }
        while(this.isComparisonOperator()){
            this.nextToken()
            this.expression()
        }
    }
    expression(){
        console.log("EXPRESSION");
        this.term()
        while(this.checkToken(TOKENTYPE.PLUS) | this.checkToken(TOKENTYPE.MINUS)){
            this.nextToken();
            this.term();
        }
    }
    term(){
        console.log("TERM");

        this.unary();
        while(this.checkToken(TOKENTYPE.ASTERISK) | this.checkToken(TOKENTYPE.SLASH)){
            this.nextToken();
            this.unary();
        }
    }
    unary(){
        console.log("UNARY");

        if(this.checkToken(TOKENTYPE.PLUS) | this.checkToken(TOKENTYPE.MINUS)){
            this.nextToken();
        }
        this.primary();
    }
    primary(){
        console.log("PRIMARY (" + this.curToken.text+ ")")

        if(this.checkToken(TOKENTYPE.NUMBER)){
            this.nextToken();
        }else if(this.checkToken(TOKENTYPE.IDENT)){
            this.nextToken();
        }else{
            this.abort("Unexpected token at "+this.curToken.text);
        }
    }
    isComparisonOperator(){
        return this.checkToken(TOKENTYPE.GT) | this.checkToken(TOKENTYPE.GTEQ) | this.checkToken(TOKENTYPE.LT) | this.checkToken(TOKENTYPE.LTEQ) | this.checkToken(TOKENTYPE.EQEQ) | this.checkToken(TOKENTYPE.NOTEQ);
    }
    nl(){
        console.log("NEWLINE");
        this.match(TOKENTYPE.NEWLINE)
        while(this.checkToken(TOKENTYPE.NEWLINE)){
            this.nextToken()
        }
    }
}


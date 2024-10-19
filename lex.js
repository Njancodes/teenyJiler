export default class Lexer{
    constructor(source){
        this.src = source+'\n';
        this.curChar = '';
        this.curPos = -1;
        this.nextChar();
    }
    nextChar(){
        this.curPos += 1;
        if(this.curPos >= this.src.length){
            this.curChar = '\0';
        }else{
            this.curChar = this.src[this.curPos]
        }
    }
    peek(){
        if(this.curPos + 1 >= this.src.length){
            return '\0';
        }
        return this.src[this.curPos+1];
    }
    abort(message){
        console.log("Lexing error. " + message)
        process.exit(0);
    }
    skipWhiteSpace(){
        while(this.curChar === ' ' || this.curChar === '\t' || this.curChar === '\r'){
            this.nextChar();
        }
    }
    skipComment(){
        if(this.curChar === '#'){
            while(this.curChar !== '\n'){
                this.nextChar()
            }
        }
    }
    getToken(){
        this.skipWhiteSpace();
        this.skipComment();
        let token = null;

        if (this.curChar === '+') {
            token = new Token(this.curChar, TOKENTYPE.PLUS)
        }else if(this.curChar === '-') {
            token = new Token(this.curChar, TOKENTYPE.MINUS)
        }else if(this.curChar === '*') {
            token = new Token(this.curChar, TOKENTYPE.ASTERISK)
        }else if(this.curChar === '/') {
            token = new Token(this.curChar, TOKENTYPE.SLASH)
        }else if(this.curChar === '=') {
            if(this.peek() === '='){
                let lastChar = this.curChar;
                this.nextChar();
                token = new Token(lastChar+this.curChar, TOKENTYPE.EQEQ);
            }else{
                token = new Token(this.curChar, TOKENTYPE.EQ);
            }
        }else if(this.curChar === '"') {
            this.nextChar();
            let startPos = this.curPos;

            while(this.curChar !== '"'){
                if(this.curChar === '\r' || this.curChar === '\n' || this.curChar === '\t' || this.curChar === '\\' || this.curChar === '%'){
                    this.abort("Illegal character in string.");
                }
                this.nextChar();
            }
            let tokText = this.src.slice(startPos,this.curPos+1);
            token = new Token(tokText, TOKENTYPE.STRING);
        }else if(isNumber(this.curChar)){
            let startPos = this.curPos;
            while(isNumber(this.peek())){
                this.nextChar()
            }
            if(this.peek() === '.'){
                this.nextChar();
                if(!isNumber(this.peek())){
                    this.abort("Illegal character in number.");
                }
                while(isNumber(this.peek())){
                    this.nextChar();
                }
            }
            let tokText = this.src.slice(startPos, this.curPos);
            token = new Token(tokText, TOKENTYPE.NUMBER);
        }else if(isAlpha(this.curChar)){
            let startPos = this.curPos;
            while(isNumber(this.peek()) || isAlpha(this.peek())){
                this.nextChar();
            }
            let tokText = this.src.slice(startPos,this.curPos+1);
            let keyword = Token.checkIfKeyword(tokText);
            if(keyword === null){
                token = new Token(tokText, TOKENTYPE.IDENT);
            }else{
                token = new Token(tokText, keyword);
            }
        }else if(this.curChar === '<') {
            if(this.peek() === '='){
                let lastChar = this.curChar;
                this.nextChar();
                token = new Token(lastChar+this.curChar, TOKENTYPE.LTEQ);
            }else{
                token = new Token(this.curChar, TOKENTYPE.LT);
            }
        }else if(this.curChar === '>') {
            if(this.peek() === '='){
                let lastChar = this.curChar;
                this.nextChar();
                token = new Token(lastChar+this.curChar, TOKENTYPE.GTEQ);
            }else{
                token = new Token(this.curChar, TOKENTYPE.GT);
            }
        }else if(this.curChar === '!') {
            if(this.peek() === '='){
                let lastChar = this.curChar;
                this.nextChar();
                token = new Token(lastChar+this.curChar, TOKENTYPE.NOTEQ);
            }else{
                this.abort("Expected !=, got !"+this.peek());
            }
        }else if(this.curChar === '\n') {
            token = new Token(this.curChar, TOKENTYPE.NEWLINE)
        }else if(this.curChar === '\0') {
            token = new Token(this.curChar, TOKENTYPE.EOF)
        }else{
            this.abort("Unknown token: " + this.curChar);
        }
        this.nextChar();
        return token
    }
}

class Token{
    constructor(tokenText, tokenKind){
        this.text = tokenText;
        this.kind = tokenKind;
    }
    static checkIfKeyword(tokenText){
        let tokens = Object.keys(TOKENTYPE);
        for(let i = 0; i< tokens.length;i++){
            let kind = tokens[i]
            if(kind === tokenText && TOKENTYPE[kind] >= 100 && TOKENTYPE[kind] < 200){
                return TOKENTYPE[kind];
            }
        }
        return null;
    }
}

function isNumber(char) {
    return /^\d$/.test(char);
}

function isAlpha(char){
    return /^[a-z]/i.test(char);
}

export const TOKENTYPE = Object.freeze({
    EOF: -1,
	NEWLINE: 0,
	NUMBER: 1,
	IDENT: 2,
	STRING: 3,
    //Keywords
	LABEL: 101,
	GOTO: 102,
	PRINT: 103,
	INPUT: 104,
	LET: 105,
	IF: 106,
	THEN: 107,
	ENDIF: 108,
	WHILE: 109,
	REPEAT: 110,
	ENDWHILE: 111,
	// Operators
	EQ: 201,
	PLUS: 202,
	MINUS: 203,
	ASTERISK: 204,
	SLASH: 205,
	EQEQ: 206,
	NOTEQ: 207,
	LT: 208,
	LTEQ: 209,
	GT: 210,
	GTEQ: 211
})
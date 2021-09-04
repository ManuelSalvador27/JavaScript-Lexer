const input = "7 77";

function* lexer(str) {
  for (let cursor = 0; cursor <= str.length; cursor++) {
    let chr = str[cursor]
    if(chr === undefined){
      yield { 
        type: 'EOF'
      }
    }else if (chr === "7"){
      yield { 
        type: 'number',
        value: 7,
      }
    }
  }
}

console.log('Start');
for(const token of lexer(input)){
  console.log(token);
}

console.log('Finish');
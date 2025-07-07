function lexer(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];

    // Skip White Spaces
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // Handle identifiers and keywords
    if (/[a-zA-Z]/.test(char)) {
      let word = "";

      while (/[a-zA-Z0-9]/.test(char)) {
        word += char;
        char = input[++cursor];
      }

      if (["ye", "bol", "agar", "nahito", "agarmagar"].includes(word)) {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }

      continue;
    }

    // Handle numbers
    if (/[0-9]/.test(char)) {
      let num = "";

      while (/[0-9]/.test(char)) {
        num += char;
        char = input[++cursor];
      }

      tokens.push({ type: "number", value: parseInt(num) });
      continue;
    }

    // Handle operators (including >=, <=, ==, !=)
    if (/[\+\-\*\/=<>!]/.test(char)) {
      let op = char;
      let nextChar = input[cursor + 1];

      // Two-char operators like >=, <=, ==, !=
      if (
        (char === '>' || char === '<' || char === '=' || char === '!') &&
        nextChar === '='
      ) {
        op += nextChar;
        cursor++;
      }

      tokens.push({ type: "operator", value: op });
      cursor++;
      continue;
    }

    // Ignore unknown characters safely
    cursor++;
  }

  return tokens;
}


function parser(tokens) {
  const ast = {
    type: "program",
    body: [],
  };

  function parseBlock() {
    const block = [];
    while (
      tokens.length > 0 &&
      !(tokens[0].type === "keyword" && ["agar", "nahito", "agarmagar"].includes(tokens[0].value))
    ) {
      let token = tokens.shift();

      if (token.type === "keyword" && token.value === "ye") {
        let declaration = {
          type: "Declaration",
          name: tokens.shift().value,
          value: null,
        };

        if (tokens[0].type === "operator" && tokens[0].value === "=") {
          tokens.shift();
          let expression = "";
          while (tokens.length > 0 && tokens[0].type !== "keyword") {
            expression += tokens.shift().value;
          }
          declaration.value = expression.trim();
        }

        block.push(declaration);
      } else if (token.type === "keyword" && token.value === "bol") {
        let next = tokens.shift();
        if (next && (next.type === "identifier" || next.type === "number")) {
          block.push({
            type: "Print",
            expression: next.value,
          });
        } else {
          throw new Error("Invalid expression after 'bol'");
        }
      }
    }
    return block;
  }

  while (tokens.length > 0) {
    let token = tokens.shift();

    if (token.type === "keyword" && token.value === "agar") {
      let test = "";
      while (
        tokens.length > 0 &&
        !(tokens[0].type === "keyword" && ["ye", "bol", "nahito", "agarmagar", "agar"].includes(tokens[0].value))
      ) {
        test += tokens.shift().value;
      }

      const ifNode = {
        type: "IfStatement",
        test: test.trim(),
        consequent: parseBlock(),
        alternate: null,
      };

      if (tokens[0] && tokens[0].type === "keyword" && tokens[0].value === "agarmagar") {
        tokens.shift();
        let elseifTest = "";
        while (
          tokens.length > 0 &&
          !(tokens[0].type === "keyword" && ["ye", "bol", "nahito", "agar"].includes(tokens[0].value))
        ) {
          elseifTest += tokens.shift().value;
        }

        ifNode.alternate = {
          type: "IfStatement",
          test: elseifTest.trim(),
          consequent: parseBlock(),
          alternate: null,
        };
      }

      if (tokens[0] && tokens[0].type === "keyword" && tokens[0].value === "nahito") {
        tokens.shift();
        ifNode.alternate = {
          type: "Block",
          body: parseBlock(),
        };
      }

      ast.body.push(ifNode);
    } else if (token.type === "keyword" && token.value === "ye") {
      // already handled above
      tokens.unshift(token);
      ast.body.push(...parseBlock());
    }
  }

  return ast;
}


function codegen(node) {
  switch (node.type) {
    case 'program':
      return node.body.map(codegen).join('\n');

    case 'Declaration':
      return `const ${node.name} = ${node.value}`;

    case 'Print':
      return `console.log(${node.expression})`;

    case 'IfStatement':
      const alternate = node.alternate
        ? node.alternate.type === 'Block'
          ? `else {\n${node.alternate.body.map(codegen).join('\n')}\n}`
          : `else ${codegen(node.alternate)}`
        : '';
      return `if (${node.test}) {\n${node.consequent.map(codegen).join('\n')}\n}${alternate}`;

    case 'Block':
      return node.body.map(codegen).join('\n');

    default:
      return '';
  }
}

function runner(input){
    eval(input)
}
const compiler = (input) => {
  const tokens = lexer(input);
  const ast = parser(tokens);
  const executablCode = codegen(ast)
  return executablCode
};

function runner (input){ // to run the code
    eval(input)
}

const code = `
ye x = 15
ye y = 5
agar x > y
  bol x
agarmagar x < y
  bol y
nahito
  bol 100
`;

const exec = compiler(code);
runner(exec);

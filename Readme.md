# 🔤 Ye bol Compiler

A custom **mini-language compiler** inspired by Hinglish programming syntax like `ye`, `bol`, `agar`, `nahito`, and more!  
This project builds a complete pipeline: `Lexer` → `Parser` → `Codegen` → `Runner`.

---

## 🚀 Features

✅ Simple variable declarations using `ye`  
✅ Conditional logic using `agar`, `agarmagar`, `nahito`  
✅ Print statements via `bol`  
✅ Custom tokenizer and parser  
✅ Outputs clean, valid JavaScript!

---

📁 Project Structure

📦 HinglishLang-Compiler
 ┣ 📄 lexer()       -> Token generator
 ┣ 📄 parser()      -> AST builder
 ┣ 📄 codegen()     -> JS code emitter
 ┣ 📄 runner()      -> Executor
 ┗ 📄 compiler()    -> Glue for all

 ---

## 🧠 Syntax Overview

```text
ye x = 10
ye y = 20

agar x < y
  bol x
agarmagar x > y
  bol y
nahito
  bol 100

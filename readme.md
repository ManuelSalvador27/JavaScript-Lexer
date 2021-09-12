Manuel Salvador Morales Salgado - Matricula: A01422267 <br/>
José Antonio Lome Paulino - Matricula: A01422195

Este proyecto esta hecho en node.js v14.17.0 sin dependencias externas

Grámatica de Javascript:
- Comentarios /*TODO*/
  - / Hola /
  - /* Esta es un comentario largo */ 
- Comentarios hashbang /*TODO*/
  - #!/usr/bin/env node 
- Palabras reservadas
  - break
  - case
  - catch
  - class
  - continue
  - debugger
  - default
  - delete
  - do
  - //else
  - export
  - extends
  - finally
  - for
  - //function
  - //if  
  - import
  - in
  - instanceof
  - new
  - return
  - super
  - switch
  - this
  - throw
  - try
  - typeof
  - var
  - void
  - while
  - with (en-US)
  - yield
  - let
*No incluye las futuras palabras reservadas*
- Identificador especiales /*TODO*/
  - arguments 
  - get 
  - set
- Literales /*TODO*/
  - null 
  - true
  - false
  - Decimales (Ej: 1234, 0888 - 888)
  - Exponenciales (Ej: 0e-5)
  - Binarios (Ej: 0b10000000000000000000000000000000; // 2147483648)
  - Octal (Ej: 0o755; // 493)
  - Hexadecimales (Ej: 0xA)
- Objetos literales /*TODO*/
  - var o = 'foo';
  - var o = {a, b, c};
- Arreglos literales /*TODO*/
  - [1954, 1974, 1990, 2014]
- Cadenas literales /*TODO*/
  - 'foo'
  - "bar"
- Expresiones regulares /*TODO*/
  - /ab+c/g
- Punto y coma 
  - Opcional
  - Existente
- Parentesis /*TODO*/
  - Curly braces
  - Parentesis

##CHANGELOG
#[NEW] Analizador léxico (tokens)
#[NEW] Analizador sintactico simple
#[NEW] Obtenemos los tokens y los mostramos, bug resulto de salto de linea
#[NEW] Imprimos y analizamos palabras reservadas, punto y coma, comas y letras
#[NEW] Nuevas actividades TODO dentro del readme.md
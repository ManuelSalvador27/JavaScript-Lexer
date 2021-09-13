var  = nicks =   , nick;
while (true) {
nick = prompt (Introduzca un nombre);
if (nick) {
nicks += nick + ; // Agrega el nuevo nombre y un espacio después
 } else {
break; // Salir del bucle
}
}
alert (nicks) // Muestra los nombres

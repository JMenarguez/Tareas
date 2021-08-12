
var nombre = localStorage.getItem("Usuario");

window.setTimeout(function(){redireccion(nombre)}, 2000);

function redireccion(nombre){
if(nombre!=""){
    window.location.href='index1.html?usuario='+nombre;
}else{
    window.location.href='login.html';
}
}
const nombre=document.getElementById("name")
const email=document.getElementById("email")
const pass=document.getElementById("password")
const form=document.getElementById("form")
const parrafo=document.getElementById("warnings")

form.addEventListener("submit", e=>{
    e.preventDefault()
    let warnings=""
    let regexEmail=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let entrar=false
    parrafo.innerHTML=""
    
    if(nombre.value.length<6){
        warnings += 'El nombre no es valido <br>'
        entrar=true

    }
    if(!regexEmail.test(email.value)){
        warnings += 'El email no es valido <br>'
        entrar=true

    }

    if(pass.value.length<8){
        warnings += 'La Contraseña no es valida <br>'
        entrar=true
    }
    if(entrar){
        parrafo.innerHTML=warnings
    }else{
        parrafo.innerHTML="Datos Enviados"
    }

})
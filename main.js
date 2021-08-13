const nombre=document.getElementById("name")
const email=document.getElementById("email")
const pass=document.getElementById("password")
const pass1=document.getElementById("password1")
const form=document.getElementById("form")
const parrafo=document.getElementById("warnings")
const db = firebase.firestore();

const saveTask=(usuario,email,clave)=>{
    db.collection('usuarios').doc().set({
        usuario,
        email,
        clave
    })
}
form.addEventListener("submit",async (e)=>{
    e.preventDefault()
    let warnings=""
    let regexEmail=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let entrar=false
    parrafo.innerHTML=""
    
    if(nombre.value.length<6){
        warnings += 'El usuario debe tener 6 caracteres <br>'
        entrar=true

    }
    let usu=nombre.value;
    let em=email.value;
    let userExiste="";
    let emailExiste="";
    Usuariosdb= await db.collection('usuarios').get();
    Usuariosdb.docs.forEach(doc => {
        usuariofb=doc.data().usuario;
        emailfb=doc.data().email;
        if(usuariofb==usu){
        userExiste=usuariofb;
        }
        if(emailfb==em){
            emailExiste=emailfb;
            }
    })

    if(userExiste!=""){
   
        warnings += 'El usuario ya existe en la BD <br>';
        entrar=true;
    }
    if(emailExiste!=""){
        warnings += 'El email ya existe en la BD <br>';
        entrar=true;
    }
    
    if(!regexEmail.test(email.value)){
        warnings += 'El email no es valido <br>'
        entrar=true

    }

    if(pass.value.length<8){
        warnings += 'La Contraseña debe tener 8 caracteres <br>'
        entrar=true
    }
    if(pass1.value!=pass.value){
        warnings += 'Las contraseñas no coinciden <br>'
        entrar=true
    }
    if(entrar){
        parrafo.innerHTML=warnings
    }else{
        
        const sav= await saveTask(nombre.value,email.value,pass.value);
        parrafo.innerHTML="Datos Enviados...redireccionando";

        window.setTimeout(function(){redireccion()}, 2000);
    }

})


function redireccion(){
    window.location.href='login.html';

}
const loginForm=document.querySelector('#loginForm');
const db = firebase.firestore();

const validarUser=async (usu,clave)=>{
         let retorno="";
         Usuariosdb= await db.collection('usuarios').get();
         
           Usuariosdb.docs.forEach(doc => {
               usuariofb=doc.data().usuario;
               clavefb=doc.data().clave;
               if(usuariofb==usu && clavefb==clave){
                //console.log(usuariofb);
                retorno=usuariofb;
               }
               
          })
          return retorno;
          
};

loginForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const usu =document.getElementById('usuario').value;
    const clave =document.getElementById('clave').value;
    let retorno="";
    Usuariosdb= await db.collection('usuarios').get();
    Usuariosdb.docs.forEach(doc => {
        usuariofb=doc.data().usuario;
        clavefb=doc.data().clave;
        if(usuariofb==usu && clavefb==clave){
        //console.log(usuariofb);
        retorno=usuariofb;
        }
        
    })
    
    if(retorno!=""){
        window.location.href='index.html?usuario='+retorno;
    }else{
        alert('usuario no registrado');
    }
})
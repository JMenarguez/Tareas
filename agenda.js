const db = firebase.firestore();



let editStatus=false;
let id="";
let usuario=""
let filtroBuscar="";

const agForm=document.querySelector('#ag-form');
const agFormBuscar=document.querySelector('#ag-buscarempresa');
const btnGuardar=document.getElementById('btn-save');
const btnCancelar=document.getElementById('btn-cancel');
const btnCancelarBuscar=document.getElementById('btn-cancelar');
const btnBuscar=document.getElementById('btn-buscar');
const agContainer=document.getElementById('ag-container');
const errortask=document.getElementById('errortask');

const saveAg=(nombre,empresa,cuit,telefono,email,usuario)=>{
    db.collection('agenda').doc().set({
        nombre,
        empresa,
        cuit,
        telefono,
        email,
        usuario
    })
    // db.collection('usuarios').doc().set({
    //     usuario:'mlorenas',
    //     clave:123
    // })
}

function getUser() {
    var sPaginaURL = window.location.search;
    var sURLVariables = sPaginaURL.split('=');
    usuario=sURLVariables[1];
    document.getElementById('user').innerHTML=usuario;
}

const editAg=id=>db.collection('agenda').doc(id).get();
const deleteAg=id =>{
    rc = confirm("¿Seguro que desea Eliminar?");
    if(rc) db.collection('agenda').doc(id).delete();
}
const updateAg=(id,updatedAg)=>db.collection('agenda').doc(id).update(updatedAg);

onGetAg=(callback)=>db.collection('agenda').orderBy('empresa').where("usuario","==",usuario).onSnapshot(callback);


const onGetAg1=()=>{
    onGetAg((querySnapshot)=>{
    agContainer.innerHTML="";
    let contadorAg=0;
    querySnapshot.forEach(doc => {
        //console.log(doc.data());   
        const agenda=doc.data();
        agenda.id=doc.id;
        //sentence.includes(word)
        let empresamayuscula=agenda.empresa.toUpperCase();
        if(empresamayuscula.includes(filtroBuscar.toUpperCase()) || filtroBuscar=='') {
        contadorAg++;
        agContainer.innerHTML+=`<div class="card card-body mt-2 border-primary" id="acciones">
          <div class="tarea-fecha">
             <h3>${agenda.empresa} </h3><a><i id="btnAcciones" data-id="${agenda.id}" class="fas fa-ellipsis-v"></i></a>
          </div>  
          <h5>${agenda.nombre} </h5>
          <p>${agenda.cuit}</p>
          <p>${agenda.telefono}</p>
          <p>${agenda.email}</p>
          <div class="action" hidden data-id="${agenda.id}">
            <button title="Borrar Tarea" class="btn btn-danger btn-lg btnBorrar" data-id="${agenda.id}"><i data-id="${agenda.id}" class="fas fa-trash-alt"></i></button>
            <button title="Editar Tarea" class="btn btn-primary btn-lg btnEdit" data-id="${agenda.id}"><i data-id="${agenda.id}" class="fas fa-pen-alt"></i></button>
          </div>
        </div>`
        }    
    })
        
        
        titulo='Agenda: ';
        $('#ag-filtros').html(titulo+contadorAg);
        
        const btnacciones=document.querySelectorAll('#btnAcciones');
        btnacciones.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                
                divactionid=e.target.dataset.id;
                $('.action[data-id='+divactionid+']').attr('hidden',$('.action[data-id='+divactionid+']').attr('hidden')==='hidden'?false:true );
            });
        })

        const btnBorrar=document.querySelectorAll('.btnBorrar');
        btnBorrar.forEach(btn=>{
            btn.addEventListener('click',async (e)=>{
               await deleteAg(e.target.dataset.id);
            })
        })
   
        const btnEdit=document.querySelectorAll('.btnEdit');
        btnEdit.forEach(btn=>{
            btn.addEventListener('click',async (e)=>{
               
               const doc=await editTask(e.target.dataset.id);
               const agenda=doc.data();

               editStatus=true;
               id=doc.id;
               agForm['ag-nombre'].value=agenda.nombre; 
               agForm['ag-empresa'].value=agenda.empresa;
               agForm['ag-cuit'].value=agenda.cuit;
               agForm['ag-telefono'].value=agenda.telefono;
               agForm['ag-email'].value=agenda.email;
               agForm['btn-save'].innerText='Actualizar';
               mostrarNueva();
               agForm['ag-empresa'].focus();
            })
        })
                 
    });
}

window.addEventListener('DOMContentLoaded',async (e)=>{
    getUser();
    onGetAg1();
})


document.getElementById('home').addEventListener('click',(e)=>{
    window.location.href='index1.html?usuario='+usuario;
}) 

document.getElementById('cs').addEventListener('click',(e)=>{
    localStorage.setItem("Usuario", "");
    window.location.href='login.html';
    
}) 


function mostrarNueva(){
    document.getElementById('ag-form').style.display = 'block';
    document.getElementById('btn-new').style.display='none';
    document.getElementById('btn-find').style.display='none';
    agForm['ag-empresa'].focus();

}

btnGuardar.addEventListener('click',async (e)=>{
    e.preventDefault();
    
    const nombre=agForm['ag-nombre'];
    const empresa=agForm['ag-empresa'];
    const cuit=agForm['ag-cuit'];
    const telefono=agForm['ag-telefono'];
    const email=agForm['ag-email'];

    
    if(nombre.value==""){ 
        errortask.removeAttribute('hidden');
        errortask.innerHTML='El nombre no puede estar en blanco';
        return false
    }
    if(empresa.value==""){
        errortask.removeAttribute('hidden');
        errortask.innerHTML='La empresa no puede estar en blanco';
        return false
    };
    //peticion asincrona, termina de guardar y devuelve una respuesta
    //usemos async await para esperar la respuesta
    //hasta qeu no termina no continua con lo de abajo (async)
    if(!editStatus){
        await saveAg(nombre.value,empresa.value,cuit.value,telefono.value,email.value,usuario);
    }else{
        await updateAg(id,{
            nombre:nombre.value,
            empresa:empresa.value,
            cuit:cuit.value,
            telefono:telefono.value,
            email:email.value,
            usuario:usuario
            })
            editStatus=false;
            id="";
            agForm['btn-save'].innerText='Guardar';        
    }
    
    agForm.reset();
    empresa.focus();
    errortask.setAttribute('hidden',"");
    if(screen.width<800){
        document.getElementById('ag-form').style.display = 'none';
        document.getElementById('btn-new').style.display='block';
        document.getElementById('btn-find').style.display='block';
    }

}) 

btnCancelar.addEventListener('click',async (e)=>{
    e.preventDefault();
    agForm.reset();
    agForm['ag-empresa'].focus();
    errortask.setAttribute('hidden',"");
    if(screen.width<800){
    document.getElementById('ag-form').style.display = 'none';
    document.getElementById('btn-new').style.display='block';
    document.getElementById('btn-find').style.display='block';
    }
})
function buscarEmpresa(){
    document.getElementById('ag-buscarempresa').style.display = 'block';
    document.getElementById('btn-new').style.display='none';
    document.getElementById('btn-find').style.display='none';
    agFormBuscar['ag-buscartext'].focus();

}

btnCancelarBuscar.addEventListener('click',async (e)=>{
    e.preventDefault();
    agFormBuscar.reset();
    //agFormBuscar['ag-empresa'].focus();
    filtroBuscar="";
    errortask.setAttribute('hidden',"");
    if(screen.width<800){
    document.getElementById('ag-buscarempresa').style.display = 'none';
    document.getElementById('btn-new').style.display='block';
    document.getElementById('btn-find').style.display='block';
    }
    onGetAg1();
})

btnBuscar.addEventListener('click',async (e)=>{
    e.preventDefault();
   
    filtroBuscar=agFormBuscar['ag-buscartext'].value;
    onGetAg1();

})
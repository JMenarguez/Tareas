const db = firebase.firestore();

const tiempoTranscurrido = Date.now();

let editStatus=false;
let id="";
let importante="#000";
let terminada=false;
let filtroterminadas=true;
let filtroimportante='#000';
let fechafiltro="";
let filtrohoy=false;
let usuario=""

const formatFecha=(fecha)=>{
    
    var month = ("0"+(fecha.getUTCMonth()+1)).slice(-2); //months from 1-12
    var day =("0"+ fecha.getDate()).slice(-2);

    var year = fecha.getUTCFullYear();
    var hora=fecha.toLocaleTimeString();
    fechavalor=year+"-"+month+"-"+day+"T"+hora;
    fechafiltro=year+"-"+month+"-"+day
    document.getElementById('task-date').value=fechavalor;
}
const obtenerHoy=()=>{
    const hoy = new Date(tiempoTranscurrido);
    //let fechavalor=hoy.toISOString();
    //console.log(hoy.toLocaleTimeString());
    //fechavalor=fechavalor.substring(0, 16);
    //fechafiltro=fechavalor.substring(0,10);
    //console.log(fechavalor);
    formatFecha(hoy);

    //document.getElementById('task-date').value=fechavalor;
}

const taskForm=document.querySelector('#task-form');
const btnGuardar=document.getElementById('btn-task');
const btnCancelar=document.getElementById('btn-cancel');
const taskContainer=document.getElementById('task-container');
const errortask=document.getElementById('errortask');

const saveTask=(fecha,title,description,importante,terminada,usuario)=>{
    db.collection('tareas').doc().set({
        fecha,
        title,
        description,
        importante,
        terminada,
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

const editTask=id=>db.collection('tareas').doc(id).get();
const deleteTask=id =>{
    rc = confirm("¿Seguro que desea Eliminar?");
    if(rc) db.collection('tareas').doc(id).delete();
}
const updateTask=(id,updatedTask)=>db.collection('tareas').doc(id).update(updatedTask);

onGetTask=(callback)=>db.collection('tareas').where("usuario","==",usuario).where("terminada","==",!filtroterminadas).onSnapshot(callback);


const onGetTask1=()=>{
    onGetTask((querySnapshot)=>{
    taskContainer.innerHTML="";
    let contadorTareas=0;
    querySnapshot.forEach(doc => {
       // console.log(doc.data());   
        const tareas=doc.data();
        tareas.id=doc.id;
        //if(tareas.usuario==usuario){
        if((tareas.importante==filtroimportante || filtroimportante=='#000') && (tareas.fecha.substring(0,10)==fechafiltro || !filtrohoy)){
        contadorTareas++;
        taskContainer.innerHTML+=`<div class="card card-body mt-2 border-primary" id="acciones">
          <div class="tarea-fecha">
             <h5>${tareas.fecha} </h5><a title="Tarea importante" class="favorito"><i data-id="${tareas.id}" value="${tareas.importante}" style="color:${tareas.importante}" class="fas fa-star"></i></a><a><i id="btnAcciones" data-id="${tareas.id}" class="fas fa-ellipsis-v"></i></a>
          </div>
          <h3>${tareas.title} </h3>
          
          <p class="${tareas.terminada}">${tareas.description}</p>
          <div class="action" hidden data-id="${tareas.id}">
            <button title="Borrar Tarea" class="btn btn-danger btn-lg btnBorrar"><i data-id="${tareas.id}" class="fas fa-trash-alt"></i></button>
            <button title="Editar Tarea" class="btn btn-primary btn-lg btnEdit"><i data-id="${tareas.id}" class="fas fa-pen-alt"></i></button>
            <button title="Terminar Tarea" class="btn btn-success btn-lg btnFinal"><i data-id="${tareas.id}" class="fas fa-clipboard-check"></i></button>
            
          </div>
        </div>`;
        }
        //}
        //armamos el titulo
        titulo=(filtrohoy)?'Mi Día: ':'Tareas: ';
        titulofiltro=(filtroimportante!='#000')?' Importantes ':'';
        titulofiltro+=(!filtroterminadas)?' Terminadas':'';
        $('#task-filtros').html(titulo+contadorTareas+titulofiltro);
        
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
               await deleteTask(e.target.dataset.id);
            })
        })
   
        const btnEdit=document.querySelectorAll('.btnEdit');
        btnEdit.forEach(btn=>{
            btn.addEventListener('click',async (e)=>{
               const doc=await editTask(e.target.dataset.id);
               const tarea=doc.data();
               editStatus=true;
               id=doc.id;
               importante=tarea.importante;
               
               taskForm['task-title'].value=tarea.title; 
               taskForm['task-description'].value=tarea.description;
               taskForm['task-date'].value=tarea.fecha;
               document.getElementById('favoritoMain').style.color = tarea.importante;
               taskForm['btn-task'].innerText='Actualizar';
               taskForm['task-title'].focus();
            })
        })
        const btnFinal=document.querySelectorAll('.btnFinal');
        btnFinal.forEach(btnf=>{
            btnf.addEventListener('click',async (e)=>{
               const doc=await editTask(e.target.dataset.id);
               const tareaf=doc.data();
               id=doc.id;

               terminada=!tareaf.terminada;
               await updateTask(id,{
                    fecha:tareaf.fecha,
                    title:tareaf.title,
                    description:tareaf.description,
                    importante:tareaf.importante,
                    terminada:terminada
                })
                editStatus=false;
                id="";
                terminada=false;
            })
        })  
          
    });
    
})
}
window.addEventListener('DOMContentLoaded',async (e)=>{
    obtenerHoy();
    getUser();
    onGetTask1();
})


document.getElementById('home').addEventListener('click',(e)=>{
    filtroterminadas=true;
    filtroimportante='#000';
    filtrohoy=false;
    onGetTask1();
}) 
document.getElementById('tt').addEventListener('click',(e)=>{
    filtroterminadas=!filtroterminadas;
    onGetTask1();
})  
document.getElementById('ti').addEventListener('click',(e)=>{
    if(filtroimportante=='#FFD523'){
        filtroimportante='#000';
    }else{
        filtroimportante='#FFD523';
    }
    onGetTask1();
})  

document.getElementById('md').addEventListener('click',(e)=>{
    filtrohoy=!filtrohoy;
    onGetTask1();
})  
document.getElementById('cs').addEventListener('click',(e)=>{
    localStorage.setItem("Usuario", "");
    window.location.href='index.html';
    
}) 
document.getElementById('favoritoMain').addEventListener('click',()=>{
        if(importante=="#000"){
          importante="#FFD523";
        
        }else{
          importante="#000";
        }
        document.getElementById('favoritoMain').style.color=importante;
    
})

function mostrarNueva(){
    document.getElementById('task-form').style.display = 'block';
    document.getElementById('btn-new').style.display='none';
    

}
//taskForm.addEventListener('submit',async (e)=>{
    btnGuardar.addEventListener('click',async (e)=>{
    e.preventDefault();
    
    const title=taskForm['task-title'];
    const description=taskForm['task-description'];
    const fecha=taskForm['task-date'];
    
    if(title.value==""){ 
        errortask.removeAttribute('hidden');
        errortask.innerHTML='El titulo no puede estar en blanco';
        return false
    }
    if(description.value==""){
        errortask.removeAttribute('hidden');
        errortask.innerHTML='La descripcion de la tarea no puede estar en blanco';
        return false
    };
    //peticion asincrona, termina de guardar y devuelve una respuesta
    //usemos async await para esperar la respuesta
    //hasta qeu no termina no continua con lo de abajo (async)
    if(!editStatus){
        await saveTask(fecha.value,title.value,description.value,importante,terminada,usuario);
    }else{
        await updateTask(id,{
            fecha:fecha.value,
            title:title.value,
            description:description.value,
            importante:importante,
            usuario:usuario
            })
            editStatus=false;
            id="";
            taskForm['btn-task'].innerText='Guardar';        
    }
    importante="#000";
    document.getElementById('favoritoMain').style.color=importante;
    document.getElementById('favoritoMain1').setAttribute("hidden","");
    taskForm.reset();
    obtenerHoy();
    title.focus();
    errortask.setAttribute('hidden',"");
    if(screen.width<800){
        document.getElementById('task-form').style.display = 'none';
        document.getElementById('btn-new').style.display='block';
    }

    
})
btnCancelar.addEventListener('click',async (e)=>{
    e.preventDefault();
    importante="#000";
    document.getElementById('favoritoMain').style.color=importante;
    document.getElementById('favoritoMain1').setAttribute("hidden","");
    
    taskForm.reset();
    obtenerHoy();
    taskForm['task-title'].focus();
    errortask.setAttribute('hidden',"");
    if(screen.width<800){
    document.getElementById('task-form').style.display = 'none';
    document.getElementById('btn-new').style.display='block';
    }
})


const db = firebase.firestore();

const tiempoTranscurrido = Date.now();

let editStatus=false;
let id="";
let importante="#000";
let terminada=false;
let filtroterminadas=false;
let filtroimportante='#000';
let fechafiltro="";
let filtrohoy=false;

const obtenerHoy=()=>{
    const hoy = new Date(tiempoTranscurrido);
    let fechavalor=hoy.toISOString();
    let horavalor=hoy.toLocaleTimeString();
    fechavalor=fechavalor.substring(0, 16);
    fechafiltro=fechavalor.substring(0,10);
    
    document.getElementById('task-date').value=fechavalor;
}
const taskForm=document.querySelector('#task-form');
const taskContainer=document.getElementById('task-container');
const saveTask=(fecha,title,description,importante,terminada)=>{
    db.collection('tareas').doc().set({
        fecha,
        title,
        description,
        importante,
        terminada
    })
}
const getTask=()=>{
    //db.collection('tareas').get();
};

const editTask=id=>db.collection('tareas').doc(id).get();
const deleteTask=id =>{
    rc = confirm("¿Seguro que desea Eliminar?");
    if(rc) db.collection('tareas').doc(id).delete();
}
const updateTask=(id,updatedTask)=>db.collection('tareas').doc(id).update(updatedTask);

onGetTask=(callback)=>db.collection('tareas').onSnapshot(callback);

const onGetTask1=()=>{
    onGetTask((querySnapshot)=>{
    taskContainer.innerHTML="";
    let contadorTareas=0;
    querySnapshot.forEach(doc => {
        //console.log(doc.data());   
        const tareas=doc.data();
        //a=JSON.parse(tareas);
        
        tareas.id=doc.id;
        if((tareas.terminada!=filtroterminadas || !filtroterminadas) && (tareas.importante==filtroimportante || filtroimportante=='#000') && (tareas.fecha.substring(0,10)==fechafiltro || !filtrohoy)){
        contadorTareas++;
        taskContainer.innerHTML+=`<div class="card card-body mt-2 border-primary" id="acciones">
          <div class="tarea-fecha">
             <h5>${tareas.fecha} </h5><a title="Tarea importante" class="favorito"><i data-id="${tareas.id}" value="${tareas.importante}" style="color:${tareas.importante}" class="fas fa-star"></i></a><a><i id="btnAcciones" data-id="${tareas.id}" class="fas fa-ellipsis-v"></i></a>
            
          </div>
          <h3>${tareas.title} </h3>
          
          <p class="${tareas.terminada}">${tareas.description}</p>
          <div class="action" hidden data-id="${tareas.id}">
            <button title="Borrar Tarea" class="btn btn-danger btnBorrar"><i data-id="${tareas.id}" class="fas fa-trash-alt"></i></button>
            <button title="Editar Tarea" class="btn btn-primary btnEdit"><i data-id="${tareas.id}" class="fas fa-pen-alt"></i></button>
            <button title="Terminar Tarea" class="btn btn-success btnFinal"><i data-id="${tareas.id}" class="fas fa-clipboard-check"></i></button>
            
          </div>
        </div>`;
        }
        //armamos el titulo
        titulo=(filtrohoy)?'Mi Día: ':'Tareas: ';
        titulofiltro=(filtroimportante!='#000')?' Importantes ':'';
        titulofiltro+=(filtroterminadas)?' Terminadas':'';
        $('#task-filtros').html(titulo+contadorTareas+titulofiltro);
        
        const btnacciones=document.querySelectorAll('#btnAcciones');
        btnacciones.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                divactionid=e.target.dataset.id;
                //$('.action[data-id='+divactionid+']').html("hola");
                $('.action[data-id='+divactionid+']').attr('hidden',$('.action[data-id='+divactionid+']').attr('hidden')==='hidden'?false:true );
                console.log();
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
    //const querySnapshot=await getTask();
    onGetTask1();
})


document.getElementById('home').addEventListener('click',(e)=>{
    filtroterminadas=false;
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
    console.log(filtroimportante);
    onGetTask1();
})  

document.getElementById('md').addEventListener('click',(e)=>{
    filtrohoy=!filtrohoy;
    console.log(fechafiltro);
    onGetTask1();
})  

document.getElementById('favoritoMain').addEventListener('click',()=>{
        if(importante=="#000"){
          importante="#FFD523";
        
        }else{
          importante="#000";
        }
        document.getElementById('favoritoMain').style.color=importante;
    
})


taskForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const title=taskForm['task-title'];
    const description=taskForm['task-description'];
    const fecha=taskForm['task-date'];
    //peticion asincrona, termina de guardar y devuelve una respuesta
    //usemos async await para esperar la respuesta
    //hasta qeu no termina no continua con lo de abajo (async)
    if(!editStatus){
        await saveTask(fecha.value,title.value,description.value,importante,terminada);
    }else{
        await updateTask(id,{
            fecha:fecha.value,
            title:title.value,
            description:description.value,
            importante:importante
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

    
})

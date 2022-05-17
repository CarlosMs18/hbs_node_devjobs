import axios from 'axios'
import Swal from 'sweetalert2'
const skills = document.querySelector('.lista-conocimientos')
const panelAdmin = document.querySelector('.panel-administracion')
const alertas = document.querySelector('.alertas');

document.addEventListener('DOMContentLoaded', e => {
        if(alertas){
            limpiarAlertas()
        }
})

const skillsSet = new Set()
if(skills){
    skills.addEventListener('click',e =>{
        if(e.target.tagName === 'LI'){
            if(e.target.classList.contains('activo')){
                skillsSet.delete(e.target.textContent)
                e.target.classList.remove('activo')
            }else{
                skillsSet.add(e.target.textContent)
                e.target.classList.add('activo')
            }

        }
        
        const skillArray = [...skillsSet]
        document.getElementById('skills').value = skillArray
    })

}

if(panelAdmin){
    panelAdmin.addEventListener('click', e =>{
    
        if(e.target.classList.contains('btn-rojo')){
            const idVacante = e.target.getAttribute('data-eliminar')
            e.preventDefault()
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {   
                  console.log(result)
                if (result.isConfirmed) {
                
                    console.log('ok')
                    const url = `${location.origin}/delete-vacante/${idVacante}`
                    axios.delete(url,{params : {url}})
                        .then(result => {
                            if(result.status === 200){
                                Swal.fire(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                  )

                                  e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                            }
                            

                                
                        })
                        .catch(() => {
                            Swal.fire({
                                type:'error',
                                title: 'Hubo un error',
                                text: 'No Se pudo eliminar'
                            })
                        })
                 
                }
              })
        }
    })
}

const limpiarAlertas= () => {
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if(alertas.children.length > 0 ) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0 ) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
}
export default skills
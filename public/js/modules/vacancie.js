
const skills = document.querySelector('.lista-conocimientos')



const skillsSet = new Set()
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

export default skills
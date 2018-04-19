let btn = document.querySelector(".run")
btn.addEventListener('click', event => {
    let a = document.querySelector(".result")
    users = document.querySelectorAll('.user');
    for(let i = 0; i < users.length; i++){
        if(users[i].lastChild.checked){
            let sn = users[i].children[1].firstChild.lastChild.firstChild.lastChild.innerHTML
            a.value += `${sn}\n`;
        }
    }
})
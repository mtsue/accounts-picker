const target = document.querySelector('#users');

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type == 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                if (hasClass(node, 'users')) {
                    let users = node.children;
                    for (let i = 0; i < users.length; i++) {
                        let checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'checkbox';
                        users[i].appendChild(checkbox);
                    }
                }
            })
        }
    });
});

const config = {
    childList: true,
    subtree: true,
};

observer.observe(target, config);

const runbtn = document.createElement('input');
runbtn.type = 'button';
runbtn.value = 'RUN';
const mountpoint = document.querySelector('.content.search');
mountpoint.insertBefore(runbtn, mountpoint.firstChild)

runbtn.addEventListener('click', event => {
    users = document.querySelectorAll('.user');
    for(let i = 0; i < users.length; i++){
        if(users[i].lastChild.checked){
            let sn = users[i].children[1].firstChild.lastChild.firstChild.lastChild.innerHTML
            console.log(sn)
        }
    }
})

function hasClass(ele, cls) {
    try {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    } catch (e) {
        console.log(ele);
    }
}
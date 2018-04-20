window.addEventListener('load', event => {
    let c = document.createElement('p');
    c.className = 'count';
    c.innerHTML = 0;
    c.style.position = 'fixed';
    c.style.zIndex = 10;
    document.querySelector('body').insertBefore(c, document.querySelector('body').firstChild)
    
    let users = document.querySelectorAll('.user');
    for (let i = 0; i < users.length; i++) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        users[i].appendChild(checkbox)
    }
});

const observer = new MutationObserver(mutations => {
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

let count = 0;
document.addEventListener('click', event => {
    let t = event.target;
    if(hasClass(t, 'checkbox')){
        if(t.checked){
            count++
        }else{
            count--
        }
    }
    document.querySelector('.count').innerHTML = count;
});

const target = document.querySelector('#users');
observer.observe(target, { childList: true, subtree: true });

function hasClass(ele, cls) {
    try {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    } catch (e) {
        console.log(ele);
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command && msg.command === 'show_accounts') {
        accounts = []
        users = document.querySelectorAll('.user');
        for (let i = 0; i < users.length; i++) {
            if (users[i].lastChild.checked) {
                let sn = users[i].children[1].firstChild.lastChild.firstChild.lastChild.innerHTML
                accounts.push(sn)
            }
        }
        sendResponse(accounts);
    }
});

window.addEventListener('load', event => {
    let users = document.querySelectorAll('.user');
    for (let i = 0; i < users.length; i++) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox-onload';
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

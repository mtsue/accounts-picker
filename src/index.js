import axios from 'axios';
import cheerio from 'cheerio';
import 'babel-polyfill';

window.addEventListener('load', event => {
    createCounter();

    let users = document.querySelectorAll('.user');
    for (let i = 0; i < users.length; i++) {
        if(users[i].querySelector('div.main div.head div.menu span.badge img[title="非公開ユーザーです"]')){
            users[i].style.display = 'none';
        }

        const screenName = getScreenName(users[i]);

        createToUserPage(users[i], screenName);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.style.width = '50px';
        checkbox.style.height = '50px';
        users[i].appendChild(checkbox);

        (async function () {
            let sc = await getStatuesCount(screenName);
            if(Number(sc.split('回')[0]) < 1000){
            users[i].style.display = 'none';
            }
            let scEle = document.createElement('div');
            scEle.className = 'status-count';
            scEle.innerHTML = sc;
            users[i].insertBefore(scEle, checkbox);
        })();
    }
});

const observer = new MutationObserver(mutations => {
    mutations.forEach(async (mutation) => {
        if (mutation.type == 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                if (hasClass(node, 'users')) {
                    let users = node.children;
                    for (let i = 0; i < users.length; i++) {
                        if(users[i].querySelector('div.main div.head div.menu span.badge img[title="非公開ユーザーです"]')){
                            users[i].style.display = 'none';
                        }

                        const screenName = getScreenName(users[i]);

                        createToUserPage(users[i], screenName);

                        let checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'checkbox';
                        checkbox.style.width = '50px';
                        checkbox.style.height = '50px';                
                        users[i].appendChild(checkbox);

                        (async function () {
                            let sc = await getStatuesCount(screenName);
                            if(Number(sc.split('回')[0]) < 1000){
                                users[i].style.display = 'none';
                            }
                            let scEle = document.createElement('div');
                            scEle.className = 'status-count';
                            scEle.innerHTML = sc;
                            users[i].insertBefore(scEle, checkbox);
                        })();
                    }
                }
            })
        }
    });
});

let count = 0;
document.addEventListener('click', event => {
    let t = event.target;
    if (hasClass(t, 'checkbox')) {
        if (t.checked) {
            count++
        } else {
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
        const accounts = []
        const users = document.querySelectorAll('.user');
        for (let i = 0; i < users.length; i++) {
            if (users[i].lastChild.checked) {
                let sn = getScreenName(users[i]);
                accounts.push(sn)
            }
        }
        sendResponse(accounts);
    }
});

function getScreenName(userDOM) {
    let sn = userDOM.children[1].firstChild.lastChild.firstChild.lastChild.innerHTML;
    sn = sn.trim().replace('@', '');
    return sn;
}

function getStatuesCount(screenName) {
    return new Promise(resolve => {
        axios.get(`https://twpro.jp/${screenName}`)
            .then(res => {
                const body = res.data;
                const $ = cheerio.load(body);
                const count = $('div.content div.user-profile div.user-navi div.user-values.r2 div.value-item.i3 span.v').text();
                resolve(count);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

function getUserPage(screenName) {
    return `https://twitter.com/${screenName}`;
}

function createCounter(){
    let counter = document.createElement('p');
    counter.className = 'count';
    counter.innerHTML = 0;
    counter.style.position = 'fixed';
    counter.style.zIndex = 10;
    document.querySelector('body').insertBefore(counter, document.querySelector('body').firstChild)
}

function createToUserPage(user, screenName = ''){
    let toUserPage = document.createElement('a');
    toUserPage.className = 'to-user-page';
    toUserPage.innerHTML = getUserPage(screenName);
    toUserPage.setAttribute('target', '_blank');
    toUserPage.setAttribute('href', getUserPage(screenName));
    user.appendChild(toUserPage);
}

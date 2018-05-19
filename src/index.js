import axios from 'axios';
import cheerio from 'cheerio';
import 'babel-polyfill';

window.addEventListener('load', event => {
    let counter = document.createElement('p');
    counter.className = 'count';
    counter.innerHTML = 0;
    counter.style.position = 'fixed';
    counter.style.zIndex = 10;
    document.querySelector('body').insertBefore(counter, document.querySelector('body').firstChild)

    let users = document.querySelectorAll('.user');
    for (let i = 0; i < users.length; i++) {
        const screenName = getScreenName(users[i]);

        let toUserPage = document.createElement('a');
        toUserPage.className = 'to-user-page';
        toUserPage.innerHTML = getUserPage(screenName);
        toUserPage.setAttribute('target', '_blank');
        toUserPage.setAttribute('href', getUserPage(screenName));
        users[i].appendChild(toUserPage);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        users[i].appendChild(checkbox);

        (async function () {
            let sc = await getStatuesCount(screenName);
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
                        const screenName = getScreenName(users[i]);

                        let toUserPage = document.createElement('a');
                        toUserPage.className = 'to-user-page';
                        toUserPage.innerHTML = getUserPage(screenName);
                        toUserPage.setAttribute('target', '_blank');
                        toUserPage.setAttribute('href', getUserPage(screenName));
                        users[i].appendChild(toUserPage);

                        let checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'checkbox';
                        users[i].appendChild(checkbox);

                        (async function () {
                            let sc = await getStatuesCount(screenName);
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
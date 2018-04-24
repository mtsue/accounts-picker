document.querySelector(".run").addEventListener('click', event => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: 'show_accounts',
        }, function (msg) {
            let resultField = document.querySelector('.result');
            resultField.value = '';
            for (let i = 0; i < msg.length; i++) {
                resultField.value += (msg[i].trim() + '\n').split('@')[1];
            }
        });
    });
})

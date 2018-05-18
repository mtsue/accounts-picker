import axios from 'axios';

axios.get('https://twpro.jp').then(res => {
    console.log(res.data);
}).catch(err => {
    console.log(err);
})
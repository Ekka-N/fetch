function getusername(url) {
    let username = url.split('=')[1];
    if (username === undefined) {
        username = 'Ekka-N';
    } 
    return username;
}

const url = window.location.toString();
const username = getusername(url);

const getDate = new Promise((resolve, reject) => {
    let date = new Date();
    if (date) {
        setTimeout(() => {
            resolve(date); 
        }, 2000)
    } else {
        reject('Нет данных о времени')
    }
})

const getRequest = fetch(`https://api.github.com/users/${username}`);

Promise.all([getDate, getRequest])
    .then(([date, request])=> {
        let divDate = document.getElementById('date');
        divDate.innerHTML = ` ${date}`;
        let res = request.json();
        return res;
    })
    .then(json => {
        console.log(json);
        if (json.login) {
            let name;
            if (json.name == null) {
                name = json.login;
            } else {
            name = json.name;
            }
            const nameTag = document.createElement('h1');
            nameTag.classList.add('username');
            let link = document.createElement('a');
            link.href = `https://github.com/${username}`;
            link.innerHTML = `${name}`;
            document.body.appendChild(nameTag);
            nameTag.appendChild(link);

            const desc = document.createElement('p');  
            desc.classList.add('description');
            if (json.bio) {
                desc.innerHTML = `${json.bio}`;
            } else {
                desc.innerHTML = `Описание профиля отсутствует`;
            }
            document.body.appendChild(desc);

            if (json.avatar_url) {
                const avatar = document.createElement('img');
                avatar.src = json.avatar_url;                
                avatar.alt = `username's photo`;
                document.body.appendChild(avatar);
            }
        } else {
            document.body.innerHTML = '<h1>Информация о пользователе не доступна</h1>'
        }

    })
    .then(() => {
        let preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
    }
    )
    .catch(() => document.body.innerHTML = '<h1>Ошибка</h1>');


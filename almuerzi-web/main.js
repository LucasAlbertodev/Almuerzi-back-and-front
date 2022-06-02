let mealsState = [];
let user = {};
let ruta = 'login'; //login, register, orders

const stringToHTML = (s) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(s, 'text/html')
    return doc.body.firstChild
}

const renderItem = (item) => {
    const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`)
    //adding and removing selected
    element.addEventListener('click', () => {
        const mealsList = document.getElementById('meals-list');
        Array.from(mealsList.children).forEach(x => x.classList.remove('selected'))
        element.classList.add('selected')
        const mealsIdInput = document.getElementById('meals-id')
        mealsIdInput.value = item._id
    })
    return element
}
//bringing structure orders and insert to html
const renderOrder = (order, meals) => {
    const meal = meals.find(meal => meal._id === order.meal_id)
    const element = stringToHTML(`<li data-id="${order._id}">${meal.name} - Cliente ${user.email} - UserID:${order.user_id}</li>`)
    return element
}

const initializeForm = () => {
    const token = localStorage.getItem('token');
    const orderForm = document.getElementById('order')
    //waiting for select meals to generate order
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const mealId = document.getElementById('meals-id')
        const mealIdValue = mealId.value;
        const submit = document.getElementById('submit')
        submit.setAttribute('disabled', true)
        if (!mealIdValue) {
            alert('Debe seleccionar la comida')
            submit.removeAttribute('disabled')
            return
        }

        const order = {
            meal_id: mealIdValue,
            user_id: user._id,
        }
        //getting json from db thru post method, idmeal and id user
        fetch('https://serverless-lucasalbertodev.vercel.app/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
            body: JSON.stringify(order),
        })
            .then(res => res.json())
            //getting json extract ids, and bring to html 
            .then(respuesta => {
                console.log(respuesta)
                const renderedOrder = renderOrder(respuesta, mealsState)
                const ordersList = document.getElementById('orders-list')
                ordersList.appendChild(renderedOrder)
                submit.removeAttribute('disabled')
            })
    }
}

const initializeData = () => {
     //getting json from db for render first app page
    fetch('https://serverless-lucasalbertodev.vercel.app/api/meals')
        .then(response => response.json())
        //getting json extract ids meals
        .then(data => {
            mealsState = data
            //save on ul from meals:id
            const mealsList = document.getElementById('meals-list')
            //save on submit
            const submit = document.getElementById('submit')
            const listItems = data.map(renderItem)
            mealsList.removeChild(mealsList.firstElementChild)
            listItems.forEach(element => mealsList.appendChild(element))
            submit.removeAttribute('disabled')
            //getting orders from db
            fetch('https://serverless-lucasalbertodev.vercel.app/api/orders')
                .then(response => response.json())
                 //getting json extract ids, and bring to html 
                .then(ordersData => {
                    const ordersList = document.getElementById('orders-list')
                    //bring and sort meals data(item._id, item.name) with ordersdata
                    const listOrders = ordersData.map(orderData => renderOrder(orderData, data))
                    ordersList.removeChild(ordersList.firstElementChild)
                    //to html
                    listOrders.forEach(element => ordersList.appendChild(element))
                    //checking orders from console json
                    console.table(ordersData)
                })
        })
}

const renderApp = () => {
    const token = localStorage.getItem('token');
    //token exists save also user
    if (token) {
        user = JSON.parse(localStorage.getItem('user'));
        return renderOrders();
    }
    renderLogin();
}

const renderOrders = () => {
    const ordersView = document.getElementById('orders-view');
    document.getElementById('app').innerHTML = ordersView.innerHTML;
    initializeForm();
    initializeData();
}

//first render screen is login
const renderLogin = () => {
    const loginTemplate = document.getElementById('login-template');
    document.getElementById('app').innerHTML = loginTemplate.innerHTML;

    const loginForm = document.getElementById('login-form');
    //wating for listening from user and then validate
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('https://serverless-lucasalbertodev.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(x => x.json())
            .then(res => {
                localStorage.setItem('token', res.token);
                ruta = 'orders';
                return res.token;
            })
            //order reference user
            .then(token => {
                return fetch('https://serverless-lucasalbertodev.vercel.app/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token,
                    },
                })
            })
            .then(x => x.json())
            .then(fetchedUser => {
                console.log(fetchedUser);
                localStorage.setItem('user', JSON.stringify(fetchedUser));
                user = fetchedUser;
                renderOrders();
            })
    }
}






window.onload = () => {
    renderApp();
}

"use strict";

localStorage.setItem("token", JSON.stringify({username: "otabek", password:"123456"}));
const url = "https://www.googleapis.com/books/v1/volumes?q=harry&startIndex=1";
const cardWrapper = $('#content-books');
const search_header = $('#search-header');
const showingbook = $('#showingbook');
const aside_ul = $('#aside-ul')


if(!localStorage.getItem("token")){
    window.location.href = "../../index.html";
}


let bookmark = JSON.parse(localStorage.getItem('bookmark')) || []; 
// ---------------------------------------------------------------- Functional ------------------------------
async function GetData(url){
    const response = await fetch(url);
    const data = await response.json();
    renderData(data);
}

function renderData(data){
    console.log(data.items[0]);
    cardWrapper.innerHTML = '';
    data.items.forEach(e => {
        if(data.items.length){
            showingbook.innerHTML = `Showing ${data.items.length} Result(s)`
        }else{
            showingbook.innerHTML = `Showing 0 Result(s)`
        }
        let str = '';
        if(e.volumeInfo.title.length > 12){
            str = e.volumeInfo.title.slice(0, 12) + '...';
        }else{
            str = e.volumeInfo.title
        }
        const card = createElement('div', "card", `
            <img src="${e.volumeInfo.imageLinks.thumbnail}" alt="">
            <p>${str}</p>
            <p>${e.volumeInfo.authors}</p>
            <p>${e.volumeInfo.publishedDate}</p>
            <div>
                <button data-info=${e.id} id="bookmark">BookMark</button>
                <button>More Info</button>
            </div>
            <button>Read</button>
        `)
        cardWrapper.append(card);
    });
}

function getSearchBook(value){
    let url = `https://www.googleapis.com/books/v1/volumes?q=${value}&startIndex=0&maxResults=20`
    GetData(url);
}

async function getAsideUldata(value){
    for(let i=0; i<value.length; i++){
        let url = `https://www.googleapis.com/books/v1/volumes?q=${value[i]}&startIndex=0&maxResults=20`
        const response = await fetch(url);
        const data = await response.json();
    
    data.items.forEach(e => {

        let str = '';
        if(e.volumeInfo.title.length > 12){
            str = e.volumeInfo.title.slice(0, 12) + '...';
        }else{
            str = e.volumeInfo.title    
        }

        aside_ul.innerHTML += `
            <li>
                <div>
                    <p>${str}</p>
                    <p>${e.volumeInfo.authors}</p>
                </div>
                <div>
                    <i class='bx bx-book-reader' ></i>
                    <i class='bx bx-message-alt-x' ></i>
                </div>
            </li>
        `;
    })
    }
}





// ---------------------------------------------------------------- Event Listeners ------------------------------
search_header.addEventListener('keyup', (e) =>{
    if(e.key === 'Enter'){
        getSearchBook(e.target.value);
    }
});


cardWrapper.addEventListener("click", (e) =>{
    if(e.target.id === 'bookmark'){
        if(!bookmark.includes(e.target.dataset.info)){
            bookmark.push(e.target.dataset.info);
            localStorage.setItem('bookmark', JSON.stringify(bookmark));
        }
        aside_ul.innerHTML = '';
        getAsideUldata(bookmark);
    }
})





// -------------------------------------------------- Call functions ------------------------------------------------
GetData(url);
getAsideUldata(bookmark);



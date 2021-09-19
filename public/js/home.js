const main = document.querySelector(".main");
const aLanzamiento = document.getElementById("aLanzamiento");
const combo = document.querySelector(".combo");
const clasificacionP = document.getElementById("clasificacionP");



fetch(
  genres_list_http +
    new URLSearchParams({
      api_key: api_key,
      language: 'es-ES',
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.genres.forEach((item) => {
     peligenero(item.id, item.name);
     chkPorGenero(item.name,item.id);
     
    });
  });


  (()=>{
    let i = 1950;
    let today = new Date();
    let year = today.getFullYear();
  while(i <= year){
      aLanzamiento.innerHTML += `<option value="${i}">${i}</option> `
      i++
    }
  })();
  
  (()=>{
   
  
    fetch(
      movie_certification +
      new URLSearchParams({
        api_key: api_key,
      })
    ).then((res) => res.json())
    .then((data) => {
      const f =data.certifications.US;
      f.forEach(i => {
        clasificacionP.innerHTML += `<option value="${i.certification}">${i.certification}</option>`
      })
      
    })
  })()
  
  const chkPorGenero = (genero, id) =>
  {
 combo.innerHTML +=`<input class="check" type="checkbox" id="${id}" name="${genero}" value="CasillaGenero"  onchange="doalert(this)" checked="true">${genero}`;
  };
  const doalert=(checkboxElem) =>{
 
  if (checkboxElem.checked) {
      peligenero(checkboxElem.id, checkboxElem.name, aLanzamiento.value, clasificacionP.value);
    } else {
      borrarPeliculas(checkboxElem.name);
    }
  }
  const borrarPeliculas = (name)=>{

    const peli = document.getElementById(`${name}_movies_div`);
    console.log(`${name}_movies_div`);
  if (!peli){
    alert("El elemento selecionado no existe");
  } else {
    padre = peli.parentNode;
    padre.removeChild(peli);
  }


  }
const peligenero = (id, genres, aLanzamiento = 0, cert = '') => {
  if(cert === "Seleccione la clasificacion"){
    cert = ''
  }
  fetch(
    movie_genres_http +
      new URLSearchParams({
        api_key: api_key,
        primary_release_year: aLanzamiento,
        with_genres: id,
        certification_country: "US",
        certification: cert,
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
        language: 'es-ES',
      })
  )
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      construirElementoCategoria(`${genres}_movies`, data.results);
    })
    .catch((err) => console.log(err));
};

/* crea el titulo de categoria */
const construirElementoCategoria = (category, data) => {
  main.innerHTML += `
    <div class="movie-list" id="${category}_div">
        <button class="pre-btn"> <img src="img/pre.png" alt=""></button>
          
          <h1 class="movie-category">${category.split("_").join(" ")}</h1>

          <div class="movie-container" id="${category}">
          </div>

        <button class="nxt-btn"> <img src="img/nxt.png" alt=""> </button>
    </div>
    `;
  construirTarjetas(category, data);
};

const construirTarjetas = (id, data) => {
  const movieContainer = document.getElementById(id);
  data.forEach((item, i) => {
    if (item.backdrop_path == null) {
      item.backdrop_path = item.poster_path;
      if (item.backdrop_path == null) {
        return;
      }
    }

    movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
        `;

    if (i == data.length - 1) {
      setTimeout(() => {
        setupScrolling();
      }, 100);
    }
  });
};


const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonOverlay = document.getElementById("contentOver");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return (
    `
        <li class="pokemon ${pokemon.type}" onclick="openMoreInfo('` +
    pokemon.name +
    `')">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
  );
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

const overlay = document.getElementById("overlay");
async function openMoreInfo(pokename) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokename}`;

  overlay.classList.add("active");
  const response = await fetch(url);
  const jsonBody = await response.json();
  const det = await fetch(jsonBody.species.url);
  const jsonBody2 = await det.json();
  let detalhes = "";
  jsonBody2.flavor_text_entries.forEach((element) => {
    if (element.language.name == "en") {
      detalhes = element.flavor_text;
    }
  });
  const types = jsonBody.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  let ob = {
    name: jsonBody.name,
    type: type,
    photo: jsonBody.sprites.other.dream_world.front_default,
    types: types,
    details: detalhes,
  };
  pokemonOverlay.innerHTML = populateOverlay(ob);
  return jsonBody.id;
}

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.classList.remove("active");
  }
});

function populateOverlay(pokemon) {
  return `<div id="TitleName">
    <p>${pokemon.name}</p>
  </div>

  <div class="overlay-d ${pokemon.type}">
  <img src="${pokemon.photo}"
  alt="${pokemon.name} ">
    
  </div>

        <li class="pokemon ${pokemon.type}">
            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>
            </div>
        </li>
        <p>${pokemon.details}</p>
    `;
}

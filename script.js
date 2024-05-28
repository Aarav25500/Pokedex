const pokeImage = document.querySelector('.poke_image');
const pokemonName = document.querySelector('.pokemon_name');
const pokeNumber = document.querySelector('.pokemon_number');
const form = document.querySelector('.form');
const inputSearch = document.querySelector('.input_search');
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');
const menuDots = document.querySelector('.menu-dots');
const menuOptions = document.querySelector('.menu-options');
const showFavoritesBtn = document.getElementById('show-favorites');
const favoriteHeart = document.querySelector('.favorite-heart');
let pokeId = 1;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Toggle menu visibility
menuDots.addEventListener('click', () => {
    menuOptions.classList.toggle('hidden');
});

// Show favorites
showFavoritesBtn.addEventListener('click', () => {
    const favoritePokemons = favorites.map(id => fetchPoke(id));
    Promise.all(favoritePokemons).then(pokemons => {
        // Display favorite pokemons
        console.log(pokemons);
    });
});

const getSpriteUrl = (data) => {
    if (data.id <= 650) {
        return data.sprites.versions["generation-v"]["black-white"].animated.front_default;
    } else {
        return data.sprites.front_default;
    }
};

const fetchPoke = async (pokeName) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
        if (!APIResponse.ok) throw new Error(`HTTP error! status: ${APIResponse.status}`);
        const data = await APIResponse.json();
        const spriteUrl = getSpriteUrl(data);
        pokeImage.setAttribute('src', spriteUrl);
        pokemonName.textContent = data.name;
        pokeNumber.textContent = `#${data.id.toString().padStart(3, '0')}`;

        // Update favorite heart status
        favoriteHeart.classList.toggle('active', favorites.includes(data.id));
        pokeId = data.id;
    } catch (error) {
        console.error(error);
    }
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fetchPoke(inputSearch.value.toLowerCase());
});

const incrementId = async () => {
    if (pokeId < 898) {
        pokeId++;
        await fetchPoke(pokeId);
    }
};

const decrementId = async () => {
    if (pokeId > 1) {
        pokeId--;
        await fetchPoke(pokeId);
    }
};

favoriteHeart.addEventListener('click', () => {
    if (favorites.includes(pokeId)) {
        favorites = favorites.filter(id => id !== pokeId);
    } else {
        favorites.push(pokeId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favoriteHeart.classList.toggle('active');
});

// Fetch initial Pokémon
fetchPoke(pokeId);

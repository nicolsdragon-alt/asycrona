const form = document.getElementById('formPoke');
const input = document.getElementById('idPoke');
const msg = document.getElementById('msg');

const nomeEl = document.getElementById('nomePokemon');
const imgEl = document.getElementById('imgPoke');
const baseEl = document.getElementById('basePoke');
const tiposEl = document.getElementById('tiposPoke');
const vantagensEl = document.getElementById('vantagensPoke');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = input.value.trim();

    // Limpa resultados anteriores e mostra status
    msg.textContent = 'Buscando na Pokédex...';
    nomeEl.textContent = '';
    imgEl.src = '';
    tiposEl.innerHTML = '';
    vantagensEl.textContent = '';
    baseEl.textContent = '';

    try {
        // 1. Busca os dados do Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Pokémon não encontrado!');
        const data = await response.json();

        msg.textContent = '';
        nomeEl.textContent = `#${data.id} - ${data.name}`;
        imgEl.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
        baseEl.textContent = `XP Base: ${data.base_experience}`;

        // 2. Exibe os tipos do Pokémon como etiquetas (badges)
        const tipos = data.types.map(t => t.type.name);
        tiposEl.innerHTML = tipos
            .map(tipo => `<span class="badge-tipo ${tipo}">${tipo}</span>`)
            .join('');

        // 3. Busca as vantagens de cada tipo na API
        const vantagensSet = new Set(); // Set evita tipos duplicados

        for (const item of data.types) {
            const typeRes = await fetch(item.type.url);
            const typeData = await typeRes.json();
            
            // Pega os tipos contra os quais causa 2x de dano
            typeData.damage_relations.double_damage_to.forEach(alvo => {
                vantagensSet.add(alvo.name);
            });
        }

        const listaVantagens = Array.from(vantagensSet);

        if (listaVantagens.length > 0) {
            vantagensEl.innerHTML = `<strong>Forte contra:</strong> ${listaVantagens.join(', ')}`;
        } else {
            vantagensEl.innerHTML = `<strong>Forte contra:</strong> Nenhum tipo específico`;
        }

    } catch (error) {
        msg.textContent = error.message;
    }
});
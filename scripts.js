//Flag para sinalizar erros nas operações de adicionar um jogo à coleção
let addGameError = '';

/*
  ---------------------------------------------------------------------------------------------
  Função para obter lista da coleção de jogos armazenada no banco de dados via requisição GET
  ---------------------------------------------------------------------------------------------
*/

const getCollection = async () => {
  let url = 'http://127.0.0.1:5000/game_collection';
  return fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      let emptyCollection = document.getElementById('game-collection-empty');
      let loadingCollection = document.getElementById('loading-collection');

      if (data.game_collection.length === 0) {
        emptyCollection.classList.remove('visually-hidden');
      } else {
        emptyCollection.classList.add('visually-hidden');
        data.game_collection.forEach(item => insertCard(item));
      }

      loadingCollection.classList.add('visually-hidden');
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

/*
  -----------------------------------------------------------------------------------------------------
  Função para obter lista de plataformas disponíveis armazenadas no banco de dados via requisição GET
  -----------------------------------------------------------------------------------------------------
*/

const getPlatforms = async () => {
  let url = 'http://127.0.0.1:5000/platforms';
  return fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      let select = document.getElementById('platform-input');
      
      data.platforms.forEach(item => {
        let option = document.createElement('option');
        option.value = item.name;
        option.text = item.name;
        select.appendChild(option);
      })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

/*
  --------------------------------------------------------------------------------------
  Função para obter lista de status disponíveis de um jogo via requisição GET
  --------------------------------------------------------------------------------------
*/

const getGameStatus = async () => {
  let url = 'http://127.0.0.1:5000/game_status_list';
  return fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      let select = document.getElementById('status-input');
      let modalSelect = document.getElementById('modal-status-input');
      
      data.game_status_list.forEach(item => {
        let option = document.createElement('option');
        option.value = item.status;
        option.text = item.status;

        let modalOption = document.createElement('option');
        modalOption.value = item.status;
        modalOption.text = item.status;

        select.appendChild(option);
        modalSelect.appendChild(modalOption);
      })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

/*
  -----------------------------------------------------------------------------------------------------------------------------
  Função para realizar a busca de um jogo pelo seu nome para completar informações na sua adição à coleção via requisição GET
  -----------------------------------------------------------------------------------------------------------------------------
*/

const searchGame = async (searchQuery) => {
  let url = 'http://127.0.0.1:5000/games_list?query=' + searchQuery;
  return fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length === 0) {

        let noResultsText = document.getElementById('no-results-container');
        noResultsText.classList.remove('visually-hidden');

      } else {
        data.results.forEach((item) => insertSearchItem(item));
      }

      document.getElementById('search-btn').disabled = false;

      let spinner = document.getElementById('spinner');
      let loadingText = document.getElementById('text-loading');
      spinner.classList.add('visually-hidden');
      loadingText.classList.add('visually-hidden');
    })
    .catch((error) => {
      document.getElementById('search-btn').disabled = false;

      let spinner = document.getElementById('spinner');
      let loadingText = document.getElementById('text-loading');
      let searchErrorText = document.getElementById('search-error-container');

      spinner.classList.add('visually-hidden');
      loadingText.classList.add('visually-hidden');
      searchErrorText.classList.remove('visually-hidden');

      console.error('Error:', error)
    })
}

/*
  -------------------------------------------------------------------------------------------
  Função para adicionar um jogo à coleção armazenada no banco de dados via requisição POST
  -------------------------------------------------------------------------------------------
*/

const addGame = async (data) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('release_date', data.release_date);
  formData.append('purchase_date', data.purchase_date);
  formData.append('is_favorite', data.is_favorite);
  formData.append('status', data.status);
  formData.append('cover_art', data.cover_art);
  formData.append('platform', data.platform);

  let url = 'http://127.0.0.1:5000/game';
  return fetch(url, {
    method: 'post',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        let err = new Error('HTTP status code: ' + response.status);
        err.response = response;
        err.status = response.status;

        if (err.status === 409) {
          addGameError = 'O jogo já existe na coleção';
        }

        if (err.status === 400) {
          addGameError = 'Ocorreu um erro e o jogo não foi adicionado';
        }
        throw err
      } else {
        return response.json()
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

/*
  -------------------------------------------------------------------------------------------
  Função para remover um jogo da coleção armazenada no banco de dados via requisição DELETE
  -------------------------------------------------------------------------------------------
*/

const deleteGame = async (id) => {
  let url = 'http://127.0.0.1:5000/game?id='+ id;
  return fetch(url, {
    method: 'delete',
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error)
    })
}

/*
  --------------------------------------------------------------------------------------
  Função que adiciona um cartão com as informações de um jogo na aba de Minha Coleção
  --------------------------------------------------------------------------------------
*/

const insertCard = (data) => {
  let gameCollectionTab = document.getElementById('nav-game-collection');
  let card = document.createElement('div');
  let imgContainer = document.createElement('div');
  let img = document.createElement('img');
  let favoriteIcon = document.createElement('i');
  let deleteBtnIcon = document.createElement('i');
  let btnContainer = document.createElement('div');
  let cardBody = document.createElement('div');
  let cardTitle = document.createElement('h5');
  let textReleaseDate = document.createElement('p');
  let textPurchaseDate = document.createElement('p');
  let textPlatform = document.createElement('p');
  let textStatus = document.createElement('p');
  let deleteButton = document.createElement('button');
  let cardInfoContainer1 = document.createElement('div');
  let cardInfoContainer2 = document.createElement('div');

  card.appendChild(imgContainer);
  card.appendChild(cardBody);
  imgContainer.appendChild(img);
  cardBody.appendChild(cardInfoContainer1);
  cardBody.appendChild(cardInfoContainer2);
  cardInfoContainer1.appendChild(cardTitle);
  cardInfoContainer1.appendChild(textPlatform);
  cardInfoContainer1.appendChild(textReleaseDate);
  cardInfoContainer1.appendChild(textPurchaseDate);
  cardInfoContainer1.appendChild(textStatus);
  cardInfoContainer2.appendChild(favoriteIcon);
  cardInfoContainer2.appendChild(btnContainer);
  btnContainer.appendChild(deleteButton);
  deleteButton.appendChild(deleteBtnIcon);

  card.className = 'card d-flex flex-row';
  cardBody.className = 'card-body d-flex flex-row';
  cardTitle.className = 'card-title';
  cardInfoContainer1.className = 'card-info-left';
  cardInfoContainer2.className = 'card-info-right';
  imgContainer.className = 'img-container';
  img.className = 'img-card';
  deleteButton.className = 'btn btn-card';
  favoriteIcon.className = data.is_favorite ? 'bi bi-suit-heart-fill' : 'bi bi-suit-heart';
  btnContainer.className = 'delete-btn';

  card.id = data.id;
  img.src = data.cover_art ? 'data:image/jpeg;base64,'+ data.cover_art : 'img/no_image_available.jpg';
  favoriteIcon.style["fontSize"] = "20px";
  favoriteIcon.style["color"] = "white";
  textReleaseDate.textContent = 'Data de lançamento: ' + (data.release_date ? data.release_date : '-');
  textPurchaseDate.textContent = 'Data de compra: ' + (data.purchase_date ? data.purchase_date : '-');
  textPlatform.textContent = data.platform;
  textStatus.textContent = 'Status: '+data.status;
  cardTitle.textContent = data.title;
  deleteBtnIcon.className = 'bi bi-trash';
  deleteBtnIcon.style["fontSize"] = "16px";
  deleteBtnIcon.style["color"] = "white";

  deleteButton.onclick = function() {
    let div = document.querySelectorAll('.card');

    if (confirm('Tem certeza que deseja excluir este jogo da coleção?')) {
      let loadingCollection = document.getElementById('loading-collection');
      loadingCollection.classList.remove('visually-hidden');
      div.forEach(e => e.remove());

      deleteGame(data.id).then(() => {
        alert('Jogo removido com sucesso!');
        getCollection();
      });
    }
  }

  gameCollectionTab.appendChild(card);
}

/*
  -------------------------------------------------------------------------------------------------------------------------------------------
  Função para adicionar um novo jogo com as informações básicas (plataforma, status, datas, etc) vindas do formulário de criar um novo jogo
  -------------------------------------------------------------------------------------------------------------------------------------------
*/

const insertNewGame = async () => {
  let img
  if (document.getElementById('cover-art-input').files[0]) {
    let promise = getBase64(document.getElementById('cover-art-input').files[0]);
    img = await promise;
  } else {
    img = '';
  }

  let data = {
    'title': document.getElementById('title-input').value,
    'platform': document.getElementById('platform-input').value,
    'release_date': document.getElementById('release-date-input').value,
    'purchase_date': document.getElementById('purchase-date-input').value,
    'is_favorite': document.getElementById('is-favorite-input').checked,
    'status': document.getElementById('status-input').value,
    'cover_art': img,
  }

  if (!data.title) {
    addGameError = 'É obrigatório preencher o nome do jogo';
  } else if (!data.platform) {
    addGameError = 'É obrigatório selecionar uma plataforma';
  } else {
      await addGame(data)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função que adiciona um jogo na lista de resultados de busca na aba Adicionar um jogo
  --------------------------------------------------------------------------------------
*/

const insertSearchItem = async (data) => {
  let searchDiv = document.getElementById('search-list');
  let btnItem = document.createElement('button');
  let img = document.createElement('img');
  let imgContainer = document.createElement('div');
  let title = document.createElement('h5');
  let releaseDate = document.createElement('p');
  let platforms = document.createElement('p');
  let itemContainer = document.createElement('div');
  let itemInfoContainer = document.createElement('div');


  searchDiv.appendChild(btnItem);
  btnItem.appendChild(itemContainer);
  itemContainer.appendChild(imgContainer);
  itemContainer.appendChild(itemInfoContainer);
  imgContainer.appendChild(img);
  itemInfoContainer.appendChild(title);
  itemInfoContainer.appendChild(platforms);
  itemInfoContainer.appendChild(releaseDate);

  btnItem.className = 'list-group-item list-group-item-action';
  itemContainer.className = 'search-item-container';
  imgContainer.className = 'img-container';
  img.className = 'img-card';
  itemInfoContainer.className = 'item-info-container';

  img.src = 'data:image/jpeg;base64,'+ data.cover_art;
  title.textContent = data.name;
  releaseDate.textContent = 'Data de lançamento: ' + data.release_date;

  let gamePlatforms = []
  
  data.platforms.forEach((item) => {
    gamePlatforms.push(item.platform.name);

    if (platforms.textContent) {
      platforms.textContent = platforms.textContent + ', ' + item.platform.name;
    } else {
      platforms.textContent = item.platform.name;
    }
  })

  btnItem.onclick = function() {
    let select = document.getElementById('modal-platform-input');

    gamePlatforms.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.text = item;
      select.appendChild(option);
    })
    document.getElementById('modal-title-input').value = data.name;
    document.getElementById('modal-release-date-input').value = data.release_date;
    document.getElementById('modal-cover-art-input').value = data.cover_art;

    let modal = new bootstrap.Modal(document.querySelector('#modal-search-form'));
    modal.show();
  }
}

/*
  -----------------------------------------------------------------------------------------------------------------------------------------------
  Função que adiciona um jogo após coletar parcialmente informações vindas da busca e completando com dados do formulário do modal de Novo jogo
  -----------------------------------------------------------------------------------------------------------------------------------------------
*/

const newGameFromSearch = async () => {
  let data = {
    'title': document.getElementById('modal-title-input').value,
    'platform': document.getElementById('modal-platform-input').value,
    'release_date': document.getElementById('modal-release-date-input').value,
    'purchase_date': document.getElementById('modal-purchase-date-input').value,
    'is_favorite': document.getElementById('modal-is-favorite-input').checked,
    'status': document.getElementById('modal-status-input').value,
    'cover_art': document.getElementById('modal-cover-art-input').value,
  }

  if (data.platform === '') {
    addGameError = 'É obrigatório selecionar uma plataforma';
  } else {
    await addGame(data);
  }
}

/*
  ------------------------------------------------------------------------------------------------------
  Função para realizar uma busca de um jogo baseado no nome colocado na entrada na aba Adicionar Jogo
  ------------------------------------------------------------------------------------------------------
*/

const getSearchQuery = () => {
  let searchQuery = document.getElementById('search-input').value;

  if (searchQuery) {
    removeButtons(document.getElementById('search-list'));
    document.getElementById('search-btn').disabled = true;
  
    let spinner = document.getElementById('spinner');
    let loadingText = document.getElementById('text-loading');
  
    spinner.classList.remove('visually-hidden');
    loadingText.classList.remove('visually-hidden');
  
    let noResultsText = document.getElementById('no-results-container');
    noResultsText.classList.add('visually-hidden');
  
    let searchErrorText = document.getElementById('search-error-container');
    searchErrorText.classList.add('visually-hidden');
  
    searchGame(searchQuery);
  } else {
    alert('Digite o nome de um jogo no campo para realizar a busca');
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para converter arquivo de imagem para base64
  --------------------------------------------------------------------------------------
*/

const getBase64 = (file) => {
  return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result.split(',')[1]); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getCollection();
getPlatforms();
getGameStatus();

/*
  --------------------------------------------------------------------------------------
  Implementa monitoramento dos eventos de submissão de formulário
  --------------------------------------------------------------------------------------
*/

const submitEventListener = async (event, callbackFunction) => {
  await callbackFunction();
    if (addGameError) {
      alert(addGameError)
    } else {
      event.target.submit();

      let loadingCollection = document.getElementById('loading-collection');
      loadingCollection.classList.remove('visually-hidden');
      await getCollection();

      alert('Jogo adicionado com sucesso!');
    }

    addGameError = ''
}

const form = document.querySelector("#new-game-form");
const modalForm = document.querySelector("#modal-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitEventListener(event, insertNewGame);
})

modalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitEventListener(event, newGameFromSearch);
})

/*
  --------------------------------------------------------------------------------------
  Função para remover do HTML as opções de um select exceto a primeira opção
  --------------------------------------------------------------------------------------
*/

const removeOptions = (selectElement) => {
  let i, L = selectElement.options.length - 1;
  for(i = L; i > 0; i--) {
     selectElement.remove(i);
  }
}

const removeButtons = (divElement) => {
  while (divElement.firstChild) {
    divElement.firstChild.remove();
  }
}

/*
  -------------------------------------------------------------------------------------------------
  Implementa monitoramento do fechamento do modal para remoção das opções do select do formulário
  -------------------------------------------------------------------------------------------------
*/

let modal = document.querySelector('#modal-search-form');

modal.addEventListener("hide.bs.modal", function(e) {
  removeOptions(document.getElementById('modal-platform-input'));
})
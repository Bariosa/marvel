import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=e71e2718fabff072296a2d9a69c1759c";
  const _baseOffset = 210;

  // запити до API

  //запит на групу персонажів
  const getAllCharacters = async (offset = _baseOffset) => {
    const result = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`,
    ); // Request URL з сайту Marvel Developer

    //повертаємо масив з новими об'єктами
    return result.data.results.map(_transformCharacter);
  };

  //запит на одного персонажа
  const getCharacter = async (id) => {
    const result = await request(`${_apiBase}characters/${id}?&${_apiKey}`); // Request URL з сайту Marvel Developer
    return _transformCharacter(result.data.results[0]);
  };

  const getCharacterByName = async (name) => {
    const result = await request(
      `${_apiBase}characters?name=${name}&${_apiKey}`,
    ); // Request URL з сайту Marvel Developer
    return _transformCharacter(result.data.results[0]);
  };

  //метод отримує дані та трансформує в необхідні. в нашому випадку отримує великий об'єкт з даними про персонажа і повертає об'єкт з потрібними нам даними
  const _transformCharacter = (char) => {
    //перевірка для description
    const description = char.description
      ? char.description.length > 150
        ? char.description.slice(0, 149) + "..."
        : char.description
      : `There is no data about ${char.name}`;

    return {
      id: char.id,
      name: char.name,
      description: description,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  //запит на групу коміксів
  const getAllComics = async (offset = 0) => {
    const result = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`,
    );
    return result.data.results.map(_transformComics);
  };

  const getComics = async (id) => {
    const result = await request(`${_apiBase}comics/${id}?&${_apiKey}`); // Request URL з сайту Marvel Developer
    return _transformComics(result.data.results[0]);
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
      language: comics.textObjects[0]?.language || "en-us",
      price: comics.prices[0].price
        ? `${comics.prices[0].price}$`
        : "not available",
    };
  };

  return {
    loading,
    error,
    getCharacter,
    getCharacterByName,
    getAllCharacters,
    clearError,
    getComics,
    getAllComics,
  };
};

export default useMarvelService;

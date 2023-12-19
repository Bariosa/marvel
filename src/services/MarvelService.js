class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=e71e2718fabff072296a2d9a69c1759c";

  //функція getResource - запитує дані через fetch, чекає на відповідь у разі помилки(серверні, наприклад 404) видає повідомлення у консоль, якщо все ок, то отримуємо відповідь у форматі json
  getResource = async (url) => {
    let result = await fetch(url);

    if (!result.ok) {
      throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
  };

  // запити до API

  //запит на групу персонажів
  getAllCharacters = async () => {
    const result = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`,
    ); // Request URL з сайту Marvel Developer

    //повертаємо масив з новими об'єктами
    return result.data.results.map(this._transformCharacter);
  };

  //запит на одного персонажа
  getCharacter = async (id) => {
    const result = await this.getResource(
      `${this._apiBase}characters/${id}?&${this._apiKey}`,
    ); // Request URL з сайту Marvel Developer
    return this._transformCharacter(result.data.results[0]);
  };

  //метод отримує дані та трансформує в необхідні. в нашому випадку отримує великий об'єкт з даними про персонажа і повертає об'єкт з потрібними нам даними
  _transformCharacter = (char) => {
    //перевірка для description
    const description = char.description
      ? char.description.length > 150
        ? char.description.slice(0, 149) + "..."
        : char.description
      : "There is no data about this character";

    return {
      name: char.name,
      description: description,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  };
}

export default MarvelService;

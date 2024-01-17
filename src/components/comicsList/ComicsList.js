import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);
  const { loading, error, getAllComics } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true); // Запуск методу для отримання коміксів
  }, []);

  // Метод для отримання нових коміксів
  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true); // Додаємо прапорець завантаження нових елементів
    getAllComics(offset) // Виклик сервісу Marvel для отримання коміксів
      .then((newComics) => {
        let ended = false;
        if (newComics.length < 8) {
          ended = true;
        }
        setComicsList((comicsList) => [...comicsList, ...newComics]); // Додаємо нові комікси до поточного списку
        setNewItemLoading(false); // Вимикаємо прапорець
        setOffset((offset) => offset + 8); // Збільшуємо зсув для наступного запиту
        setComicsEnded(ended);
      })
      .catch(() => {
        // Обробка помилки при отриманні коміксів
        setComicsList([]); // Очищаємо список коміксів у випадку помилки
      });
  };

  if (error) return <ErrorMessage />; // Відображення повідомлення про помилку
  if (loading && !newItemLoading) return <Spinner />; // Відображення індикатора завантаження

  // Формування списку коміксів
  const renderComicsList = comicsList.map((comics, i) => (
    <li key={i} className="comics__item">
      <Link to={`/comics/${comics.id}`}>
        <img
          src={comics.thumbnail}
          alt={comics.title}
          className="comics__item-img"
        />

        <div className="comics__item-name">{comics.title}</div>
        <div className="comics__item-price">{comics.price}</div>
      </Link>
    </li>
  ));

  // Відображення списку коміксів та кнопки "Завантажити більше"
  return (
    <div className="comics__list">
      <ul className="comics__grid">{renderComicsList}</ul>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;

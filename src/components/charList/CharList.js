import { useState, useEffect, useRef } from "react";

import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

const CharList = ({ onCharSelected }) => {
  const [chars, setChars] = useState([]); // Список персонажів
  const [loading, setLoading] = useState(true); //  вказує на те, чи йде завантаження
  const [error, setError] = useState(false); // вказує на те, чи виникла помилка
  const [newItemLoading, setNewItemLoading] = useState(false); //  вказує на те, чи йде завантаження нових елементів
  const [offset, setOffset] = useState(210); // Початковий зсув для отримання нових персонажів
  const [charEnded, setCharEnded] = useState(false);

  const myRef = useRef();

  const marvelService = new MarvelService(); // Екземпляр сервісу Marvel для отримання даних

  useEffect(() => {
    onRequest(); // Запуск методу для отримання персонажів
  }, []);

  const onItemHandler = (id) => {
    onCharSelected(id);
    myRef.current = id;
  };

  // Метод для отримання нових персонажів
  const onRequest = () => {
    onCharListLoading(); // Виклик функції для відображення індикатора завантаження
    marvelService
      .getAllCharacters(offset) // Виклик сервісу Marvel для отримання персонажів
      .then((newChars) => {
        let ended = false;
        if (newChars.length < 9) {
          ended = true;
        }

        // Успішна обробка результатів

        setChars((chars) => [...chars, ...newChars]); // Додаємо нових персонажів до поточного списку
        setLoading(false); // Вимикаємо індикатор завантаження
        setNewItemLoading(false); // Вимикаємо прапорец
        setOffset((offset) => offset + 9); // Збільшуємо зсув для наступного запиту
        setError(false); // Вимикаємо прапорець помилки
        setCharEnded(ended);
      })
      .catch(() => {
        // Обробка помилки при отриманні персонажів
        setChars([]); // Очищаємо список персонажів у випадку помилки
        setLoading(false); // Вимикаємо індикатор завантаження
        setError(true); // Вмикаємо прапорець помилки
      });
  };

  // Функція для відображення індикатора завантаження нових елементів
  const onCharListLoading = () => {
    setNewItemLoading(true); // Додаємо прапорець завантаження нових елементів
  };

  // Відображення різних станів компонента в залежності від значень прапорців
  if (error) return <ErrorMessage />; // Відображення повідомлення про помилку
  if (loading) return <Spinner />; // Відображення індикатора завантаження

  // Формування списку персонажів для відображення
  const renderCharsList = chars.map((char) => (
    <li
      //new
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") onItemHandler(char.id);
      }}
      key={char.id}
      className={`char__item ${
        char.id === myRef.current ? "char__item--selected" : ""
      }`}
      onClick={() => onItemHandler(char.id)} // Передача ідентифікатора обраного персонажа до App.js
    >
      <img
        src={char.thumbnail}
        alt={char.name}
        className={
          char.thumbnail.includes("image_not_available")
            ? "char__item-img char__item-img--no-image"
            : "char__item-img"
        }
      />
      <div className="char__name">{char.name}</div>
    </li>
  ));

  // Відображення списку персонажів та кнопки "Завантажити більше"
  return (
    <div className="char__list">
      <ul className="char__grid">{renderCharsList}</ul>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)} // Виклик методу для отримання нових персонажів
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propType = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;

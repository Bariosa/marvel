import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";

import "./charList.scss";
import Skeleton from "../skeleton/Skeleton";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;

    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;

    case "confirmed":
      return <Component />;

    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const CharList = ({ onCharSelected }) => {
  const [chars, setChars] = useState([]); // Список персонажів
  const [newItemLoading, setNewItemLoading] = useState(false); //  вказує на те, чи йде завантаження нових елементів
  const [offset, setOffset] = useState(210); // Початковий зсув для отримання нових персонажів
  const [charEnded, setCharEnded] = useState(false);

  const myRef = useRef();

  const { getAllCharacters, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true); // Запуск методу для отримання персонажів
  }, []);

  const onItemHandler = (id) => {
    onCharSelected(id);
    myRef.current = id;
  };

  // Метод для отримання нових персонажів
  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true); // Додаємо прапорець завантаження нових елементів
    getAllCharacters(offset) // Виклик сервісу Marvel для отримання персонажів
      .then((newChars) => {
        let ended = false;
        if (newChars.length < 9) {
          ended = true;
        }

        // Успішна обробка результатів

        setChars((chars) => [...chars, ...newChars]); // Додаємо нових персонажів до поточного списку
        setNewItemLoading(false); // Вимикаємо прапорец
        setOffset((offset) => offset + 9); // Збільшуємо зсув для наступного запиту
        setCharEnded(ended);
        setProcess("confirmed");
      })
      .catch(() => {
        // Обробка помилки при отриманні персонажів
        setChars([]); // Очищаємо список персонажів у випадку помилки
      });
  };

  // Відображення різних станів компонента в залежності від значень прапорців
  // if (error) return <ErrorMessage />; // Відображення повідомлення про помилку
  // if (loading && !newItemLoading) return <Spinner />; // Відображення індикатора завантаження

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
      <ul className="char__grid">
        {setContent(process, () => renderCharsList, newItemLoading)}
      </ul>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{
          display: charEnded ? "none" : "block",
        }}
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

import { Component } from "react";

import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

class CharList extends Component {
  state = {
    chars: [], // Список персонажів
    loading: true, //  вказує на те, чи йде завантаження
    error: false, // вказує на те, чи виникла помилка
    newItemLoading: false, //  вказує на те, чи йде завантаження нових елементів
    offset: 210, // Початковий зсув для отримання нових персонажів
    charEnded: false,
  };

  marvelService = new MarvelService(); // Екземпляр сервісу Marvel для отримання даних

  componentDidMount() {
    // Викликається після монтажу компонента
    this.onRequest(); // Запуск методу для отримання персонажів
  }

  // Метод для отримання нових персонажів
  onRequest = () => {
    const { offset } = this.state; // Деструктуризація стану для отримання поточного значення зсуву
    this.onCharListLoading(); // Виклик функції для відображення індикатора завантаження
    this.marvelService
      .getAllCharacters(offset) // Виклик сервісу Marvel для отримання персонажів
      .then((newCharsList) => {
        let ended = false;
        if (newCharsList.length < 9) {
          ended = true;
        }

        // Успішна обробка результатів
        this.setState(({ chars }) => ({
          chars: [...chars, ...newCharsList], // Додаємо нових персонажів до поточного списку
          loading: false, // Вимикаємо індикатор завантаження
          error: false, // Вимикаємо прапорець помилки
          newItemLoading: false, // Вимикаємо прапорець завантаження нових елементів
          offset: offset + 9, // Збільшуємо зсув для наступного запиту
          charEnded: ended,
        }));
      })
      .catch(() => {
        // Обробка помилки при отриманні персонажів
        this.setState({
          chars: [], // Очищаємо список персонажів у випадку помилки
          loading: false, // Вимикаємо індикатор завантаження
          error: true, // Вмикаємо прапорець помилки
        });
      });
  };

  // Функція для відображення індикатора завантаження нових елементів
  onCharListLoading = () => {
    this.setState({
      newItemLoading: true, // Додаємо прапорець завантаження нових елементів
    });
  };

  render() {
    // Відображення різних станів компонента в залежності від значень прапорців
    if (this.state.error) return <ErrorMessage />; // Відображення повідомлення про помилку
    if (this.state.loading) return <Spinner />; // Відображення індикатора завантаження

    // Формування списку персонажів для відображення
    const renderCharsList = this.state.chars.map((char) => (
      <li
        key={char.id}
        className="char__item"
        onClick={() => this.props.onCharSelected(char.id)} // Передача ідентифікатора обраного персонажа до App.js
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
          disabled={this.state.newItemLoading}
          style={{ display: this.state.charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(this.state.offset)} // Виклик методу для отримання нових персонажів
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propType = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;

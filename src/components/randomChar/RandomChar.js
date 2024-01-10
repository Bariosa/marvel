import { useState, useEffect } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const RandomChar = () => {
  const [char, setChar] = useState({});
  const { loading, error, getCharacter, clearError } = useMarvelService();

  // один з методів життєвого циклу компонента
  useEffect(() => {
    updateChar();
  }, []);

  const onCharLoaded = (char) => {
    setChar(char);
  };

  //метод звертається до сервера - отримує дані - записує в state
  const updateChar = () => {
    clearError();
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); //випадкове id персонажа. рандомне число розраховується за формулою

    getCharacter(id).then(onCharLoaded);
  };

  //змінні в яких прописані умови за яких відображається компонент <ErrorMessage /> або <Spinner /> або <View />
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? <View char={char} /> : null;

  return (
    <div className="randomchar">
      {errorMessage}
      {spinner}
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button className="button button__main">
          <div className="inner" onClick={updateChar}>
            try it
          </div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

//компонент для відображення елементу верстки(простий елемент рендерингу)
const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char; //деструктуризація об'єкта (char) з даними про персонажа

  // const style = thumbnail.includes("image_not_available")
  //   ? { objectFit: "contain" }
  //   : null;
  const imgClass = thumbnail?.includes("image_not_available")
    ? "randomchar__img randomchar__img--no-image"
    : "randomchar__img";

  return (
    <div className="randomchar__block">
      <img
        // style={style}
        src={thumbnail}
        alt="Random character"
        className={imgClass}
      />

      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;

import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const RandomChar = () => {
  const [char, setChar] = useState({});
  const { getCharacter, clearError, process, setProcess } = useMarvelService();

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

    getCharacter(id)
      .then(onCharLoaded)
      .then(() => setProcess("confirmed"));
  };

  return (
    <div className="randomchar">
      {setContent(process, View, char)}
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
const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki } = data; //деструктуризація об'єкта (char) з даними про персонажа

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

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import MarvelService from "../../services/MarvelService";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //створюємо нову властивість this.marvelService всередині класу CharInfo
  const marvelService = new MarvelService(); // новий екземпляр класу MarvelService, в якому зберігається нащадок класу

  useEffect(() => {
    updateChar();
  }, []);

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    const { charId } = props; //передаємо пропси з App.js. деструктуруємо charId
    if (!charId) {
      return;
    }

    onCharLoading();
    marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);
  };

  const onCharLoaded = (char) => {
    setChar(char);
    setLoading(false);
  };
  const onCharLoading = () => {
    setLoading(true);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  //змінні в яких прописані умови за яких відображається компонент <ErrorMessage /> або <Spinner /> або <View /> або <Skeleton/>
  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : `There is no comics with ${name}`}
        {comics.map((item, i) => {
          if (i > 9) return;
          return (
            <li key={i} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;

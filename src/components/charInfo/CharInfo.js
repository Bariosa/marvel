import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Transition } from "react-transition-group";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [isShowView, setIsShowView] = useState(false);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    setIsShowView(!(loading || error || !char));
  }, [loading, error, char]);

  // useEffect(() => {
  //   updateChar();
  // }, []);

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    const { charId } = props; //передаємо пропси з App.js. деструктуруємо charId
    if (!charId) {
      return;
    }
    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  //змінні в яких прописані умови за яких відображається компонент <ErrorMessage /> або <Spinner /> або <View /> або <Skeleton/>
  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  // const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {isShowView && (
        <View
          char={char}
          isShowView={isShowView}
          setIsShowView={setIsShowView}
        />
      )}
    </div>
  );
};

const View = ({ char, isShowView, setIsShowView }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  const duration = 300;
  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
    visibility: "hidden",
  };

  const transitionStyles = {
    entering: { opacity: 1, visibility: "visible" },
    entered: { opacity: 1, visibility: "visible" },
    exiting: { opacity: 0, visibility: "hidden" },
    exited: { opacity: 0, visibility: "hidden" },
  };
  return (
    <Transition
      in={isShowView}
      timeout={duration}
      onEnter={() => setIsShowView(false)}
      onExited={() => setIsShowView(true)}
    >
      {(state) => (
        <div style={{ ...defaultStyle, ...transitionStyles[state] }}>
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
        </div>
      )}
    </Transition>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./singleCharacterPage.scss";
import AppBanner from "../appBanner/AppBanner";

const SingleCharacterPage = () => {
  const { charId } = useParams();
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail } = char;

  return (
    <div className="single-character">
      <img src={thumbnail} alt={name} className="single-character__img" />
      <div className="single-character__info">
        <h2 className="single-character__name">{name}</h2>
        <p className="single-character__descr">{description}</p>
      </div>
    </div>
  );
};

export default SingleCharacterPage;

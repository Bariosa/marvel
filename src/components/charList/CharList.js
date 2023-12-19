import { Component } from "react";

import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
  };
  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService
      .getAllCharacters()
      .then((charsList) =>
        this.setState({
          chars: charsList,
          loading: false,
          error: false,
        }),
      )
      .catch(() => {
        this.setState({
          chars: [],
          loading: false,
          error: true,
        });
      });
  }

  render() {
    console.log("render 1");
    if (this.state.error) return <ErrorMessage />;
    if (this.state.loading) return <Spinner />;
    console.log("render 2");

    const renderCharsList = this.state.chars.map((char) => (
      <li key={char.wiki} className="char__item">
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

    return (
      <div className="char__list">
        <ul className="char__grid">{renderCharsList}</ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;

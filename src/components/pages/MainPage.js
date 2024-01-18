import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from "../../resources/img/vision.png";
import CharSearch from "../charSearch/CharSearch";

const MainPage = () => {
  const [selectedChar, setChar] = useState(null);

  // метод який встановлює вибраний персонаж (selectedChar)
  const onCharSelected = (id) => {
    setChar(id);
  };

  return (
    <>
      <ErrorBoundary>
        <RandomChar />
      </ErrorBoundary>
      <div className="char__content">
        <ErrorBoundary>
          {/* створюємо пропс для встановлення персонажа*/}
          <CharList onCharSelected={onCharSelected} />
        </ErrorBoundary>

        <ErrorBoundary>
          <div>
            <CharInfo charId={selectedChar} />
            <CharSearch />
          </div>
        </ErrorBoundary>
      </div>
      <img className="bg-decoration" src={decoration} alt="vision" />
    </>
  );
};

export default MainPage;

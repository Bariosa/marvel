import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./charSearch.scss";
import { useState } from "react";
import Spinner from "../spinner/Spinner";
import useMarvelService from "../../services/MarvelService";
import { Link } from "react-router-dom";

const CharSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [char, setChar] = useState(null);
  const { getCharacterByName } = useMarvelService();

  const formHandler = (name, resetForm) => {
    setLoading(true);
    getCharacterByName(name)
      .then((char) => {
        setChar(char);
        setLoading(false);
        resetForm();
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  return (
    <div className="char-search">
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("This field is required"),
        })}
        onSubmit={(values, { resetForm }) =>
          formHandler(values.name, resetForm)
        }
      >
        <Form>
          <h2 className="char-search__title">Or find a character by name:</h2>

          <div className="char-search__input-wrapper">
            <Field
              className="char-search__input"
              id="name"
              name="name"
              type="text"
              placeholder="Enter name"
            />

            <button className="button button__main" type="submit">
              <div className="inner">FIND</div>
            </button>
          </div>
          <ErrorMessage
            className="char-search__text char-search__text--error"
            name="name"
            component="div"
          />
        </Form>
      </Formik>

      {loading && <Spinner />}
      {error && (
        <div className="char-search__text char-search__text--error">
          The character was not found. Check the name and try again
        </div>
      )}
      {char && (
        <div className="char-search__input-wrapper">
          <p className="char-search__text char-search__text--sucses">
            There is! Visit {char.name} page?
          </p>
          <Link to={`/character/${char.id}`}>
            <button className="button button__secondary">
              <div className="inner">TO PAGE</div>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default CharSearch;

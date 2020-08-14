import React, { useCallback } from "react";

import "./NewPlace.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";

const NewPlace = (props) => {
  // useCallback reexecutes this function only when values specified in second argument change
  // that will allow us to not stack into infinite loop because of the fact that rerendering of this function means
  // that Input`s useEffect will be executed again and which means that this component this rerendered again and so on
  const titleInputHandler = useCallback((id, value, isValid) => {}, []);
  const descriptionInputHandler = useCallback((id, value, isValid) => {}, []);
  return (
    <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={titleInputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 character)"
        onInput={descriptionInputHandler}
      />
    </form>
  );
};

export default NewPlace;

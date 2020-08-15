import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import "./Input.css";

// Reducer similar to Redux reducer, which receives action and updates the state
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  // useReducer is more complex state managment than useState
  // allows to do something whenever state changes and so on
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: props.valid || false,
  }); // inital values of the state

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    // Dispatching CHANGE action
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    // Dispatching TOUCH action
    dispatch({
      type: "TOUCH",
    });
  };
  const element =
    props.element === "input" ? (
      <input
        value={inputState.value}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onBlur={touchHandler}
        onChange={changeHandler}
      />
    ) : (
      <textarea
        id={props.id}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
        rows={props.rows || 3}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;

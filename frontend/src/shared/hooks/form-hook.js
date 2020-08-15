// Custom hooks are recognized by react and whenever state is changed
// in such hooks, react rerenders component which uses this custom hook

// Custom hooks should only be used directly in components, not in if blocks or any blocks

import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        // Skip undefined properties
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  // useCallback reexecutes this function only when values specified in second argument change
  // that will allow us to not stack into infinite loop because of the fact that rerendering of this function means
  // that Input`s useEffect will be executed again and which means that this component this rerendered again and so on
  const inputHandler = useCallback(
    (id, value, isValid) => {
      dispatch({ type: "INPUT_CHANGE", value, isValid, inputId: id });
    },
    [dispatch]
  );

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);
  // We return state and pointer to inputHandler function
  return [formState, inputHandler, setFormData];
};

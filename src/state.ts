import produce from "immer";
import {
  usernameIsValid,
  telephoneIsValid,
  passwordIsValid,
} from "./create-account/form-validation";

export type View = "create" | "success";

export type State = {
  form: {
    dirty: boolean;
    usernameIsAvailable: boolean;
    username: string;
    checkingUsername: boolean;
    telephone: string;
    password: string;
    terms: boolean;
    submitting: boolean;
  };
} & (
  | {
      view: "create";
    }
  | {
      view: "success";
      username: string;
    }
);

export type Event =
  | {
      type: "username field input";
      username: string;
    }
  | {
      type: "password field input";
      password: string;
    }
  | {
      type: "telephone field input";
      telephone: string;
    }
  | {
      type: "terms checkbox clicked";
      state: boolean;
    }
  | {
      type: "account submitted";
    }
  | {
      type: "account created";
    }
  | {
      type: "username checked";
      available: boolean;
      username: string;
    }
  | {
      type: "checking username";
    };

function assertExhaustive(c: never): never {
  throw new Error(`case ${c} not handled`);
}

export function reducer(state: State, event: Event): State {
  return produce(state, (draft) => {
    switch (event.type) {
      case "username field input": {
        if (!draft.form.dirty) draft.form.dirty = true;
        if (!draft.form.checkingUsername) draft.form.username = event.username;
        break;
      }
      case "password field input": {
        if (!draft.form.dirty) draft.form.dirty = true;
        draft.form.password = event.password;
        break;
      }
      case "telephone field input": {
        if (!draft.form.dirty) draft.form.dirty = true;
        draft.form.telephone = event.telephone;
        break;
      }
      case "terms checkbox clicked": {
        draft.form.terms = event.state;
        break;
      }
      case "account created": {
        draft.view = "success";
        // annoying that TS narrows view to "success" but is unable
        // to type the discriminate union allowing draft.user...
        if (draft.view === "success") {
          draft.username = state.form.username;
        }
        draft.form.submitting = false;
        draft.form.username = "";
        draft.form.password = "";
        draft.form.telephone = "";
        draft.form.terms = false;
        draft.form.dirty = false;
        break;
      }
      case "account submitted": {
        draft.form.submitting = true;
        break;
      }
      case "checking username": {
        draft.form.checkingUsername = true;
        break;
      }
      case "username checked": {
        draft.form.usernameIsAvailable = event.available;
        draft.form.checkingUsername = false;
        draft.form.username = event.username;
        break;
      }
      default: {
        assertExhaustive(event);
      }
    }
  });
}

export const defaultState = (): State => ({
  form: {
    dirty: false,
    checkingUsername: false,
    usernameIsAvailable: false,
    username: "",
    password: "",
    telephone: "",
    terms: false,
    submitting: false,
  },
  view: "create",
});

export function selectIsUnsubmitable(state: State): boolean {
  return (
    !state.form.dirty ||
    state.form.submitting ||
    !state.form.terms ||
    !usernameIsValid(state.form.username) ||
    state.form.checkingUsername ||
    !state.form.usernameIsAvailable ||
    !telephoneIsValid(state.form.telephone) ||
    !passwordIsValid(state.form.password)
  );
}

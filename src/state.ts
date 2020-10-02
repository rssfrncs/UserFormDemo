import produce from "immer";
import {
  usernameIsValid,
  telephoneIsValid,
  passwordIsValid,
} from "./create-account/form-validation";

export type View = "create" | "success";

type Field = {
  value: string;
  dirty: boolean;
};

export type State = {
  form: {
    username: Field & {
      available: boolean;
      checking: boolean;
    };
    password: Field;
    telephone: Field;
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
      case "password field input": {
        if (!draft.form.password.dirty) draft.form.password.dirty = true;
        draft.form.password.value = event.password;
        break;
      }
      case "telephone field input": {
        if (!draft.form.telephone.dirty) draft.form.telephone.dirty = true;
        draft.form.telephone.value = event.telephone;
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
          draft.username = state.form.username.value;
        }
        draft.form.submitting = false;
        draft.form.username.value = "";
        draft.form.username.dirty = false;
        draft.form.password.value = "";
        draft.form.password.dirty = false;
        draft.form.telephone.value = "";
        draft.form.telephone.dirty = false;
        draft.form.terms = false;
        break;
      }
      case "account submitted": {
        draft.form.submitting = true;
        break;
      }
      case "checking username": {
        draft.form.username.checking = true;
        break;
      }
      case "username checked": {
        if (!draft.form.username.dirty) draft.form.username.dirty = true;
        draft.form.username.available = event.available;
        draft.form.username.checking = false;
        draft.form.username.value = event.username;
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
    username: {
      value: "",
      dirty: false,
      checking: false,
      available: false,
    },
    password: {
      value: "",
      dirty: false,
    },
    telephone: {
      value: "",
      dirty: false,
    },
    terms: false,
    submitting: false,
  },
  view: "create",
});

export function selectIsUnsubmitable(state: State): boolean {
  const {
    form: { submitting, terms, username, password, telephone },
  } = state;
  return (
    submitting ||
    !terms ||
    !usernameIsValid(username.value) ||
    username.checking ||
    !username.available ||
    !telephoneIsValid(telephone.value) ||
    !passwordIsValid(password.value)
  );
}

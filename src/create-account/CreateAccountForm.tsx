import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
} from "@chakra-ui/core";
import React from "react";
import { fakeServer } from "./fake-server-api";
import { selectIsUnsubmitable } from "../state";
import { AppState } from "../App";
import { debounce } from "debounce";
import {
  passwordIsValid,
  telephoneIsValid,
  usernameIsValid,
} from "./form-validation";

export function CreateAccountForm() {
  const { state, update } = React.useContext(AppState);
  const unsubmitable = React.useMemo(() => selectIsUnsubmitable(state), [
    state,
  ]);
  const submit = async () => {
    if (unsubmitable) return;
    update({
      type: "account submitted",
    });
    await fakeServer.createAccount({
      username: state.form.username,
      password: state.form.password,
      telephone: state.form.telephone,
    });
    update({
      type: "account created",
    });
  };
  return (
    <Stack spacing={6} as="form">
      <Box>
        <Username />
      </Box>
      <FormControl>
        <Input
          placeholder="Telephone"
          value={state.form.telephone}
          isInvalid={
            state.form.dirty && !telephoneIsValid(state.form.telephone)
          }
          onChange={(e: any) =>
            void update({
              type: "telephone field input",
              telephone: e.target.value,
            })
          }
        />
      </FormControl>
      <FormControl>
        <Input
          placeholder="Password"
          type="password"
          value={state.form.password}
          isInvalid={state.form.dirty && !passwordIsValid(state.form.password)}
          onChange={(e: any) =>
            void update({
              type: "password field input",
              password: e.target.value,
            })
          }
        />
      </FormControl>
      <FormControl>
        <Checkbox
          variantColor="green"
          isChecked={state.form.terms}
          onChange={(e) =>
            void update({
              type: "terms checkbox clicked",
              state: e.target.checked,
            })
          }
        >
          I agree to the terms and conditions
        </Checkbox>
      </FormControl>

      <Divider />

      <Stack direction="row" align="center" justify="flex-end">
        {state.form.submitting ? (
          <CircularProgress isIndeterminate color="#2f8a53" />
        ) : null}
        <Button
          alignSelf="flex-end"
          rightIcon="arrow-forward"
          variantColor="green"
          size="lg"
          isDisabled={unsubmitable}
          onClick={submit}
        >
          Submit form
        </Button>
      </Stack>
    </Stack>
  );
}

function Username() {
  const { state, update } = React.useContext(AppState);
  const [draftUsername, set] = React.useState(state.form.username);
  const checkUsername = React.useCallback(
    async (username: string) => {
      update({
        type: "checking username",
      });
      const available = await fakeServer.isUsernameAvailable(username);
      update({
        type: "username checked",
        available,
        username,
      });
    },
    [update]
  );
  const debouncedCheckUsername = React.useMemo(
    // 333ms is a good user wait timing
    // i was lazy and didn't write my own debounce implementation!
    () => debounce(checkUsername, 333),
    [checkUsername]
  );
  React.useEffect(() => {
    set(state.form.username)
  }, [state.form.username])
  React.useEffect(() => {
    if (usernameIsValid(draftUsername)) debouncedCheckUsername(draftUsername);
  }, [draftUsername, debouncedCheckUsername]);
  return (
    <FormControl>
      <InputGroup>
        <Input
          placeholder="Username"
          id="username"
          value={draftUsername}
          isDisabled={state.form.checkingUsername}
          isInvalid={state.form.dirty && !usernameIsValid(draftUsername)}
          onChange={(e: any) => void set(e.target.value)}
        />
        <InputRightAddon
          children={
            state.form.checkingUsername ? (
              <CircularProgress isIndeterminate size="10px" />
            ) : state.form.usernameIsAvailable ? (
              <Icon name="check-circle" color="#2f8a53" />
            ) : (
              <Icon name="not-allowed" color="#e22043" />
            )
          }
        />
      </InputGroup>
    </FormControl>
  );
}

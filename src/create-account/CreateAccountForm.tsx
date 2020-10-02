import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Tooltip,
  List,
  ListItem,
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
  const { form } = state;
  const unsubmitable = React.useMemo(() => selectIsUnsubmitable(state), [
    state,
  ]);
  const submit = async () => {
    if (unsubmitable) return;
    update({
      type: "account submitted",
    });
    await fakeServer.createAccount({
      username: form.username.value,
      password: form.password.value,
      telephone: form.telephone.value,
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
        <InputGroup>
          <InputLeftElement>
            <Tooltip
              aria-label="Valid telephone numbers are numeric and greater than 5 digits"
              label="Valid telephone numbers are numeric and greater than 5 digits."
              placement="left"
            >
              <Icon name="phone" />
            </Tooltip>
          </InputLeftElement>
          <Input
            placeholder="Telephone"
            value={form.telephone.value}
            isInvalid={
              form.telephone.dirty &&
              !telephoneIsValid(form.telephone.value).valid
            }
            onChange={(e: any) =>
              void update({
                type: "telephone field input",
                telephone: e.target.value,
              })
            }
          />
        </InputGroup>
      </FormControl>
      <FormControl>
        <Password />
      </FormControl>
      <FormControl>
        <Checkbox
          variantColor="green"
          isChecked={form.terms}
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

      <ErrorLog />

      <Divider />

      <Stack direction="row" align="center" justify="flex-end">
        <Button
          alignSelf="flex-end"
          rightIcon="arrow-forward"
          variantColor="green"
          size="lg"
          isDisabled={unsubmitable}
          onClick={submit}
          isLoading={form.submitting}
          loadingText="Submitting"
        >
          Submit form
        </Button>
      </Stack>
    </Stack>
  );
}

function Username() {
  const {
    state: {
      form: { username },
    },
    update,
  } = React.useContext(AppState);
  const [draftUsername, set] = React.useState(username.value);
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
    set(username.value);
  }, [username.value]);
  React.useEffect(() => {
    update({
      type: "username field input",
      username: draftUsername,
    });
    if (usernameIsValid(draftUsername).valid)
      debouncedCheckUsername(draftUsername);
  }, [draftUsername, debouncedCheckUsername]);
  return (
    <FormControl>
      <InputGroup>
        <InputLeftElement>
          <Tooltip
            aria-label="Usernames must be unique and greater than 5 characters."
            label="Usernames must be unique and greater than 5 characters."
            placement="left"
          >
            <Icon name="question-outline" />
          </Tooltip>
        </InputLeftElement>
        <Input
          placeholder="Username"
          id="username"
          value={draftUsername}
          isDisabled={username.checking}
          isInvalid={
            username.dirty &&
            (!usernameIsValid(draftUsername).valid || !username.available)
          }
          onChange={(e: any) => void set(e.target.value)}
        />
        <InputRightElement>
          {username.checking ? (
            <CircularProgress isIndeterminate size="10px" />
          ) : !username.dirty ? null : username.available ? (
            <Tooltip
              aria-label="username is available"
              label="Username is available"
              placement="auto"
            >
              <Icon name="check-circle" color="#2f8a53" />
            </Tooltip>
          ) : (
            <Tooltip
              aria-label="username is not available"
              label="Username is not available"
              placement="auto"
            >
              <Icon name="not-allowed" color="#e22043" />
            </Tooltip>
          )}
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

function Password() {
  const {
    state: {
      form: { password },
    },
    update,
  } = React.useContext(AppState);
  const [showPassword, toggle] = React.useReducer((show) => !show, false);
  return (
    <InputGroup>
      <InputLeftElement>
        <Tooltip
          aria-label="A strong password is a mixture of unique characters and a minimum length"
          label="A strong password is a mixture of unique characters and a minimum length."
          placement="left"
        >
          <Icon name="question-outline" />
        </Tooltip>
      </InputLeftElement>
      <Input
        isInvalid={password.dirty && !passwordIsValid(password.value).valid}
        onChange={(e: any) =>
          void update({
            type: "password field input",
            password: e.target.value,
          })
        }
        type={showPassword ? "text" : "password"}
        placeholder="Password"
      />
      <InputRightElement>
        <IconButton
          variant="ghost"
          onClick={toggle}
          icon={showPassword ? "view" : "view-off"}
          aria-label="password visibility toggle"
        />
      </InputRightElement>
    </InputGroup>
  );
}

function ErrorLog() {
  const {
    state: {
      form: { username, telephone, password },
    },
  } = React.useContext(AppState);
  const errors = React.useMemo(() => {
    const _errors: string[] = [];

    const usernameValidation = usernameIsValid(username.value);
    if (username.dirty && !usernameValidation.valid)
      _errors.push(usernameValidation.reason);
    else {
      if (username.dirty && !username.available)
        _errors.push(
          "Your username is not available please choose a different username."
        );
    }
    const telephoneValidation = telephoneIsValid(telephone.value);
    if (telephone.dirty && !telephoneValidation.valid)
      _errors.push(telephoneValidation.reason);
    const passwordValidation = passwordIsValid(password.value);
    if (password.dirty && !passwordValidation.valid)
      _errors.push(passwordValidation.reason);
    return _errors;
  }, [username, telephone, password]);
  return errors.length ? (
    <Box bg="tomato" w="100%" p={4} color="white">
      <List styleType="disc">
        {errors.map((error) => (
          <ListItem key={error}>{error}</ListItem>
        ))}
      </List>
    </Box>
  ) : null;
}

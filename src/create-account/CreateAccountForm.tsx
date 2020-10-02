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
              form.telephone.dirty && !telephoneIsValid(form.telephone.value)
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

      <Divider />

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
    if (usernameIsValid(draftUsername)) debouncedCheckUsername(draftUsername);
  }, [draftUsername, debouncedCheckUsername]);
  return (
    <FormControl>
      <InputGroup>
        <InputLeftElement>
          <Icon name="question-outline" />
        </InputLeftElement>
        <Input
          placeholder="Username"
          id="username"
          value={draftUsername}
          isDisabled={username.checking}
          isInvalid={
            username.dirty &&
            (!usernameIsValid(draftUsername) || !username.available)
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
        isInvalid={password.dirty && !passwordIsValid(password.value)}
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
    const errors: string[] = [];
    if (username.dirty && !username.available)
      errors.push(
        "Your username is not available please choose a different username."
      );
    if (username.dirty && !usernameIsValid(username.value))
      errors.push("Your username is not valid please try a longer username");
    if (telephone.dirty && !telephoneIsValid(telephone.value))
      errors.push(
        "Your telephone is not valid please make sure it is numerical and has at least 5 digits."
      );
    if (password.dirty && !passwordIsValid(password.value))
      errors.push("Your password is not valid please try a stronger password.");
    return errors;
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

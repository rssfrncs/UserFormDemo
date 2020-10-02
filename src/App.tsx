import { Box, Flex, Heading } from "@chakra-ui/core";
import React from "react";
import { CreateAccountForm } from "./create-account/CreateAccountForm";
import { CreateAccountSuccess } from "./create-account/CreateAccountSuccess";
import { State, Event, defaultState, reducer } from "./state";
import waves from "./waves.svg";

type AppStateContextProps = {
  state: State;
  update: (event: Event) => void;
};
export const AppState = React.createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

function App() {
  const [state, update] = React.useReducer(reducer, defaultState());
  const memoizedContextValue = React.useMemo(() => ({ state, update }), [
    state,
    update,
  ]);
  return (
    <AppState.Provider value={memoizedContextValue}>
      <Flex
        backgroundColor="#f1f2f3"
        backgroundImage={`url(${waves})`}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="top center"
        h="100vh"
        w="100vw"
        flexDir="column"
        alignItems="center"
      >
        <Box flex={1} />
        <Heading
          w="calc(100vw - 2rem)"
          as="h1"
          size="2xl"
          mb={8}
          color="white"
          fontWeight="thin"
          textAlign="center"
        >
          Create an account
        </Heading>
        <Box
          rounded="lg"
          bg="white"
          shadow="lg"
          w="calc(100vw - 2rem)"
          maxW="md"
          px={8}
          py={10}
        >
          {state.view === "create" ? (
            <CreateAccountForm />
          ) : (
            <CreateAccountSuccess username={state.username} />
          )}
        </Box>
        <Box flex={2} />
      </Flex>
    </AppState.Provider>
  );
}

export default App;

import { Button, Text, Divider, Heading, Stack, Icon } from "@chakra-ui/core";
import React from "react";

export function CreateAccountSuccess(props: { username: string }) {
  return (
    <Stack spacing={6} alignItems="center" textAlign="center">
      <Icon size={"64px"} name="check-circle" color="orange.400" />
      <Heading>Welcome, {props.username}!</Heading>
      <Text>You're all set up and ready to go!</Text>
      <Divider />
      <Button size="lg" rightIcon="arrow-forward" variantColor="green">
        Get started
      </Button>
    </Stack>
  );
}

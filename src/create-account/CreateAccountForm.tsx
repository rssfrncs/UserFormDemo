import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  Input,
  Stack,
} from "@chakra-ui/core";
import React from "react";

export function CreateAccountForm() {
  return (
    <Stack spacing={6} as="form">
      <FormControl>
        <Input placeholder="Username" id="username" />
      </FormControl>
      <FormControl>
        <Input placeholder="Telephone" id="telephone" />
      </FormControl>
      <FormControl>
        <Input placeholder="Password" id="telephone" type="password" />
      </FormControl>
      <FormControl>
        <Checkbox variantColor="green">
          I agree to the terms and conditions
        </Checkbox>
      </FormControl>

      <Divider />

      <Button
        alignSelf="flex-end"
        rightIcon="arrow-forward"
        variantColor="green"
        size="lg"
      >
        Submit form
      </Button>
    </Stack>
  );
}

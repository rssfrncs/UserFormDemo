# Front-end engineer assignment

Implement the form for creating a new account in this imaginary app.

This will form part of the discussion at the face-to-face interview. You should expect to spend around 2 hours on this.

If you do not complete it to a standard that _you_ are happy with within 2 hours, that is OK. We will talk through where you got to at the interview.

Please don't spend too long on this - we don't want to overburden our candidates.

## Part 1 • Password strength function

Implement the `passwordStrength` function in `src/create-account/password-strength.ts`, such that:

```
strength = password_length_capped_at_5 + unique_characters_in_password
```

That is, you get one 'point' for each character up to a maximum of 5 points. And you get a point for each _unique_ character.

For example:

- `abcde` => 5 points for length, 5 for unique characters = 10 points
- `aaaaa` => 5 points for length, 1 for unique characters = 6 points
- `aaaaabbbbb` => 5 points for length, 2 for unique characters = 7 points

There are unit tests that can be run with `npm run test`.

## Part 2 • Form validation and submission

Implement the Create Account form.

- Use the `CreateAccountForm` component as a basis - it will need to be modified in some way to complete this!
- Use the validation functions in `src/create-account/form-validation.ts` to add client-side validation to the form.
- Use the fake server API in `src/create-account/fake-server-api.ts` so that user can see if their username is available _before_ they submit the form.
- Use the fake server API to submit the form, and when it succeeds (it always succeeds, it doesn't validate anything) display the `CreateAccountSuccess` UI in place of the form.

Constraints:

- Do not use an off-the-shelf validation library. We know they exist, but this is to test your ability to handle React state yourself.
- Do not let the user submit the form until we are as sure as we can be on the client side, that the data is valid.

Guidance:

- Use modern React idioms (i.e. not classes)
- The existing app uses [Chakra UI](https://chakra-ui.com/) so you can use that, or write CSS files/inline styles if you feel you need to.
- Feel free to change every piece of code/UI you encounter. If you dislike the code structure or disagree with a UI decision, it's entirely yours to change.
- You are not expected to write tests for this part, but if it helps you when devloping, please do. `react-testing-library` are available through the default `create-react-app` installation.

# Running the project

### Unit tests: `npm run test`

These fail, but should be made to pass in **Part 1**.

### React App: `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

import { Button } from "../ui/button";

export function ToLogin() {
  return (
    <form method="GET" action="/auth/signin">
      <Button>Sign In </Button>
    </form>
  );
}

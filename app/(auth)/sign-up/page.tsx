import SignUpClient from "./sign-up-client";

export default async function SignUp() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-primary-foreground">
      <SignUpClient />
    </div>
  );
}

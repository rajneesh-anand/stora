import React from "react";
import { getProviders, signIn } from "next-auth/client";

export default function SignIn() {
  return (
    <>
      <button onClick={() => signIn("github")}>Sign in with Github</button>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
      {/* {providers.map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))} */}
    </>
  );
}

// SignIn.getInitialProps = async (context) => {
//   const providers = await getProviders();
//   console.log(providers);
//   return {
//     providers: providers,
//   };
// };

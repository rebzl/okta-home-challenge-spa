import React from "react";
import { useOktaAuth } from "@okta/okta-react"; // Okta state

const Home = () => {
    // Okta hook state
    const { authState, oktaAuth } = useOktaAuth();
    const login = () =>
        oktaAuth.signInWithRedirect({ originalUri: "/profile" }); // Redirect to profile

    if (!authState) {
        // Not authenticated
        return <div>Loading authentication...</div>;
    } else if (!authState.isAuthenticated) {
        // Authenticated
        return (
            <div>
                <button onClick={login}>Login</button>;
            </div>
        );
    } else {
        return "You authenticated up in here!";
    }
};
export default Home;

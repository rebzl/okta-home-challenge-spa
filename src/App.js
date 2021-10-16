import { Route, Switch, useHistory } from "react-router-dom";
// LoginCallback -> Redirect to the /login/callback
// SecureRoute -> Check if you are authenticated before allow you to see the information
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import Home from "./Home";
import NoAuthenticated from "./NoAuthenticated";
import Profile from "./Profile";
import { oktaConfig } from "./lib/oktaConfig";

const CALLBACK_PATH = "/login/callback";

// Create a new okta auth
const oktaAuth = new OktaAuth(oktaConfig);

const App = () => {
    const history = useHistory();
    const restoreOriginalUri = async (_oktaAuth, originalUri) => {
        history.replace(
            toRelativeUrl(originalUri || "/", window.location.origin)
        );
    };

    return (
        // Wrap all in Security to have access to authentification in Okta
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
            <Switch>
                {/* <Route path="/" exact component={Home} /> */}
                <Route path={CALLBACK_PATH} exact component={LoginCallback} />
                <Route path="/signout" exact component={LoginCallback} />
                <SecureRoute
                    path="/no-authenticated"
                    exact
                    component={NoAuthenticated}
                />
                <SecureRoute path="/" component={Profile} />
            </Switch>
        </Security>
    );
};

export default App;

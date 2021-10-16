import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";

const Profile = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            // No authenticated
            setUserInfo(null);
        } else {
            // Authenticated
            // Get User information from okta and set it in the userInfo state.
            oktaAuth.getUser().then((info) => {
                setUserInfo(info);
            });
        }
    }, [authState, oktaAuth]); // Update if authState changes

    const viewTasks = async () => {
        const response = await fetch("http://localhost:8080/api/tasks", {
            headers: {
                Authorization: `Bearer ${authState.accessToken.accessToken}`,
            },
        });

        if (!response.ok) {
            return Promise.reject();
        }
        const data = await response.json();

        setMessages(data);
    };

    const addTask = async (task) => {
        const response = await fetch("http://localhost:8080/api/create", {
            headers: {
                Authorization: `Bearer ${authState.accessToken.accessToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                name: task,
            }),
        });
        setCount((prevCount) => prevCount + 1);
        if (!response.ok) {
            return Promise.reject();
        }

        const data = await response.json();
        viewTasks();
    };

    const logout = async () => {
        // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
        await oktaAuth.signOut();
    };

    if (!userInfo) {
        return (
            <div>
                <p>Fetching user profile...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-3 mb-3">
            <div className="d-flex justify-content-between">
                <h2>Welcome {userInfo.name}! You are authenticated</h2>
                <button type="button" className="btn btn-dark" onClick={logout}>
                    Logout
                </button>
            </div>

            <hr />
            <h1 className="mb-3 mt-3">To do App</h1>
            <div className="d-flex w-25 flex-column mb-4">
                <button
                    type="button"
                    className="btn btn-dark w-100 mb-3"
                    onClick={() => addTask(`New Task #${count}`)}
                >
                    Add New Task
                </button>
                <button
                    type="button"
                    className="btn btn-outline-dark w-100"
                    onClick={viewTasks}
                >
                    View Task
                </button>
            </div>
            <hr />
            {messages.map((t, i) => {
                return <li key={i}>{t.name}</li>;
            })}
        </div>
    );
};

export default Profile;

import { Container } from "@chakra-ui/react";

import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import PostPage from "./pages/PostPage";

import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";
import { useEffect, useState } from "react";

const App = () => {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (data._id) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    fetchUser();
  }, [setUser]);

  if (isCheckingAuth) return null;

  return (
    <Container
      w={["full", "480px", "576px", "768px", "992px", "1280px"]}
      centerContent
      className={"darkBlack"}
    >
      {user && <Header user={user} />}
      <Routes>
        <Route
          path={"/auth"}
          element={!user ? <AuthPage /> : <Navigate to={"/"} />}

        />
        <Route
          path={"/"}
          element={user ? <HomePage user={user} /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to={"/auth"} />}
        />
        <Route
          path={"/:username"}
          element={user ? <UserPage user={user} /> : <Navigate to={"/auth"} />}
        />
        <Route
          path={"/:username/post/:pid"}
          element={user ? <PostPage user={user} /> : <Navigate to={"/auth"} />}
        />
      </Routes>
    </Container>
  );
};

export default App;

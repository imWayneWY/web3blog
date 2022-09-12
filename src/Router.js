import { HashRouter, Route, Routes } from "react-router-dom";
import { Post } from "./pages/Post";
import { Todo } from "./pages/ui-challenges/Todo";
import { memo } from "react";
import { Main } from "./pages/Main";

export const Router = memo(() => {
	return <HashRouter>
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/post" element={<Post />} />
			<Route path="/todo" element={<Todo />} />
		</Routes>
	</HashRouter>
});

import { HashRouter, Route, Routes } from "react-router-dom";
import { Post } from "./pages/Post";
import { List } from "./pages/List";
import { Todo } from "./pages/ui-challenges/Todo";
import { memo } from "react";

export const Router = memo(() => {
	return <HashRouter>
		<Routes>
			<Route path="/" element={<List items={[]} />} />
			<Route path="/post" element={<Post />} />
			<Route path="/todo" element={<Todo />} />
		</Routes>
	</HashRouter>
});

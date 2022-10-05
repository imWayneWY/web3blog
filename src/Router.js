import { Route, Routes } from "react-router-dom";
import { Post } from "./pages/Post";
import { Todo } from "./pages/ui-challenges/Todo";
import { memo } from "react";
import { Main } from "./pages/Main";
import { Detail } from "./pages/Detail";
import { Demos } from "./pages/Demos";
import { Others } from "./pages/Others";
import { Calendar } from "./pages/ui-challenges/Calendar";
import { Jira } from "./pages/ui-challenges/Jira";
import { About } from "./pages/About";

export const Router = memo(() => {
	return <Routes>
		<Route path="/" element={<Main />} />
		<Route path="/post" element={<Post />} />
		<Route path="/detail" element={<Detail />} />
		<Route path="/demos" element={<Demos />} />
		<Route path="/others" element={<Others />} />
		<Route path="/about" element={<About />} />
		<Route path="/ui-challenges/todo" element={<Todo />} />
		<Route path="/ui-challenges/calendar" element={<Calendar />} />
		<Route path="/ui-challenges/JIRA" element={<Jira />} />
	</Routes>
});

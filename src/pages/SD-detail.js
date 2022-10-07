import { memo } from "react";
import { useLocation } from "react-router-dom";
import { SystemDesigns } from "./SystemDesign";
import {Image} from "grommet";

export const SystemDesignDetail = memo(() => {
	const location = useLocation();
	return <Image src={SystemDesigns[location.state.id].asset} />;
});

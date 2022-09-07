import React from "react";
import MDEditor from '@uiw/react-md-editor';
import { Box } from "grommet";

export const Post = () => {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <Box width='100%' height='100vh'>
      <MDEditor
	  	height='100%'
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}
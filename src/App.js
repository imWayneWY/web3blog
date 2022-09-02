import { Grommet, Sidebar, Avatar, Button, Nav, Box } from "grommet";
import * as Icons from "grommet-icons";

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};


function App() {
  return (
    <Grommet theme={theme} style={{height: "100vh"}}>
      <Box direction="row" height={{ min: '100%' }}>
      <Sidebar background="brand" round="small"
        header={
          <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
        }
        footer={
          <Button icon={<Icons.Help />} hoverIndicator />
        }
      >
        <Nav gap="small">
          <Button icon={<Icons.Projects />} hoverIndicator />
          <Button icon={<Icons.Clock />} hoverIndicator />
        </Nav>
      </Sidebar>
      </Box>
    </Grommet>
  );
}

export default App;

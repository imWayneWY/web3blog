import { Grommet, Sidebar, Avatar, Button, Nav, Box, Heading } from "grommet";
import * as Icons from "grommet-icons";
import AvatarImg from "./assets/Avatar.jpeg";
import { Welcome } from "./pages/Welcome";

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  }
};

const SidebarButton = ({ icon, label, ...rest }) => (
  <Box pad="small">
    <Button
      gap="medium"
      alignSelf="start"
      plain
      icon={icon}
      label={label}
      {...rest}
    />
  </Box>
);


function App() {
  return (
    <Grommet theme={theme} style={{ height: "100vh" }}>
      <Box direction="row" height={{ min: '100%' }} background="light-3">
        <Sidebar background="neutral-3" responsive
          header={
            <Box pad="small" direction="row" justify="around" align="center">
              <Avatar src={AvatarImg} />
              <Heading>WEB3</Heading>
            </Box>
          }
          footer={
            <SidebarButton icon={<Icons.User />} label="About Me" />
          }
        >
          <Nav gap="small">
            <SidebarButton icon={<Icons.Blog />} label="In My Point Of View" />
            <SidebarButton icon={<Icons.Article />} label="Others Said" />
            <SidebarButton icon={<Icons.Projects />} label="A Little Practice" />
          </Nav>
        </Sidebar>
        <Welcome />
      </Box>
    </Grommet>
  );
}

export default App;

import { Grommet, Sidebar, Avatar, Button, Nav, Box, Heading } from "grommet";
import { User, Article, Cubes, Blog, Edit, Brush} from "grommet-icons";
import AvatarImg from "./assets/Avatar.jpeg";
import { Welcome } from "./pages/Welcome";
import { Router } from "./Router";
import { useWallet } from "./hooks/useWallet";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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


const Content = styled(Box)`
  flex: 1;
`;

function App() {
  const {selectedAddress} = useWallet();
  const navigate = useNavigate();
  const handleNavigate = useCallback((link) => {
    navigate(link);
  }, [navigate])

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
              <SidebarButton icon={<User />} label="About Me" onClick={() => handleNavigate("/about")}/>
            }
          >
            <Nav gap="small">
              <SidebarButton icon={<Blog />} label="In My Point Of View" onClick={() => handleNavigate("/")} />
              <SidebarButton icon={<Article />} label="Others Said"  onClick={() => handleNavigate("/others")} />
              <SidebarButton icon={<Edit />} label="Post My Thought" onClick={() => handleNavigate("/post")} />
              <SidebarButton icon={<Cubes />} label="A Little Practice" onClick={() => handleNavigate("/demos")} />
              <SidebarButton icon={<Brush />} label="System Design" onClick={() => handleNavigate("/system-design")} />
            </Nav>
          </Sidebar>
          <Content pad="medium" overflow="auto" height="100vh">
            {
              selectedAddress ? <Router /> : <Welcome />
            }
          </Content>
        </Box>
      </Grommet>
  );
}

export default App;


import { Grommet, Sidebar, Avatar, Button, Nav, Box, Heading } from "grommet";
import { User, Article, Cubes, Blog, Edit, Brush} from "grommet-icons";
import AvatarImg from "./assets/Avatar.jpeg";
import { Router } from "./Router";
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

const HeadingResponsive = styled(Heading)``;
const NavItem = styled.span``;

const SideBarResponsive = styled(Sidebar)`
  @media (max-width: 576px) {
    width: 64px;
    ${HeadingResponsive},
    ${NavItem} {
      display: none;
    }
  }
`;

const SidebarButton = ({ icon, label, ...rest }) => (
  <Box pad="small" justify="center" align="center">
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
  position: relative;
  flex: 1;
`;

function App() {
  const navigate = useNavigate();
  const handleNavigate = useCallback((link) => {
    navigate(link);
  }, [navigate])

  return (
      <Grommet theme={theme} style={{ height: "100vh" }} >
        <Box direction="row" height={{ min: '100%' }} background="light-3" >
          <SideBarResponsive background="neutral-3"
            header={
              <Box pad="small" direction="row" justify="around" align="center">
                <Avatar src={AvatarImg} />
                <HeadingResponsive>WEB3</HeadingResponsive>
              </Box>
            }
            footer={
              <SidebarButton icon={<User />} label={<NavItem>About Me</NavItem>} onClick={() => handleNavigate("/about")}/>
            }
          >
            <Nav gap="small">
              <SidebarButton icon={<Blog />} label={<NavItem>In My Point Of View</NavItem>} onClick={() => handleNavigate("/")} />
              <SidebarButton icon={<Article />} label={<NavItem>Others Said</NavItem>}  onClick={() => handleNavigate("/others")} />
              <SidebarButton icon={<Edit />} label={<NavItem>Post My Thought</NavItem>} onClick={() => handleNavigate("/post")} />
              <SidebarButton icon={<Cubes />} label={<NavItem>A Little Practice</NavItem>} onClick={() => handleNavigate("/demos")} />
              <SidebarButton icon={<Brush />} label={<NavItem>System Design</NavItem>} onClick={() => handleNavigate("/system-design")} />
            </Nav>
          </SideBarResponsive>
          <Content pad="medium" overflow="auto" height="100vh">
            <Router />
          </Content>
        </Box>
      </Grommet>
  );
}

export default App;


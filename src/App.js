import { Grommet, Sidebar, Avatar, Button, Nav, Box, Heading } from "grommet";
import { User, Article, Projects, Blog} from "grommet-icons";
import { useEffect, useState } from "react";
import AvatarImg from "./assets/Avatar.jpeg";
import { Welcome } from "./pages/Welcome";
import { ethers } from "ethers";
import { List } from "./pages/List";
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
  const [selectedAddress, setSelectedAddress] = useState();
  const [provider, setProvider] = useState();
  useEffect(() => {
    const getSelectedAddress = async () => {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const userAddress = ethers.utils.getAddress(accounts[0]);
      setSelectedAddress(userAddress);
    }
    // Getting new wallet provider...
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      getSelectedAddress();
    }
  }, []);

  useEffect(() => {
    if (!provider) return;
    const { provider: ethereum } = provider;
    const eventName = `accountsChanged`;

    const listener = ([selectedAddress]) => {
      setSelectedAddress(selectedAddress);
    };
    
    // listen for updates
    ethereum.on(eventName, listener);

    // clean up on unmount
    return () => {
      ethereum.off(eventName, listener);
    };
  }, [provider]);

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
            <SidebarButton icon={<User />} label="About Me" />
          }
        >
          <Nav gap="small">
            <SidebarButton icon={<Blog />} label="In My Point Of View" />
            <SidebarButton icon={<Article />} label="Others Said" />
            <SidebarButton icon={<Projects />} label="A Little Practice" />
          </Nav>
        </Sidebar>
        {
          selectedAddress ? <List items={[]} /> : <Welcome onConnect={setSelectedAddress} />
        }
      </Box>
    </Grommet>
  );
}

export default App;


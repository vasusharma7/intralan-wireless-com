import * as React from "react";
import { AppNavBar, setItemActive } from "baseui/app-nav-bar";
import { ChevronDown, Delete, Overflow, Upload } from "baseui/icon";
import { Redirect } from "react-router";
let Navbar;
export default Navbar = () => {
  const [selected, setSelected] = React.useState([]);
  const [status, setStatus] = React.useState(false);
  const [mainItems, setMainItems] = React.useState([
    { icon: Upload, label: "Settings" },
    {
      active: true,
      icon: ChevronDown,
      label: "Me",
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: "Home" },
        { icon: Upload, label: "My Calls" },
        { icon: Upload, label: "My Chats" },
      ],
    },
  ]);

  let handleAction = (item) => {
    if (item.label === "Log Out") {
      setStatus(true);
    }
  };

  return (
    <>
      {selected === "Home" && <Redirect push to="/home"></Redirect>}
      {selected === "My Calls" && <Redirect push to="/clog"></Redirect>}
      {selected === "My Chats" && <Redirect push to="/mlog"></Redirect>}
      {selected === "Settings" && <Redirect push to="/settings"></Redirect>}

      {status && <Redirect to="/"></Redirect>}
      <AppNavBar
        title="IntraLan Web"
        mainItems={mainItems}
        onMainItemSelect={(item) => {
          setMainItems((prev) => setItemActive(prev, item));
          setSelected(item.label);
        }}
        username={localStorage.getItem("name")}
        userItems={[
          { icon: Overflow, label: "My Profile" },
          { icon: Overflow, label: "Log Out" },
        ]}
        onUserItemSelect={(item) => handleAction(item)}
      />
    </>
  );
};

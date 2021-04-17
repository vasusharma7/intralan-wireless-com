import * as React from "react";
import { AppNavBar, setItemActive } from "baseui/app-nav-bar";
import { ChevronDown, Delete, Overflow, Upload } from "baseui/icon";
import { Redirect } from "react-router";

export default () => {
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
        { icon: Upload, label: "Calls" },
        { icon: Upload, label: "Chat" },
        { icon: Upload, label: "File Transfer" },
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
      {selected === "File Transfer" && <Redirect push to="/files"></Redirect>}
      {selected === "Calls" && <Redirect push to="/files"></Redirect>}
      {selected === "Chat" && <Redirect push to="/files"></Redirect>}
      {status && <Redirect to="/"></Redirect>}
      <AppNavBar
        title="IntraLan Web"
        mainItems={mainItems}
        onMainItemSelect={(item) => {
          setMainItems((prev) => setItemActive(prev, item));
          setSelected(item.label);
        }}
        username="Anup Nair"
        userItems={[
          { icon: Overflow, label: "My Profile" },
          { icon: Overflow, label: "Log Out" },
        ]}
        onUserItemSelect={(item) => handleAction(item)}
      />
    </>
  );
};

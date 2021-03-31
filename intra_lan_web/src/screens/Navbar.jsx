import * as React from "react";
import {
  AppNavBar,
  setItemActive
} from "baseui/app-nav-bar";
import {
  ChevronDown,
  Delete,
  Overflow,
  Upload
} from "baseui/icon";

export default () => {
  const [mainItems, setMainItems] = React.useState([
    { icon: Upload, label: "Settings" },
    {
      active: true,
      icon: ChevronDown,
      label: "Me",
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: "Calls" },
        { icon: Upload, label: "Chat" }
      ]
    }
  ]);
  return (
    <AppNavBar
      title="IntraLan Web"
      mainItems={mainItems}
      onMainItemSelect={item => {
        setMainItems(prev => setItemActive(prev, item));
      }}
      username="Anup Nair"
      userItems={[
        { icon: Overflow, label: "My Profile" },
        { icon: Overflow, label: "Log Out" }
      ]}
      onUserItemSelect={item => console.log(item)}
    />
  );
}
import React from "react";
import PropTypes from "prop-types";

function NavTab({ tabs, activeTab, setActive }) {
  activeTab = activeTab || tabs[0];

  return (
    <ul className="nav nav-tabs">
      {tabs.map(tab => (
        <li onClick={() => setActive(tab)} key={tab}>
          <a
            data-toggle="tab"
            href={"#" + tab}
            className={tab === activeTab ? "active" : undefined}
          >
            {tab.toTitle()}
          </a>
        </li>
      ))}
    </ul>
  );
}

NavTab.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTab: PropTypes.string
};

export default NavTab;

import React from "react";
import {NavLink} from "react-router-dom";

import "../../layouts/navbar.scss";


const NavBar = props => {
  const { navElements } = props;

  const renderIcon = (navEle) =>{
    if (navEle.icon){
      return(
        React.createElement(navEle.icon, {
          className:'icons'
        })
      );
    }else{
      return (
        <i className="nav_icon">
          <img src={navEle.imgSrc} alt={navEle.alt} />
        </i>
      );
    }
  };

  return (
    <div className={"main_nav"}>
      <div className={'container-menu-list'}>
        <ul>
          {navElements.map((navEle, index) =>
            !navEle.sub_menus ? (
              <li key={index}>
                <NavLink to={navEle.href || "#"} title="">
                  {renderIcon(navEle)}
                  <span>{navEle.title || "..."}</span>
                </NavLink>
              </li>
            ) : (
              <li key={index} className="has_sub_menu">
                <NavLink to={navEle.href || "#"} title="">
                  {renderIcon(navEle)}
                </NavLink>
                <ul className="sub_menu">
                  {navEle.sub_menus.map((navSubEle, index) => (
                    <li key={index}>
                      <NavLink to={navEle.href || "#"} title="">
                        {renderIcon(navEle)}
                        <span>{navSubEle.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

NavBar.defaultProps = {
  logoFull: "",
  navElements: []
};

export default NavBar;

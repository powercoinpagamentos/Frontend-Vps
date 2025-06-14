import React, { useContext, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import "./Main.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Main = (props) => {
  const { children } = props;
  const { setDataUser, loading, authInfo } = useContext(AuthContext);

  const location = useLocation();
  let navigate = useNavigate();

  const { dataUser } = authInfo;

  const [isOpen, setIsOpen] = useState(false);

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div
              onClick={() => {
                setDataUser(null);
              }}
            >
              Sair
            </div>
          ),
        },
      ]}
    />
  );

  const handleZoom = (zoomDirection) => {
    let zoomLevel = document.body.style.zoom || 1;
    zoomLevel = parseFloat(zoomLevel) + 0.1 * zoomDirection;
    document.body.style.zoom = zoomLevel;
  };

  return (
    <>
      <div className="Main_container">
        <div className="Main_right">
          <div className={`Main_header ${isOpen ? "open" : ""}`}>
            <div className="Main_headerRight">
              <div
                className="Main_headerSearch"
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faRightFromBracket}
                />
              </div>
            </div>
          </div>
          <div
            className="Main_content"
            style={{ marginTop: "30px", marginLeft: "-10px" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;

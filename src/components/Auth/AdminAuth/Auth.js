import React, { useState, useEffect } from "react"; // alterado BELINI
import "./Auth.css";
import { Button, Checkbox, Col, Input, Row } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
} from "@ant-design/icons";
import { FiLogIn } from "react-icons/fi";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FacebookImg from './Facebook.png';
import InstagramImg from './Instagram.png';
import WhatsappImg from './Whatsapp.png';
const Auth = (props) => {
  const {
    authTitle,
    authDescription,
    authFields,
    authSubmit,
    authImage,
    onsubmit,
    successMessage,
    errorMessage,
    textImage,
  } = props;

  const [rememberMe, setRememberMe] = useState(false); // armazena o valor da checkbox, adicionado BELINI

  useEffect(() => {  // Carrega o estado da checkbox, adicionado BELINI
    const storedRememberMe = localStorage.getItem("rememberMe") === "true";
    setRememberMe(storedRememberMe);
  }, []);

  const handleCheckboxChange = (event) => { // lida com a mudança de estado da checkbox, adicionado BELINI
    const checked = event.target.checked;
    setRememberMe(checked);
    localStorage.setItem("rememberMe", checked);
  };

  const handleSubmit = (event) => { // lida com o envio do formulário, adicionado BELINI
    event.preventDefault();
    if (typeof onsubmit === "function") { // passa o estado da checkbox, adicionado BELINI
      onsubmit(rememberMe);
    }
  };

  return (
    <div className="Admin_Auth_container">
      <Row className="Admin_Auth_rowContainer">
        <Col xs={24} md={10} lg={10} xl={10} className="Admin_Auth_AuthForm">
          {textImage && <div className="Admin_LogoTextImage">{textImage}</div>}
          <div className="Admin_Auth_authBlock">
            <div className="Admin_Auth_authTitle">
              <FiLogIn className="Admin_Auth_authTitleIcon" />
              <div className="Admin_Auth_authTitleText">{authTitle}</div>
            </div>

            <form className="Admin_Auth_AuthForm" onSubmit={onsubmit}>
              {authFields.map((itemField, indexField) => {
                switch (itemField.type) {
                  case "text":
                    return (
                      <div className="Admin_Auth_itemField" key={indexField}>
                        <label
                          htmlFor="username"
                          className="Admin_Auth_itemFieldLabel"
                        >
                          {itemField.label}
                        </label>
                        <Input
                          placeholder={itemField.placeholder ?? ""}
                          value={itemField.value}
                          id="username"
                          type="text"
                          name="username"
                          autoComplete="username"
                          onChange={(event) => {
                            if (typeof itemField.setField === "function") {
                              itemField.setField(event.target.value);
                            }
                          }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              onsubmit();
                            }
                          }}
                        />
                        {itemField.error && (
                          <div className="Admin_Auth_itemFieldError">
                            {itemField.error}
                          </div>
                        )}
                      </div>
                    );
                  case "password":
                    return (
                      <div className="Admin_Auth_itemField" key={indexField}>
                        <label
                          htmlFor="password"
                          className="Admin_Auth_itemFieldLabel"
                        >
                          {itemField.label}
                        </label>
                        <Input.Password
                          placeholder={itemField.placeholder ?? ""}
                          id="password"
                          value={itemField.value}
                          type="password"
                          name="password"
                          autoComplete="current-password"
                          iconRender={(visible) =>
                            visible ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                              ></FontAwesomeIcon>
                            ) : (
                              <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            )
                          }
                          onChange={(event) => {
                            if (typeof itemField.setField === "function") {
                              itemField.setField(event.target.value);
                            }
                          }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              onsubmit();
                            }
                          }}
                        />
                        {itemField.error && (
                          <div className="Admin_Auth_itemFieldError">
                            {itemField.error}
                          </div>
                        )}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
              <div className="Admin_Auth_checkbox"> { /* Inicio, adicionado Belini */}
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleCheckboxChange}
                  />
                  Expirar Sessão após 15 minutos.
                </label>
              </div> { /* Fim, adicionado Belini */}
            </form>
            <Button
              className="Admin_Auth_authSubmit"
              onClick={() => {
                if (typeof onsubmit === "function") {
                  onsubmit();
                }
              }}
            >
              {authSubmit}
            </Button>
            {successMessage && (
              <div className="Admin_Auth_successMessage">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="Admin_Auth_errorMessage">
                <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
              </div>
            )}
          </div>
          <div className="Admin_MediaIcons">
            <a
              href="https://www.facebook.com/pagmaq?mibextid=9R9pXO"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={FacebookImg} alt="Facebook" className="Admin_Auth_SocialIcon" />
            </a>
            <a
              href="https://instagram.com/br.pagmaq?igshid=YzAwZjE1ZTI0Zg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={InstagramImg} alt="Instagram" className="Admin_Auth_SocialIcon" />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=5537920007857&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={WhatsappImg} alt="Whatsapp" className="Admin_Auth_SocialIcon" />
            </a>
          </div>


        </Col>

        <Col xs={24} md={14} lg={14} xl={14} className="Admin_Auth_AuthImage">
          {authImage && (
            <img className="Admin_Auth_AuthImage" src={authImage} alt="auth" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Auth;

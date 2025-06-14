import "./SignIn.css";
import axios from "axios";
import Auth from "../Auth/Auth";
import React, { useContext, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import signin from "../../../assets/images/cliente_sign_in.png";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const initialDataSignIn = {
  email: "",
  password: "",
};

const initErrorField = {
  email: undefined,
  password: undefined,
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const SignIn = (props) => {
  const { setDataUser, loading, notiMessage, setNotiMessage } =
    useContext(AuthContext);
  let navigate = useNavigate();

  const [dataAuth, setDataSingUp] = useState({ ...initialDataSignIn });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorField, setErrorField] = useState({ ...initErrorField });
  const [isLoading, setIsLoading] = useState(false);

  const onsubmit = () => {
    let dataErrorField = {};
    if (dataAuth.email.trim() === "") {
      dataErrorField = {
        ...dataErrorField,
        email: "Email obrigatório.",
      };
    } else if (!validateEmail(dataAuth.email.trim())) {
      dataErrorField = {
        ...dataErrorField,
        email: "Email inválido.",
      };
    }
    if (dataAuth.password.trim() === "") {
      dataErrorField = {
        ...dataErrorField,
        password: "Senha obrigatória",
      };
    } else if (dataAuth.password.trim().length < 6) {
      dataErrorField = {
        ...dataErrorField,
        password: "Senha tem que ter no mínimo 6 dígitos.",
      };
    }

    setSuccess(false);
    if (Object.keys(dataErrorField).length === 0) {
      setIsLoading(true);
      setError(null);
      const RememberMe = localStorage.getItem("rememberMe") === "true"; //Lê o estado da checkbox, adicionado BELINI

      // Adicionando logs para verificar dados de login
      console.log("Email:", dataAuth.email);
      console.log("Password:", dataAuth.password);
      console.log("RememberMe:", RememberMe);

      axios
        .post(`${process.env.REACT_APP_SERVIDOR}/login-cliente`, {
          senha: dataAuth.password,
          email: dataAuth.email.trim(),
          RememberMe: RememberMe ? 1 : 0, // Converte booleano para número, Adicionado BELINI
        })
        .then((res) => {
          console.log("Resposta do backend:", res); // Adicionado BELINI
          if (res.status === 200) {
            setIsLoading(false);
            setSuccess(true);
            setDataSingUp({
              ...initialDataSignIn,
            });
            setDataUser({
              ...res.data,
            });
            navigate("/dashboard-maquinas");
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error("Erro ao fazer login:", err); // Adicionado BELINI
          setIsLoading(false);
          if (err.response.status === 500) {
            setError(
              'Usuário já existe, <a target="_blank" href=' +
              "/forgot-password" +
              ">esqueceu sua senha<a/>?"
            );
          } else {
            setError(
              "Error: " + (err.response?.data?.error ?? "")
            );
          }
        });
    } else {
      setErrorField((prev) => {
        return {
          ...prev,
          ...dataErrorField,
        };
      });
    }
  };

  return (
    <>
      <NotificationContainer />
      {isLoading && <LoadingAction />}
      <Auth
        authTitle={"Login"}
        authDescription={"Preencha com e-mail e senha."}
        authFields={[
          {
            label: "E-mail",
            placeholder: "Digite seu e-mail",
            name: "email",
            value: dataAuth?.email ?? "",
            type: "text",
            setField: (value) => {
              setDataSingUp((prev) => ({
                ...prev,
                email: value,
              }));
              setErrorField((prev) => ({
                ...prev,
                email: undefined,
              }));
            },
            error: errorField?.email ?? "",
          },
          {
            label: "Senha",
            placeholder: "Digite sua senha",
            name: "password",
            value: dataAuth?.password ?? "",
            type: "password",
            setField: (value) => {
              setDataSingUp((prev) => ({
                ...prev,
                password: value,
              }));
              setErrorField((prev) => ({
                ...prev,
                password: undefined,
              }));
            },
            error: errorField?.password ?? "",
          },
        ]}
        authSubmit={"Entrar"}
        textImage={""}
        authImage={signin}
        onsubmit={() => {
          onsubmit();
        }}
        successMessage={success ? "Usuário cadastrado com sucesso!" : ""}
        errorMessage={error ?? ""}
        isSignIn={true}
      />
    </>
  );
};

export default SignIn;

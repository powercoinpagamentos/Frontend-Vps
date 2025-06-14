
// ESTE AQUI É DE CLIENTE E NÃO É USADO

/*
import React, { useContext, useState } from "react";
import { Button, Input } from "antd";
import "./AddMachine.css";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import question_icon from "../../../assets/images/question.png";

const AddMachine = (props) => {
  const { authInfo, setDataUser, setNotiMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const [data, setData] = useState({
    nome: "",
    descricao: "",
    valorDoPix: "",
    store_id: "",
    valorDoPulso: "1",
    pulsotentativa: "2", // Pelucia
    valpelucia: "10", // Pelucia
    limitetrava: "40", // Pelucia
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => {
      let errorsTemp = { ...prev };
      delete errorsTemp[name];
      return errorsTemp;
    });
  };

  const onSave = () => {
    //  check require

    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }

    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }

    if (data.valorDoPulso < 1) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório 01";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          nome: data.nome,
          descricao: data.descricao,
          valorDoPix: data.valorDoPix,
          valorDoPulso: data.valorDoPulso,
          store_id: String(data.store_id),
          valpelucia: Number(data.valpelucia), // Pelucia
          pulsotentativa: Number(data.pulsotentativa), // Pelucia
          limitetrava: Number(data.limitetrava), // Pelucia
        },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        navigate("/dashboard-maquinas");
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "Sua sessão expirou, faça login novamente.",
          });
          setDataUser(null);
        } else if (err.response.status === 400) {
          setNotiMessage({
            type: "error",
            message: "Já existe uma máquina com esse nome",
          });
          setErrors((prev) => ({
            ...prev,
            nome: "Já existe uma máquina com esse nome",
          }));
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu",
          });
        }
      });
  };
  return (
    <>
      {isLoading && <LoadingAction />}
      <div className="AddMachine_container">
        <div className="AddMachine_header">
          <div className="AddMachine_header_title">Add Máquina</div>
          <Link
            className="AddMachine_header_back"
            to={"/dashboard-maquinas"}
          >
            VOLTAR
          </Link>
        </div>
        <div className="AddMachine_content">
          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="nome">
              Nome:
            </label>
            <Input
              placeholder={"Máquina do Fulano de Tal"}
              value={data.nome}
              id="nome"
              type="text"
              name="nome"
              autoComplete="nome"
              onChange={(event) => {
                handleChange("nome", event.target.value);
              }}
              className={`${!!errors.nome ? "AddMachine_inputError" : ""}`}
            />
            {errors.nome && (
              <div className="AddMachine_itemFieldError">{errors.nome}</div>
            )}
          </div>
          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="descricao">
              Descricão:
            </label>
            <Input
              placeholder={"Está no Endereço Tal"}
              value={data.descricao}
              id="descricao"
              type="text"
              name="descricao"
              autoComplete="descricao"
              onChange={(event) => {
                handleChange("descricao", event.target.value);
              }}
              className={`${!!errors.descricao ? "AddMachine_inputError" : ""}`}
            />
            {errors.descricao && (
              <div className="AddMachine_itemFieldError">
                {errors.descricao}
              </div>
            )}
          </div>

          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="store_id">
              Store_id:
            </label>
            <Button
              className="EditPagamentos_header_HelpPage"
              onClick={() => {
                navigate("/help-page-store_id", {
                  state: { redirect_url: `/adicionar-maquina` },
                });
              }}
              disabled={isLoading}
            >
              <img
                className="Edit_Pagamento_Icon"
                src={question_icon}
                alt="question icon"
              />
            </Button>
            <Input
              placeholder={"12345678"}
              value={data.store_id}
              id="store_id"
              name="store_id"
              min={0}
              autoComplete="store_id"
              onChange={(event) => {
                handleChange("store_id", event.target.value);
              }}
              className={`${!!errors.store_id ? "AddMachine_inputError" : ""}`}
            />
            {errors.store_id && (
              <div className="AddMachine_itemFieldError">{errors.store_id}</div>
            )}
          </div>

          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="valorDoPulso">
              Valor em Reais para dar 01 Pulso:
            </label>
            <Input
              placeholder={"1"}
              value={data.valorDoPulso}
              id="valorDoPulso"
              type="number"
              name="valorDoPulso"
              autoComplete="valorDoPulso"
              onChange={(event) => {
                handleChange("valorDoPulso", event.target.value);
              }}
              className={`${!!errors.valorDoPulso ? "AddMachine_inputError" : ""
                }`}
            />
            {errors.valorDoPulso && (
              <div className="AddMachine_itemFieldError">
                {errors.valorDoPulso}
              </div>
            )}
          </div>

          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="pulsotentativa">
              Valor em Reais para 01 Tentativa:
            </label>
            <Input
              placeholder={"2"}
              value={data.pulsotentativa}
              id="pulsotentativa"
              type="number"
              name="pulsotentativa"
              autoComplete="pulsotentativa"
              onChange={(event) => {
                handleChange("pulsotentativa", event.target.value);
              }}
              className={`${!!errors.pulsotentativa ? "AddMachine_inputError" : ""
                }`}
            />
            {errors.pulsotentativa && (
              <div className="AddMachine_itemFieldError">
                {errors.pulsotentativa}
              </div>
            )}
          </div>

          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="valpelucia">
              Valor em Reais Da Pelúcia:
            </label>
            <Input
              placeholder={"10"}
              value={data.valpelucia}
              id="valpelucia"
              type="number"
              name="valpelucia"
              autoComplete="valpelucia"
              onChange={(event) => {
                handleChange("valpelucia", event.target.value);
              }}
              className={`${!!errors.valpelucia ? "AddMachine_inputError" : ""
                }`}
            />
            {errors.valpelucia && (
              <div className="AddMachine_itemFieldError">
                {errors.valpelucia}
              </div>
            )}
          </div>

          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="limitetrava">
              Limite da Trava:
            </label>
            <Input
              placeholder={"40"}
              value={data.limitetrava}
              id="limitetrava"
              type="number"
              name="limitetrava"
              autoComplete="limitetrava"
              onChange={(event) => {
                handleChange("limitetrava", event.target.value);
              }}
              className={`${!!errors.limitetrava ? "AddMachine_inputError" : ""
                }`}
            />
            {errors.limitetrava && (
              <div className="AddMachine_itemFieldError">
                {errors.limitetrava}
              </div>
            )}
          </div>

          <Button
            className="AddMachine_saveBtn"
            onClick={() => {
              if (!isLoading) onSave();
            }}
            disabled={isLoading}
          >
            SALVAR
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddMachine;
*/
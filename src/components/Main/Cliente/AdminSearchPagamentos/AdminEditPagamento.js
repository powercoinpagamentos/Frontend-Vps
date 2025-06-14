import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./AdminEditPagamento.css";
import { Button, Input, DatePicker } from "antd"; // alterado BELINI
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import question_icon from "../../../../assets/images/question.png";
import moment from "moment"; // adicionado BELINI

const AdminEditPagamento = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nome: localStorage.getItem(`Textonome`) ?? "",
    descricao:localStorage.getItem(`Textodescricao`) ?? "",
    valpelucia: localStorage.getItem(`Valorpelucia`) ?? 20,
    store_id: localStorage.getItem(`Numerostoryid`) ?? "",
    idmaquina: localStorage.getItem(`Numeromaquina`) ?? "",
    valorDoPulso: localStorage.getItem(`Valorcredito`) ?? 1,
    limitetrava: localStorage.getItem(`Valortrava`) ?? 40,
    pulsotentativa: localStorage.getItem(`Valortentativa`) ?? 2,
    estoque: localStorage.getItem(`Valorestoque`) ?? 100,
    versaointerface: localStorage.getItem(`interfaceversao`) ?? "0.0.0", 
  });

  const { maquinaInfos, clienteInfo } = location.state;

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false); 

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

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
    // check require
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }

    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }

    if (data.valorDoPulso < 1) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório 03";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina`,
        {
          id,
          nome: data.nome,
          descricao: data.descricao,
          estoque: Number(data.estoque),
          store_id: String(data.store_id),
          idmaquina: data.idmaquina,
          valorDoPulso: data.valorDoPulso,
          valpelucia: Number(data.valpelucia), // Pelucia
          pulsotentativa: Number(data.pulsotentativa), // Pelucia
          limitetrava: Number(data.limitetrava), // Pelucia
          versaointerface: data.versaointerface,
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
        navigate(`/cliente-maquinas/${clienteInfo.id}`, {
          state: location.state.clienteInfo,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "Sua sessão expirou, faça login novamente.",
          });
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
    <div className="Admin_PagamentosSearch_container">
      {isLoading && <LoadingAction />}
  
      <div className="Admin_PagamentosSearch_header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px" }}>
        
        <Button
          className="Admin_EditPagamentos_header_back"
          onClick={() => {
            navigate(`/cliente-maquinas/pagamentos/${id}`, {
              state: location.state,
            });
          }}
          style={{
            backgroundColor: "transparent",
            color: "#333",
            border: "1px solid #333",
            borderRadius: "5px",
            padding: "8px 16px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span>VOLTAR</span>
        </Button>
  
        <span
        className="textoPosVoltar"
        style={{
          fontSize: "18px", // Aumenta o tamanho da fonte
          color: "#333",
          textAlign: "right",
          marginLeft: "auto",
        }}
      >
        ID: {id} - VERSÃO: {data.versaointerface}
      </span>

    </div>

      <div className="Admin_Update_Pagamento_content">

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="nome"
          >
            Nome:
          </label>
          <Input
           //  placeholder={"Máquina do Fulano de Tal"}
            value={data.nome}
            id="nome"
            type="text"
            name="nome"
            autoComplete="nome"
            onChange={(event) => {
              handleChange("nome", event.target.value);
            }}
            className={`${!!errors.nome ? "Admin_Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.nome && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.nome}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="descricao"
          >
            Descricão:
          </label>
          <Input
           //  placeholder={"Está no Endereço Tal"}
            value={data.descricao} // Retira a data da descrição - BELINI
            id="descricao"
            type="text"
            name="descricao"
            autoComplete="descricao"
            onChange={(event) => {
              handleChange("descricao", event.target.value);
            }}
            className={`${!!errors.descricao ? "Admin_Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.descricao && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.descricao}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="store_id"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span>Store_id:</span>
            <Button
              className="Admin_EditPagamentos_header_HelpPage"
              onClick={() => {
                navigate("/help-page-store_id", {
                  state: {
                    ...location.state,
                    redirect_url: `/cliente-maquinas/edit-pagamento-adm/${id}`,
                  },
                });
              }}
              disabled={isLoading}
            >
              <img
                className="Admin_Edit_Pagamento_Icon"
                src={question_icon}
                alt="question icon"
              />
            </Button>
          </label>
          <Input
            // placeholder={"12345678"}
            value={data.store_id}
            id="store_id"
            name="store_id"
            min={0}
            autoComplete="store_id"
            onChange={(event) => {
              handleChange("store_id", event.target.value);
            }}
            className={`${!!errors.store_id ? "Admin_Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.store_id && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.store_id}
            </div>
          )}
        </div>



        <div className="Admin_Update_itemField">
          <label className="Admin_Update_itemFieldLabel" htmlFor="idmaquina">
            Alterar ID da máquina:
          </label>
          <Input
            // placeholder={"1"}
            value={data.idmaquina}
            id="idmaquina"
            type="text"
            name="idmaquina"
            autoComplete="idmaquina"
            onChange={(event) => {
              handleChange("idmaquina", event.target.value);
            }}
            className={`${!!errors.idmaquina ? "Admin_Update_inputError" : ""
              }`}
          />
          {errors.idmaquina && (
            <div className="Admin_Update_itemFieldError">
              {errors.idmaquina}
            </div>
          )}
        </div>



        <div className="Admin_Update_itemField">
          <label className="Admin_Update_itemFieldLabel" htmlFor="valorDoPulso">
            Valor em Reais para dar 01 Pulso:
          </label>
          <Input
            // placeholder={"1"}
            value={data.valorDoPulso}
            id="valorDoPulso"
            type="number"
            name="valorDoPulso"
            autoComplete="valorDoPulso"
            onChange={(event) => {
              handleChange("valorDoPulso", event.target.value);
            }}
            className={`${!!errors.valorDoPulso ? "Admin_Update_inputError" : ""
              }`}
          />
          {errors.valorDoPulso && (
            <div className="Admin_Update_itemFieldError">
              {errors.valorDoPulso}
            </div>
          )}
        </div>

        <div className="Admin_Update_itemField">
          <label className="Admin_Update_itemFieldLabel" htmlFor="pulsotentativa">
            Valor em Reais para 01 Tentativa:
          </label>
          <Input
            // placeholder={"2"}
            value={data.pulsotentativa}
            id="pulsotentativa"
            type="number"
            name="pulsotentativa"
            autoComplete="pulsotentativa"
            onChange={(event) => {
              handleChange("pulsotentativa", event.target.value);
            }}
            className={`${!!errors.pulsotentativa ? "Admin_Update_inputError" : ""
              }`}
          />
          {errors.pulsotentativa && (
            <div className="Admin_Update_itemFieldError">
              {errors.pulsotentativa}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label className="Admin_Update_Pagamento_itemFieldLabel" htmlFor="valpelucia">
            Valor em Reais Da Pelúcia:
          </label>
          <Input
           //  placeholder={"20"}
            value={data.valpelucia}
            id="valpelucia"
            type="number"
            name="valpelucia"
            autoComplete="valpelucia"
            onChange={(event) => {
              handleChange("valpelucia", event.target.value);
            }}
            className={`${!!errors.valpelucia ? "Admin_Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.valpelucia && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.valpelucia}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label className="Admin_Update_Pagamento_itemFieldLabel" htmlFor="limitetrava">
            Limite da Trava:
          </label>
          <Input
            // placeholder={"40"}
            value={data.limitetrava}
            id="limitetrava"
            type="number"
            name="limitetrava"
            autoComplete="limitetrava"
            onChange={(event) => {
              handleChange("limitetrava", event.target.value);
            }}
            className={`${!!errors.limitetrava ? "Admin_Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.limitetrava && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.limitetrava}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="estoque"
          >
            Estoque:
          </label>
          <Input
            // placeholder={"100"}
            value={data.estoque}
            id="estoque"
            type="number"
            name="estoque"
            autoComplete="estoque"
            onChange={(event) => {
              handleChange("estoque", event.target.value);
            }}
            className={`${!!errors.estoque ? "Admin_Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.estoque && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.estoque}
            </div>
          )}
        </div>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
        <Button
          className="Admin_Update_Pagamento_deleteBtn"
          onClick={() => {
            navigate(`/cliente-maquinas/delete-pagamentos-adm/${id}`, {
              state: location.state,
            });
          }}
          disabled={isLoading}
        >
          EXCLUIR MÁQUINA
        </Button>
      </div>
    </div>
  );
};

export default AdminEditPagamento;

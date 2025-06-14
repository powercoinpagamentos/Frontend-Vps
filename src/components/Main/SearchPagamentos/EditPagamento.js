import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./EditPagamento.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import question_icon from "../../../assets/images/question.png";

const EditPagamento = (props) => {
  const location = useLocation();
  
  let navigate = useNavigate();

  const maquinaInfos = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nome: localStorage.getItem(`Textonome`) ?? "",
    descricao:localStorage.getItem(`Textodescricao`) ?? "",
    valpelucia: localStorage.getItem(`Valorpelucia`) ?? 20,
    valorDoPulso: localStorage.getItem(`Valorcredito`) ?? 1,
    limitetrava: localStorage.getItem(`Valortrava`) ?? 40,
    pulsotentativa: localStorage.getItem(`Valortentativa`) ?? 2,
    estoque: localStorage.getItem(`Valorestoque`) ?? 100,
  });
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();
  // 
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

    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }

    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }

    if (data.valorDoPulso < 1) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório 04";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          id,
          nome: data.nome,
          descricao: data.descricao,
          estoque: Number(data.estoque),
          valorDoPulso: data.valorDoPulso,
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
        navigate(`/dashboard-maquinas`);
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
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">EDITAR MÁQUINA</div>
        </div>

        <Button
          className="EditPagamentos_header_back"
          onClick={() => {
            navigate(`/pagamentos/${id}`, {
              state: location.state,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <div className="Update_Pagamento_content">
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="nome">
            Nome:
          </label>
          <Input
            // placeholder={"Máquina do Fulano de Tal"}
            value={data.nome}
            id="nome"
            type="text"
            name="nome"
            autoComplete="nome"
            onChange={(event) => {
              handleChange("nome", event.target.value);
            }}
            className={`${!!errors.nome ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Update_Pagamento_itemFieldError">{errors.nome}</div>
          )}
        </div>
        <div className="Update_Pagamento_itemField">
          <label
            className="Update_Pagamento_itemFieldLabel"
            htmlFor="descricao"
          >
            Descricão:
          </label>
          <Input
            // placeholder={"Está no Endereço Tal"}
            value={data.descricao}
            id="descricao"
            type="text"
            name="descricao"
            autoComplete="descricao"
            onChange={(event) => {
              handleChange("descricao", event.target.value);
            }}
            className={`${!!errors.descricao ? "Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.descricao && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.descricao}
            </div>
          )}
        </div>
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="valorDoPulso">
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
            className={`${!!errors.valorDoPulso ? "Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.valorDoPulso && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.valorDoPulso}
            </div>
          )}
        </div>
 
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="pulsotentativa">
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
            className={`${!!errors.pulsotentativa ? "Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.pulsotentativa && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.pulsotentativa}
            </div>
          )}
        </div>

        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="valpelucia">
            Valor em Reais Da Pelúcia:
          </label>
          <Input
            // placeholder={"10"}
            value={data.valpelucia}
            id="valpelucia"
            type="number"
            name="valpelucia"
            autoComplete="valpelucia"
            onChange={(event) => {
              handleChange("valpelucia", event.target.value);
            }}
            className={`${!!errors.valpelucia ? "Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.valpelucia && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.valpelucia}
            </div>
          )}
        </div>

        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="limitetrava">
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
            className={`${!!errors.limitetrava ? "Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.limitetrava && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.limitetrava}
            </div>
          )}
        </div>

        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="estoque">
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
            className={`${!!errors.estoque ? "Update_Pagamento_inputError" : ""
              }`}
          />
          {errors.estoque && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.estoque}
            </div>
          )}
        </div>
        <Button
          className="Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
      </div>
    </div>
  );
};

export default EditPagamento;
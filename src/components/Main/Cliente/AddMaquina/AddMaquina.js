import React, { useContext, useState } from "react";
import { Button, Input } from "antd";
import "./AddMaquina.css";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const AddMaquina = (props) => {
  const { authInfo, setDataUser, setNotiMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { maquinaInfos, clienteInfo } = location.state;

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const [data, setData] = useState({
    nome: "",
    descricao: "",
    valorDoPix: "",
    store_id: "",
    valorDoPulso: "1",
    pulsotentativa: "2",
    estoque: "100",
    valpelucia: "20", // Pelucia
    limitetrava: "40", // Pelucia
    quantidade: "1", // Número de máquinas a serem criadas
    numerar: "1", //  Número inicial das novas máquinas
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

  const onSave = async () => {
    // Check for required fields
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }
    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }
    if (data.valorDoPulso < 1) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório 02";
    }
  
    if (data.store_id.trim() === "") {
      errorsTemp.store_id = "Este campo é obrigatório";
    }
  
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }
  
    setIsLoading(true);
  
    const quantidade = parseInt(data.quantidade, 10);
    let numerar = parseInt(data.numerar, 10); // valor inicial para numerar
  
    // Logando a sequência de numeração
    console.log(`Iniciando a criação de ${quantidade} máquinas com a numeração inicial: ${numerar}`);
  
    for (let i = 0; i < quantidade; i++) {
      const nomeMaquina = `${data.nome} ${numerar}`;
      const descricaoMaquina = `${data.descricao} ${numerar}`;
  
      // Logando o nome e descrição antes de enviar
      // console.log(`Criando máquina ${i + 1} de ${quantidade}:`);
      // console.log(`Nome: ${nomeMaquina}`);
      //  console.log(`Descrição: ${descricaoMaquina}`);
  
      try {
        // Esperando uma requisição ser concluída antes de seguir para a próxima
        await axios.post(
          `${process.env.REACT_APP_SERVIDOR}/maquina`,
          {
            clienteId: id,
            nome: nomeMaquina,
            descricao: descricaoMaquina,
            valorDoPulso: data.valorDoPulso,
            valorDoPix: data.valorDoPix,
            store_id: data.store_id,
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
        );
        // Logando sucesso após cada requisição
        // console.log(`Máquina ${numerar} criada com sucesso`);
        numerar += 1; // Incrementa numerar após cada máquina
      } catch (err) {
        console.error(`Erro ao criar máquina ${numerar}: ${err.response?.data?.error || err.message}`);
        break; // Para caso haja erro, você pode decidir se quer parar a criação
      }
    }
  
    setIsLoading(false);
    setNotiMessage("Máquinas criadas com sucesso!");
    setTimeout(() => {
      navigate(`/cliente-maquinas/${id}`, {
        state: location.state,
      });
    }, 1000);
  };
  
  return (
    <>
      {isLoading && <LoadingAction />}
      <div className="AddMaquina_container">
        <div className="AddMaquina_header">
          <div className="AddMaquina_header_title">Adicionar Máquina</div>

          <Button
            className="AddMaquina_header_back"
            onClick={() =>
              navigate(`/cliente-maquinas/${id}`, {
                state: location.state,
              })
            }
          >
            VOLTAR
          </Button>
        </div>

        <div className="AddMaquina_content">
          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="nome">
              Nome:
            </label>
            <Input
              placeholder={"Máquina de alguém"}
              value={data.nome}
              id="nome"
              type="text"
              name="nome"
              autoComplete="nome"
              onChange={(event) => handleChange("nome", event.target.value)}
              className={`${!!errors.nome ? "AddMaquina_inputError" : ""}`}
            />
            {errors.nome && (
              <div className="AddMaquina_itemFieldError">{errors.nome}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="descricao">
              Descricao:
            </label>
            <Input
              placeholder={"Está em algum lugar"}
              value={data.descricao}
              id="descricao"
              type="text"
              name="descricao"
              autoComplete="descricao"
              onChange={(event) => handleChange("descricao", event.target.value)}
              className={`${!!errors.descricao ? "AddMaquina_inputError" : ""}`}
            />
            {errors.descricao && (
              <div className="AddMaquina_itemFieldError">{errors.descricao}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="store_id">
              Store_id:
            </label>
            <Input
              placeholder={"12345678"}
              value={data.store_id}
              id="store_id"
              type="number"
              name="store_id"
              autoComplete="store_id"
              onChange={(event) => handleChange("store_id", event.target.value)}
              className={`${!!errors.store_id ? "AddMaquina_inputError" : ""}`}
            />
            {errors.store_id && (
              <div className="AddMaquina_itemFieldError">{errors.store_id}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="valorDoPulso">
              Valor em Reais para dar 01 Pulso:
            </label>
            <Input
              placeholder={"1"}
              value={data.valorDoPulso}
              id="valorDoPulso"
              type="number"
              name="valorDoPulso"
              autoComplete="valorDoPulso"
              onChange={(event) => handleChange("valorDoPulso", event.target.value)}
              className={`${!!errors.valorDoPulso ? "AddMaquina_inputError" : ""}`}
            />
            {errors.valorDoPulso && (
              <div className="AddMaquina_itemFieldError">{errors.valorDoPulso}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
          <label className="AddMaquina_itemFieldLabel" htmlFor="pulsotentativa">
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
            className={`${!!errors.pulsotentativa ? "AddMaquina_inputError" : ""
              }`}
          />
          {errors.pulsotentativa && (
            <div className="AddMaquina_itemFieldError">
              {errors.pulsotentativa}
            </div>
          )}
        </div>

        <div className="AddMaquina_itemField">
          <label className="AddMaquina_itemFieldLabel" htmlFor="valpelucia">
            Valor em Reais Da Pelúcia:
          </label>
          <Input
            placeholder={"20"}
            value={data.valpelucia}
            id="valpelucia"
            type="number"
            name="valpelucia"
            autoComplete="valpelucia"
            onChange={(event) => {
              handleChange("valpelucia", event.target.value);
            }}
            className={`${!!errors.valpelucia ? "AddMaquina_inputError" : ""
              }`}
          />
          {errors.valpelucia && (
            <div className="AddMaquina_itemFieldError">
              {errors.valpelucia}
            </div>
          )}
        </div>

        <div className="AddMaquina_itemField">
          <label className="AddMaquina_itemFieldLabel" htmlFor="limitetrava">
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
            className={`${!!errors.limitetrava ? "AddMaquina_inputError" : ""
              }`}
          />
          {errors.limitetrava && (
            <div className="AddMaquina_itemFieldError">
              {errors.limitetrava}
            </div>
          )}
        </div>

        <div className="AddMaquina_itemField">
          <label
            className="AddMaquina_itemFieldLabel"
            htmlFor="estoque"
          >
            Estoque:
          </label>
          <Input
            placeholder={"100"}
            value={data.estoque}
            id="estoque"
            type="number"
            name="estoque"
            autoComplete="estoque"
            onChange={(event) => {
              handleChange("estoque", event.target.value);
            }}
            className={`${!!errors.estoque ? "AddMaquina_inputError" : ""
              }`}
          />
          {errors.estoque && (
            <div className="AddMaquina_itemFieldError">
              {errors.estoque}
            </div>
          )}
        </div>
           
          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="quantidade">
              Quantidade de máquinas para criar de uma vez:
            </label>
            <Input
              placeholder={"1"}
              value={data.quantidade}
              id="quantidade"
              type="number"
              name="quantidade"
              autoComplete="quantidade"
              onChange={(event) => handleChange("quantidade", event.target.value)}
              className={`${!!errors.quantidade ? "AddMaquina_inputError" : ""}`}
            />
            {errors.quantidade && (
              <div className="AddMaquina_itemFieldError">{errors.quantidade}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="numerar">
              Numero inicial para novas máquinas:
            </label>
            <Input
              placeholder={"1"}
              value={data.numerar}
              id="numerar"
              type="number"
              name="numerar"
              autoComplete="numerar"
              onChange={(event) => handleChange("numerar", event.target.value)}
              className={`${!!errors.numerar ? "AddMaquina_inputError" : ""}`}
            />
            {errors.numerar && (
              <div className="AddMaquina_itemFieldError">{errors.numerar}</div>
            )}
          </div>

          <Button
            className="AddMaquina_saveBtn"
            onClick={() => {
              onSave();
            }}
          >
            Salvar
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddMaquina;

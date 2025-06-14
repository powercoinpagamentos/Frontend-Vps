import React, { useContext, useState, useEffect } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./EditCliente.css";
import { Button, Input, DatePicker, Tooltip } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import question_icon from "../../../../assets/images/question.png";
import moment from "moment";

const EditCliente = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const token = authInfo?.dataUser?.token;

  const { id } = location.state || {};
 // console.log("ID do cliente recebido:", id);

  const [data, setData] = useState({}); // Estado inicial para os dados
  const [errors, setErrors] = useState({}); // Estado inicial para erros
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dateFormat = "YYYY-MM-DD";
  let currentDate = moment();

  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    senha: '',
    mercadoPagoToken: '',
    novaId: '',
    mensalidade: '',
    telefone: '',
    pessoaId: '',
    dataInclusao: '',
    ultimoAcesso: '',
    ativo: true,
    dataVencimento: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVIDOR}/clientes-info/${id}`,
          {
            method: "GET",
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const clienteData = await response.json();

       if (clienteData.dataVencimento) {
        clienteData.dataVencimento = moment.utc(clienteData.dataVencimento).format("YYYY-MM-DD");
        console.log("Data de Vencimento Convertida UTC:", clienteData.dataVencimento);
      }
        setCliente(clienteData);
        setData(clienteData);  

      } catch (err) {
        console.error("Erro na busca do cliente:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData(); 
  }, [id]); 
  
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

  const onSave = () => {// check require
    
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    const adjustedDateVencimento = moment(data.dataVencimento).startOf('day').utc().toDate();

    let body = {
      nome: data.nome,
      dataVencimento: adjustedDateVencimento,
      email: data.email,
      senha: data.senha,
      mensalidade: data.mensalidade,
      telefone: data.telefone,
      novaId: data.novaId,
    };

    if (
      data.mercadoPagoToken &&
      data.mercadoPagoToken.toString() !== cliente.mercadoPagoToken.toString()
    )
      body.mercadoPagoToken = data.mercadoPagoToken;

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/alterar-cliente-adm-new/${cliente.id}`,
        body,
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        navigate(`/dashboard-clientes`, {
          state: location.state,
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
            message: "Nome do cliente, email ou ID já existe",
          });
          setErrors((prev) => ({
            ...prev,
            nome: "Nome do cliente, email ou ID já existe",
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
    <div className="Edit_Cliente_container">
      {isLoading && <LoadingAction />}
      <div className="Edit_Cliente_header">
        <div className="Edit_Cliente_header_left">
          <div className="Edit_Cliente_staBlockTitle">Editar Cliente</div>
        </div>

        <Button
          className="Edit_Cliente_header_back"
          onClick={() => {
            navigate(`/cliente-maquinas/${id}`, {
              state: location.state,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <div className="Edit_Cliente_content">

        <div className="Edit_Cliente_itemField">
          <label className="Edit_Cliente_itemFieldLabel" htmlFor="novaId">
            Alterar ID do cliente:
          </label>
          <Input
            value={data.novaId || cliente.id} 
            id="novaId"
            type="text"
            name="novaId"
            autoComplete="novaId"
            onChange={(event) => {
              handleChange("novaId", event.target.value);
            }}
            className={`${!!errors.novaId ? "Edit_Cliente_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Edit_Cliente_itemFieldError">{errors.novaId}</div>
          )}
        </div>

        <div className="Edit_Cliente_itemField">
          <div className="Edit_Cliente_Label_Icon">
            <label
              className="Edit_Cliente_itemFieldLabel"
              htmlFor="mercadoPagoToken"
            >
              Alterar token do cliente
            </label>
            <img
              src={question_icon}
              alt="question icon"
              className="Edit_Cliente_Icon"
              onClick={() =>
                navigate(`/token-help-page`, {
                  state: {
                    redirect_url: `/editar-cliente/${cliente.id}`,
                  },
                })
              }
            />
          </div>

          <Input
            value={data.mercadoPagoToken}
            id="mercadoPagoToken"
            type="text"
            name="mercadoPagoToken"
            autoComplete="mercadoPagoToken"
            onChange={(event) => {
              handleChange("mercadoPagoToken", event.target.value);
            }}
            className={`${!!errors.mercadoPagoToken ? "Edit_Cliente_inputError" : ""
              }`}
          />
          {errors.mercadoPagoToken && (
            <div className="Edit_Cliente_itemFieldError">
              {errors.mercadoPagoToken}
            </div>
          )}
        </div>

        <div className="Edit_Cliente_itemField">
          <label className="Edit_Cliente_itemFieldLabel" htmlFor="nome">
            Alterar nome do cliente:
          </label>
          <Input
            value={data.nome}
            id="nome"
            type="text"
            name="nome"
            autoComplete="nome"
            onChange={(event) => {
              handleChange("nome", event.target.value);
            }}
            className={`${!!errors.nome ? "Edit_Cliente_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Edit_Cliente_itemFieldError">{errors.nome}</div>
          )}
        </div>

        <div className="Edit_Cliente_itemField">
          <label className="Edit_Cliente_itemFieldLabel" htmlFor="email">
            Alterar email do cliente:
          </label>
          <Input
            value={data.email}
            id="email"
            type="text"
            name="email"
            autoComplete="email"
            onChange={(event) => {
              handleChange("email", event.target.value);
            }}
            className={`${!!errors.email ? "Edit_Cliente_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Edit_Cliente_itemFieldError">{errors.email}</div>
          )}
        </div>

        <div className="Edit_Cliente_itemField">
          <label className="Edit_Cliente_itemFieldLabel" htmlFor="senha">
            Alterar senha do cliente:
          </label>
          <Input
            value={data.senha}
            id="senha"
            type="text"
            name="senha"
            autoComplete="senha"
            onChange={(event) => {
              handleChange("senha", event.target.value);
            }}
            className={`${!!errors.senha ? "Edit_Cliente_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Edit_Cliente_itemFieldError">{errors.senha}</div>
          )}
        </div>       

        <div className="Edit_Cliente_itemField">
            <label className="Edit_Cliente_itemFieldLabel" htmlFor="telefone">
            Telefone para enviar mensagens:
            </label>
            <Input           
              value={data.telefone}
              id="telefone"
              type="number"
              name="telefone"
              autoComplete="telefone"
              onChange={(event) => {
                handleChange("telefone", event.target.value);
              }}
              className={`${!!errors.telefone ? "Edit_Cliente_inputError" : ""
                }`}
            />
            {errors.telefone && (
              <div className="Edit_Cliente_itemFieldError">
                {errors.telefone}
              </div>
            )}
          </div>

        <div className="Edit_Cliente_itemField">
            <label className="Edit_Cliente_itemFieldLabel" htmlFor="mensalidade">
            Valor da mensalidade:
            </label>
            <Input
              value={data.mensalidade}
              id="mensalidade"
              type="number"
              name="mensalidade"
              autoComplete="mensalidade"
              onChange={(event) => {
                handleChange("mensalidade", event.target.value);
              }}
              className={`${!!errors.mensalidade ? "Edit_Cliente_inputError" : ""
                }`}
            />
            {errors.mensalidade && (
              <div className="Edit_Cliente_itemFieldError">
                {errors.mensalidade}
              </div>
            )}
          </div>

          <div className="Edit_Cliente_itemField">
          <div className="AddCliente_Label_Icon">
            <label
              className="Edit_Cliente_itemFieldLabel"
              htmlFor="mercadoPagoToken"
            >
              Data de vencimento
            </label>
            <Tooltip title="A data de vencimento do cliente é uma data que após 10 dias é feito a trava das máquinas do cliente para receber pagamentos. Ideal para quem cobra mensalidade, se não definida por padrão colocamos 1 (um) ano. se não quiser usar coloque uma data maior">
              <img
                src={question_icon}
                alt="question icon"
                className="AddCliente_Icon"
              />
            </Tooltip>
          </div>
  <DatePicker
  placeholder={cliente.dataVencimento}
  style={{ color: "black" }}
  className={`custom-datepicker ${
    !!errors.dataVencimento ? "AddCliente_inputError" : ""
  }`}
  defaultValue={data.dataVencimento}
  format={"YYYY-MM-DD"}
  id="dataVencimento"
  name="dataVencimento"
  autoComplete="dataVencimento"
  onChange={(vl, dateString) => {
    handleChange("dataVencimento", dateString);
  }}
/>
{errors.dataVencimento && (
  <div className="AddCliente_itemFieldError">
    {errors.dataVencimento}
  </div>
)}
        </div>

        <Button
          className="Edit_Cliente_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
        <Button
          className="Edit_Cliente_deleteBtn"
          onClick={() => {
            navigate(`/delete-cliente/${id}`, {
              state: location.state,
            });
          }}
          disabled={isLoading}
        >
          EXCLUIR CLIENTE
        </Button>
      </div>
    </div>
  );
};

export default EditCliente;

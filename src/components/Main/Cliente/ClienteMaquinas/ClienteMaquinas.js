import React, { useContext, useEffect, useState } from "react";
import "./ClienteMaquinas.css";
import { Button, Col, Row } from "antd";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import {
  faArrowsRotate,
  faCheckCircle,
  faXmarkCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { AiOutlineEdit, AiOutlinePlusCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";

const ClienteMaquinas = (props) => {
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const { dataUser } = authInfo;

  const location = useLocation();
  const maquinaInfos = location.state;

  let navigate = useNavigate();

  const clienteInfo = location.state;

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const [totalClienteMaquinas, setTotalClienteMaquinas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const copyToClipboard = (text) => {// Copia informações das máquinas para a área de transferência
    navigator.clipboard.writeText(text).then(
      () => {
        setNotiMessage({
          type: "success",
          message:
            "As Id's foram copiadas para área de transferência.",
        });
      },
      (err) => {
        setNotiMessage({
          type: "error",
          message:
            "Erro ao copiar Id's para área de transferência.",
        });
      }
    );
  };

  const handleMachinesData = () => {   //  Cria um Array com informações das máquinas
    const maquinasInfo = totalClienteMaquinas.map(
      (post) => `Máquina: ${post.nome}, ID: ${post.id}`
    );
    const maquinasText = maquinasInfo.join("\n"); 
    console.log("Informações das Máquinas:", maquinasText); 
    copyToClipboard(maquinasText); 
  };

  const handleRefresh = () => { // Atualiza a página do navegador, adicionado BELINI
    window.location.reload();
  };

  useEffect(() => {
    dataData();

    const intervalId = setInterval(() => {
      dataData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const dataData = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/maquinas-adm?id=${id}`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setTotalClienteMaquinas(res.data);
        } else {
          throw new Error();
        }
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
        }
      });
  };

  return (
    <div className="Cliente_Maquinas_container">
      {isLoading && <LoadingAction />}
      <div className="WarningMsgSpan">
        <span>{dataUser.warningMsg}</span>
      </div>

      <div className="Container_atualizar">

        <Button className="adicionar-maquina-button" style={{ margin: "0 15px" }}
          onClick={() =>
            navigate(`/cliente-maquinas/adicionar-maquina-adm/${clienteInfo.id}`, {
              state: location.state,
            })
          }
        >
          <AiOutlinePlusCircle />
          <span>Add Máquina</span>
        </Button>

        <Button className="editar-cliente-button" style={{ margin: "0 15px" }}
          onClick={() =>
            navigate(`/editar-cliente/${clienteInfo.id}`, {
              state: clienteInfo,
            })
          }
        >
          <AiOutlineEdit />
          <span>Editar Cliente</span>
        </Button>

        <Button className="Botao_atualizar" style={{ margin: "0 15px" }} onClick={handleRefresh}> {/* Atualiza a página do navegador, adicionado BELINI */}
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{ marginRight: "5px" }}
          />
          Atualizar
        </Button>

        <Link className="AddCliente_header_back" to={"/dashboard-clientes"}>
          VOLTAR
        </Link>

        <Button
        className="copiar-ids-button"
        onClick={handleMachinesData}
      >
        COPIAR IDs
      </Button>
 
      </div>

      <div className="AddCliente_header">
        <div className="AddCliente_header_title">MÁQUINAS DO CLIENTE  {clienteInfo.nome}</div>
      </div>

      <Row>
        {totalClienteMaquinas.map((post) => (
          <Col className="Cliente_Maquinas_col">
            <div
              onClick={() =>
                navigate(
                  `/cliente-maquinas/pagamentos/${post.id}`,
                  {
                    state: { clienteInfo, maquinaInfos: post },
                  }
                )
              }
            >
              <div className="maquina" key={post.id} onClick={() => null}>

                <div className="maquina-info">
                  {(() => {
                    switch (post.status) {
                      case "ONLINE":
                        return (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={"green"}
                            className="status-icon fa-3x"
                          />
                        );
                      case "OFFLINE":
                        return (
                          <FontAwesomeIcon
                            icon={faXmarkCircle}
                            color={"red"}
                            className="status-icon fa-3x"
                          />
                        );
                      case "PAGAMENTO_RECENTE":
                        return (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={"blue"}
                            className="status-icon fa-3x"
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                  <h2 className="nome">{post.nome}</h2>
                  <h4 className="descricao"> {post.descricao}</h4>
                  <h5 className="status"> {post.status}</h5>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ClienteMaquinas;

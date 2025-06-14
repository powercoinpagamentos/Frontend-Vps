import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { Button, Col, Modal, Row, Table } from "antd";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCheckCircle,
  faXmarkCircle,
  faSignOutAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { AiOutlinePlusCircle } from "react-icons/ai";
import moment from 'moment';

const DashboardFornecedor = (props) => {
  const { setDataUser, loading, authInfo, setNotiMessage } =
    useContext(AuthContext);
  const { dataUser } = authInfo;
  const location = useLocation();
  const maquinaInfos = location.state;
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const premiumExpiration = authInfo?.dataUser?.premiumExpiration ?? null;
  const hasData = !!authInfo?.dataUser?.hasData;
  const [favorites, setFavorites] = useState([]);
  const [meusFits, setMeusFits] = useState(null);
  const [totalCanais, setTotalCanais] = useState(null);
  const [totalFornecedores, setTotalFornecedores] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataCurrentDetail, setDataCurrentDetail] = useState(null);

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
      .get(`${process.env.REACT_APP_SERVIDOR}/maquinas`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setTotalFornecedores(res.data);
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

  const handleMaquinaClick = (id, nome, storeId, pulso, estoque, descricao) => {
    console.log("handleMaquinaClick called with:", { id, nome, storeId, pulso, estoque, descricao });
    const maquinaInfo = { nome, storeId, pulso, estoque, descricao };
    console.log("Navigating to:", `/pagamentos/${id}`, {
      state: maquinaInfo,
    });
    navigate(`/pagamentos/${id}`, {
      state: maquinaInfo,
    });
  };

  const handleLogout = () => {
    setDataUser(null);
    navigate("/");
  };

  return (
    <div className="Dashboard_container">
      {isLoading && <LoadingAction />}
      <div className="WarningMsgSpan">
        <span>{dataUser.warningMsg}</span>
      </div>

      <div className="Container_atualizar">

        <Button className="Botao_atualizar" style={{ margin: "0 15px" }} onClick={handleRefresh}> {/* Atualiza a página do navegador, adicionado BELINI */}
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{ marginRight: "5px" }}
          />
          Atualizar
        </Button>

        <Button //  adicionado BELINI
          className="Cliente_Dashboard_sair"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>SAIR</span>
        </Button>
      </div>

 <div className="Dashboard_staBlockTitle">
  {dataUser?.vencimento && (() => {
    const isVencida = moment().isAfter(moment(dataUser.vencimento));
    return (
      <span
        style={{
          marginLeft: "10px",
          color: isVencida ? "red" : "green",
          fontWeight: "bold",
        }}
      >
        {isVencida
          ? `MENSALIDADE VENCIDA: ${moment(dataUser.vencimento).format("DD/MM/YYYY")}`
          : `VENCIMENTO: ${moment(dataUser.vencimento).format("DD/MM/YYYY")}`}
      </span>
    );
  })()}
</div>

      <Row>
        {totalFornecedores.map((post) => (
          <Col className="Dashboard_col" key={post.id}>
            <div
              className="maquina"
              onClick={() =>
                handleMaquinaClick(
                  post.id,
                  post.nome,
                  post.store_id,
                  post.pulso,
                  post.estoque,
                  post.descricao
                )
              }
            >

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
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardFornecedor;

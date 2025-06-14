import React, { useContext, useEffect, useState } from "react";
import "./ClientesDashboard.css";
import { Button, Col, Row } from "antd";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { format, parseISO } from "date-fns";
import { faSignOutAlt, } from "@fortawesome/free-solid-svg-icons";

const ClientesDashboard = (props) => {
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const { dataUser } = authInfo;
  let navigate = useNavigate();

  const token = authInfo?.dataUser?.token;

  const [totalClientes, setTotalClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {  //  Atualiza a página do navegador, adicionado BELINI
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
      .get(`${process.env.REACT_APP_SERVIDOR}/clientes`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setTotalClientes(res.data);
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

  const handleClienteClick = ({
    id,
    nome,
    email,
    ativo,
    dataInclusao,
    dataVencimento,
    ultimoAcesso,
    mercadoPagoToken,
  }) => {
    const cliente = {
      id,
      nome,
      email,
      ativo,
      dataInclusao,
      dataVencimento,
      ultimoAcesso,
      mercadoPagoToken,
    };
    navigate(`/cliente-maquinas/${id}`, {
      state: cliente,
    });
  };

  const handleLogout = () => {
    setDataUser(null);
    navigate("/admin-sign-in");
  };

  const totalGeralDeMaquinas = totalClientes.reduce((total, post) => total + (post.Maquina?.length || 0), 0); // Total geral de máquinas - BELINI

  return (
    <div className="ClientesDashboard">
      {isLoading && <LoadingAction />}

      <div className="Container_atualizar">
        <Link to={"/novo-cliente"}>
          <Button className="Cliente_Dashboard_addbtn" style={{ margin: "0 15px" }}>
            <AiOutlinePlusCircle />
            <span>Criar novo cliente</span>
          </Button>
        </Link>
        <Button className="Botao_atualizar" style={{ margin: "0 15px" }} onClick={handleRefresh}>
          <FontAwesomeIcon icon={faArrowsRotate} style={{ marginRight: "5px" }} />
          Atualizar
        </Button>
        <Button className="Cliente_Dashboard_sair_admin" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>SAIR</span>
        </Button>
      </div>

      <div className="Cliente_Dashboard_header">
        <div className="Cliente_titulo">
          {totalClientes.length} CLIENTES E {totalClientes.reduce((acc, cliente) => acc + (cliente.Maquina?.length || 0), 0)} MÁQUINAS
        </div>
      </div>

      <div className="Clientes_principal">
        {totalClientes.map((post, index) => (
          <div key={post.id} className="Cliente_coluna">
            <div className="Cliente_click" onClick={() => handleClienteClick(post)}>
              <div className="Cliente_info">
                <h3 className="Cliente_nome">{post.nome}</h3>
                <div className="Cliente_email">{post.email}</div>
              
               <div className="Cliente_maquina">
                  Total de máquinas: {post.Maquina?.length}
                </div>
                <div className="Cliente_footer">
                  <div>
                    Data de Inclusão:{" "}
                    {format(new Date(post.dataInclusao), "dd/MM/yyyy - kk:mm")}
                  </div>
                  <div>
                    Último Acesso:{" "}
                    {post.ultimoAcesso
                      ? format(new Date(post.ultimoAcesso), "dd/MM/yyyy - kk:mm")
                      : "--"}
                  </div>
                  <div>
  {post.dataVencimento && (() => {
    const datadeVencimento = new Date(post.dataVencimento);
    const hoje = new Date();
    const isVencida = hoje > datadeVencimento;

    return (
      <span
        style={{
          color: isVencida ? "red" : "green",
          fontWeight: "bold",
        }}
      >
        {isVencida
          ? `VENCIDO: ${format(datadeVencimento, "dd/MM/yyyy")}`
          : `VENCIMENTO: ${format(datadeVencimento, "dd/MM/yyyy")}`}
      </span>
    );
  })()}
</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );





};

export default ClientesDashboard;
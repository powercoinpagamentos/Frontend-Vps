import React, { useContext, useEffect, useState } from "react";
import "./Relatorio.css";
import { Col, Row, Button } from "antd";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import money_bag from "../../../../assets/images/money_bag.png";
import hand_money from "../../../../assets/images/hand_money.png";
import hand_rateio from "../../../../assets/images/rateio.png"; // Adicionado BELINI
import vazio_icon from "../../../../assets/images/vazio.png";  // Adicionado BELINI
import card from "../../../../assets/images/card.png";
import pix_icon from "../../../../assets/images/pix.png";
import especie_icon from "../../../../assets/images/especie.png";
import estorno_icon from "../../../../assets/images/Estorno.png";
import credito_icon from "../../../../assets/images/credito.png";
import debito_icon from "../../../../assets/images/debito.png";
import entradas_icon from "../../../../assets/images/entradas.png"; // Adicionado BELINI
import saidas_icon from "../../../../assets/images/saidas.png"; // Adicionado BELINI
import saldo_icon from "../../../../assets/images/saldo.png"; // Adicionado BELINI
import moment from "moment";

const Relatorio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { authInfo } = useContext(AuthContext);
  const { dataUser } = authInfo;
  let navigate = useNavigate();
  const location = useLocation();
  const { maquinaInfos, dataInicio, dataFim } = location.state;
  const { id } = useParams();
  const token = authInfo?.dataUser?.token;

  // Eliminadas todas declarações de pagamentos desta parte - BELINI

  // useEffect() desta parte - BELINI

  // Eliminadas todas rotas que eram chamadas aqui e trocadas por apenas leitura do localStorage - BELINI

  function getValidNumber(value) { // Adicionado BELINI
    const number = parseFloat(value);
    return isNaN(number) || number <= 0 ? 0 : number;
  }
  
  const dataInicial = localStorage.getItem(`DataInicial_${id}`); // Lê o que gravou em localStorage - Adicionado BELINI
  const dataFinal = localStorage.getItem(`DataFinal_${id}`); // Lê o que gravou em localStorage - Adicionado BELINI
  const estornos = getValidNumber(localStorage.getItem(`Totalestorno_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const cash = getValidNumber(localStorage.getItem(`Totalcash_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const entradas = getValidNumber(localStorage.getItem(`Totalgeral_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const saidas = getValidNumber(localStorage.getItem(`Totalsaidas_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  // const qtdetentativas = getValidNumber(localStorage.getItem(`Totalqtdetentativas_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  // const saidapelucia = getValidNumber(localStorage.getItem(`TotalsaidaPel_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const saldo = getValidNumber(localStorage.getItem(`Totalsaldo_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const pix = getValidNumber(localStorage.getItem(`TotalPix_${id}`));  // Lê o que gravou em localStorage - Adicionado BELINI
  const credito = getValidNumber(localStorage.getItem(`TotalCredito_${id}`));  // Lê o que gravou em localStorage - Adicionado BELINI
  const debito = getValidNumber(localStorage.getItem(`TotalDebito_${id}`));  // Lê o que gravou em localStorage - Adicionado BELINI
  const taxapix = getValidNumber(localStorage.getItem(`TaxaPix_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const taxacredito = getValidNumber(localStorage.getItem(`TaxaCredito_${id}`)); // Lê o que gravou em localStorage - Adicionado BELINI
  const taxadebito = getValidNumber(localStorage.getItem(`TaxaDebito_${id}`));  // Lê o que gravou em localStorage - Adicionado BELINI

  const Totalestornos = pix + credito + debito + estornos; // Adicionado BELINI
  const Totalvalidado = Totalestornos - estornos; // Adicionado BELINI
  const Totaltaxapix = pix + taxapix; // Adicionado BELINI
  const Totaltaxacredito = credito + taxacredito; // Adicionado BELINI
  const Totaltaxadebito = debito + taxadebito; // Adicionado BELINI
  const Totalonline = pix + debito + credito; // Adicionado BELINI
  const Totaltaxas = taxapix + taxadebito + taxacredito; // Adicionado BELINI

  let Pctvalidado, Pctestornos, Pctcash, Pctsaidas, Pctsaldo, Pctcredito, Pctdebito;
  let Pcttaxapix, Pctpix, Pcttaxacredito, Pcttaxadebito, Pcttaxacash = 0;

  if (estornos > 0) { // Adicionado BELINI
    Pctestornos = (estornos / Totalestornos) * 100;
  } else {
    Pctestornos = 0;
  }
  if (Totalvalidado > 0) { // Adicionado BELINI
    Pctvalidado = (Totalvalidado / Totalestornos) * 100;
  } else {
    Pctvalidado = 0;
  }
  if (cash > 0) {  // Adicionado BELINI
    Pctcash = (cash / entradas) * 100;
  } else {
    Pctcash = 0;
  }
  if (saidas > 0) { // Adicionado BELINI
    Pctsaidas = (saidas / entradas) * 100;
  } else {
    Pctsaidas = 0;
  }
  if (saldo > 0) { // Adicionado BELINI
    Pctsaldo = (saldo / entradas) * 100;
  } else {
    Pctsaldo = 0;
  }
  if (pix > 0) { // Adicionado BELINI
    Pctpix = (pix / entradas) * 100;
  } else {
    Pctpix = 0;
  }
  if (credito > 0) { // Adicionado BELINI
    Pctcredito = (credito / entradas) * 100;
  } else {
    Pctcredito = 0;
  }
  if (debito > 0) { // Adicionado BELINI
    Pctdebito = (debito / entradas) * 100;
  } else {
    Pctdebito = 0;
  }
  if (taxapix > 0) { // Adicionado BELINI
    Pcttaxapix = (taxapix / Totaltaxapix) * 100;
  } else {
    Pcttaxapix = 0;
  }
  if (taxacredito > 0) { // Adicionado BELINI
    Pcttaxacredito = (taxacredito / Totaltaxacredito) * 100;
  } else {
    Pcttaxacredito = 0;
  }
  if (taxadebito > 0) { // Adicionado BELINI
    Pcttaxadebito = (taxadebito / Totaltaxadebito) * 100;
  } else {
    Pcttaxadebito = 0;
  }

  const FormatDate = (dateString) => { // Adicionado BELINI
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '--';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatValue = (value) => { // mostrar apenas 2 casas decimais - BELINI
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const formatInicial = FormatDate(dataInicial); // Adicionado BELINI
  const formatFinal = FormatDate(dataFinal); // Adicionado BELINI

  // console.log("formatInicial", formatInicial)
  //  console.log("formatFinal", formatFinal)

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const body = {
        maquinaId: id,
        dataInicio,
        dataFim,
      };
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // setNotiMessage({type: "error", message: "Recarregando pagina...", });
    }
  };

  return (
    <div>
      {isLoading && <LoadingAction />}
      <div className="Cliente_WarningMsgSpan">
        <span>{dataUser?.warningMsg}</span>
      </div>
      <div className="Relatorio_main">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div className="Relatorio_staBlockTitle">
            <span>Relatório Máquina: {maquinaInfos?.nome} </span>
            <br />
            <span style={{ color: "grey", fontSize: "15px" }}>
              Período de:&nbsp;{formatInicial}&nbsp;até:&nbsp;{formatFinal}
            </span>
          </div>
          <div className="Relatorio_staBlockTitle">
            Gerado em: {moment(new Date()).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
        <Button
          className="Help_Page_header_back"
          onClick={() => {
            navigate(`/pagamentos/${id}`, {
              state: maquinaInfos,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={12} xl={12}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Entradas</div>
              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={especie_icon} alt="Espécie" />
                    Espécie:
                  </Col>
                  <Col span={12}>{formatValue(Pctcash)}%</Col> {/* Alterado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={credito_icon} alt="Crédito" />
                    Crédito:
                  </Col>
                  <Col span={12}>{formatValue(Pctcredito)}%</Col> {/* Alterado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={debito_icon} alt="Débito" />
                    Débito:
                  </Col>
                  <Col span={12}>{formatValue(Pctdebito)}%</Col> {/* Alterado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={pix_icon} alt="PIX" />
                    Pix:
                  </Col>
                  <Col span={12}>{formatValue(Pctpix)}%</Col> {/* Alterado BELINI */}
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_money_icon" src={money_bag} alt="money icon" />
            </div>
          </div>
        </Col>

        <Col xs={24} md={12} lg={12} xl={12}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Taxas</div>
              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={estorno_icon} alt="Total Taxas" />
                    Total Taxas:
                  </Col>
                  <Col span={12}>R${formatValue(Totaltaxas)}</Col> {/* Adicionado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={credito_icon} alt="Taxas Crédito" />
                    Crédito:
                  </Col>
                  <Col span={12}>{formatValue(Pcttaxacredito)}%</Col> {/* Alterado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={debito_icon} alt="Taxas Débito" />
                    Débito:
                  </Col>
                  <Col span={12}>{formatValue(Pcttaxadebito)}%</Col> {/* Alterado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={pix_icon} alt="Taxas PIX" />
                    Pix:
                  </Col>
                  <Col span={12}>{formatValue(Pcttaxapix)}%</Col> {/* Alterado BELINI */}
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_money_icon" src={hand_money} alt="money icon" />
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={12} xl={12}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Rateio</div> {/* Adicionado BELINI */}
              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={especie_icon} alt="Valor Total" />
                    Valor Total:
                  </Col>
                  <Col span={12}>R${formatValue(entradas)}</Col> {/* Adicionado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={saidas_icon} alt="Saídas" />
                    Saídas:
                  </Col>
                  <Col span={12}>{formatValue(Pctsaidas)}%</Col> {/* Adicionado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={saldo_icon} alt="Saldo" />
                    Saldo:
                  </Col>
                  <Col span={12}>{formatValue(Pctsaldo)}%</Col> {/* Adicionado BELINI */}
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_money_icon" src={hand_rateio} alt="money icon" />
            </div>
          </div>
        </Col>

        <Col xs={24} md={12} lg={12} xl={12}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Entradas Online</div> {/* Alterado BELINI */}
              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={especie_icon} alt="Total Válido" />
                    Total Válido:
                  </Col>
                  <Col span={12}>R${formatValue(entradas)}</Col> {/* Adicionado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={estorno_icon} alt="Estornos" />
                    Estornado:
                  </Col>
                  <Col span={12}>{formatValue(Pctestornos)}%</Col> {/* Alterado BELINI */}
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>
                    <img className="Relatorio_title_col_title" src={especie_icon} alt="Estornos" />
                    Validado:
                  </Col>
                  <Col span={12}>{formatValue(Pctvalidado)}%</Col> {/* Alterado BELINI */}
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_money_icon" src={card} alt="money icon" />
            </div>
          </div>
        </Col>

      </Row>
    </div>
  );
};

export default Relatorio;

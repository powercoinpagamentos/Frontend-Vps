import { DatePicker, ConfigProvider } from "antd"; // adicionado BELINI
import locale from 'antd/es/date-picker/locale/pt_BR'; //  adicionado BELINI
import React, { useContext, useEffect, useRef, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import { Button, Table, notification } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import "./PagamentosSearch.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import _, { debounce } from "lodash";
import axios from "axios";
import { useParams } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faSearch } from '@fortawesome/free-solid-svg-icons';
import html2pdf from 'html2pdf.js'; //  Salvar em pdf - BELINI

import {
  AiOutlineEdit,
  AiFillDelete,
  AiFillDollarCircle,
} from "react-icons/ai";
import qr_code_icon from "../../../assets/images/QR.png";
import notes from "../../../assets/images/notes.png";
const { RangePicker } = DatePicker;

const PagamentosSearch = (props) => {
  const datePickerRef = useRef(null);
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, loading, authInfo, setNotiMessage } =
    useContext(AuthContext);
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const [loadingTable, setLoadingTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listCanals, setListCanals] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState(null);
  const [estornos, setEstornos] = useState("");
  const [estoque, setEstoque] = useState("");
  const [cash, setCash] = useState("");
  const [nome, setnome] = useState(0);
  const [descricao, setdescricao] = useState(0);
  const [valpelucia, setvalpelucia] = useState(0);
  const [valorDoPulso, setvalorDoPulso] = useState(0);
  const [qtdetentativas, setqtdetentativas] = useState(0); // Pelúcia
  const [pulsotentativa, setpulsotentativa] = useState(0); // Pelúcia
  const [saidapelucia, setsaidapelucia] = useState(0); // Pelúcia
  const [arrecadou, setarrecadou] = useState(0); // Pelúcia
  const [mediasaidas, setmediasaidas] = useState(0); // Pelúcia
  const [limitetrava, setlimitetrava] = useState(0); // Pelúcia
  const [numerodesaidas, setnumerodesaidas] = useState(0); // Pelúcia
  const [porcentpelucia, setporcentpelucia] = useState(0); // Pelúcia
  const [porcentretida, setporcentretida] = useState(0); // Pelúcia
  const [arrecadouparcial, setarrecadouparcial] = useState(0); // Adicionado BELINI
  const [arrecadoutotal, setarrecadoutotal] = useState(0); // Adicionado BELINI
  const [total, setTotal] = useState(""); // Adicionado BELINI
  const [saidas, setSaidas] = useState(""); // Adicionado BELINI
  const [online, setOnline] = useState(""); // Adicionado BELINI
  const [saldo, setSaldo] = useState(""); // Adicionado BELINI
  const [pix, setPix] = useState(""); // Adicionado BELINI
  const [credito, setCredito] = useState(""); // Adicionado BELINI
  const [debito, setDebito] = useState(""); // Adicionado BELINI
  const [taxapix, setTaxaPix] = useState(""); // Adicionado BELINI
  const [taxacredito, setTaxaCredito] = useState(""); // Adicionado BELINI
  const [taxadebito, setTaxaDebito] = useState(""); // Adicionado BELINI
  const [dataMaisAntiga, setdataMaisAntiga] = useState(null); // Adicionado BELINI
  const [dataMaisRecente, setdataMaisRecente] = useState(null); // Adicionado BELINI
  const [diasEntreDatas, setdiasEntreDatas] = useState(null); // Adicionado BELINI
  const { RangePicker } = DatePicker;
  const { id } = useParams();

  const handleRefresh = () => { window.location.reload(); };   //  Atualiza a página do navegador - adicionado BELINI

  const defaultPickerValue = [moment().subtract(1, 'month'), moment()];  // ajusta a visualização dos meses - BELINI

  //  <=============================================================== Eliminadas getData() e getMaquinas() - BELINI

  const generatePdf = () => {
    const element = document.getElementById('pdf-content');
    const options = {
      margin: 0.5,
      filename: 'relatorio.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1, // Ajuste de escala, você pode reduzir ainda mais se necessário
        useCORS: true // Garante que imagens externas sejam renderizadas corretamente
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'landscape' // Define modo paisagem (horizontal)
      }
    };
  
    html2pdf().from(element).set(options).toPdf().output('blob').then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Relatorio.pdf';
      link.click();
      notification.success({
        message: 'Sucesso!',
        description: 'O PDF deste relatório foi baixado com sucesso!',
      });
    });
  };
  
  const handleDateChange = (dates, dateStrings) => {
    setDataInicio(dateStrings ? dateStrings[0] : null);
    setDataFim(dateStrings ? dateStrings[1] : null);
  };

  const getPreviousMonth = () => {  // Função para calcular o mês anterior - BELINI
    const currentMonth = moment().month();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    return moment().month(previousMonth);
  };

  useEffect(() => {  //  Adicionado BELINI
    if (dataInicio === null || dataFim === null) {
      console.log("carregando dados da tabela (sem datas)...");
      getPaymentsPeriod(id, dataInicio, dataFim);
    }
  }, [id, dataInicio, dataFim, getPaymentsPeriod]);

  useEffect(() => {  // Adicionado BELINI
    if (dataInicio !== null && dataFim !== null) {
      console.log("carregando dados da tabela (com datas)...");
      getPaymentsPeriod(id, dataInicio, dataFim);
    }
  }, [dataInicio, dataFim, id, getPaymentsPeriod]);

  const getPaymentsPeriod = (id) => {  // Envia requisição com ou sem datas de período defindas - BELINI
    setLoadingTable(true);
    const url = `${process.env.REACT_APP_SERVIDOR}/Info-Cliente/${id}`;
    const requestBody = {}; // Enviar no corpo da requisição - BELINI

    if (dataInicio && dataFim) { // Adiciona dataInicio E dataFim se estiverem definidos - BELINI
      requestBody.dataInicio = `${dataInicio}T00:00:00.000Z`;
      requestBody.dataFim = `${dataFim}T23:59:00.000Z`;
    }

    const urlWithParams = `${url}?dataInicio=${requestBody.dataInicio}&dataFim=${requestBody.dataFim}`;
    console.log("URL completa:", urlWithParams);

    console.log("INICIO:", dataInicio);
    console.log("FIM:", dataFim);

    axios
      .post(url, requestBody, { headers: { "x-access-token": token, "content-type": "application/json", }, })
      .then((res) => {
        console.log('Response data:', res.data);
        setLoadingTable(false);
        setTotal(res?.data?.total);
        setEstornos(res?.data?.estornos);
        setCash(res?.data?.cash); //  Adicionado BELINI
        setdataMaisAntiga(res?.data?.dataMaisAntiga); // Adicionado BELINI
        setdataMaisRecente(res?.data?.dataMaisRecente); // Adicionado BELINI
        setdiasEntreDatas(res?.data?.diasEntreDatas); // Adicionado BELINI
        setnome(res?.data?.nome); // Adicionado BELINI
        setdescricao(res?.data?.descricao); // Adicionado BELINI
        setvalpelucia(res?.data?.valpelucia); // Adicionado BELINI 
        setvalorDoPulso(res?.data?.valorDoPulso); // Adicionado BELINI 
        setqtdetentativas(res?.data?.qtdetentativas); // Pelúcia
        setpulsotentativa(res?.data?.pulsotentativa); // Pelúcia
        setsaidapelucia(res?.data?.saidapelucia); // Pelúcia
        setmediasaidas(res?.data?.mediasaidas); // Pelúcia
        setnumerodesaidas(Number(res?.data?.numerodesaidas)); // Pelúcia
        setporcentpelucia(res?.data?.porcentpelucia); // Pelúcia
        setporcentretida(res?.data?.porcentretida); // Pelúcia
        setlimitetrava(res?.data?.limitetrava); // Pelúcia
        setarrecadouparcial(res?.data?.arrecadouparcial); // Adicionado BELINI
        setarrecadoutotal(res?.data?.arrecadoutotal); // Adicionado BELINI
        setSaidas(res.data.saidas); // Adicionado BELINI
        setEstoque(res?.data?.estoque);
        setOnline(res.data.online);
        setSaldo(res.data.saldo);
        setPix(res.data.pix);
        setCredito(res.data.credito);
        setDebito(res.data.debito);
        setTaxaPix(res.data.taxapix);
        setTaxaCredito(res.data.taxacredito);
        setTaxaDebito(res.data.taxadebito);
        if (res.status === 200 && Array.isArray(res.data.pagamentos)) {
          setListCanals(res.data.pagamentos);
        }
      })
      .catch((err) => {
        setLoadingTable(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message: "Sua sessão expirou, faça login novamente.",
          });
          setDataUser(null);
        }
      }
      );
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      className: "table-column-data",
      render: (data) => (
        <span>{moment(data).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },
    {
      title: "Forma de pagamento",
      dataIndex: "tipo",
      key: "tipo",
      className: "table-column-tipo",
      render: (tipo, record) => (
        <span>
          {tipo === "bank_transfer"
            ? "PIX"
            : tipo === "CASH"
              ? "Espécie"
              : tipo === "debit_card"
                ? "Débito"
                : tipo === "credit_card"
                  ? "Crédito"
                  : tipo === "PELÚCIA"
                  ? "Pelúcia"    
                  : "N/A"}
        </span>
      ),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      className: "table-column-valor",
      render: (valor) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor),
    },
    {
      title: "ID da Transação",
      dataIndex: "mercadoPagoId",
      key: "mercadoPagoId",
      className: "table-column-mercadoPagoId",
    },
    {
      title: "Operação",
      dataIndex: "tipo",
      key: "operacao",
      className: "table-column-operacao",
      render: (tipo, record) => {
        if (record.tipo === "SAIDA") {
          return (
            <span style={{ color: "red" }}>Retirada</span>
          );
        } else if (record.tipo === "PELÚCIA") {
          return (
            <span style={{ color: "orange" }}>Saiu pelúcia</span>
          );
        } else {
          return (
            <OverlayTrigger
              key={record.key}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top-${record.key}`}>
                  {record.estornado ? (record.motivoEstorno ? record.motivoEstorno : "Sem motivo registrado") : "Recebido"}
                </Tooltip>
              }
            >
              <span style={{ color: record.estornado ? "red" : "green" }}>
                {record.estornado ? "Estornado" : "Recebido"}
              </span>
            </OverlayTrigger>
          );
        }
      },
      
    },
  ];

  const EditarCliente = () => {
    localStorage.setItem(`Textonome`, nome);  // grava em localStorage - Adicionado BELINI 
    localStorage.setItem(`Textodescricao`, descricao);  // grava em localStorage - Adicionado BELINI 
    localStorage.setItem(`Valorpelucia`, valpelucia);  // grava em localStorage - Adicionado BELINI 
    localStorage.setItem(`Valorcredito`, valorDoPulso);  // grava em localStorage - Adicionado BELINI      
    localStorage.setItem(`Valortrava`, limitetrava);  // grava em localStorage - Adicionado BELINI 
    localStorage.setItem(`Valortentativa`, pulsotentativa);  // grava em localStorage - Adicionado BELINI 
    localStorage.setItem(`Valorestoque`, estoque);  // grava em localStorage - Adicionado BELINI   
     navigate(`/edit-pagamento/${id}`, {
        state: location.state,
      });
  };

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "Selecione no calendario a direita a data de inicio e firm para gerar o relatorio para essa maquina!",
      });
    } else {
      localStorage.setItem(`Totalestorno_${id}`, estornos); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`Totalcash_${id}`, cash); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`Totalgeral_${id}`, total); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`Totalsaidas_${id}`, saidas); // grava em localStorage - Adicionado BELINI
      // localStorage.setItem(`TotalsaidaPel_${id}`, saidapelucia); // grava em localStorage - Pelucia
      // localStorage.setItem(`Valmediasaidas_${id}`, mediasaidas); // grava em localStorage - Pelucia
      // localStorage.setItem(`Valnumerodesaidas_${id}`, numerodesaidas); // grava em localStorage - Pelucia
      // localStorage.setItem(`Valporcentpelucia_${id}`, porcentpelucia); // grava em localStorage - Pelucia
      // localStorage.setItem(`Valporcentretida_${id}`, porcentretida); // grava em localStorage - Pelucia
      localStorage.setItem(`Totalsaldo_${id}`, saldo); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`TotalPix_${id}`, pix); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`TotalCredito_${id}`, credito); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`TotalDebito_${id}`, debito);  // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`TaxaPix_${id}`, taxapix); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`TaxaCredito_${id}`, taxacredito); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`TaxaDebito_${id}`, taxadebito); // grava em localStorage - Adicionado BELINI
      localStorage.setItem(`DataInicial_${id}`, dataInicio);  // grava em localStorage - Adicionado BELINI  
      localStorage.setItem(`DataFinal_${id}`, dataFim);  // grava em localStorage - Adicionado BELINI 
      navigate(`/relatorio/${id}`, {
        state: { maquinaInfos, dataInicio, dataFim },
      });
    }
  };

  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}

      <div className="Container_atualizar">

        <Button className="Botao_atualizar" style={{ margin: "0 15px" }} onClick={handleRefresh}> {/* Atualiza a página do navegador, adicionado BELINI */}
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{ marginRight: "5px" }}
          />
          Atualizar
        </Button>

        <Button
          onClick={generatePdf}
          className="header_pdf"
        >
          <span>Salvar PDF</span>
        </Button>

        <Link
          className="PagamentosSearch_header_back"
          to={"/dashboard-maquinas"}
        >
          VOLTAR
        </Link>
      </div>

      <div className="PagamentosSearch_header">

        <Button
          className="header_editBtn"
          onClick={() => EditarCliente()}
        >
          <AiOutlineEdit />
          <span>Editar</span>
        </Button>

        <Button
          className="header_editBtn"
          onClick={() => {
            navigate(`/delete-pagamentos/${id}`, {
              state: location.state,
            });
          }}
        >
          <AiFillDelete />
          <span>Fazer Acerto</span>
        </Button>

        <Button
          className="header_editBtn"
          onClick={() => {
            navigate(`/credito-remoto/${id}`, {
              state: location.state,
            });
          }}
        >
          <AiFillDollarCircle />
          <span>Crédito Remoto</span>
        </Button>

        <Button
          className="header_editBtn"
          onClick={() => onRelatorioHandler()}
        >
          <img
            style={{ width: "15px", marginRight: "2px" }}
            src={notes}
            alt="notes"
          />
          <span>Relatório</span>
        </Button>
        <div className="PagamentosSearch_datePicker">
          <ConfigProvider locale={locale}>
            <RangePicker
              placeholder={["Data Inicial", "Data Final"]}
              onChange={handleDateChange}
              value={dataInicio && dataFim ? [moment(dataInicio), moment(dataFim)] : []}
              defaultPickerValue={[getPreviousMonth(), moment()]}
              inputReadOnly
            />
          </ConfigProvider>
        </div>
      </div>

      <div id="pdf-content"> {/* Salvar em pdf - BELINI   */}
        <div className="PagamentosSearch_body">

          <div className="PagamentosSearch_titleList_main"> {/* adicionado BELINI */}
            <div className="PagamentosSearch_pair"> {/* adicionado BELINI */}

              <div class="pair">
                <div class="pair_text">Entradas</div>
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(total)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Saidas</div>  {/* alterado BELINI*/}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(saidas)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Saldo</div> {/*. adicionado BELINI*/}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(saldo)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Cash</div> {/* alterado BELINI*/}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(cash)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">PIX</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(pix)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Débito</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(debito)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Crédito</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(credito)}</div>
              </div>
           
              <div class="pair">
                <div class="pair_text">% Pix</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(taxapix)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">% Débito</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(taxadebito)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">% Crédito</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(taxacredito)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Arrecadou Parcial</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(arrecadouparcial)}</div>
              </div>

            </div>
          </div>

          <div className="PagamentosSearch_titleList_main2"> {/* adicionado BELINI */}
            <div className="PagamentosSearch_pair"> {/* adicionado BELINI */}

              <div class="pair">
                <div class="pair_text">Total Online</div> {/*. Adicionado BELINI*/}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(online)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Estornos</div>
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(estornos)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Estoque</div>
                <div className="pair_value">{estoque ? Number(estoque) : 0}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Pulso Crédito</div>
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(valorDoPulso)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Pulso Jogada</div>
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(pulsotentativa)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Data Inicial</div>
                <div className="pair_value"> {dataMaisAntiga} </div>
              </div>

              <div class="pair">
                <div class="pair_text">Data Final</div>
                <div className="pair_value"> {dataMaisRecente} </div>
              </div>

              <div class="pair_admin">
                <div class="pair_text">Nº de Dias</div>
                <div className="pair_value"> {diasEntreDatas} </div>
              </div>

              <div class="pair">
                <div class="pair_text">Livre</div>
                <div className="pair_value"> 0 </div>
              </div>

              <div class="pair">
                <div class="pair_text">Livre</div>
                <div className="pair_value"> 0 </div>
              </div>

            </div>
          </div>

          <div className="PagamentosSearch_titleList_main3"> 
            <div className="PagamentosSearch_pair"> {/* adicionado BELINI */}

              <div class="pair">
                <div class="pair_text">Saída Pelúcia</div>
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(saidapelucia)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Média Saídas</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(mediasaidas)}</div>
              </div>
              
              <div class="pair">
                <div class="pair_text">Limitador</div>
                <div className="pair_value"> {limitetrava} </div>
              </div>

              <div class="pair">
                <div class="pair_text">Nº de Jogadas</div>
                <div className="pair_value">
                  {Intl.NumberFormat("pt-BR").format(Math.round(qtdetentativas))}
                </div>
              </div>

              <div class="pair">
                <div class="pair_text">Nº de Saídas</div>
                <div className="pair_value">
                  {Intl.NumberFormat("pt-BR").format(Math.round(numerodesaidas))}
                </div>
              </div>
              
              <div class="pair">
                <div class="pair_text">% de Saída</div>
                <div className="pair_value">
                  {Intl.NumberFormat("pt-BR").format(Math.round(porcentpelucia)) + '%'}
                </div>
              </div>

              <div class="pair">
                <div class="pair_text">% de Lucro</div>
                <div className="pair_value">
                  {Intl.NumberFormat("pt-BR").format(Math.round(porcentretida)) + '%'}
                </div>
              </div>

              <div class="pair">
                <div class="pair_text">Arrecadou Total</div> {/* adicionado BELINI */}
                <div className="pair_value">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(arrecadoutotal)}</div>
              </div>

              <div class="pair">
                <div class="pair_text">Livre</div>
                <div className="pair_value"> 0 </div>
              </div>

            </div>
          </div>

          <div className="PagamentosSearch_tableContainer">
            <Table
              className="PagamentosSearch_table"
              columns={columns}
              dataSource={listCanals}
              pagination={false}
              loading={loadingTable}
              locale={{
                emptyText:
                  searchText.trim() !== "" ? (
                    "-"
                  ) : (
                    <div>Não foram encontrados resultados para sua pesquisa.</div>
                  ),
              }}
            />
          </div>
        </div>

        </div>
    </div >
  );
};

export default PagamentosSearch;

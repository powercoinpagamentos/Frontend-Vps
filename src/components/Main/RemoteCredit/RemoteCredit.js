import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import { Button, Input } from "antd";

const RemoteCredit = (props) => {
    const { id } = useParams();
    const location = useLocation();
    const maquinaInfos = location.state;
    const {
        setDataUser,
        loading,
        authInfo,
        setNotiMessage
    } = useContext(AuthContext);
    let navigate = useNavigate();
    const token = authInfo?.dataUser?.token;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        valor: ''
    })
    const [errors, setErrors] = useState({})
    const handleChange = (name, value) => {
        setData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => {
            let errorsTemp = { ...prev }
            delete errorsTemp[name]
            return errorsTemp
        })
    }
    const onSave = () => {
        // check require
        let errorsTemp = {}
        if (data.valor.trim() === "") {
            errorsTemp.valor = 'Este campo é obrigatório'
        }
        if (Object.keys(errorsTemp).length > 0) {
            setErrors(errorsTemp)
            return;
        }

        setIsLoading(true)
        axios.post(`${process.env.REACT_APP_SERVIDOR}/credito-remoto-cliente`, {
            id: id,
            valor: data.valor,
        }, {
            headers: {
                "x-access-token": token,
                "content-type": "application/json",
            }
        })
            .then(res => {
                setIsLoading(false)
                setData({
                    valor: ''
                })
                setNotiMessage({
                    type: 'success',
                    message: `${res?.data?.retorno}`
                })
            })
            .catch(err => {
                setIsLoading(false)
                if ([401, 403].includes(err.response.status)) {
                    setNotiMessage({
                        type: 'error', message: "Sua sessão expirou, faça login novamente."
                    })
                    setDataUser(null);
                } else {
                    setNotiMessage({
                        type: 'error', message: `Error: ${err.response?.data?.msg}`
                    })
                }
            })
    }
    return (
        <>
            {isLoading && <LoadingAction />}
            <div className="AddMachine_container">
                <div className="AddMachine_header">
                    <div className="AddMachine_header_title">
                        Adicionando $ na {maquinaInfos.nome}
                    </div>
                    <div className="AddMachine_header_back" onClick={() => {
                        navigate(`/pagamentos/${id}`, { state: location.state });
                    }}>
                        VOLTAR
                    </div>
                </div>
                <div className="AddMachine_content">
                    <div className="AddMachine_itemField">
                        <label
                            className="AddMachine_itemFieldLabel"
                            htmlFor="valor"
                        >
                            Valor:
                        </label>
                        <Input
                            placeholder={""}
                            value={data.valor}
                            id="valor"
                            type="number"
                            name="valor"
                            autoComplete="valor"
                            onChange={(event) => {
                                handleChange('valor', event.target.value)
                            }}
                            className={`${!!errors.valor ? 'AddMachine_inputError' : ''}`}
                        />
                        {errors.valor && (
                            <div className="AddMachine_itemFieldError">{errors.valor}</div>
                        )}
                    </div>
                    <Button className="AddMachine_saveBtn" onClick={() => {
                        if (!isLoading) onSave()
                    }} disabled={isLoading}>
                        ENVIAR
                    </Button>
                </div>

            </div>
        </>
    )
}

export default RemoteCredit

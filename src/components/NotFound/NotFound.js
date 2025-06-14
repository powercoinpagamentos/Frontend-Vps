import "./NotFound.css";
import React from "react";
import {NavLink} from "react-router-dom";
function NotFound() {
    return (
        <div className="NotFoundWrapper">
            <div className="NotFoundText">
                404 - Página Não Encontrada.
            </div>
            {/* <NavLink to={"/"} className="NotFoundGoHome">
                Voltar
            </NavLink> */}
        </div>
    )
}

export default NotFound;

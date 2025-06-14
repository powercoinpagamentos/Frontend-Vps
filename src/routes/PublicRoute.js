import React, {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
import LoadingAction from "../themes/LoadingAction/LoadingAction";
import {CANAL} from "../utils/constants";
function PrivateRoute({children, ...rest}) {
    const {
        authInfo,
        loading
    } = useContext(AuthContext)

    const {
        isAuthenticated,
        dataUser
    } = authInfo;
    if (loading) {
        return <LoadingAction />
    }
    if (!isAuthenticated) {
        return children;
    }
    return <Navigate to={dataUser?.type === CANAL ? "/dashboard-canal" : "/dashboard-maquinas"} />;

}

export default PrivateRoute;

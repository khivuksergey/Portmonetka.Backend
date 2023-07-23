import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { IAuthContext, IUserCredentials } from "../Common/DataTypes";
import axios, { AxiosError } from "axios";

export default function useLogin() {
    const { setToken, setUserId, setExpireTimestamp } = useContext<IAuthContext>(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCheckUserName = async (userName: string): Promise<boolean | null> => {
        const url = `api/user/checkusername/${userName}`;
        try {
            setError("");

            const response = await axios.get(url);
            switch (response.statusText) {
                case "OK":
                    return true;
                case "User doesn't exist":
                    return false;
                default: return null;
            }
        } catch (e: unknown) {
            const error = e as AxiosError;
            setError(error.message);
            //console.error("handleCheckUserName: error", error);
        }

        return null;
    }

    const handleLogin = async (user: IUserCredentials) => {
        const url = "api/user/login";
        try {
            setError("");
            setLoading(true);
            const response = await axios.post(url, user);
            switch (response.statusText) {
                case "OK":
                    setToken(response.data.token);
                    setUserId(response.data.userId);
                    setExpireTimestamp(response.data.expireTime);
                    return true;
                default: return false;
            }
        } catch (e: unknown) {
            const error = e as AxiosError;
            setError(error.request.response);
        } finally {
            setLoading(false);
        }

        return false;
    }

    const handleLogout = () => {
        setToken("");
        setUserId(0);
    }

    return {
        handleCheckUserName,
        handleLogin,
        handleLogout,
        loading,
        error
    };
}
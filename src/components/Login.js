import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTokens } from "./ProductSlice";
import "./login.css";
import axios from "axios";

function Login() {
    const initialData = {
        email: "",
        pass: "",
    };

    const [logInData, setLogInData] = useState(initialData);

    const accessToken = useSelector((state) => {

        console.log(state.pagination.tokens, "current state")

        return state.pagination.tokens
    })

    console.log(accessToken, "outside useSeelctor")

    const dispatch = useDispatch();
    const rootURL = process.env.REACT_APP_API_KEY
    const api = axios.create({
        baseURL: "http://192.168.1.123:8080/api/admin/product",
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA3MjAwOTY0fQ.GsgfXI2aavKpgawlN5mIHTsfLUB4Xe2H1WN36RcdczE',
        },
    });

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;

        setLogInData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleLog(event) {
        event.preventDefault();

        const isValid = validateForm();

        if (isValid) {
            // console.log(logInData, "log iiiin ")
            // localStorage.setItem("currentUser", JSON.stringify(logInData));

            // dispatch(setTokens())
            // localStorage.setItem("accessToken", JSON.stringify(token));
            // const fetchToken = JSON.parse(localStorage.getItem("accessToken"));
            // console.log(fetchToken, "token Fetched");

            const payload = {
                "email": logInData.email,
                "password": logInData.pass,
                "user_type": "Admin"
            }
            var response;
            const RegisterAPI = async () => {
                try {
                    response = await api.post(rootURL + '/api/admin/user/login', payload);
                    dispatch(setTokens(response.data.accessToken))
                    localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
                }
                catch (err) {
                    console.log(err)
                }
            };

            RegisterAPI();
        }
    }
    console.log(accessToken, "set token method token")

    function validateForm() {
        let flag = true;
        // eslint-disable-next-line
        const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const validPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

        if (logInData.email.length === 0) {
            alert("please enter email ID");
            flag = false;
        } else if (logInData.email && !logInData.email.match(validEmail)) {
            alert("enter valid Email ID");
            flag = false;
        }

        if (logInData.pass.length === 0) {
            alert("enter Password");
            flag = false;
        } else if (logInData.pass && !logInData.pass.match(validPass)) {
            alert("enter valid Password");
            flag = false;
        }

        return flag;
    }


    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "250px",
                    marginLeft: "150px",
                    
                }}
            >
                <fieldset style={{border: '3px solid black'}}>
                    <form style={{ color: "black" }}>
                        <h2 style={{ color: "black", fontFamily: 'serif' }}> <u> <b> LOGIN FORM </b> </u> </h2>
                        <br />
                        <label>
                            {" "}
                            EMAIL-ID <nbsp />
                            <input
                                type="text"
                                value={logInData.email}
                                name="email"
                                onChange={handleChange}
                            />
                        </label>{" "}
                        <br />
                        <br />
                        <label>
                            {" "}
                            PASSWORD
                            <nbsp />
                            <input
                                type="text"
                                value={logInData.pass}
                                name="pass" 
                                onChange={handleChange}
                            />
                        </label>{" "}
                        <br />
                        <br />
                        <button onClick={handleLog}> LOG IN </button>
                        <nbsp />

                    </form>
                </fieldset>
            </div>
        </>
    );
}

export default Login;

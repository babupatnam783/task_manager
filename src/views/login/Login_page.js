import React, { useEffect } from "react";
import './Login_page.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Server from "../../server/ServerDetails";
import { SnackbarMessage } from "../../components/message_snackbar/Message_Snackbar";
import { auth, provider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

function LoginPage() {

    const [oLoginCredentials, setLoginCredentials] = React.useState({ "Email": "", "Password": "" });
    const [bOpenSnackBar, setOpenSnackBar] = React.useState(false);
    const [sErrorMessage, setErrorMessage] = React.useState("");
    const [sMessageType, setMessageType] = React.useState("");

    let navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/home');
        }

    });

    function handleNavigateSignup() {
        navigate('/signup')
    }
    function handleChange(oEvent, sField) {
        setLoginCredentials(prevState => ({
            ...prevState,
            [sField]: oEvent.target.value
        }));
    }

    async function handleLogin(oEvent) {
        oEvent.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!(oLoginCredentials.Email && oLoginCredentials.Password)) {
            setErrorMessage("All fields are required");
            setMessageType('error');
            setOpenSnackBar(true);
        }
        else if (!emailRegex.test(oLoginCredentials.Email)) {
            setErrorMessage("Invalid email format");
            setMessageType('error')
            setOpenSnackBar(true);
        }
        else {
            try {
                const userResponse = await Server.post('/login', {
                    "Email": oLoginCredentials.Email,
                    "Password": oLoginCredentials.Password
                });

                if (userResponse.status === 200 && userResponse.data.message === "Login successful") {
                    const userCredentials = userResponse.data
                    Cookies.set('token', userCredentials.token, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
                    navigate('/home')
                }
            } catch (error) {
                let message;
                if (error.response?.data) {
                    message = error.response.data.message;
                }
                else {
                    message = error.message
                }
                setErrorMessage(message);
                setMessageType('error');
                setOpenSnackBar(true);
                console.log("Error response data:", error.response?.data);
            }
        }

    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken(); // Fetch the ID token
    
            // Prepare user details to send to backend
            const userDetails = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                idToken: idToken, 
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            };
            const googleResposne = await Server.post('/auth/google',userDetails);
            if(googleResposne.status == 200){
                Cookies.set('token', googleResposne.idToken, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
                navigate('/home')  
            }
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    };

    return (
        <>
            <div class='login-wrapper'>
                <h2 className="login-header">Login</h2>
                <div class="login-container">
                    <form>
                        <input className="login_input_style" type="email" placeholder="Email" onChange={(oEvent) => handleChange(oEvent, "Email")} required />
                        <input className="login_input_style" type="password" placeholder="Password" onChange={(oEvent) => handleChange(oEvent, "Password")} required />
                        <button class="login-btn" type="submit" onClick={handleLogin}>
                            Login
                        </button>
                    </form>
                    <div>
                        <h6>Don't have an account? <strong className="signup-link" onClick={handleNavigateSignup} >Signup</strong></h6>

                        <button className="google-btn" onClick={signInWithGoogle}>Login with Google</button>
                    </div>
                </div>
            </div>
            <SnackbarMessage bOpenSnackBar={bOpenSnackBar} setOpenSnackBar={setOpenSnackBar} sMessage={sErrorMessage} sMessType={sMessageType} /></>
    );
}
export default LoginPage;

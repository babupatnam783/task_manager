import React, { useEffect } from "react";
import '../login/Login_page.css'
import { useNavigate } from 'react-router-dom';
import Server from "../../server/ServerDetails";
import { SnackbarMessage } from "../../components/message_snackbar/Message_Snackbar";
import Cookies from 'js-cookie';
import { auth, provider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

function SignUpPage() {
    const [oSignupCredentials, setSignupCredentials] = React.useState({ "FirstName": "", "LastName": "", "Email": "", "Password": "", "ConfirmPassword": "" });
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

    function handleNavigateLogin() {
        navigate('/login')
    }
    function handleChange(oEvent, sField) {
        setSignupCredentials(prevState => ({
            ...prevState,
            [sField]: oEvent.target.value
        }));
    }

    async function handleSignup(oEvent) {
        oEvent.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            !(
                oSignupCredentials.FirstName &&
                oSignupCredentials.LastName &&
                oSignupCredentials.Email &&
                oSignupCredentials.Password !== "" &&
                oSignupCredentials.ConfirmPassword !== ""
            )
        ) {
            setErrorMessage("All fields are required");
            setMessageType('error');
            setOpenSnackBar(true);

        } else if (!emailRegex.test(oSignupCredentials.Email)) {
            setErrorMessage("Invalid email format");
            setMessageType('error')
            setOpenSnackBar(true);
        }
        else if (
            oSignupCredentials.ConfirmPassword !== oSignupCredentials.Password
        ) {
            setErrorMessage("Password are not matched");
            setMessageType('error')
            setOpenSnackBar(true);
        } else {
            try {
                const userResponse = await Server.post("/signup", {
                    FirstName: oSignupCredentials.FirstName,
                    LastName: oSignupCredentials.LastName,
                    Email: oSignupCredentials.Email,
                    Password: oSignupCredentials.Password,
                });

                if (
                    (userResponse.status ===
                        201 && userResponse.data.message === "User registered successfully")
                ) {
                    setErrorMessage(userResponse.data.message);
                    setMessageType('success')
                    setOpenSnackBar(true);

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
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
                setMessageType('error')
                setOpenSnackBar(true);
                console.log("Error response data:", error.response?.data);
            }
        }

    }

    const signUpWithGoogle = async () => {
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
                <h2 className="login-header">Signup</h2>
                <div class="login-container">
                    <form>
                        <input className="login_input_style" type="text" placeholder="First Name" required onChange={(oEvent) => handleChange(oEvent, "FirstName")} />
                        <input className="login_input_style" type="text" placeholder="Last Name" required onChange={(oEvent) => handleChange(oEvent, "LastName")} />
                        <input className="login_input_style" type="email" placeholder="Email" required onChange={(oEvent) => handleChange(oEvent, "Email")} />
                        <input className="login_input_style" type="password" placeholder="Password" required onChange={(oEvent) => handleChange(oEvent, "Password")} />
                        <input className="login_input_style" type="password" placeholder="Confirm Password" required onChange={(oEvent) => handleChange(oEvent, "ConfirmPassword")} />
                        <button class="login-btn" type="submit" onClick={handleSignup}>
                            Signup
                        </button>
                    </form>
                    <div>
                        <h6>Already have an account? <strong className="signup-link" onClick={handleNavigateLogin}>Login</strong></h6>

                        <button className="google-btn" onClick={signUpWithGoogle}>Signup with Google</button>
                    </div>
                </div>
            </div>
            <SnackbarMessage bOpenSnackBar={bOpenSnackBar} setOpenSnackBar={setOpenSnackBar} sMessage={sErrorMessage} sMessType={sMessageType} />
        </>
    );
}
export default SignUpPage;

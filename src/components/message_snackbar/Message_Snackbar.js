import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export const SnackbarMessage = ({ bOpenSnackBar, setOpenSnackBar, sMessage, sMessType }) => {

    return (
        <Snackbar
            open={bOpenSnackBar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackBar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert
                onClose={() => setOpenSnackBar(false)}
                severity={sMessType}
                sx={{ width: "100%" }}
            >
                {sMessage}
            </Alert>
        </Snackbar>
    );
}
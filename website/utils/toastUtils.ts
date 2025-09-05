import { toast } from 'react-toastify';

type AllowedStrings = "error" | "info" | "success" | "warn" ;

export const showToast = (typeString: AllowedStrings  , toastMessageString: string) => {

   return toast[typeString](toastMessageString, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
} 
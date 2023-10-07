import { BsCameraVideo } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";

export default function CallChat() {


    return (

        <div className="CallChat">

            <button> <i><BsCameraVideo /></i> <span>  Video chat </span> </button>
            <button> <i><FiPhoneCall /></i> <span>  Voice chat </span> </button>

        </div>
    )
}

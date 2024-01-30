import React from 'react'
import "../styles/alert.css";

const Alert = ({alert , Progress, Toast, setProgress, setToast , timer1 , timer2 , setAlert}) => {
  //ALERT JS BY ABDULRAFAY
  const HandleCloseBtn = () => {
    setToast(false);

    setTimeout(() => {
      setProgress(false);
      setAlert(null);
    }, 300);
    clearTimeout(timer1);
    clearTimeout(timer2);
  };

  return (
    <div className={Toast ? "toast_custom active" : "toast_custom"}>
      <div className="toast_custom-content">
        {alert && alert.type === "Success" && (
          <i className="fas fa-solid fa-check check"></i>
        )}

        {alert && alert.type === "Warning" && (
          <i className="fas fa-solid fa-warning warning"></i>
        )}

        {alert && alert.type === "Error" && (
          <i className="fas fa-solid fa-warning danger"></i>
        )}

        <div className="message">
          <span className="text text-1">{alert && alert.type}</span>
          <span className="text text-2">{alert && alert.message}</span>
        </div>
      </div>
      <i className="fa-solid fa-xmark close" onClick={HandleCloseBtn}></i>

      {alert && alert.type === "Warning" && (
        <div
          className={Progress ? "warning_progress active" : "warning_progress"}
        ></div>
      )}

      {alert && alert.type === "Success" && (
        <div className={Progress ? "progress active" : "progress"}></div>
      )}

      {alert && alert.type === "Error" && (
        <div
          className={Progress ? "danger_progress active" : "danger_progress"}
        ></div>
      )}
    </div>
  );
}

export default Alert
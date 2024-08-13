import React from 'react'
import IdleTimer from 'react-idle-timer';

const SessionTimeOut = () => {
    const idleTimerRef = React.useRef(null);
    const autoRedirctRef = React.useRef(null);

    const onIdle = () => {
        autoRedirctRef.current = setTimeout(logout, 1000);
    }

    const logout = () => {
        clearTimeout(autoRedirctRef.current)
        sessionStorage.clear();
        localStorage.clear();
        window.location = '/SignIn';
      };
  return (
    <>
    <IdleTimer
    ref={idleTimerRef}
    timeout={300000}
    onIdle={onIdle} />
    </>
  )
}

export default SessionTimeOut
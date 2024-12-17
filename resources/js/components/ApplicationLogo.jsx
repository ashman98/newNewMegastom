export default function ApplicationLogo(props) {
    return (
        <img src={`${import.meta.env.VITE_APP_URL}logo.png`} alt="logo" style={{width: 39, cursor:'pointer'}}/>
    );
}

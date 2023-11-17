import { useContext, useEffect, useState } from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../../../components/MissionProvider/MissionProvider';
import Modal from '../../../components/Modal';
import logo from '../../../assets/images/logo.png';
import message from '../../../components/MessageItem/MessageItem';
import Loading from '../../../components/Loading';

const cx = classNames.bind(styles);

function Header() {
    const contextMission = useContext(missionContext);

    const [bonus, setBonuses] = useState();

    const [dark, setDark] = useState(false);

    const [number, setNumber] = useState();
    const [day, setDay] = useState();
    const [time, setTime] = useState();

    const stringifyJSON = (item) => {
        return JSON.stringify(item);
    };

    const localSET = (name, item) => {
        return localStorage.setItem(name, stringifyJSON(item));
    };

    // Đổi kiểu khi lấy dữ liệu từ localStorage
    const praseJSON = (item) => {
        return JSON.parse(item);
    };
    // Lấy dữ liệu từ localStorage
    const localGET = (name) => {
        const result = localStorage.getItem(name);
        return praseJSON(result);
    };

    // Reset tất cả các giá trị
    const handleResetGift = () => {
        contextMission.setReset(true);
    };

    // Xử lý set theme cho giao diện
    const handleSetTheme = (e) => {
        const theme = e.target.innerText;
        document.querySelector('body').setAttribute('data-theme', theme);
        localSET('theme', theme);
    };

    // Xử lý rút tiền
    const handleWithDraw = () => {
        const random = Math.floor(Math.random() * (3500 - 1000 + 1)) + 1000;
        const coin = localGET('bonus');
        if (!coin || coin === 0) {
            alert(message.noMoneyMessage);
        } else {
            contextMission.setDraw(true);
            setTimeout(() => {
                contextMission.setDraw(false);
                alert(message.errorWithDraw);
            }, [random]);
        }
    };

    // Xử lý chế độ dark mode
    const handelDarkMode = () => {
        setDark(!dark);
        if (!dark) {
            document.querySelector('body').setAttribute('data-mode', 'darkmode');
            localSET('mode', 'darkmode');
        } else {
            document.querySelector('body').setAttribute('data-mode', 'lightmode');
            localSET('mode', 'lightmode');
        }
    };

    // Lấy thời gian hiện tại theo từng second
    useEffect(() => {
        const intervalId = setInterval(() => {
            const day = new Date();
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            setNumber(daysOfWeek[day.getDay()]);
            setDay(`${day.getDate()} - ${day.getMonth() + 1} - ${day.getFullYear()}`);
            setTime(`${day.getHours()} : ${day.getMinutes()} : ${day.getSeconds()}`);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        // Set những giá trị đã được người dùng chọn trước đó
        const theme = localGET('theme');
        const mode = localGET('mode');
        document.querySelector('body').setAttribute('data-theme', theme || 'default');
        document.querySelector('body').setAttribute('data-mode', mode || 'lightmode');
        if (mode === 'lightmode' || !mode) {
            setDark(false);
        } else {
            setDark(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const result = localGET('bonus');
        setBonuses(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextMission.update]);

    return (
        <div className={cx('wrapper')}>
            {contextMission.reset && <Modal title={message.titleReset} message={message.messageResetAll} />}
            {contextMission.draw && <Loading />}
            <div className={cx('container')}>
                <div>
                    <img className={cx('logo')} src={logo} alt="logo" />
                </div>
                <div className={cx('cover-time')}>
                    <i className={cx('fa-solid fa-calendar-day')}></i> {number}
                    {', '} {day} {', '} {time} <i className="fa-regular fa-clock"></i>
                </div>
                <div className={cx('cover-gift')}>
                    <span className={cx('label-gift')}>Gift: </span>
                    <div className={cx('value-gift')}>
                        {bonus || 0} <i className={cx('fa-solid fa-coins')}></i>
                    </div>
                    <button className={cx('btn-draw')} onClick={handleWithDraw}>
                        Withdraw
                    </button>

                    <button className={cx('btn-draw')}>
                        Theme <i className="fa-solid fa-palette"></i>
                        <div className={cx('modal-theme')}>
                            <div className={cx('inner-modal')}>
                                <div className={cx('theme-item', 'default')} onClick={handleSetTheme}>
                                    default
                                </div>
                                <div className={cx('theme-item', 'pink')} onClick={handleSetTheme}>
                                    pink
                                </div>
                                <div className={cx('theme-item', 'black')} onClick={handleSetTheme}>
                                    black
                                </div>
                                <div className={cx('theme-item', 'orange')} onClick={handleSetTheme}>
                                    orange
                                </div>
                                <div className={cx('theme-item', 'blue')} onClick={handleSetTheme}>
                                    blue
                                </div>
                                <div className={cx('theme-item', 'green')} onClick={handleSetTheme}>
                                    green
                                </div>
                                <div className={cx('theme-item', 'gray')} onClick={handleSetTheme}>
                                    gray
                                </div>
                            </div>
                        </div>
                    </button>

                    <button className={cx('btn-draw')} onClick={handleResetGift}>
                        Reset <i className="fa-solid fa-power-off"></i>
                    </button>

                    <button className={cx('mode-dark')} onClick={handelDarkMode}>
                        {!dark && <i className="fa-solid fa-moon"></i>}
                        {dark && <i className="fa-regular fa-sun"></i>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;

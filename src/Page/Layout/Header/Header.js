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

    const [today, setToday] = useState();
    const [bonus, setBonuses] = useState();

    const [dark, setDark] = useState(false);

    const [number, setNumber] = useState();
    const [day, setDay] = useState();
    const [time, setTime] = useState();

    const handleResetGift = () => {
        contextMission.setReset(true);
    };

    const handleSetTheme = (e) => {
        const theme = e.target.innerText;
        document.querySelector('body').setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const handleWithDraw = () => {
        const random = Math.floor(Math.random() * (3500 - 1000 + 1)) + 1000;
        contextMission.setDraw(true);
        setTimeout(() => {
            contextMission.setDraw(false);
            alert(message.errorWithDraw);
        }, [random]);
    };

    const handelDarkMode = () => {
        setDark(!dark);
        if (!dark) {
            document.querySelector('body').setAttribute('data-mode', 'darkmode');
            localStorage.setItem('mode', 'darkmode');
        } else {
            document.querySelector('body').setAttribute('data-mode', 'lightmode');
            localStorage.setItem('mode', 'lightmode');
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const day = new Date();
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            setNumber(daysOfWeek[day.getDay()]);
            setDay(`${day.getDate()} - ${day.getMonth() + 1} - ${day.getFullYear()}`);
            setTime(`${day.getHours()} : ${day.getMinutes()} : ${day.getSeconds()}`);
        }, 1000);

        const theme = localStorage.getItem('theme');
        const mode = localStorage.getItem('mode');
        document.querySelector('body').setAttribute('data-theme', theme || 'default');
        document.querySelector('body').setAttribute('data-mode', mode || 'lightmode');

        if (mode === 'lightmode' || !mode) {
            setDark(false);
        } else {
            setDark(true);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const result = localStorage.getItem('bonus');
        setBonuses(JSON.parse(result));
    }, [contextMission.update]);

    return (
        <div className={cx('wrapper')}>
            {contextMission.reset && <Modal />}
            {contextMission.draw && <Loading />}
            <div className={cx('container')}>
                <div>
                    <img className={cx('logo')} src={logo} alt="logo" />
                </div>
                <div className={cx('cover-time')}>
                    <i className={cx('fa-solid fa-calendar-day')}></i> {number}
                    {', '} {day} {', '} {time} <i class="fa-regular fa-clock"></i>
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

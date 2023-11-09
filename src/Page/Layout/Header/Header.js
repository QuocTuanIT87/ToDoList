import { useContext, useEffect, useState } from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../../../components/MissionProvider/MissionProvider';
import Modal from '../../../components/Modal';

const cx = classNames.bind(styles);

function Header() {
    const contextMission = useContext(missionContext);

    const [today, setToday] = useState();
    const [bonus, setBonuses] = useState();

    const handleResetGift = () => {
        contextMission.setReset(true);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const day = new Date();
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = `${daysOfWeek[day.getDay()]} || ${day.getDate()} - ${
                day.getMonth() + 1
            } - ${day.getFullYear()} || ${day.getHours()} : ${day.getMinutes()} : ${day.getSeconds()}`;
            setToday(today);
        }, 1000);

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
            <div className={cx('container')}>
                <div>To Do</div>
                <div>
                    <i className={cx('fa-solid fa-calendar-day')}></i> {today}
                </div>
                <div className={cx('cover-gift')}>
                    <span className={cx('label-gift')}>Gift: </span>
                    <div className={cx('value-gift')}>
                        {bonus || 0} <i className={cx('fa-solid fa-coins')}></i>
                    </div>
                    <button className={cx('btn-draw')}>Draw</button>
                    <button className={cx('btn-draw')} onClick={handleResetGift}>
                        Reset <i class="fa-solid fa-power-off"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;

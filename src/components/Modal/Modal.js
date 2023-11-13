import { useContext } from 'react';
import styles from './Modal.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../MissionProvider/MissionProvider';

const cx = classNames.bind(styles);

function Modal({ title, message }) {
    const contextMission = useContext(missionContext);

    const handleHideModal = () => {
        contextMission.setReset(false);
    };

    const handleResetGift = () => {
        localStorage.setItem('bonus', 0);
        contextMission.updateNow();
        contextMission.setReset(false);
        contextMission.setStack([]);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <p>{title}</p>
                <p className={cx('message')}>
                    <i class="fa-solid fa-triangle-exclamation"></i> {message}
                </p>
                <div className={cx('cover-btn')}>
                    <button className={cx('btn', 'cancel')} onClick={handleHideModal}>
                        Cancel
                    </button>
                    <button className={cx('btn', 'reset')} onClick={handleResetGift}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;

import classNames from 'classnames/bind';

import message from '../MessageItem/MessageItem';
import styles from './Congratulation.module.scss';
import { useContext } from 'react';
import { missionContext } from '../MissionProvider/MissionProvider';

const cx = classNames.bind(styles);

function Congratulation() {
    const contextMission = useContext(missionContext);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('top-inner')}>
                    <div className={cx('cover-check')}>
                        <i className="fa-solid fa-check"></i>
                    </div>
                </div>
                <div className={cx('inner')}>
                    <div>
                        {message.congratulation} <i class="fa-solid fa-heart">.</i>
                    </div>
                    <i
                        className={cx('fa-solid fa-circle-right', 'btn-continue')}
                        onClick={() => contextMission.setCongratulation(false)}
                    ></i>
                </div>
            </div>
        </div>
    );
}

export default Congratulation;

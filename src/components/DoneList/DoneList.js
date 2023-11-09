import { useContext, useEffect, useState } from 'react';
import styles from './DoneList.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../MissionProvider/MissionProvider';
import Fire from '../Fire';

const cx = classNames.bind(styles);

function DoneList() {
    const contextMission = useContext(missionContext);

    const [listMissionDone, setListMissionDone] = useState([]);
    const [fire, setFire] = useState(false);

    const handleTakeGift = (index) => {
        const updatedList = listMissionDone.filter((_, i) => i !== index);
        setListMissionDone(updatedList);
        localStorage.setItem('listMissionDone', JSON.stringify(updatedList));
        const result = JSON.parse(localStorage.getItem('bonus'));
        localStorage.setItem('bonus', JSON.stringify(result + 1));
        contextMission.updateNow();
        setFire(true);
    };

    useEffect(() => {
        const result = localStorage.getItem('listMissionDone');
        setListMissionDone(JSON.parse(result));
    }, [contextMission.update]);

    useEffect(() => {
        if (fire) {
            setTimeout(() => {
                setFire(false);
            }, 6000);
        }
    }, [fire]);

    console.log('red');

    return (
        <div className={cx('wrapper')}>
            {fire && <Fire />}

            <div className={cx('container')}>
                <div className={cx('cover-input')}></div>
                <h2 style={{ fontFamily: 'Inter-Bold' }}>
                    Mission complete <i className="fa-brands fa-gratipay"></i>
                </h2>
                <div className={cx('list-missions')}>
                    {listMissionDone?.map((mission, index) => (
                        <div className={cx('mission')} key={index}>
                            <i className="fa-solid fa-circle" style={{ marginRight: '8px', fontSize: '8px' }}></i>
                            <span className={cx('mission-name')}>{mission}</span>
                            <div className={cx('control-mission')}>
                                <button className={cx('btn', 'delete')} onClick={() => handleTakeGift(index)}>
                                    <i className="fa-solid fa-gift"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DoneList;

import { useContext, useEffect, useRef, useState } from 'react';
import styles from './DoneList.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../MissionProvider/MissionProvider';
import Fire from '../Fire';
import sound from '../../assets/audio/sound.mp3';
import sound1 from '../../assets/audio/sound1.mp3';
import AllMission from '../AllMission';

const cx = classNames.bind(styles);

function DoneList() {
    const contextMission = useContext(missionContext);

    const refAudio = useRef();
    const refAudio1 = useRef();

    const [listMissionDone, setListMissionDone] = useState([]);
    const [allMission, setAllMission] = useState([]);
    const [fire, setFire] = useState(false);
    const [isDisable, setIsDisable] = useState(false);

    const handleTakeGift = async (index) => {
        const day = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = `on ${daysOfWeek[day.getDay()]} ${day.getDate()} - ${day.getMonth() + 1} - ${day.getFullYear()} `;

        const updatedList = listMissionDone.filter((_, i) => i !== index);
        const aCompleteMission = listMissionDone[index] + ' ' + today;
        console.log('a: ', aCompleteMission);
        setAllMission((prev) => [...prev, aCompleteMission]);
        setListMissionDone(updatedList);
        localStorage.setItem('listMissionDone', JSON.stringify(updatedList));
        const result = JSON.parse(localStorage.getItem('bonus'));
        localStorage.setItem('bonus', JSON.stringify(result + 1));
        contextMission.updateNow();
        setFire(true);
        setIsDisable(true);
        await refAudio.current.play();
        await refAudio1.current.play();
        setTimeout(() => {
            setIsDisable(false);
        }, 1000);
    };

    useEffect(() => {
        localStorage.setItem('allMission', JSON.stringify(allMission));
    }, [allMission]);

    useEffect(() => {
        const result = localStorage.getItem('listMissionDone');
        setListMissionDone(JSON.parse(result) || []);
        const allMission = localStorage.getItem('allMission');
        setAllMission(JSON.parse(allMission) || []);
    }, [contextMission.update]);

    useEffect(() => {
        if (fire) {
            setTimeout(() => {
                setFire(false);
            }, 6000);
        }
    }, [fire]);

    return (
        <div className={cx('wrapper')}>
            {fire && <Fire />}
            {contextMission.all && <AllMission />}
            <div className={cx('container')}>
                <audio ref={refAudio1} style={{ display: ' none' }}>
                    <source src={sound1} />
                </audio>
                <audio ref={refAudio} style={{ display: ' none' }}>
                    <source src={sound} />
                </audio>

                <div className={cx('cover-input')}></div>
                <div>
                    <button className={cx('all-completed')} onClick={() => contextMission.setAll(true)}>
                        All
                    </button>
                </div>
                <h2 style={{ fontFamily: 'Inter-Bold' }}>
                    Mission completed <i className="fa-brands fa-gratipay"></i>
                </h2>

                <div className={cx('list-missions')}>
                    {listMissionDone?.map((mission, index) => (
                        <div className={cx('mission')} key={index}>
                            <i className="fa-solid fa-circle" style={{ marginRight: '8px', fontSize: '8px' }}></i>
                            <span className={cx('mission-name')}>{mission}</span>
                            <div className={cx('control-mission')}>
                                <button
                                    className={cx('btn', 'delete', { disable: isDisable })}
                                    onClick={() => handleTakeGift(index)}
                                >
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

import { useContext, useEffect, useRef, useState } from 'react';
import styles from './DoList.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../MissionProvider/MissionProvider';

const cx = classNames.bind(styles);

function DoList() {
    const myRef = useRef();
    const contextMission = useContext(missionContext);

    const [mission, setMission] = useState('');
    const [listMission, setListMission] = useState([]);
    const [listMissionDone, setListMissionDone] = useState([]);

    const handleAddMission = () => {
        if (mission) {
            const updatedList = [...listMission, mission];
            setListMission((prev) => [...prev, mission]);
            localStorage.setItem('listMission', JSON.stringify(updatedList));
            setMission('');
            myRef.current.focus();
        } else {
            myRef.current.focus();
        }
    };

    const handleDeleteMission = (index) => {
        const updatedList = listMission.filter((_, i) => i !== index);
        setListMission(updatedList);
        localStorage.setItem('listMission', JSON.stringify(updatedList));
    };

    const handleCompleteMission = (index) => {
        const result = listMission.filter((_, i) => i === index);
        const updatedList = [...listMissionDone, result];
        setListMissionDone((prev) => [...prev, result]);
        localStorage.setItem('listMissionDone', JSON.stringify(updatedList));
        contextMission.updateNow();
        handleDeleteMission(index);
    };

    useEffect(() => {
        const result = localStorage.getItem('listMission');
        setListMission(JSON.parse(result) || []);
        const listDone = localStorage.getItem('listMissionDone');
        setListMissionDone(JSON.parse(listDone) || []);
    }, [mission]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button className={cx('btn-back')}>
                    <i className="fa-solid fa-rotate-left"></i>
                </button>
                <h2 style={{ fontFamily: 'Inter-Bold' }}>
                    Today mission <i className="fa-solid fa-briefcase"></i>
                </h2>
                <div className={cx('cover-input')}>
                    <input
                        ref={myRef}
                        className={cx('form-input-mission')}
                        type="text"
                        placeholder="Your mission"
                        value={mission}
                        onChange={(e) => {
                            setMission(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddMission();
                            }
                        }}
                        spellCheck={false}
                    />
                    <button className={cx('btn-add')} onClick={handleAddMission}>
                        <i className={cx('fa-solid fa-plus', 'icon-plus')}></i>
                    </button>
                </div>
                <div className={cx('list-missions')}>
                    {listMission?.map((mission, index) => (
                        <div className={cx('mission')} key={index}>
                            <i className="fa-solid fa-circle" style={{ marginRight: '8px', fontSize: '8px' }}></i>
                            <span className={cx('mission-name')}>{mission}</span>
                            <div className={cx('control-mission')}>
                                <button className={cx('btn', 'delete')} onClick={() => handleDeleteMission(index)}>
                                    <i className="fa-regular fa-trash-can"></i>
                                </button>
                                <button className={cx('btn', 'complete')} onClick={() => handleCompleteMission(index)}>
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DoList;

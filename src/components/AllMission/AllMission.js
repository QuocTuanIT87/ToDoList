import { useContext, useEffect, useState } from 'react';
import styles from './AllMission.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../MissionProvider/MissionProvider';

const cx = classNames.bind(styles);

function AllMission() {
    const contextMission = useContext(missionContext);
    const [listAll, setListALL] = useState([]);

    useEffect(() => {
        const result = localStorage.getItem('allMission');
        setListALL(JSON.parse(result) || []);
    }, []);

    return (
        <div className={cx('wrapper')} onClick={() => contextMission.setAll(false)}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('inner')}>
                    {listAll?.map((mission, index) => (
                        <div className={cx('cover-mission')}>
                            <span>{`${index + 1}`}</span>
                            <div>{mission}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AllMission;
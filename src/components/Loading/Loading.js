import styles from './Loading.module.scss';
import classNames from 'classnames/bind';
import { ClockLoader } from 'react-spinners';

const cx = classNames.bind(styles);

function Loading() {
    return (
        <div className={cx('wrapper')}>
            <ClockLoader color={'var(--color-modal)'} size={140} />
        </div>
    );
}

export default Loading;

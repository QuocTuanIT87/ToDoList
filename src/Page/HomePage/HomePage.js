import DoList from '../../components/DoList';
import DoneList from '../../components/DoneList';
import Header from '../Layout/Header';
import styles from './HomePage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function HomePage() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div>
                    <Header />
                </div>
                <div className={cx('content')}>
                    <div className={cx('inner-content')}>
                        <div className={cx('cover-dolist')}>
                            <DoList />
                        </div>
                        <div className={cx('cover-donetlist')}>
                            <DoneList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

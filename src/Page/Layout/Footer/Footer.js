import classNames from 'classnames/bind';

import styles from './Footer.module.scss';
import { useEffect, useState } from 'react';
import quotes from '../../../components/Quotes/Quotes';

const cx = classNames.bind(styles);

function Footer() {
    const [message, setMessage] = useState();

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length - 1);

        setMessage(quotes[randomIndex]);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('quotes')}>{message}</div>
            </div>
        </div>
    );
}

export default Footer;

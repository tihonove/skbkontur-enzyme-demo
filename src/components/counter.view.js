import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './counter.less';

import { Button } from 'ui';

const cx = classNames.bind(styles);

import { Increment, Decrement } from './counter.reducer';

export default function Counter({ value, dispatch }) {
    const onIncrement = () => dispatch({ type: Increment });
    const onDecrement = () => dispatch({ type: Decrement });

    return (<div className={cx('counter')}>
        <Button onClick={onDecrement}>-</Button>
        <span
            className={cx({
                value: true,
                negative: value < 0,
                positive: value > 0,
            })}>
            {value}
        </span>
        <Button onClick={onIncrement}>+</Button>
    </div>);
}

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
};

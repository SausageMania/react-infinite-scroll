import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { throttle } from 'lodash';
import { Box, Typography } from '@material-ui/core';

const Scrolling = props => {
    const { position, screenHeight } = props;
    const [textSize, setTextSize] = useState('50px');

    useEffect(() => {
        if (position - screenHeight / 1.5 < 0) {
            setTextSize('100px');
        } else {
            const dynamicSize = ((position - screenHeight / 1.5) / (screenHeight / 1.5)) * 50 + 50;
            setTextSize(dynamicSize + 'px');
        }
    }, [position, screenHeight]);

    return (
        <Box display="flex" alignItems="center">
            <Typography style={{ fontSize: textSize, fontWeight: 600, color: 'white' }}>
                Parallax Scroll!
            </Typography>
        </Box>
    );
};

export default Scrolling;

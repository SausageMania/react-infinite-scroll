import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';

const Scrolling = props => {
    const { position, screenHeight } = props;
    const [textSize, setTextSize] = useState('50px');

    useEffect(() => {
        if (position - screenHeight / 1.5 < 0) {
            setTextSize('50px');
        } else {
            const dynamicSize = ((position - screenHeight / 1.5) / (screenHeight / 3)) * 50 + 50;
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

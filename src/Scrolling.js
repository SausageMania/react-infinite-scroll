import React from 'react';
// eslint-disable-next-line no-unused-vars
import { throttle } from 'lodash';
import { Box, Typography } from '@material-ui/core';

const Scrolling = () => {
    return (
        <Box display="flex" alignItems="center">
            <Typography style={{ fontSize: '50px', fontWeight: 600, color: 'white' }}>
                Hello!
            </Typography>
        </Box>
    );
};

export default Scrolling;

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { throttle } from 'lodash';
import { Box, Typography } from '@material-ui/core';

const Scrolling = props => {
    const { position, screenHeight } = props;

    return (
        <Box
            style={{ opacity: (position - screenHeight / 1.5) / 300 }}
            display="flex"
            alignItems="center"
        >
            <Typography style={{ fontSize: '50px', fontWeight: 600 }}>Hello!</Typography>
        </Box>
    );
};

export default Scrolling;

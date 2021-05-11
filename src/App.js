import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    LinearProgress,
    Typography,
} from '@material-ui/core';
import Scrolling from './Scrolling';

const downData = [
    { name: 'test', age: '24' },
    { name: 'test1', age: '25' },
    { name: 'test2', age: '26' },
    { name: 'test3', age: '27' },
    { name: 'test4', age: '28' },
    { name: 'test5', age: '29' },
    { name: 'test6', age: '30' },
    { name: 'test7', age: '31' },
    { name: 'test8', age: '32' },
    { name: 'test9', age: '33' },
];

const upData = [
    { name: 'upTest', age: '50' },
    { name: 'upTest1', age: '51' },
    { name: 'upTest2', age: '52' },
    { name: 'upTest3', age: '53' },
    { name: 'upTest4', age: '54' },
    { name: 'upTest5', age: '55' },
    { name: 'upTest6', age: '56' },
    { name: 'upTest7', age: '57' },
    { name: 'upTest8', age: '58' },
    { name: 'upTest9', age: '59' },
];

const App = () => {
    const [rowList, setRowList] = useState([]);
    const [active, setActive] = useState(false);
    const [upScroll, setUpScroll] = useState(false); //최상단 scroll 감지 스위치

    const firstScroll = useRef();
    const lastScroll = useRef();
    const loadingDown = useRef();
    const loadingUp = useRef();

    const upSavePoint = useRef(null);
    const downSavePoint = useRef(null);

    const [position, setPosition] = useState(0);
    const screenHeight = window.innerHeight;

    const onScroll = () => {
        setPosition(window.scrollY);
    };

    useEffect(() => {
        // window.addEventListener(
        //     'scroll',
        //     throttle(() => {
        //         onScroll();
        //     }, 100),
        // );

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        const downObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && active) {
                    lastScroll.current.style.opacity = '1';
                    loadingDown.current.style.opacity = '1';
                    lastScroll.current.style.transition = 'all 0.5s';
                    loadingDown.current.style.transition = 'all 0.5s';
                    setTimeout(() => {
                        lastScroll.current.style.opacity = '0';
                        loadingDown.current.style.opacity = '0';
                        setRowList(rowList => rowList.concat(downData));
                    }, 1000);
                }
            },
            { threshold: 1 },
        );
        downObserver.observe(lastScroll.current);

        return () => downObserver.disconnect();
    }, [active]);

    useEffect(() => {
        const upObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadingUp.current.style.opacity = '1';
                    loadingUp.current.style.transition = 'all 0.5s';
                    setTimeout(() => {
                        loadingUp.current.style.opacity = '0';
                        setActive(true);
                        setUpScroll(upScroll => !upScroll);
                        setRowList(rowList => upData.concat(rowList));
                    }, 1000);
                }
            },
            { threshold: 1 },
        );
        upObserver.observe(firstScroll.current);

        return () => upObserver.disconnect();
    }, []);

    useEffect(() => {
        if (upSavePoint.current) {
            upSavePoint.current.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center',
            });
            upSavePoint.current.style.backgroundColor = 'rgba(0,240,250,0.3)';
        }
    }, [upScroll]);

    return (
        <React.Fragment>
            <Box
                width="100%"
                height="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
                <Box mb={1}>
                    <Typography style={{ fontSize: '30px', fontWeight: 600 }}>
                        Infinite Scroll
                    </Typography>
                </Box>
                <Box
                    width="350px"
                    height="500px"
                    overflow="auto"
                    component={Paper}
                    elevation={15}
                    style={{ opacity: (screenHeight / 3 - position) / 300 }}
                    position="sticky"
                    top="calc(50vh - 250px)"
                >
                    <div ref={firstScroll} />
                    <LinearProgress ref={loadingUp} style={{ opacity: 0 }} />
                    <Table stickyHeader>
                        <TableHead style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <TableRow>
                                <TableCell align="center">
                                    <Typography style={{ fontWeight: 600 }}>이름</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography style={{ fontWeight: 600 }}>나이</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowList.map((data, index) => (
                                <TableRow
                                    key={index}
                                    ref={
                                        index === 9
                                            ? upSavePoint
                                            : index === rowList.length - 10
                                            ? downSavePoint
                                            : null
                                    }
                                    style={
                                        index === 0
                                            ? { backgroundColor: 'rgba(0,155,255,0.3)' }
                                            : index === rowList.length - 1
                                            ? { backgroundColor: 'rgba(255,0,0,0.3)' }
                                            : null
                                    }
                                >
                                    <TableCell align="center">{data.name}</TableCell>
                                    <TableCell align="center">{data.age}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    ref={lastScroll}
                                    align="center"
                                    style={{ opacity: 0 }}
                                >
                                    불러오는 중...
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <LinearProgress
                        variant="indeterminate"
                        ref={loadingDown}
                        style={{ opacity: 0 }}
                    />
                </Box>
            </Box>
            <Box
                width="100%"
                height="100vh"
                display="flex"
                justifyContent="center"
                style={{ opacity: (position - screenHeight / 1.5) / 300, backgroundColor: 'black' }}
            >
                <Scrolling position={position} screenHeight={screenHeight} />
            </Box>
        </React.Fragment>
    );
};

export default App;

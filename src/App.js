import React, { useState, useRef, useEffect, useCallback } from 'react';
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
// eslint-disable-next-line no-unused-vars
import { throttle } from 'lodash';
import axios from 'axios';

// const downData = [
//     { name: 'downTest0', age: '24' },
//     { name: 'downTest1', age: '25' },
//     { name: 'downTest2', age: '26' },
//     { name: 'downTest3', age: '27' },
//     { name: 'downTest4', age: '28' },
//     { name: 'downTest5', age: '29' },
//     { name: 'downTest6', age: '30' },
//     { name: 'downTest7', age: '31' },
//     { name: 'downTest8', age: '32' },
//     { name: 'downTest9', age: '33' },
// ];

const upData = [
    { name: 'upTest0', age: '50' },
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
    const [page, setPage] = useState(5);
    const [lastPage, setLastPage] = useState(false);

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

    const fetchAPI = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://60a1cf67745cd7001757576b.mockapi.io/api/userdata?page=${page}&limit=10`,
            );

            if (page === 10) setLastPage(true);
            else setLastPage(false);

            setRowList(rowList => rowList.concat(response.data));
        } catch (error) {
            console.log(error);
        }
    }, [page]);

    useEffect(() => {
        window.addEventListener(
            'scroll',
            throttle(() => {
                onScroll();
            }, 150),
        );

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        const downObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && active) setPage(page => (page < 10 ? page + 1 : page));
            },
            { threshold: 1 },
        );
        downObserver.observe(lastScroll.current);

        return () => downObserver.disconnect();
    }, [active]);

    useEffect(() => {
        if (!lastPage) {
            loadingDown.current.style.opacity = '1';
            loadingDown.current.style.transition = 'all 0.5s';
        }
        lastScroll.current.style.opacity = '1';
        lastScroll.current.style.transition = 'all 0.5s';

        setTimeout(() => {
            if (!lastPage) {
                loadingDown.current.style.opacity = '0';
                lastScroll.current.style.opacity = '0';
                fetchAPI();
            }
        }, 1000);
    }, [fetchAPI, page, lastPage]);

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
                    <Typography style={{ float: 'right' }}>with Sticky</Typography>
                </Box>
                <Box
                    width="350px"
                    height="500px"
                    overflow="auto"
                    component={Paper}
                    elevation={15}
                    style={{ opacity: (screenHeight / 1.5 - position) / (screenHeight / 3) }}
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
                            {}
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    ref={lastScroll}
                                    align="center"
                                    style={{ opacity: 0 }}
                                >
                                    {lastPage ? '마지막 데이터입니다.' : '불러오는 중...'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {!lastPage && (
                        <LinearProgress
                            variant="indeterminate"
                            ref={loadingDown}
                            style={{ opacity: 0 }}
                        />
                    )}
                </Box>
            </Box>
            <Box
                width="100%"
                height="100vh"
                display="flex"
                justifyContent="center"
                style={{
                    opacity: (position - screenHeight / 1.5) / (screenHeight / 3),
                    backgroundColor: 'black',
                }}
            >
                <Scrolling position={position} screenHeight={screenHeight} />
            </Box>
        </React.Fragment>
    );
};

export default App;

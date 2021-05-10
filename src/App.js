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
} from '@material-ui/core';

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

    const upSavePoint = useRef(null);
    const downSavePoint = useRef(null);

    useEffect(() => {
        const downObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && active) {
                    setTimeout(() => {
                        setRowList(rowList => rowList.concat(downData));
                    }, 500);
                }
            },
            { rootMargin: '0px 0px 120px', threshold: 1 },
        );
        downObserver.observe(lastScroll.current);

        return () => downObserver.disconnect();
    }, [active]);

    useEffect(() => {
        const upObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setActive(true);

                        setUpScroll(upScroll => !upScroll);
                        setRowList(rowList => upData.concat(rowList));
                    }, 500);
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
                block: 'start',
                inline: 'center',
            });
            upSavePoint.current.style.backgroundColor = 'rgba(0,240,250,0.3)';
        }
    }, [upScroll]);

    console.log(rowList);

    return (
        <Box m={5} width="500px" height="500px" overflow="auto" component={Paper}>
            <div ref={firstScroll} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>이름</TableCell>
                        <TableCell>나이</TableCell>
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
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.age}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={2} ref={lastScroll} align="center">
                            더 보기
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <LinearProgress variant="indeterminate" />
        </Box>
    );
};

export default App;

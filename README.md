# react-infinite-scroll & Parallax Scroll

## 1. 구현한 내용
최하단으로 스크롤 했을 때 0.5초 로딩(setTimeout 500ms로 로딩처럼 구현) 후 데이터 concat.  
최상단으로 스크롤 했을 때 역시 0.5초 로딩 후 데이터 concat

## 2. 구현 단계
### I. Infinite Scroll
처음에는 getBoundingClientRect를 이용하여 element의 크기만큼 scroll 하면 데이터를 추가하려고 했으나 불필요한 reflow 발생.  
서칭 후 IntersectionObserver를 알게 되어 사용함. (해당 element가 화면에 나왔을 때 event 발생)

```javascript
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
```

### II. Parallax Scroll
window.addEventListener를 사용하여 scroll시 위치를 가져오게 하였음.  
이 방식은 부드러운 화면 전환이 가능하지만 엄청나게 많은 re-rendering을 야기함.  
따라서 throttle을 이용하여 렌더링 갯수를 조절할 필요가 있음.  

```javascript
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
```


## 3. 발견한 문제

useRef는 값이 변경되어도 re-rendering되지 않음.  
변경된 값을 사용하기 위해선 useState로 스위치를 넣는게 불가피 했음.  
-> 더 나은 방법이 없는지 서칭중...  
첫 로딩 땐 위로 스크롤 하기 위해선 아래로 내렸다가 위로 올려야 함.  
구조적인 문제이기에 현재는 해결방안이 마땅히 보이지 않음. 

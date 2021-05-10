# react-infinite-scroll

## 1. 구현한 내용
최하단으로 스크롤 했을 때 0.5초 로딩(setTimeout 500ms로 로딩처럼 구현) 후 데이터 concat
최상단으로 스크롤 했을 때 역시 0.5초 로딩 후 데이터 concat

## 2. 구현 단계
처음에는 getBoundingClientRect를 이용하여 element의 크기만큼 scroll 하면 데이터를 추가하려고 했으나 불필요한 reflow 발생.  
서칭 후 IntersectionObserver를 알게 되어 사용함. (해당 element가 화면에 나왔을 때 event 발생)

```javascript
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
```
## 3. 발견한 문제

useRef는 값이 변경되어도 re-rendering되지 않음.  

const forEach = (arrayFn = {}, fn) => {
    Object.keys(arrayFn).forEach((key) => {
        fn(arrayFn[key], key);
    })
}

export { forEach };
1
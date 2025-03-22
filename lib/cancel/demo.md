# 请求取消的使用场景

- 搜索时，用户输入关键字后，会有一个下拉框提示用户可能的搜索结果，如果用户输入的关键字不是想要的，可以点击取消按钮，取消搜索。
- 轮询，离开当前页面时，需要取消轮询请求，避免资源浪费。

# 示例

CancelToken

new AbortController()

```js
const source = axios.CancelToken.source();
axios.get('/user/12345', {
  cancelToken: source.token
}).catch(thrown => {
  isCancel(thrown) && console.log('Request canceled', thrown.message);
});

source.cancel('Operation canceled by the user.');
```

```js
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(c => {
    cancel = c;
  })
});

// 取消请求
cancel();
```

```js
const controller = new AbortController();
const signal = controller.signal;
axios.get('/user/12345', {
  signal
});

// 取消请求
controller.abort();
```
```

# 设计思路
xhr.abort()

异步状态分离


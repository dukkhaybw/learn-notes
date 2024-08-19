## 打击鼓

demo分析：

1. 按下键盘后让音频播放
2. 按下键盘后同时让对应元素的样式变化
3. 事件结束后移除对应元素上的样式

```html
<div class="container">
    <ul>
        <li data-key="65">
            <p>A</p>
            <span>CLAP</span>
        </li>
        <li data-key="83">
            <p>S</p>
            <span>HIHAT</span>
        </li>
        <li data-key="68">
            <p>D</p>
            <span>KICK</span>
        </li>
        <li data-key="70">
            <p>F</p>
            <span>OPENHAT</span>
        </li>
        <li data-key="71">
            <p>G</p>
            <span>BOOM</span>
        </li>
        <li data-key="72">
            <p>H</p>
            <span>RIDE</span>
        </li>
        <li data-key="74">
            <p>J</p>
            <span>SNARE</span>
        </li>
        <li data-key="75">
            <p>K</p>
            <span>TOM</span>
        </li>
        <li data-key="76">
            <p>L</p>
            <span>TINK</span>
        </li>
    </ul>

    <audio data-key="65" src="./sounds/clap.wav"></audio>
    <audio data-key="83" src="./sounds/hihat.wav"></audio>
    <audio data-key="68" src="./sounds/kick.wav"></audio>
    <audio data-key="70" src="./sounds/openhat.wav"></audio>
    <audio data-key="71" src="./sounds/boom.wav"></audio>
    <audio data-key="72" src="./sounds/ride.wav"></audio>
    <audio data-key="74" src="./sounds/snare.wav"></audio>
    <audio data-key="75" src="./sounds/tom.wav"></audio>
    <audio data-key="76" src="./sounds/tink.wav"></audio>
</div>


<script>
    window.addEventListener('keydown', function(event) {
        let audio = document.querySelector(`audio[data-key="${event.keyCode}"]`)
        let li = document.querySelector(`li[data-key="${event.keyCode}"]`)
        if (audio) {
            audio.currentTime = 0
            audio.play()
            li.classList.add('active')
        }
    })
    const lis = document.querySelectorAll('li[data-key]')
    lis.forEach(function(item) {
        item.addEventListener('transitionend', function() {
            this.classList.remove('active')
        })
    })
</script>
```

全局监听键盘按下事件，在事件处理函数中先判断按下的是哪个按键，通过事件对象event中的keyCode属性确定。在获取到keyCode后，用它作为属性选择器的一部分，通过querySlector ( )方法获取对应的音频元素audio。调用audio的paly()方法开启音频的播放。注意按下按钮时音频的播放时长问题，如果希望每次点就都从头开始播放则可以设置audio元素对象的currentTime属性为0。currentTime 属性设置或返回音频播放的当前位置（以秒计）。当设置该属性时，播放会跳跃到指定的位置。



对于设有css属性中的transition属性的元素。可以通过js获取到该元素并监听该元素上的和transition有关的事件——transitionstart、transitionrun、transitionend。



### 使用JS控制html元素下定义的css变量








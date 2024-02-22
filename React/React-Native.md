# React-Native

原生 App:

![image-20211002221953279](..\typora-user-images\image-20211002221953279.png)

混合 App：

![image-20211002222212604](..\typora-user-images\image-20211002222212604.png)

phonegap.js:做为适配层，封装了 WebView。下层和原生 app 接口和能力进行桥接，向上承载业务逻辑层。

网页上的 js 并没有原生的能力，比如调用摄像头，访问蓝牙，播放视频等原生应用才能做的事。

![image-20211002222707042](..\typora-user-images\image-20211002222707042.png)

![image-20211002223133793](..\typora-user-images\image-20211002223133793.png)

react-native 提供了一系列组件标签，每个标签在不同的操作系统下都对应着不同的原生视图组件。

## 基础部分

在 React-native 中可以写函数式组件或类组件。

函数式组件：

```jsx
import React from 'react';
import { View, Text } from 'react-native'; //引入react-native中的核心组件

const myCom = () => {
  return (
    <View>
      <Text>hello world</Text>
    </View>
  );
};
export default myCom;
```

类组件：

```jsx
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class MyCom extends Component {
  render() {
    return (
      <View>
        <Text>hello world</Text>
      </View>
    );
  }
}
export default MyCom;
```

React-Native 将原生的 React 语法和移动端操作系统的原生功能进行连接来进行原生 App 的开发。通过 React-Native，可以使用 JavaScript 语法访问移动端操作系统提供的 API，使用 React 中的组件来设置 UI 样式。在 React Native 中，使用 React 组件通过 JavaScript 来调用视图。

在运行时，React Native 为这些组件创建相应的 Android 和 iOS 视图。由于 React Native 组件就是对原生视图的封装，因此使用 React Native 编写的应用外观、感觉和性能与其他任何原生应用一样，这些平台支持的组件称为**原生组件**。

React-Native 提供了 native 这一层，就是 RN 帮助开发者封装了一套能够去调用系统底层的工具，应用和相关组件的 API。

组件+API

## React-Native 中的原生组件

![image-20211001114308660](..\typora-user-images\image-20211001114308660.png)

各个平台在写原生 App 时，有自己的一套视图标签

## React-Native 中的核心组件

| REACT NATIVE UI COMPONENT | ANDROID VIEW | IOS VIEW | WEB ANALOG | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| `<View>` | `<ViewGroup>` | `<UIView>` | A non-scrollling `<div>` | A container that supports layout with flexbox, style, some touch handling, and accessibility controls |
| `<Text>` | `<TextView>` | `<UITextView>` | `<p>` | Displays, styles, and nests strings of text and even handles touch events |
| `<Image>` | `<ImageView>` | `<UIImageView>` | `<img>` | Displays different types of images |
| `<ScrollView>` | `<ScrollView>` | `<UIScrollView>` | `<div>` | A generic scrolling container that can contain multiple components and views |
| `<TextInput>` | `<EditText>` | `<UITextField>` | `<input type="text">` | Allows the user to enter text |

```jsx
import React from 'react'
import { View, Text, Image, ScrollView, TextInput } from 'react-native'

consr App = ()=>{
    return (
    	<ScrollView>
        	<Text>some text</Text>
            <View>
            	<Text>some more text</Text>
                <Image source={{ url:'https://xxxx.xxx/xxx/xxxjpg' }}
                    style={{width:200,height:200}}
                ></Image>
            </View>
            <TextInput style={{height:40,borderColor:'gray',borderWidth:1}}>
            	defaultValue = "清输入内容"
            </TextInput:>
        </ScrollView>
    )
}
```

![image-20211001120700592](..\typora-user-images\image-20211001120700592.png)

## React 基础

函数组件：

```jsx
import React from 'react';
import { Text } from 'react-native';

const getFullName = (firstName, secondName, thirdName) => {
  return firstName + ' ' + secondName + ' ' + thirdName;
};

const Cat = () => {
  const name = 'mimi';
  return (
    <View>
      <Text>hello cat! {name}</Text>
      <Text>Hello, I am {getFullName('Rum', 'Tum', 'Tugger')}!</Text>
    </View>
  );
};

export default Cat;
```

JSX 语法糖的实质是调用`React.createElement`方法，所以你必须在文件头部引用`import React from 'react'`。在 React Native 中， `View` 使用弹性盒模型（Flexbox）来为子元素布局。

props 用来配置组件的第一次渲染（初始状态）。state 则用来记录组件中任意可能随时间变化的数据。

**函数组件中的 props 和 state**

props 属性常用于实现父子组件之间的通信。react-native 中的核心组件也有提供许多的 props 属性。

state 状态，在函数组将中定义状态需要借助 useState 函数。

```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const sonCom = (props) => {
  const [isHungry, setIsHungry] = useState(true);
  return (
    <View>
      <Text>
        {props.name} is {isHungry ? hungry : full}
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        title={isHungry ? '喂食' : '已经饱了'}
        disabled={!isHungry}
      ></Button>
    </View>
  );
};

const myCom = () => {
  return (
    <view>
      <sonCom name='bobo'></sonCom>
      <sonCom name='xixi'></sonCom>
    </view>
  );
};

export default myCom;
```

类组件：

```jsx
import React { Component } from 'react'
import { Text, View } from 'react-native'

class myCom extends Component {
    render(){
        return (
        	<View>
            	<Text>hello  world</Text>
            </View>
        )
    }
}

export default myCom
```

```jsx
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class sonCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHungry: true
    };
  }
  render() {
    return (
      <View>
        <Text>
          {this.props.name} is {this.state.isHungry ? 'hungey' : 'full'}
        </Text>
        <Button
          onPress={() => {
            this.setState({ isHungry: false });
          }}
          disable={!this.state.isHungry}
          title={this.state.isHungry ? '喂食' : '已经饱了'}
        ></Button>
      </View>
    );
  }
}

class myCom extends Component {
  render() {
    return (
      <>
        <sonCom name='bobo'></sonCom>
        <sonCom name='xixi'></sonCom>
      </>
    );
  }
}

export default myCom;
```

## 文本输入组件

`<TextInput />`

标签属性：

- onChangeText = { ( ) => { ..... } }

- onSubmitEditing = { () => { ..... } }

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

const myCom = () => {
  const [text, setText] = useState('');
  return (
    <View>
      <TextInput
        defaultValue={text}
        onChangeText={(text) => {
          setText(text);
        }}
        placeholder='Type here to translate!'
      ></TextInput>
      <Text>{text}</Text>
    </View>
  );
};

export default myCom;
```

## 滚动视图

`<ScrollView>`：适合用来显示数量不多的滚动元素。放置在`ScrollView`中的所有组件都会被渲染，哪怕有些组件因为内容太长被挤出了屏幕外，所以没法实现懒加载能力。

属性：

- horizontal：控制水平还是垂直滑动
- pagingEnabled：允许使用滑动手势对视图进行分页

```jsx
import React from 'react';
import { Image, ScrollView, Text } from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64
};

export default App = () => (
  <ScrollView>
    <Text style={{ fontSize: 96 }}>Scroll me plz</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 96 }}>If you like</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 96 }}>Framework around?</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 80 }}>React Native</Text>
  </ScrollView>
);
```

## 长列表

`FlatList`：组件用于显示一个垂直的滚动列表，其中的元素之间结构近似而仅数据不同。`FlatList`更适于长列表数据，且元素个数可以增删。和[`ScrollView`](https://reactnative.cn/docs/using-a-scrollview)而是优先渲染屏幕上可见的元素。

属性：

- data：列表的数据源
- renderItem：从数据源中逐个解析数据，然后返回一个设定好格式的组件来渲染

```jsx
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});

const FlatListBasics = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: 'Devin' },
          { key: 'Dan' },
          { key: 'Dominic' },
          { key: 'Jackson' },
          { key: 'James' },
          { key: 'Joel' },
          { key: 'John' },
          { key: 'Jillian' },
          { key: 'Jimmy' },
          { key: 'Julie' }
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

export default FlatListBasics;
```

SectionList:渲染的是一组需要分组的数据，也许还带有分组标签的。

```jsx
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});

const SectionListBasics = () => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          { title: 'D', data: ['Devin', 'Dan', 'Dominic'] },
          { title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie'] }
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

export default SectionListBasics;
```

## 面向平台开发

针对不同平台编写不同代码的需求。有些内置组件的某些属性可能只在特定平台上有效。

React Native 提供了两种方法来区分平台：

- 使用[`Platform`模块](https://reactnative.cn/docs/platform-specific-code#platform模块)

  - Platform.OS
  - Platform.select( )
  - Platform.Version

- 使用[特定平台扩展名](https://reactnative.cn/docs/platform-specific-code#特定平台扩展名).

Platform 对象: 一个检测当前运行平台的模块。如果组件只有一小部分代码需要依据平台定制，那么这个模块就可以派上用场。

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100
});
```

`Platform.OS`在 iOS 上会返回`ios`，而在 Android 设备或模拟器上则会返回`android`。

Platform.select()它可以以 Platform.OS 为 key，从传入的对象中返回对应平台的值，见下面的示例：

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red'
      },
      android: {
        backgroundColor: 'blue'
      }
    })
  }
});
```

这一方法可以接受任何合法类型的参数，因此你也可以直接用它针对不同平台返回不同的组件，像下面这样：

```jsx
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid')
})();

<Component />;
```

特定平台扩展名：当不同平台的代码逻辑较为复杂时，最好是放到不同的文件里，这时候我们可以使用特定平台扩展名。React Native 会检测某个文件是否具有`.ios.`或是`.android.`的扩展名，然后根据当前运行的平台自动加载正确对应的文件。

如项目中的文件名叫：BigButton.ios.js 或者 BigButton.android.js

引用：

```js
import BigButton from './BigButton'; // 去掉平台扩展名直接引用
```

## 开发环境搭建

- Nodejs:版本应大于等于 12

- Java SE Development Kit:版本必须是 1.8

- yarn

- 安装 Android Studio

  安装界面中选择"Custom"选项，确保选中了以下几项：

  - `Android SDK`
  - `Android SDK Platform`
  - `Android Virtual Device`

- 安装 Android SDK React Native 应用需要的是`Android 10 (Q)`版本的 SDK，在 Android Studio 的欢迎界面中找到 SDK Manager。点击"Configure"，然后就能看到"SDK Manager"。

![image-20211001174946677](..\typora-user-images\image-20211001174946677.png)

"SDK Platforms"选项卡：

`Android 10 (Q)`选项，确保勾选了下面这些组件（重申你必须使用稳定的代理软件，否则可能都看不到这个界面）：

- `Android SDK Platform 29`
- `Intel x86 Atom_64 System Image`（官方模拟器镜像文件，使用非官方模拟器不需要安装此组件）

![image-20211001175148643](..\typora-user-images\image-20211001175148643.png)

"SDK Tools"选项卡：

"Android SDK Build-Tools"选项，确保选中了 React Native 所必须的`29.0.2`版本。

![image-20211001175301213](..\typora-user-images\image-20211001175301213.png)

"NDK (Side by side)"，同样勾中右下角的"Show Package Details"，选择`20.1.5948944`版本进行安装。

![image-20211001175315109](..\typora-user-images\image-20211001175315109.png)

Windows 下环境变量的配置：

打开`控制面板` -> `系统和安全` -> `系统` -> `高级系统设置` -> `高级` -> `环境变量` -> `新建`，创建一个名为`ANDROID_HOME`的环境变量（系统或用户变量均可），指向你的 Android SDK 所在的目录。

把一些工具目录添加到环境变量 Path：

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

尝试创建项目：

- px react-native init AwesomeProject：最简单的项目创建
- npx react-native init AwesomeProject --version X.XX.X：创建指定版本的项目
- npx react-native init AwesomeTSProject --template react-native-template-typescript：使用一些社区提供的模板

andriod 设备准备:

既可以是真机，也可以是模拟器。

- 使用 Android 真机来代替模拟器进行开发，只需用 usb 数据线连接到电脑，然后遵照[在设备上运行](https://reactnative.cn/docs/running-on-device)这篇文档的说明操作即可

- 使用 Android Studio 打开项目下的"android"目录，然后可以使用"AVD Manager"来查看可用的虚拟设备，点击"Create Virtual Device..."，然后选择所需的设备类型并点击"Next"，然后选择**Q** API Level 29 image。

编译并运行 React Native 应用：

yarn react-native run-android。此命令会对项目的原生部分进行编译，同时在另外一个命令行中启动`Metro`服务对 js 代码进行实时打包处理（类似 webpack）。`Metro`服务也可以使用`yarn start`命令单独启动。

## react-native 部分

### 样式

在 react-native 项目中是不存在传统网页开发中的标签的，比如 div 之类的标签。

文本内容必须放在`<Text></Text>`这个组件标签中。

- 在 RN 中默认容器的布局方式都是 flex 布局
- flex 布局的方向的默认值是：flex-direction:column;（纵向排列）

证明：

```jsx
import React from 'react';
import { View, Text } from 'react-native';

const App = () => {
  return (
    //给最外层的view组件标签添加flex：1 属性后，view组件的高度将占满整个屏幕
    <View style={{ backgroundColor: '#afc', flex: 1 }}>
      //默认情况下两个text组件标签是上下排列的，也说明了flex-direction:column;是默认值
      <Text>hello native world1</Text>
      <Text>hello native world2</Text>
    </View>
  );
};

export default App;
```

![image-20211010201150284](..\typora-user-images\image-20211010201150284.png)

```jsx
import React from 'react';
import { View, Text } from 'react-native';

const App = () => {
  return (
    //让两个text组件标签横向排列的话设置 view组件标签的flexDirection:'row'
    <View style={{ backgroundColor: '#afc', flex: 1 }}>
      <Text>hello native world1</Text>
      <Text>hello native world2</Text>
    </View>
  );
};

export default App;
```

![image-20211010201443185](..\typora-user-images\image-20211010201443185.png)

- 在 RN 中样式是无法继承的

  ```jsx
  <View
    style={{
      backgroundColor: '#afc',
      flex: 1,
      flexDirection: 'row',
      color: 'red',
      fontSize: 50
    }}
  >
    <Text>hello native world1</Text>
    <Text>hello native world2</Text>
  </View>
  ```

下图字体的颜还是默认的，并不是红色；字体大小也没有继承。

![image-20211010203826190](..\typora-user-images\image-20211010203826190.png)

- 单位不用加，如果加了 px, vw 等会报错；RN 自动根据手机的屏幕像素比自动调整；但是可以加百分比

注意：

在组件中，组件内部的嵌套的其他组件标签如果想要获取手机屏幕宽高的特定比例，可以借助 React-Native 中提供一个 API。

```jsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width); //屏幕宽度的一半
const screenHeight = Math.round(Dimensions.get('window').height); //屏幕高度的一半

const App = () => {
  return (
    <View
      style={{
        backgroundColor: '#afc',
        flexDirection: 'row',
        color: 'red',
        width: '50%',
        height: '50%'
      }}
    >
      <Text>hello world1</Text>
      <Text>hello world2</Text>
      //内层嵌套的view组件标签的宽高直接取屏幕的宽高的一半
      <View
        style={{
          width: screenWidth / 2,
          height: screenHeight / 2,
          backgroundColor: '#ccc'
        }}
      >
        <Text>hello world3</Text>
      </View>
    </View>
  );
};

export default App;
```

![image-20211010211403440](..\typora-user-images\image-20211010211403440.png)

- 变换

  ```jsx
  <View>
    <Text
      style={{
        transform: [{ translateY: 200 }, { scale: 1.2 }],
        backgroundColor: '#ccc'
      }}
    >
      hello world1
    </Text>
  </View>
  ```

![image-20211010212036250](..\typora-user-images\image-20211010212036250.png)

react-native 中的所有的核心组件都接受名为`style`的属性。样式属性名按照 JS 的语法要求使用了驼峰命名法，例如将`background-color`改为`backgroundColor`。

style 属性的属性值：

- 可以是一个普通的 JavaScript 对象

- 一个数组——在数组中位置居后的样式对象比居前的优先级更高，可以间接实现样式的继承

- `StyleSheet.create` 集中定义组件的样式，按顺序声明和使用`style`属性，以借鉴 CSS 中的“层叠”做法（即后声明的属性会覆盖先声明的同名属性）。

```jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LotsOfStyles = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.red}>just red</Text>
      <Text style={styles.bigBlue}>just bigBlue</Text>
      <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
      <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30
  },
  red: {
    color: 'red'
  }
});

export default LotsOfStyles;
```

### 宽高

React Native 中的尺寸都是无单位的，表示的是与设备像素密度无关的逻辑像素点。

- `width`和`height`:指定固定宽高

- 弹性（Flex）宽高：使组件在可利用的空间中动态地扩张或收缩

  组件能够撑满剩余空间的前提是其父容器的尺寸不为零。如果父容器既没有固定的`width`和`height`，也没有设定`flex`，则父容器的尺寸为零。其子组件如果使用了`flex`，也是无法显示的。

- 百分比宽高

```jsx
 <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />




<View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}} />
      <View style={{flex: 2, backgroundColor: 'skyblue'}} />
      <View style={{flex: 3, backgroundColor: 'steelblue'}} />
</View>




<View style={{ height: '100%' }}>
    <View style={{
            height: '15%', backgroundColor: 'powderblue'
        }} />
    <View style={{
            width: '66%', height: '35%', backgroundColor: 'skyblue'
        }} />
    <View style={{
            width: '33%', height: '50%', backgroundColor: 'steelblue'
        }} />
</View>
```

### Flexbox 布局

组件用于决定其子组件的布局方式。

属性：

- flexDirection
- alignItems
- justifyContent
- flex

React Native 中的 Flexbox 的工作原理和 web 上的 CSS 基本一致，当然也存在少许差异。首先是默认值不同：`flexDirection`的默认值是`column`而不是`row`，而`flex`也只能指定一个数字值。

flex 属性

当 flex 属性被用在一个组件的子组件中时，决定该子组件在主轴上如何**填满**父组件的可用区域。

### 标签

理解为 react-native 提供的一套 UI 组件。常用标签：

- View

  - 相当于 web 端的 div
  - 不支持设置字体颜色和字体大小等
  - 不能直接放文本内容
  - 不支持直接绑定点击事件

- Text

  - 文本标签，可以设置字体颜色和大小等
  - 支持绑定点击事件

- TouchableOpacity

  - 相当于块级容器
  - 支持绑定点击事件 onPress
  - 可以设置点击时的透明度

  ```jsx
  import { transform } from '@babel/core';
  import React from 'react';
  import { TouchableOpacity, Text } from 'react-native';

  const handlePress = () => {
    alert('hello');
  };

  const App = () => {
    return (
      //1 表示完全不透明，0表示完全透明
      <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
        <Text>hello world</Text>
      </TouchableOpacity>
    );
  };

  export default App;
  ```

  ![image-20211010213034575](..\typora-user-images\image-20211010213034575.png)

  ![image-20211010213046528](..\typora-user-images\image-20211010213046528.png)

- Image

  - 渲染本地图片
  - 渲染网络图片，且必须加宽高
  - 在 android 中使用 git 和 webp 格式的图片

  ![image-20211010213535004](..\typora-user-images\image-20211010213535004.png)

- ImageBackground 一个可以使用图片当作背景的容器，相当于以前的 div+背景图片 

  ![image-20211010213841334](..\typora-user-images\image-20211010213841334.png)

- TextInput

  输入框组件，可以通过 onChangeText 事件来获取输入框的值

  ```jsx
  import React from 'react';
  import { TextInput } from 'react-native';
  
  const ChangeText = (text) => {
    alert(text);
  };
  
  const App = () => {
    return <TextInput onChangeText={ChangeText}></TextInput>;
  };
  
  export default App;
  ```

  ![image-20211010214255232](..\typora-user-images\image-20211010214255232.png)

## react-native 项目代码的调试

方式一：使用谷歌浏览器调试

- 手机模拟器中按下 ctrl+m 后，选择 Debug 唤起谷歌浏览器调试
- 不能查看标签结构
- 不能查看手机发出的网络请求

解决查看不了网络请求的方法：

在项目的入口文件 index.js 中加入以下代码：

![image-20211010221430074](..\typora-user-images\image-20211010221430074.png)

方式二：使用 rn 推荐的工具 react-native-debugger

- 工具的下载地址：https://github.com/jhen0409/react-native-debugger/releases
- 在手机模拟器中 ctrl + m 后停止已开启的 Debug 调试，并关闭调试使用的浏览器
- 运行该工具的 exe 文件
- 打开手机模拟器的 ctrl + m 选择 debug 连接该调试工具

![image-20211010221937442](..\typora-user-images\image-20211010221937442.png)

![image-20211010222032085](..\typora-user-images\image-20211010222032085.png)

注意：

在 react-native 项目中也可以使用 axios，使用 npm 安装 axios 后需要重启项目。

## Mobx

react 中的全局数据管理库，可以简单的实现数据的跨组件共享，类似 vue 中的 vuex。

使用步骤：

- 安装依赖

  ```shell
  yarn add mobx mobx-react @babel/plugin-proposal-decorators
  ```

- 在 babel.config.js 文件中增加预设

  ```js
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]];
  ```

- 新建 mobx\index.js 用来存放全局数据

  mobx 是用过 class 语法来存放全局数据的。

  ```js
  import { observable, action } from 'mobx';

  class RootStore {
    @observable //es7中的装饰器语法  Object.defineProperty()
    key1 = value1;

    @action
    changeKey1(name) {
      this.key1 = name;
    }
  }

  export default new RootStore();
  ```

- 在根组件中进行挂载

  ```jsx
  import React, { Component } from 'react';
  import { View, Text } from 'react-native';
  import RootStore from 'mobx';
  import { Provider } from 'mobx-react';
  import Son from './son.jsx';

  class App extends Component {
    render() {
      return (
        <View>
          <Provider RootStore={RootStore}>
            <Son></Son>
          </Provider>
        </View>
      );
    }
  }

  export default App;
  ```

- 后代组件中使用并且能修改 mobx 中的数据

  ```jsx
  import React, { Component } from 'react';
  import { View, Text } from 'react-native';
  import { inject, observer } from 'mobx-react';
  @inject('RootStore')
  @observer
  class Son extends Component {
    render() {
      return (
        <View>
          <Text onPress={this.changeMobxKey1}>{this.props.RootStore.key1}</Text>
        </View>
      );
    }
    changeMobxKey1 = () => {
      this.props.RootStore.changeKey1('newValue');
    };
  }
  
  export default Son;
  ```

## 探花交友

### 项目框架搭建

- 创建项目：npx react-native init projectName

- 使用 React-navigation 搭建页面路由

  - 安装依赖：

    ```shell
    yarn add @react-navigation/native react-native-screens react-native-safe-area-context @react-navigation/native-stack
    ```

  - 代码实例：

    app.js

    ```jsx
    import React from 'react';
    import { Button, View, Text } from 'react-native';
    import { NavigationContainer } from '@react-navigation/native';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import Login from './src/pages/account/index.js';
  
    function HomeScreen({ navigation }) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Home Screen</Text>
          <Button title='Go To Profile' onPress={() => navigation.navigate('Profile')} />
        </View>
      );
    }
  
    function ProfileScreen({ navigation }) {
      return (
        <View>
          <Text>hello profile</Text>
        </View>
      );
    }
  
    const Stack = createNativeStackNavigator();
  
    function App() {
      return (
        <NavigationContainer>
          // 在Navigation的第六版中，隐藏应用头部的导航栏的方法：screenOptions=
          {{ headerShown: false }} headerMode="none"是第五版中的方法
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  
    export default App;
    ```

    ![image-20211011202839973](.\typora-user-images\image-20211011202839973.png)

    ![image-20211011202816614](.\typora-user-images\image-20211011202816614.png)

    Login.js:

    ```jsx
    import React, { Component } from 'react';
    import { View, Text } from 'react-native';
  
    class Login extends Component {
      render() {
        return (
          <View>
            <Text>hello login</Text>
          </View>
        );
      }
    }
  
    export default Login;
    ```

- 新建登录页面

  在 RN 中宽高之类的是不能带具体单位的。这些属性的默认单位是 dp，而在开发时，UI 给到的一般是 px。所以需要进行转换。转换的单位的公式： 设计稿的宽度 / 元素的宽度 = 手机屏幕 / 手机中元素的宽度。

  手机默认有自己的状态栏和默认的样式。如果希望对状态栏进行设置，有特定的组件完成。

  元素宽高单位转换工具：

  ```jsx
  import { Dimensions } from 'react-native';
  
  //手机屏幕的宽度
  export const screenWidth = Dimensions.get('window').width;
  
  //手机屏幕的高度
  export const screenHeight = Dimensions.get('window').height;
  
  // 设计稿的宽度 / 元素的宽度 = 手机屏幕  / 手机中元素的宽度
  
  /*
   *元素宽高转换方法
   *@param {Number} elementPx
   */
  export const pxToPd = (elementPx) => (screenWidth * elementPx) / 375;
  ```

  注意点：

  - Image 图片标签

    ```jsx
    <Image
      style={{ width: '100%', height: pxToPd(200) }}
      source={require('../../../assets/profileBackground.jpg')}
    />
    ```

  - StatusBar 状态栏标签

    ```jsx
    <StatusBar backgroundColor='transparent' translucent={true} />
    ```

  - Input 输入框标签，来自 react-native-elements

    ```shell
    npm install react-native-elements
    
    # or with yarn
    yarn add react-native-elements


    npm install react-native-vector-icons
    
    # or with yarn
    yarn add react-native-vector-icons
    
    import { Input } from 'react-native-elements';

![image-20211012230149721](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211012230149721.png)

![image-20211012230025490](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211012230025490.png)

对于这个项目，将页面路由单独抽取到一个文件中——RootNav.js 中，方便对路由进行统一的管理。

## react-native 脚手架创建的项目的结构

![image-20211006170013559](..\typora-user-images\image-20211006170013559.png)

`__test__`:存放单元测试的代码。

android：内部存放的是一个完整的 android 原生项目代码，可以使用 Android Studio 打开运行。常常使用里面和 android 客户端编译相关的一些配置文件。后期引入第三方插件时，要在 android 客户端生效，就需要对该目录下的文件进行编辑。

ios：内部存放的是一个完整的 ios 原生项目代码，可以使用 Xcode 打开运行。同 android 目录一样。

在 android 或者 ios 目录中的代码有任何修改都需要重新编译 ，命令行是：yarn android 或者 yarn ios。

node_modules:js 的第三方库存放目录。

`.buckcongif 到 .watchmancongih`:都是辅助工具的一系列配置文件。

app.json:react-native 的配置文件，配置像应用的名称和基本属性。

App.js：项目的示范代码，项目的根组件，很多设置都是在根组件中设置的。

Babel.config.js:babel 的配置文件。

index.js:项目固定的入口文件，文件名和扩展名都不能改动。

metro.config.js:类似于 webpack.config.js 的一个打包器的配置文件。

package.json 和 yarn.lock 不再多说。

## 在上述的项目结构下另增的项目结构安排：

- assets：存放项目中使用到的静态资源文件，如图片，字体等。传统的有两种做法：1. 把项目中使用到的所有资源都放在 assets 目录中； 2. 资源跟随代码走，比如首页组员会在首页代码目录下再创建一个子目录用于存放首页中使用到的资源文件
- patches：打补丁文件存放的目录。为什么要有这个目录？开源社区中的开源项目，总免不了碰上 bug，没有实现的需求功能，需求偏差等。当自己碰到 bug 或者 自己项目的需求该开源项目存在偏差。所以打补丁是一种很常见的行为。
- scripts：辅助性的自动化脚本
- src：项目源码
  - components：全局都可能复用的组件
  - screens:全屏页面组件
    - home-screen
      - components
    - profile-screen
      - components
    - ....
  - routers
  - redux-state
    - actions.js
    - store.js
    - selector.js
    - reducers 目录
  - types(ts 项目中)
  - utils
  - App.js

### 项目的初始配置

前端不会有的问题，但应用端可能会碰到。

#### 应用的网络权限的修改

- 在新版的 ios9 及 Android9 开始，新建的一个空白项目默认是不能访问 http 接口，只能访问 https 接口；

  解决办法：

  - 在 ios 中，在项目的 ios 目录中和项目同名的目录中有一个 Info.plist 文件，该文件中的 key `<key>NSAppTransportSecurity</key>`控制着传输的安全。需要在该字段下加上一个值：

  ```
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  ```

  ![image-20211006195644565](..\typora-user-images\image-20211006195644565.png)

  - 在 Android 中，在项目的 android 目录下 android\app\src\debug\AndroidManifest.xml 中的 usesCleartextTraffic 表示允许使用 http 接口

  ![image-20211006195917256](..\typora-user-images\image-20211006195917256.png)

注意：AndroidManifest 文件有两个，一个在 debug 目录中，一个在 main 目录中。一个对应开发环境一个对应生产环境。

在 main 目录中的 AndroidManifest 文件中是没有自动设定 usesCleartextTraffic 属性为 true 的。所以意味着在生产环境下默认的配置是无法访问 http 接口的。所以需要手动添加 usesCleartextTraffic。

![image-20211006200120011](..\typora-user-images\image-20211006200120011.png)

![image-20211006200342593](..\typora-user-images\image-20211006200342593.png)

手动添加 usesCleartextTraffic="true"

![image-20211006200557878](..\typora-user-images\image-20211006200557878.png)

在 ios 应用的权限配置文件是 Info.plist

```
<key>NSLocationWhenInUseUsageDescription</key>   //定位权限，定位时需要向用户说明为什么使用定位权限
<string>'请求获取您的地理位置，以方便为您提供后续服务'</string>
```

在 Android 应用的配置文件 AndroidManifest.xml 中默认只给了一个权限："android.permission.INTERNET"，网络权限

```
<uses-permission android:name="android.permission.INTERNET" />
```

手动增加其他权限：

```
<uses-permission android:name="android.permission.CAMERA" />   //相机权限
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />  //地理位置精确定位权限
```

![image-20211006194228243](..\typora-user-images\image-20211006194228243.png)

![image-20211006192426481](..\typora-user-images\image-20211006192426481.png)

![image-20211006192457026](..\typora-user-images\image-20211006192457026.png)

![image-20211006192541107](..\typora-user-images\image-20211006192541107.png)

![image-20211006192609209](..\typora-user-images\image-20211006192609209.png)

react-native 项目使用的自动打包工具是 Metro。一般的网页项目使用的是 webpack 进行打包，webpack 默认不会转码 node_modules 中的文件，node_modules 中的文件都是事先转码打包好的。Metro 则可以转码 node_modules 中的文件。

在 node_modules 中去修改网页端的使用的第三方包的时候，绝大多数情况下没法直接改源码，即便该包中包含源码，而自己去改源码，自己的项目可能也不会生效。因为一般引用的 node_modules 中的第三方包都是该开源项目已经打包压缩过的文件而非直接引用的源码（而自己改的是源码）。除非将修改后的源码再次打包生成新的打包文件以提供给项目引用。

依赖包的依赖包存在的问题：

package.json 中的 resolutions 字段中可以指定间接依赖的包的版本。只有 yarn 有效，npm 不支持该字段。

```js
{
  "name": "project",
  "version": "1.0.0",
  "dependencies": {
    "left-pad": "1.0.0",
    "c": "file:../c-1",
    "d2": "file:../d2-1"
  },
  "resolutions": {
    "d2/left-pad": "1.1.1",   //表示指定项目依赖d2包下的间接依赖left-pad的版本号
    "c/**/left-pad": "^1.1.2"，
    "**/metro":"0.60.0"    //表示指定项目依赖包下的间接依赖metro的版本号
  }
}
```

## 给开源项目打补丁（重点）

扩展：如何修复第三方开源项目的问题

方式一：

一般通过 npm install packageName 或者 yarn add packageName 安装一般都是安装最新的稳定版本。但是通过命令行指令： npm info packageName 还可能看到其它版本。 npm install packageName 只是安装的最新的稳定版的包版本，而不是时间上最新的版本。所有有可能对应的问题在包的测试版中修复了而在正式版中还没有修复。 所有开发者可以尝试一下安装最新测试版本

如下图： npm info react

![image-20211006172741111](..\typora-user-images\image-20211006172741111.png)

![image-20211006173042008](..\typora-user-images\image-20211006173042008.png)

一般 next 表示更新的测试版本： npm install react@next

或者直接安装 github 地址： `npm intall https://github.com/xxxxxx/xxx`

方式二：

自己 fork 一份开源项目代码，然后将代码 clone 到本地后进行按需修改，编辑后提交并推送到自己 fork 下来的仓库，自己下载该仓库的包或者自己去 npm 发布一份，在自己的项目中安装自己 npm 发布的包。

方式三：

最不建议的就是将项目下载下来后，直接去 node_modules 中去找到源码并修改。这样修改了 git 并不会对它进行版本控制，同事也无法得知自己的修改，一旦重新安装项目依赖，以前的修改将自动失效。

如果要这样做的话，就必须借助其他工具来记录这些修改。

工具——patch-package

使用:

```
npm i patch-package

yarn add patch-package postinstall-postinstall
```

package.json:

```js
"script":{
    "postinstall":"patch-package"
}
```

然后在 node_modules 目录中找到对应的第三方的包进行源码修改。修改后保存。

然后在命令行中运行 npm run postinstall 。运行后就会对包修改前后的内容进行比较，并将差异生成文件存放在 patches 目录中。这样就完成了补丁的修改。这时即使删除项目中的 node_modules 目录后，下次再安装项目依赖后，patch-package 会自动使用之前记录下来的补丁文件对第三方包的源码进行修改。

![image-20211006180742011](..\typora-user-images\image-20211006180742011.png)

![image-20211006181108022](..\typora-user-images\image-20211006181108022.png)

## 导航器

应用中的页面跳转有栈式,tab 标签式，抽屉式导航。

React Navigation（栈式导航）第 5 版

面试题：你做过什么项目？（项目亮点）

注意：

- 不要罗列
- 项目中的角色，内容，设计等有没有别人做不到的
  - 项目架构设计方面，抛开代码自己做了什么设计（可以参考 vue3 工程化体系）
    1. 项目规范，怎么构建设计的规范，怎么在代码中强化规范，自动化发布中如何执行规范
    2. 工程化
    3. 发布部署
    4. git 分支如何管理
    5. webpack 中 loader 或者 plugins
  - 实际需求的深化
    1. 日常业务中如何训练自己提高项目需求的两点
    2. 网速不稳定
    3. 数据量变大
    4. 交互上的优化（参考 ant-design，element-ui）
  - 团队角度，做过什么提升全体开发效率或者代码质量的事

微观技术亮点例子：

1. 文件上传

   `<input type='file'/>` + axios.post + formData + 进度条

   考点：

   - 图片文件信息
   - 文件大小校验
   - 字符串和十六进制 ascii 码
   - 大文件

   亮点：超大文件的上传以 GB 为单位的文件上传，文件没有 post 上传完，网络不稳定，断网，则整个文件就需要重新上传，这就造成了极大浪费。这时就不要采用 post 上传。

   解决方案：

   - 断点 + 续传

     将文件切分为小片段，分片段上传，下次续传。断点续传需要给文件加上一个唯一标识，常见的就是计算文件的 md5。 但是计算大型文件的 md5 可能需要数十秒钟，巨大计算量导致的卡顿如何解决（可考虑：webworker，抽样（损失一点正确率以换取效率的大提升），fiber（空闲时间计算））

     ````js
     createFileChunk(file, size=Size){
         //生成文件块
         const chunks = [];
         let cur = 0;
         while(cur<file.size){
             chunks.push({file:file.slice(cur,cur + size)});
             cur += size
         }
         return chunks
     }
     async uploadChunks (uploadedList=[]){
         const list = this.chunks.filter(chunk => uploadedList.indexOf(chunk.hash)===-1).map(({chunk, hash, index},i)=>{
             const form = new FormData();
             form.append('chunk', chunk);
             form.append('hash', hash);
             form.append('filename', this.container.file.name);
             form.append('fileHash', this.container.hash);
             return { form, index, status:Status.wait };
         }).map(({form, index})=>request({
             url:'/upload',
             data:form,
             onProgress:this.createProgresshandler(this.chunks[index]),
             requestList:this.requestList
         }));
     }
     ```



- **使用 webworker 计算 hash**

 ```js
 //使用webworker计算hash
 async calculateHash(chunks){
     return new Promise(resolve=>{
         //web-worker 防止卡顿主线程
         this.container.worker = new worker('/hash.js')
         this.container.worker.postMessage({chunks})
         //开启web-worker的异步监听事件
         this.container.worker.onmessage = e =>{
             const { progress, hash } = e.data
             this.hashProgress = Number(progress.toFixed(2))
             if(hash){
                 resolve(hash)
             }
         }
     })
 }
 ```



 ```js
 self.importScripts('spark-md5.min.js');
 self.onmessage = (e) => {
   const { chunks } = e.data;
   const spark = new self.SparkMD5.ArrayBuffer();
   let progress = 0;
   let count = 0;
   const loadNext = (index) => {
     const reader = new FileReader();
     reader.readAsArrayBuffer(chunks[index].file);
     reader.onload = (e) => {
       //累加器不能依赖index
       count++;
       //增量计算md5
       spark.append(e.target.result);
       if (count === chunks.length) {
         //通知主线程计算结束
         self.postMessage({
           progress: 100,
           hash: spark.end()
         });
       } else {
         //每个区块计算结束通知进度
         progress == 100 / chunks.length;
         self.postMessage({
           progress
         });
         //计算下一个
         loadNext(count);
       }
     };
   };
 };
 //启动
 loadNext(0);
 ```

 - **时间切片计算 md5 值，根据浏览器的机制抽空执行 js**

 ![image-20211009171825279](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211009171825279.png)

 ![image-20211009171851360](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211009171851360.png)

 ![image-20211009171901723](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211009171901723.png)

 ![image-20211009171943959](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211009171943959.png)

 ![image-20211009171958469](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20211009171958469.png)

 ```js
 const workLoop = async (deadline) => {
   //有任务且当前帧还没有结束
   while (count < chunks.length && deadline.timeRemaining() > -1) {
     await appendToSpark(chunks[count].file);
     count++;
     if (count < chunks.length) {
       //计算中
       this.hashProgress = Number(((100 * count) / chunks.length).toFixed(2));
     } else {
       //计算完毕
       this.hashProgress = 100;
       //计算任务结束
       resolve(spark.end());
     }
     //当前帧没有时间了，说明浏览器有开始渲染任务了，如果你把渲染任务耽搁了就会卡顿
     //等待下次空闲时间再计算
     window.requestIdleCallback(workLoop);
   }
   //利用空闲时间启动workLoop
   window.requestIdleCallback(workLoop);
 };
 ```

 - 抽样计算 hash

   ![image-20211009173003733](..\typora-user-images\image-20211009173003733.png)

  ```jsx
   let cur = offset;
   while (cur < size) {
     if (cur + offset >= size) {
       chunks.push(file.slice(cur, cur + offset));
     } else {
       const mid = cur + offset / 2;
       const end = cur + offset;
       chunks.push(file.slice(cur, cur + 2));
       chunks.push(file.slice(mid, mid + 2));
       chunks.push(file.slice(end, end + 2));
     }
     cur += offset;
   }
   render.readAsArrayBuffer(new Blob(chunks));
   reader.onload = (e) => {
     spark.append(e.target.result);
     resolve(spark.end());
   };
  ```

 亮点：交互上的优化

   解决方案：

   - 拖拽上传
   - 粘贴上传(比如掘金中本地图片直接粘贴到线上的文章编辑区域就能展示)

   亮点：上传文件的格式限定

   解决方案：

   - 最简单的就是文件.type 或者 name.splite( '.' )[1] ==='xxx'，这样做有隐患，可以修改文件后缀来骗过（没有亮点）

   - 使用图片的二进制信息来读取文件的格式以满足要求，jpg 图片的十六进制数据中以 FFD8 开头，以 FFD9 结尾。无论文件后缀被人为的修改为其他任何格式，二进制数据也都是不会变的。（亮点）**文件头信息**（百度）

     ![image-20211006224526212](..\typora-user-images\image-20211006224526212.png)

   亮点：切好文件片段和计算好 md5 后，如果直接使用 promise.all 同时发起许多个 tcp 请求也会卡顿

   解决方案：（字节跳动面试）

   - 并发数控制 + 错误重试

   亮点：一个切片的大小怎么定,pc 端和移动端对切片的大小要求是不一样的，所以不能固定不变。

   解决方案：

   - 借鉴 tcp 的慢启动逻辑先发小包，根据响应时间动态调整切片大小

   有 100 个请求异步任务，如何同时发起多个请求？

   浏览器本身对于同时发起网络请求的个数是限制的。

2. 列表渲染

   亮点：要展示的数据量很大

   解决方案：

   - 分页（pc 端）
   - 滚动刷新（移动端）
     - 虚拟滚动，andt4.0 自带功能

宏观技术亮点例子：

从开发到上线的所有过程，工程化。

1. 规范(多参考 vuejs 源码的管理方式)

   - eslint
   - 命名规范，文件、变量、类、常量命名规范
   - git 规范，分支管理，log 规范
   - 组件规范
   - 使用 git hook 去校验规范
   - ....

2. 技术选项
   - Vue.js 还是 React, 看团队的人
   - 语言扩展库（lodash 还是自己写）
   - 日期库，组件库，数据，路由...
   - SSR（首屏性能与 SEO）
     - 从 0 开始的，next 或者 nuxt 等 SSR 框架
     - 已经成型的话，可以重构，也可以通过静态化，puppeteer 等方式 hack 一下
3. 通用逻辑分装
   - axios 拦截器
   - 权限拦截
   - .......
4. webpack 的优化
   - 性能分析，bundle-analysis
   - gzip, dll, 懒加载
   - preload， prefetch
   - 性能优化
   - 自定义 loader 或者 plugin
   - .....
5. 通用组件库
   - 组件库的基本设计，参考 element-ui，ant-design
   - 私有 npm
   - .....
6. 进阶
   - lowcode
   - 自动化部署，git + gitlab + 钉钉推送
   - 性能同级
   - 报错同级，sentry
   - coderview 流程
     - 代码审核，写代码后不能直接 merge master，要给一个同事审核
   - ........

App 的桌面图标和启动画面

- 如何生成多种尺寸的应用图标
- 如何配置启动画面

App 的过度页面和轮播效果

- 如何使用轮播组件
- 在过度画面的背后操作本地的各种应用状态

App 的注册登录和账户管理

- 输入手机号码获取验证码短信
- 输入验证码进行登录
- 如何发送请求，如何搭建 nodejs 项目并在服务器端发送真实的短信
- 更改头像和个人资料

视频的配音制作页面

- 选择本地视频文件
- 上传视频文件
- 生成静音视频
- 增加倒计时倒计时结束开始配音
- 配音结束后的预览
- 填写作品标题提交到后台进行音视频合并
- 前后端配合实现上传，监听上传进度并展示到客户端

React-Native 在语法层面的优势：

- 它是纯 JavaScript 组件化开发，不夹杂其他语言
- 它的技术框架允许开发者方便的介入和调用到各个平台下的 api
- 它的布局采用 flex 布局
- 开发时用 JavaScript 编程，但运行时调用的是原生组件，性能有提高

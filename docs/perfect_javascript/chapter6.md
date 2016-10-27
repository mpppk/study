# Chapter6

---
## 6-2-1 関数宣言の巻き上げ _P159_

```js
// P160
function doit(){
    fn();
    function fn(){ print('called') }
}

function doit2(){
    fn();
    var fn = function(){ print('called') };
}

doit(); // => 'called'
doit2(); // => TypeError: fn is not function

```

---
## 6-3-1 argumentsオブジェクト _P160_
* 関数に渡された引数の情報は、argumentsオブジェクトに格納される
* argumentsは配列風だが、配列ではない

```js
function fn(){ return arguments; }

fn(1); // => 1
fn(1, 2, 3); // => [1, 2, 3]
fn(1, 2, 3).length; // => 3 (配列っぽい)

[1, 2, 3].forEach((v) => print("v:" + v)); // v:1 v:2 v:3
fn(1, 2, 3).forEach((v) => print("v:" + v)); // TypeError: fn().forEach is not a function (配列じゃないっぽい)
```

---
## 6-4 スコープ _P162_

---
### 関数スコープ
* jsの変数は関数スコープを持つ
    * 入れ子の関数は、関数の外側へ向かって変数を探す(スコープチェーン)
    * ブロックスコープではない

```js
var x = 1;
function f(){
    print("x1:" + x);
    var x = 2;
    print("x2:" + x);
}

f(); // x1: undefined x2: 2

function loop(){
    var i = 999;
    for(var i = 0; i < 10; i++){
        setTimeout(function(){
            print(i);
        }, 1);
    }
    print("last: " + i);
}
loop(); // => "last: 10" 10 10 10 10 10 10 10 10 10 10
```

---
### let
* letで宣言した変数はブロックスコープを持つ

```js
function letLoop(){
    var i = 999;
    for(let i = 0; i < 10; i++){
        setTimeout(function(){
            print(i);
        }, 1);
    }
    print("last: " + i);
}
letLoop();// => "last: 999" 0 1 2 3 4 5 6 7 8 9
```

---
## Callオブジェクト / スコープチェーン
* 関数を呼び出すと、Callオブジェクトが暗黙的に生成される
* 関数が終了すると、Callオブジェクトは破棄される
* 関数で宣言された変数はCallオブジェクトのプロパティになる
* 変数を探す際には、まず自身のCallオブジェクトのプロパティを探し、次に呼び出し元のCallオブジェクトのプロパティを探す(ブロックチェーン)

---
## 6-7 クロージャ _P162_
```js
function f(){
    var cnt = 0;
    var g = function(){
        return cnt++;
    }
    return g;
}
var g2 = f(); // 状態を持つメソッド
g2();g2();g2();// => 0 1 2
```

* 関数fのプロパティに関数gが追加される
    * fを呼び出した際のCallオブジェクト(Call-fとする)のプロパティにgが追加される
* f()から生成されたgは変数g2から参照されている限りGCの対象にならない
* gが存在する限り、gをプロパティとして持つCall-fとそのプロパティであるcntは破棄されない

---
### 6-7-4 モジュール _P178_
* 複数のメソッドやオブジェクトをオブジェクトのプロパティにしてしまえば、グローバル名前空間に公開する変数名を減らすことができる

```js
var MyModule = {
    f: function(){return 0},
    o: {x: 1}
}
MyModule.f(); // 0
MyModule.o.x; // 1
```

---
### 即時実行関数
* 関数を定義し、即座に実行するイディオム
* 関数スコープを作り出すために利用される
```js
(function(){})()
```

---
### プロパティのアクセス制御
* 即時実行関数を利用することで、privateなプロパティやメソッドを作ることができる

```js
var getThree = (function(){
    function sum(a, b){ return a + b }
    var obj = {x: 1, y: 2};
    return function(){
        return sum(obj.x, obj.y);
    }
})();

getThree(); // 3
getThree.sum; // undefined
getThree.obj; // undefined
```

---
### プロパティのアクセス制御(クラス)

```js
var MyClass = function(startCnt){
    var cnt = startCnt || 0; // private property
    return {
        countUp: function(){ return cnt++ }
    };
};

var myClass = MyClass(5);
myClass.countUp(); // 5
myClass.countUp(); // 6
myClass.cnt; // undefined
```

---
### 6-8 コールバック _P182_

```js
// 本よりもシンプルにするために、callbackを複数登録できないようになっているので注意
var emitter = {
    msg: "emitter msg",
    callback: function(){ print("nothing"); },
    register: function(f){ this.callback = f; },
    onOpen: function(){ this.callback(); }
}

emitter.onOpen(); // => "nothing"
emitter.register(function(){ print("listener"); });
emitter.onOpen(); // => "listener"
```

---
## 状態を持つコールバック関数

```js
// オブジェクトのプロパティをthisで参照しようとしても上手くいかない
var obj = {msg: "msg", showMsg: function(){print(this.msg);}};
emitter.register(obj.showMsg);
emitter.onOpen();// => undefined

// bindでthisを差し替えた関数オブジェクトを生成して渡す
emitter.register(obj.showMsg.bind(obj));
emitter.onOpen(); // => "msg"

// クロージャを使う方法もある
emitter.register(
    (function(){
        var msg = "msg2";
        return function(){ print(msg); };
    })()
);
emitter.onOpen(); // => "msg2"

// es2015だとスッキリかける
{ let msg = "msg3"; emitter.register( () => print(msg) ); }
emitter.onOpen(); // => "msg3"
```

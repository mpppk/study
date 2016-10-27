# Chapter 5
## ⬇

--
## 5-2 変数の代入 _P110_
* 値型変数の代入は値渡し
* 参照変数の代入は全て参照の値渡し

```js
var a = 1;
var b = a;
++b; // 2
a; // 1

var oa = {a: 1}
var ob = oa;
++ob.a; // 2
oa.a; // 2
ob = {a: 3}
oa.a; //2

var fa = 1;
function(fb){return ++fb;}(fa); // 2
fa; // 1
```

--
## 5-21 グローバルオブジェクト _P154_
* 「グローバル変数」は「グローバルオブジェクトのプロパティ」
* window変数はグローバルオブジェクトの自己参照変数

```js
var a = 1;
this.a; // 1
function fn(){};
'fn' in this; // true
```

--
## 5-7-2 コンストラクタとnew式 _P121_
* あらゆる関数はnew式によるコンストラクタ呼び出しが可能
    * 通常、関数は関数呼び出し/コンストラクタ呼び出しのどちらかのみを想定して作る
    * 便宜上、コンストラクタ呼び出しを意図する関数をコンストラクタと呼ぶ
* new式は空のオブジェクトを生成し、コンストラクタ内のthisはそのオブジェクトを参照する

```js
function MyClass(x){ this.x = x; }
var obj = new MyClass(1);
obj.x; // 1
```

--
## 5-8 プロパティへのアクセス _P124_
* ２通りの方法がある
    * ドット演算子(.)
    * ブラケット演算子([])
        * 与えられた式の文字列値で参照する

```js
var obj = {x:1, y=2};
print(obj.x); // => 1
var x = 'y';
print(obj[x]); // => 2
```

プロパティ | 例
----- | ----
数値やハイフン | `obj["1-2"]`
変数の値 | `var x = "y"; obj[x];`
式の評価結果 | `obj["x" + "y"]`

--
## 5-10 属性 (1) _P129_
### プロパティは複数の属性を持つ
* value属性
    * プロパティ値=value属性
* enumerable属性
    * for inで列挙するかどうか

    ```js
    var map = {};
    'toString' in map; // => true
    for(var key in map){ print(key); } // => 何も列挙されない
    ```

--
## 5-10 属性 (2) _P129_
* preventExtensions, seal, freeze
    * プロパティの追加、変更、削除を禁止する
    * 内部ではconfigurable属性やwritable属性を変更している

* get, set
    * プロパティにアクセスした際の処理を定義できる

--
## 5-14 this参照 _P134_
レシーバオブジェクトを参照する変数

```js
var obj = {x: 1, fn: function(){print(this.x)}};
obj.fn()); // =>1 (fnのレシーバオブジェクトはobj)
```

### this参照の特殊なケース
* コンストラクタ呼び出し
* トップレベルコードのthis参照先はグローバルオブジェクト
    * グローバル変数はグローバルオブジェクトのプロパティであるため
* apply/call/bindメソッドによるthisの変更

--
## コンストラクタ呼び出し(再掲)

```js
function MyClass(x){ this.x = x; }
var obj = new MyClass(1);
obj.x; // 1
```

## トップレベルコードのthis

```js
var x = "global";
var obj = {x:"obj", fn: function(){return this.x}};
obj.fn(); // => "obj"
var fn = obj.fn;
fn(); // => "global"
```

--
## apply/call/bindメソッドによるthisの変更

```js
var x = "global";
var f = function(a, b){return this.x + "_" + a + "_" + b};
var obj = {x: "obj"};

f();// => "global_undefined_undefined"

f.apply(obj); // => "obj_undefined_undefined"
f.apply(obj, ["a", "b"]); // "obj_a_b"

f.call(obj); // => "obj_undefined_undefined"
f.call(obj, "a", "b"); // => "obj_a_b"

var bindedF = f.bind(obj);
bindedF(); // => "obj_undefined_undefined"
bindedF("a", "b"); // => "obj_a_b"
```

--
# 5-16 Prototype _P137_

--
## コンストラクタを使用したインスタンス生成の問題点
* プロパティのアクセス制御(public, private)ができない
    * get/set属性を利用
    * クロージャを利用(=> 6章)
* 複数のインスタンスを生成するとメモリ/実行効率が良くない
    * 全インスタンスがメソッド定義の実態のコピーを持つため
    * **Prototype継承を利用**

--
## Prototype継承
* 全ての関数はprototypeプロパティを持つ
* 全てのオブジェクトは生成に使ったコンストラクタのprototypeオブジェクトへの暗黙リンクを持つ
    * 仕様ではないが、実装上、暗黙リンクは`__proto__`プロパティとして表現される
* オブジェクトのプロパティを探す際には暗黙リンクを順番にたどっていく

```js
var C = function(){}
C.prototype.x = 1;
C.y = 2;
var c = new C();
Object.prototype.z = 3;
c.prototype.zz = 4; // TypeError: Cannot set property 'zz' of undefined
print(c.x); // 1
print(c.y); // undefined
print(c.z); // 3
print(c.zz) // undefined 
```

--
## 5-17 型判定 _P144_
### instanceof / isPrototypeOf

```js
function Derived(){}
function Base(){}
Derived.prototype = new Base();
var obj = new Derived();

obj instanceof Derived; // true
Derived.prototype.isPrototypeOf(obj); // true (上のコードと同じ)

obj instnceof base; // true
obj instanceof Object; // true
```

### Duck Typing

```js
var duck = {sound: "quack"};
var cat = {sound: "myaa"};
var animal = Duck; // or Cat

if('sound' in animal){ animal.sound(); }// 何の動物でも鳴けるなら鳴かせる
```

--
## 5-18 Object.create _P148_
プロトタイプを指定してオブジェクトを生成できる

```js
'toString' in Object.create(null); // => false
var obj = Object.create({x:1}); // obj.x => 1
var obj = Object.create(Object.prototype, {
    x: {value:1, writable:true, enumerable:true, configurable:true}
}); // 上のコードと等価
```

--
## 5-19 様々な標準オブジェクト _P152_
* Object (全てのクラスの基底クラス)
    * Objectへの変更は影響が大きすぎるので極力避ける
* グローバルオブジェクト
    * 決まった名前の変数に格納されているわけではない
    * トップレベルでのthisに格納されている
    * クライアントJSではwindowオブジェクトに格納される
* Math (数学系のメソッドを直接呼ぶUtil Class)
    * インスタンスは生成できない
* Error (エラーを表すクラス)

---
# Chapter5 idioms
## ⬇

--
## 5-5 変数の存在チェック _P115_
### ||代入
* aが値を持っていなければbを代入するイディオム
    * `||`の返り値はbooleanではない
* デフォルト引数の表現にも使える

```js
var a == true ? a : b; 
var a = a || b; // 上式と等価
```

### undefined判定
```js
var obj = {};
obj.hoge === undefined; // true
var undefined = "define";
obj.hoge === undefined; // 実行環境によってはfalse
typeof obj.hoge === 'undefined'; // true
``` 

---
Appendix: 
# Chapter5 in ES-NEXT
## ⬇

--
## class

## Map

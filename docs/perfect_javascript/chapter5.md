# Chapter 5
## ⬇

--

## 変数の代入
* 値型変数の代入は値渡し
* 参照変数の代入は全て参照の値渡し

--

## global object
* 「グローバル変数」は「グローバルオブジェクトのプロパティ」
* window変数はグローバルオブジェクトの自己参照変数

--

## コンストラクタとnew式
* あらゆる関数はnew式によるコンストラクタ呼び出しが可能
    * 通常、関数は関数呼び出し/コンストラクタ呼び出しのどちらかのみを想定して作る
    * 便宜上、コンストラクタ呼び出しを意図する関数をコンストラクタと呼ぶ
* new式は空のオブジェクトを生成し、コンストラクタ内のthisはそのオブジェクトを参照する
* コンストラクタで参照型の値をreturnするとnew式はその値を返す
    * ややこしいので使わないほうが良い

--

## コンストラクタを使用したインスタンス生成
### cons
* プロパティのアクセス制御(public, private)ができない
* 複数のインスタンスを生成するとメモリ/実行効率が良くない
    * 全員スタンスがメソッド定義の実態のコピーを持つため

--

## プロパティのアクセス
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

* ブラケット演算子でしか表現できないプロパティ名
    * 数値やハイフン
    * 変数の値
    * 式の評価結果

--

## 属性 (1)
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

## 属性 (2)
* preventExtensions, seal, freeze
    * プロパティの追加、変更、削除を禁止する
    * 内部ではconfigurable属性やwritable属性を変更している

* get, set
    * プロパティにアクセスした際の処理を定義できる

--

## this参照
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

## Prototype

--

## Prototype Chain
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

## 型判定
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

## Object.create
プロトタイプを指定してオブジェクトを生成できる

```js
'toString' in Object.create(null); // => false
var obj = Object.create({x:1}); // obj.x => 1
var obj = Object.create(Object.prototype, {
    x: {value:1, writable:true, enumerable:true, configurable:true}
}); // 上のコードと等価
```

--

# built-in objects
標準オブジェクト

--

## 様々な標準オブジェクト
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

## ||代入
* aが値を持っていなければbを代入するイディオム
    * `||`の返り値はbooleanではない

```js
var a == true ? a : b; 
var a = a || b; // 上式と等価
```

* デフォルト引数の表現にも使える

--

## undefined判定
```js
typeof hoge !== 'undefined'
``` 

--

## 

---

Appendix: 
# Chapter5 in ES-NEXT
## ⬇

--

## class

## Map

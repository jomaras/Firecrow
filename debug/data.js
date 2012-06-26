
/*********** Test: 1  ************/
/*;
function foo(a)
{
	return a + 1;
}
var a = 3;
var b = 4, c = 5;
var d = foo(b);
function bar()
{ 
	return 3; 
}
bar();
;*/

 testData.push(;
function foo(a)
{
	return a + 1;
}
var a = 3;
var b = 4, c = 5;
var d = foo(b);
function bar()
{ 
	return 3; 
}
bar();
; 
);
/*********** Test: 2  ************/
/*/*01*/;
/*02*/function test()
/*03*/{
/*04*/	var a = 3;
/*05*/	
/*06*/	function test1(b)
/*07*/	{
/*08*/		var c = a + b;
/*09*/		return c;
/*10*/	}
/*11*/	
/*12*/	return test1(3);
/*13*/}
/*14*/
/*15*/test();
/*16*/;*/

 testData.push(/*01*/;
/*02*/function test()
/*03*/{
/*04*/	var a = 3;
/*05*/	
/*06*/	function test1(b)
/*07*/	{
/*08*/		var c = a + b;
/*09*/		return c;
/*10*/	}
/*11*/	
/*12*/	return test1(3);
/*13*/}
/*14*/
/*15*/test();
/*16*/; 
);
/*********** Test: 3  ************/
/*;
var sum = 0;
for(var i = 0; 
    i < 10; 
    i++
   )
{
	sum += i;
}
;*/

 testData.push(;
var sum = 0;
for(var i = 0; 
    i < 10; 
    i++
   )
{
	sum += i;
}
; 
);
/*********** Test: 4  ************/
/*;
var sum = 0, i = 0;
while(i < 3)
{
	sum += i;
	i++;
}
;*/

 testData.push(;
var sum = 0, i = 0;
while(i < 3)
{
	sum += i;
	i++;
}
; 
);
/*********** Test: 5  ************/
/*;
var sum = 0, i = 0;
do
{
	sum += i;
	i++;
}
while(i < 3);

i++;
;*/

 testData.push(;
var sum = 0, i = 0;
while(i < 3)
{
	sum += i;
	i++;
}
; 
);
/*********** Test: 6  ************/
/*;
function obj()
{
	this.a = "2";
}

var a = new obj();
;*/

 testData.push(;
function obj()
{
	this.a = "2";
}

var a = new obj();
; 
);
/*********** Test: 7  ************/
/*;
var obj = {
	a: 3,
	b: "4",
	c: function()
	{
		return 3;
	},
	d: {
		c : 'd'
	}
};

var b = 3, c = 4;

c = b;
b = obj.a;
;*/

 testData.push(;
var obj = {
	a: 3,
	b: "4",
	c: function()
	{
		return 3;
	},
	d: {
		c : 'd'
	}
};

var b = 3, c = 4;

c = b;
b = obj.a;
; 
);
/*********** Test: 8  ************/
/*;
	var a = [1,2,3];
	
	var b = a[0] + a[1] + a[2];
;*/

 testData.push(;
	var a = [1,2,3];
	
	var b = a[0] + a[1] + a[2];
; 
);
/*********** Test: 9  ************/
/*;
var obj = {
	a : 3,
	b : 4,
	c : "test"
};

var propValues = "";

for(var key in obj)
{
	propValues += obj[key];
}
;*/

 testData.push(;
var obj = {
	a : 3,
	b : 4,
	c : "test"
};

var propValues = "";

for(var key in obj)
{
	propValues += obj[key];
}
; 
);
/*********** Test: 10  ************/
/*;
var a = 4;
var b = true;

if(a%3 == 0)
{
	b = false;	
}
else if (a % 2 == 1)
{
	b = true	
}
else
{
	b = true;
}

var c = 3;

if(c == 3)
{
	c = 4;
}

if(c == 3)
{
	c = 4;
}
else
{
	c = 5;
}

c = 6;
;*/

 testData.push(;
var a = 4;
var b = true;

if(a%3 == 0)
{
	b = false;	
}
else if (a % 2 == 1)
{
	b = true	
}
else
{
	b = true;
}

var c = 3;

if(c == 3)
{
	c = 4;
}

if(c == 3)
{
	c = 4;
}
else
{
	c = 5;
}

c = 6;
; 
);
/*********** Test: 11  ************/
/*;
var a = 3, b = 4;

b = a % 2 == 0 
	? a + 1
	: a;

b = a % 2 == 1 
	? a + 1
	: a;

b = a % 2 == 1
	? 3
	: 4;
;*/

 testData.push(;
var a = 3, b = 4;

b = a % 2 == 0 
	? a + 1
	: a;

b = a % 2 == 1 
	? a + 1
	: a;

b = a % 2 == 1
	? 3
	: 4;
; 
);
/*********** Test: 12  ************/
/*;
function test(a)
{
	if(a%2 == 0) 
	{ 
		return "even"; 
	}
	
	return "odd";
}

test(4);
;*/

 testData.push(;
function test(a)
{
	if(a%2 == 0) 
	{ 
		return "even"; 
	}
	
	return "odd";
}

test(4);
; 
);
/*********** Test: 13  ************/
/*;
var sum = 0;

for(var i = 9; 
	i < 13; 
	i++)
{
	if(i%4 == 0) 
	{ 
		break; 
	}
	
	sum += i;
}

sum++;
;*/

 testData.push(;
var sum = 0;

for(var i = 9; 
	i < 13; 
	i++)
{
	if(i%4 == 0) 
	{ 
		break; 
	}
	
	sum += i;
}

sum++;
; 
);
/*********** Test: 14  ************/
/*;
var sum = 0;

for(var i = 0; i < 10; i++)
{
	for(var j = 0; j < 5; j++)
	{
		if(j == 4)
		{
			break;
		}
		
		sum += j;		
	}
	
	if(i == 9)
	{
		break;
	}
}

sum++;
;*/

 testData.push(;
var sum = 0;

for(var i = 0; i < 10; i++)
{
	for(var j = 0; j < 5; j++)
	{
		if(j == 4)
		{
			break;
		}
		
		sum += j;		
	}
	
	if(i == 9)
	{
		break;
	}
}

sum++;
; 
);
/*********** Test: 15  ************/
/*;
var sum = 0;

for(var i = 0; 
   i < 10; 
   i++)
{
	for(var j = 0; 
	j < 5; 
	j++)
	{
		if(j == 2)
		{
			continue;
		}
		
		sum += j;
	}
	
	if(i == 3)
	{
		continue;
	}
}

sum++;
;*/

 testData.push(;
var sum = 0;

for(var i = 0; 
   i < 10; 
   i++)
{
	for(var j = 0; 
	j < 5; 
	j++)
	{
		if(j == 2)
		{
			continue;
		}
		
		sum += j;
	}
	
	if(i == 3)
	{
		continue;
	}
}

sum++;
; 
);
/*********** Test: 16  ************/
/*;
var a = 3, sum = 0;

switch(a)
{
	case 1: 
		sum += 10;
		break;
	case 2:
		sum += 20;
		break;
	case 3:
		sum += 30;
	case 4:
		sum += 40;
		break;
	default:
		sum += 80;	
}

sum++;
;*/

 testData.push(;
var a = 3, sum = 0;

switch(a)
{
	case 1: 
		sum += 10;
		break;
	case 2:
		sum += 20;
		break;
	case 3:
		sum += 30;
	case 4:
		sum += 40;
		break;
	default:
		sum += 80;	
}

sum++;
; 
);
/*********** Test: 17  ************/
/*;
var a = {
	b: 3,
	c: 4
}

var c = a.b + a.c;
;*/

 testData.push(;
var a = {
	b: 3,
	c: 4
}

var c = a.b + a.c;
; 
);
/*********** Test: 18  ************/
/*;
	var a = 3, b = 4;
	
	try
	{
		b++;
		a++;
		b = b+2;
	}
	catch(e)
	{
		b = b+3;
	}
	finally
	{
		b = b+7;
		a++;
		b = b+5;	
	}	
	
	b++;
	a++;
;*/

 testData.push(;
	var a = 3, b = 4;
	
	try
	{
		b++;
		a++;
		b = b+2;
	}
	catch(e)
	{
		b = b+3;
	}
	finally
	{
		b = b+7;
		a++;
		b = b+5;	
	}	
	
	b++;
	a++;
; 
);
/*********** Test: 19  ************/
/*;
	var a = 3, 
		b = 4;
	try
	{
		b++;
		c++;
		a = b + 2;
		if(a == 3)
		{
			b++;
		}
	}
	catch(e)
	{
		b = b + 3;
		if(b == 3)
		{
			b++;
		}
	}
	finally
	{
		b = b + 7;
		a++;
		b = b + 5;
	}
	b++;
	a++;
;*/

 testData.push(;
	var a = 3, 
		b = 4;
	try
	{
		b++;
		c++;
		a = b + 2;
		if(a == 3)
		{
			b++;
		}
	}
	catch(e)
	{
		b = b + 3;
		if(b == 3)
		{
			b++;
		}
	}
	finally
	{
		b = b + 7;
		a++;
		b = b + 5;
	}
	b++;
	a++;
; 
);
/*********** Test: 20  ************/
/*;
	var a = 3, b = 4;
	
	try
	{
		b++;
		throw "Error";
		a = b+2;
	}
	catch(e)
	{
		b = b+3;
	}
	finally
	{
		b = b+7;
		a++;
		b = b+5;	
	}	
	
	b++;
	a++;
;*/

 testData.push(;
	var a = 3, b = 4;
	
	try
	{
		b++;
		throw "Error";
		a = b+2;
	}
	catch(e)
	{
		b = b+3;
	}
	finally
	{
		b = b+7;
		a++;
		b = b+5;	
	}	
	
	b++;
	a++;
; 
cc);
/*********** Test: 21  ************/
/*;
var a = {
 b: 3,
 c: 4
};

with(a)
{
	b++;
} 

a.b += a.c; 
;*/

 testData.push(;
var a = {
 b: 3,
 c: 4
};

with(a)
{
	b++;
} 

a.b += a.c; 
; 
);
/*********** Test: 22  ************/
/*;
function throwExceptionFunction()
{
	a++;
	return a;
}

try
{
   var b = 4;
   b++;
   throwExceptionFunction();
   b = b+2;
}
catch(e)
{
  b++;
}

b = b+1;
;*/

 testData.push(;
function throwExceptionFunction()
{
	a++;
	return a;
}

try
{
   var b = 4;
   b++;
   throwExceptionFunction();
   b = b+2;
}
catch(e)
{
  b++;
}

b = b+1;
; 
);
/*********** Test: 23  ************/
/*;
var a = (function(a)
{
	a++;
	return a;
})(2);

a = a+1;
;*/

 testData.push(;
var a = (function(a)
{
	a++;
	return a;
})(2);

a = a+1;
; 
);
/*********** Test: 24  ************/
/*;
var a = {
 b : 3,
 c: function(d) 
 {
 	return d+1;
 }
};

a.c(4);
;*/

 testData.push(;
var a = {
 b : 3,
 c: function(d) 
 {
 	return d+1;
 }
};

a.c(4);
; 
);
/*********** Test: 25  ************/
/*;
var a = {
	b: 3,
	c: {
		d:4
	}
}

a.c.d;
;*/

 testData.push(;
var a = {
	b: 3,
	c: {
		d:4
	}
}

a.c.d;
; 
);
/*********** Test: 26  ************/
/*;
var a = 
{
	b: 3,
	increment: function(c)
	{
		return c + 1;
	},
	getB: function()
	{
		var c = this.increment(this.b);
		return c;
	}
}

a.getB();
;*/

 testData.push(;
var a = 
{
	b: 3,
	increment: function(c)
	{
		return c + 1;
	},
	getB: function()
	{
		var c = this.increment(this.b);
		return c;
	}
}

a.getB();
; 
);
/*********** Test: 27  ************/
/*;
function test()
{
	var b = 2 + 1;
	return b;
}

var a = {
	test: function()
	{
		var b = 3+1;
		return b;
	}
}

with(a)
{
	test();
}

test();
;*/

 testData.push(;
function test()
{
	var b = 2 + 1;
	return b;
}

var a = {
	test: function()
	{
		var b = 3+1;
		return b;
	}
}

with(a)
{
	test();
}

test();
; 
);
/*********** Test: 28  ************/
/*;
function test1()
{
	var b = 3;
	
	function test2()
	{
		return b + 1;
	}
	
	test2();	
}

function test2()
{
	var b = 4;
	return b + 1;
}

test1();

test2();
;*/

 testData.push();
/*********** Test: 29  ************/
/*;
var a = {
	aa: 3,
	ab: 4
};

var b = {
	bb: 5,
	bc: 6,
	bc: function()
	{
		return 2;
	}
};

var arr = [a,b];

var c = arr[0+1];

c["b" + "c"]();
;*/

 testData.push();
/*********** Test: 30  ************/
/*;
var a = 1 + 2 + 3;

var b = a * 4 * 3;

var c = b / 2 - 3;
;*/

 testData.push(;
function test1()
{
	var b = 3;
	
	function test2()
	{
		return b + 1;
	}
	
	test2();	
}

function test2()
{
	var b = 4;
	return b + 1;
}

test1();

test2();
; 
);
/*********** Test: 31  ************/
/*;
var obj1 = {
	test: function()
	{
		return 3;
	}
};

var obj2 = {
	test: function()
	{
		return 4;
	}
};

var obj3 = {
	test: function()
	{
		return 5;
	}
};

var array = [obj1, obj2, obj3];
var sum = 0;

for(var i = 0; 
	i < 3; 
	i++)
{
	var currentItem = array[i];
	sum += currentItem.test();	
}
;*/

 testData.push();
/*********** Test: 32  ************/
/*;
var a = 3;

var b = 3 + a++ +a;

a = 3;

b = 3 + ++a + a;
;*/

 testData.push();
/*********** Test: 33  ************/
/*;
var a = {
	test: function()
	{
		return 3;
	}
};

var b = null;

var c = {
	test: function()
	{
		return 4;
	}
};

var d = a
	|| b
	|| c;

d.test(); //d == a

d = false //d == a;
 || a
 || b
 || c;
 
d.test();

d = 1 //d == 1
	|| a
	|| b;

d = false
	|| b
	|| c; // d == c

d.test();
;
*/

 testData.push(;
var obj1 = {
	test: function()
	{
		return 3;
	}
};

var obj2 = {
	test: function()
	{
		return 4;
	}
};

var obj3 = {
	test: function()
	{
		return 5;
	}
};

var array = [obj1, obj2, obj3];
var sum = 0;

for(var i = 0; 
	i < 3; 
	i++)
{
	var currentItem = array[i];
	sum += currentItem.test();	
}
; 
);
/*********** Test: 34  ************/
/*;
var a = {
	test: function()
	{
		return 3;
	}
};

var b = null;

var c = {
	test: function()
	{
		return 4;
	}
};

var d = a //d == a
	&& b
	&& c;

//d.test();

var d = a //d == c
	&& c
	&& b;

//d.test(); 

d = false //d == false;
 && a
 && b
 && c;
 
d = 1 //d == a
	&& a
	&& false;

d = a
	&& true
	&& c; // d == c

//d.test();
;
*/

 testData.push(;
var a = {
	test: function()
	{
		return 3;
	}
};

var b = null;

var c = {
	test: function()
	{
		return 4;
	}
};

var d = a //d == a
	&& b
	&& c;

//d.test();

var d = a //d == c
	&& c
	&& b;

//d.test(); 

d = false //d == false;
 && a
 && b
 && c;
 
d = 1 //d == a
	&& a
	&& false;

d = a
	&& true
	&& c; // d == c

//d.test();
;
 
 );
/*********** Test: 35  ************/
/*;
	var a = {
		b : 3,
		test: function()
		{
			return this.b;
		}
	};
	
	function test()
	{
		return a;
	}
	
	test().b = 4;
	
	var b = a.test(); //4

	b++;
;*/

 testData.push(;
	var a = {
		b : 3,
		test: function()
		{
			return this.b;
		}
	};
	
	function test()
	{
		return a;
	}
	
	test().b = 4;
	
	var b = a.test(); //4

	b++;
; 
);
/*********** Test: 36  ************/
/*;
var obj = {
	b:4
};

var test =  {
	a: function()
	{
		return obj;
	}
}

test.a().b = 5;

obj.b;
;*/

 testData.push(;
var obj = {
	b:4
};

var test =  {
	a: function()
	{
		return obj;
	}
}

test.a().b = 5;

obj.b;
; 
);
/*********** Test: 37  ************/
/*;
var a = {
	test:function()
	{
		return {
			other: function()
			{
				return 3;
			}
		};
	}
};

a.test().other();
;*/

 testData.push(;
var a = {
	test:function()
	{
		return {
			other: function()
			{
				return 3;
			}
		};
	}
};

a.test().other();
; 
);
/*********** Test: 38  ************/
/*;
function obj(a)
{
	this.a = a;
	this.func = function()
	{
		return this.a;
	};
}

var a = new obj(4);

a.func();
;*/

 testData.push(;
function obj(a)
{
	this.a = a;
	this.func = function()
	{
		return this.a;
	};
}

var a = new obj(4);

a.func();
; 
);
/*********** Test: 39  ************/
/*;
function cons()
{
	this.a = function()
	{
		return 3;
	}
}

(new cons()).a();
;*/

 testData.push(;
function cons()
{
	this.a = function()
	{
		return 3;
	}
}

(new cons()).a();
; 
);
/*********** Test: 40  ************/
/*;
function test1()
{
	return function()
	{
		return 3;
	}
}

test1()();
;*/

 testData.push(;
function test1()
{
	return function()
	{
		return 3;
	}
}

test1()();
; 
);
/*********** Test: 41  ************/
/*var d;
var c;
(function()
{
	var a = 1;
	var obj1 = {
		fun: function()
		{
			return 3;
		}
	};
	
	var obj2 = {
		fun: function()
		{
			return 4;
		}
	};
	
	var array = [obj1, obj2];
	
	(function()
	{
		var obj = array[a];
		c = obj.fun();	
	})();
	
	a++;
	d = a;
})()*/

 testData.push(var d;
var c;
(function()
{
	var a = 1;
	var obj1 = {
		fun: function()
		{
			return 3;
		}
	};
	
	var obj2 = {
		fun: function()
		{
			return 4;
		}
	};
	
	var array = [obj1, obj2];
	
	(function()
	{
		var obj = array[a];
		c = obj.fun();	
	})();
	
	a++;
	d = a;
})() 
);
/*********** Test: 42  ************/
/**/

 testData.push( 
 );
/*********** Test: 43  ************/
/*;
var a = {
	own: function()
	{
		return 4;
	},
	test: function()
	{
		return this.own() + 3;
	}
}

var b = {
	own: function()
	{
		return 5;
	}
};

b.test = a.test;

b.test();
;*/

 testData.push(;
var a = {
	own: function()
	{
		return 4;
	},
	test: function()
	{
		return this.own() + 3;
	}
}

var b = {
	own: function()
	{
		return 5;
	}
};

b.test = a.test;

b.test();
; 
);
/*********** Test: 44  ************/
/*;
x = {
	a: function()
	{
		return 3;
	}, 
	b: function()
	{
		return 4;
	}
};
y = {
	a: function()
	{
		return 3;
	}, 
	c: function()
	{
		return 4;
	}
};
y.__proto__ = x;
 
y.a(); // own characteristic
y.c(); // own characteristic
y.b(); // 20 – is gotten from the prototype x;
 
delete y.a; // removed own a
y.a(); // a – is gotten from the prototype
 
z = {
	a: function()
	{
		return 3;
	}, 
	e: function()
	{
		return 4;
	}
};
y.__proto__ = z; // changed the prototype of the y to z
y.a(); // is gotten from the prototype z
y.e(); // also – is gotten from the prototype z
 
z.q = function() // added new property to the prototype
{
	return 4;
}; 

y.q(); // changes are available and on y
;*/

 testData.push(;
x = {
	a: function()
	{
		return 3;
	}, 
	b: function()
	{
		return 4;
	}
};
y = {
	a: function()
	{
		return 3;
	}, 
	c: function()
	{
		return 4;
	}
};
y.__proto__ = x;
 
y.a(); // own characteristic
y.c(); // own characteristic
y.b(); // 20 – is gotten from the prototype x;
 
delete y.a; // removed own a
y.a(); // a – is gotten from the prototype
 
z = {
	a: function()
	{
		return 3;
	}, 
	e: function()
	{
		return 4;
	}
};
y.__proto__ = z; // changed the prototype of the y to z
y.a(); // is gotten from the prototype z
y.e(); // also – is gotten from the prototype z
 
z.q = function() // added new property to the prototype
{
	return 4;
}; 

y.q(); // changes are available and on y
; 
);
/*********** Test: 45  ************/
/*;
x = {
	a: function()
	{
		return 3;
	}
};
 
y = {
	b: function()
	{
		return 4;
	}
};

y.__proto__ = x;
 
z = {
	c: function()
	{
		return 30;
	}
};
z.__proto__ = y;
 
z.a(); // 3
;*/

 testData.push(;
x = {
	a: function()
	{
		return 3;
	}
};
 
y = {
	b: function()
	{
		return 4;
	}
};

y.__proto__ = x;
 
z = {
	c: function()
	{
		return 30;
	}
};
z.__proto__ = y;
 
z.a(); // 3
; 
);
/*********** Test: 46  ************/
/*;
function A() {}
A.prototype.x = function()
{
	return 10;
};
 
var a = new A();
a.x(); // 10 – by delegation, from the prototype
 
// set .prototype property of the
// function to new object;
A.prototype = {
  constructor: A,
  y: function()
  {
  	return 100;
  }
};
 
var b = new A();
// object "b" has new prototype
b.y(); // 100 – by delegation, from the prototype
//and there is not b.x() - because "b" has new prototype 

a.x();
;*/

 testData.push(;
function A() {}
A.prototype.x = function()
{
	return 10;
};
 
var a = new A();
a.x(); // 10 – by delegation, from the prototype
 
// set .prototype property of the
// function to new object;
A.prototype = {
  constructor: A,
  y: function()
  {
  	return 100;
  }
};
 
var b = new A();
// object "b" has new prototype
b.y(); // 100 – by delegation, from the prototype
//and there is not b.x() - because "b" has new prototype 

a.x();
; 
);
/*********** Test: 47  ************/
/*;
//pop - OK
//push - OK
//reverse - OK
//shift - OK
//splice - OK
//unshift - OK

//concat - see test 49
//join - (no test necessary, not really important and the implementation is easy)
//slice - see test 50
//indexOf - see test 51
//lastIndexOf - see test 51

//- All in test 48
//sort
//filter
//forEach
//every
//map
//some
//reduce
//reduceRight

var array = new Array();

var a = {
	x: function()
	{
		return "a";
	}
};

var b = {
	x: function()
	{
		return "b";
	}
};

var c = {
	x: function()
	{
		return "c";
	}
};

array.push(a);
array.push(b);
array.push(c);

array[0].x();
array[1].x();
array[2].x();

array[array.length - 1].x();

array.pop();

array[array.length - 1].x();

array.pop();

array[array.length - 1].x();

array.push(a, b, c);

array[0].x();
array[1].x();
array[2].x();

array.reverse();

array[0].x();
array[1].x();
array[2].x();

var first = array.shift();
first.x();

array[0].x();
array[1].x();

array.unshift(first, first);

array[0].x();
array[1].x();
array[2].x();
array[3].x();

array.splice(2, 0, first);

array[0].x();
array[1].x();
array[2].x();
array[3].x();
array[4].x();

var removed = array.splice(3, 1);

array[0].x();
array[1].x();
array[2].x();
array[3].x();

removed[0].x();
;*/

 testData.push(;
//pop - OK
//push - OK
//reverse - OK
//shift - OK
//splice - OK
//unshift - OK

//concat - see test 49
//join - (no test necessary, not really important and the implementation is easy)
//slice - see test 50
//indexOf - see test 51
//lastIndexOf - see test 51

//- All in test 48
//sort
//filter
//forEach
//every
//map
//some
//reduce
//reduceRight

var array = new Array();

var a = {
	x: function()
	{
		return "a";
	}
};

var b = {
	x: function()
	{
		return "b";
	}
};

var c = {
	x: function()
	{
		return "c";
	}
};

array.push(a);
array.push(b);
array.push(c);

array[0].x();
array[1].x();
array[2].x();

array[array.length - 1].x();

array.pop();

array[array.length - 1].x();

array.pop();

array[array.length - 1].x();

array.push(a, b, c);

array[0].x();
array[1].x();
array[2].x();

array.reverse();

array[0].x();
array[1].x();
array[2].x();

var first = array.shift();
first.x();

array[0].x();
array[1].x();

array.unshift(first, first);

array[0].x();
array[1].x();
array[2].x();
array[3].x();

array.splice(2, 0, first);

array[0].x();
array[1].x();
array[2].x();
array[3].x();
array[4].x();

var removed = array.splice(3, 1);

array[0].x();
array[1].x();
array[2].x();
array[3].x();

removed[0].x();
; 
);
/*********** Test: 48  ************/
/*;
//array sort test1
//sort
//filter - OK
//forEach  - OK
//every - nothing, useless and complicates things
//map - 
//some
//reduce
//reduceRight
var a0= {
	value: 0,
	fun: function() { return this.value; }
};

var a1 = {
	value: 1,
	fun: function() { return this.value; }
};

var a2 = {
	value: 2,
	fun: function() { return this.value; }
};

var a3 = {
	value: 3,
	fun: function() { return this.value; }
};

var a4 = {
	value: 4,
	fun: function() { return this.value; }
};

var a5 = {
	value: 5,
	fun: function() { return this.value; }
};

var a6 = {
	value: 6,
	fun: function() { return this.value; }
};

var array = [a0, a1, a2, a3, a4];

var evenArray = array.filter(function(a)
{
	return a.value % 2 == 0;
});

for(var i = 0; 
	i < evenArray.length; 
	i++)
{
	evenArray[i].fun();
}

array.forEach(function(element, index, array)
{
	element.value++;
});

array[array[2].value].fun(); // the array[2] is a0 - the new value should be 1 so the function from a2 should be called

array.forEach(function(element, index, array)
{
	element.value--;
});

var mappedArray = array.map(function(element)
{
	return element.value;
});

for(var i = 0;
	i < mappedArray.length;
	i++)
{
	if(mappedArray[i] != null)
	{
		array[mappedArray[i]].fun();
	}
}
;*/

 testData.push(;
//array sort test1
//sort
//filter - OK
//forEach  - OK
//every - nothing, useless and complicates things
//map - 
//some
//reduce
//reduceRight
var a0= {
	value: 0,
	fun: function() { return this.value; }
};

var a1 = {
	value: 1,
	fun: function() { return this.value; }
};

var a2 = {
	value: 2,
	fun: function() { return this.value; }
};

var a3 = {
	value: 3,
	fun: function() { return this.value; }
};

var a4 = {
	value: 4,
	fun: function() { return this.value; }
};

var a5 = {
	value: 5,
	fun: function() { return this.value; }
};

var a6 = {
	value: 6,
	fun: function() { return this.value; }
};

var array = [a0, a1, a2, a3, a4];

var evenArray = array.filter(function(a)
{
	return a.value % 2 == 0;
});

for(var i = 0; 
	i < evenArray.length; 
	i++)
{
	evenArray[i].fun();
}

array.forEach(function(element, index, array)
{
	element.value++;
});

array[array[2].value].fun(); // the array[2] is a0 - the new value should be 1 so the function from a2 should be called

array.forEach(function(element, index, array)
{
	element.value--;
});

var mappedArray = array.map(function(element)
{
	return element.value;
});

for(var i = 0;
	i < mappedArray.length;
	i++)
{
	if(mappedArray[i] != null)
	{
		array[mappedArray[i]].fun();
	}
}
; 
);
/*********** Test: 49  ************/
/**/

 testData.push( 
 );
/*********** Test: 50  ************/
/**/

 testData.push( 
 );
/*********** Test: 51  ************/
/**/

 testData.push( 
 );
/*********** Test: 52  ************/
/*;
var a0 = {
  value : 0,
  fun : function ()
  {
    return this.value;

1 + 1;
  }
};
var a1 = {
  value : 1,
  fun : function ()
  {
    return this.value;

1 + 1;
  }
};
var array = [a0,a1];
var mappedArray = array.map(function (element,index,array)
{
  return element.value;

1 + 1;
});
for(var i = 0;
i < mappedArray.length;
i++)
{
  if(array[mappedArray[i]] != null)
  {
    array[mappedArray[i]].fun();
  }
}i++;
;

1 + 1;
*/

 testData.push(;
var a0 = {
  value : 0,
  fun : function ()
  {
    return this.value;

1 + 1;
  }
};
var a1 = {
  value : 1,
  fun : function ()
  {
    return this.value;

1 + 1;
  }
};
var array = [a0,a1];
var mappedArray = array.map(function (element,index,array)
{
  return element.value;

1 + 1;
});
for(var i = 0;
i < mappedArray.length;
i++)
{
  if(array[mappedArray[i]] != null)
  {
    array[mappedArray[i]].fun();
  }
}i++;
;

1 + 1;
 
 );
/*********** Test: 53  ************/
/*;
function test()
{
	arguments[0].test();
	arguments[1].test();
}

var a = {
	test: function()
	{
		return 3;
	}
};

var b = {
	test:function()
	{
		return 4;
	}
};

test(a,b);
;*/

 testData.push(;
function test()
{
	arguments[0].test();
	arguments[1].test();
}

var a = {
	test: function()
	{
		return 3;
	}
};

var b = {
	test:function()
	{
		return 4;
	}
};

test(a,b);
; 
);
/*********** Test: 54  ************/
/*;
var a = {
	test: function()
	{
		return 3;
	},
	sort: [].sort,
	splice: [].splice
};

var test = function()
{
	var options;
	var target = arguments[0]
			|| {};
	return target.test();
	
	1 + 1;
};

test(a);

1 + 1;*/

 testData.push(;
var a = {
	test: function()
	{
		return 3;
	},
	sort: [].sort,
	splice: [].splice
};

var test = function()
{
	var options;
	var target = arguments[0]
			|| {};
	return target.test();
	
	1 + 1;
};

test(a);

1 + 1; 
);
/*********** Test: 55  ************/
/*;
	var target = false;
	var a = 3;
	
	if(typeof target === "boolean")
	{
		a++;
	}
	
	a--;
;*/

 testData.push(;
	var target = false;
	var a = 3;
	
	if(typeof target === "boolean")
	{
		a++;
	}
	
	a--;
; 
);
/*********** Test: 56  ************/
/*;
var a = {
	test: function()
	{
		return 3;
	},
	test1: function()
	{
		return 4;
	},
	test2: function()
	{
		return 5;
	}
};

for(var propName in a)
{
	var prop = a[propName];
	
	if(typeof prop == "function")
	{
		prop();
	}
	
	1+1;
}
;*/

 testData.push(;
var a = {
	test: function()
	{
		return 3;
	},
	test1: function()
	{
		return 4;
	},
	test2: function()
	{
		return 5;
	}
};

for(var propName in a)
{
	var prop = a[propName];
	
	if(typeof prop == "function")
	{
		prop();
	}
	
	1+1;
}
; 
);
/*********** Test: 57  ************/
/*;
var obj1 = {
	test: function()
	{
		return 4;
	}
};

var obj2 = {
	test: function()
	{
		return 5;
	}
};

var a = {
	test: function(a, b)
	{
		a.test();
		b.test();
		return 3;
	},
	returnSomething: function()
	{
		return this;
	}
}

function applyTest(a, b)
{
	this.test(a,b);
}

function callTest(a,b)
{
	this.test(a,b);
}

function callTwo()
{
	return this.returnSomething();
}

applyTest.apply(a, [obj1, obj2]);
callTest.call(a, obj1, obj2);

var alias = callTwo.call(a);

alias.returnSomething();

;*/

 testData.push(;
var obj1 = {
	test: function()
	{
		return 4;
	}
};

var obj2 = {
	test: function()
	{
		return 5;
	}
};

var a = {
	test: function(a, b)
	{
		a.test();
		b.test();
		return 3;
	},
	returnSomething: function()
	{
		return this;
	}
}

function applyTest(a, b)
{
	this.test(a,b);
}

function callTest(a,b)
{
	this.test(a,b);
}

function callTwo()
{
	return this.returnSomething();
}

applyTest.apply(a, [obj1, obj2]);
callTest.call(a, obj1, obj2);

var alias = callTwo.call(a);

alias.returnSomething();

; 
);
/*********** Test: 58  ************/
/*;

var array = [
	{
		a:4
	},
	{
		a:2
	},
	{
		a: 3
	},
];

function isEven()
{
	return this.a % 2 == 0;
}

if(array == null)
{
	var a = 3;
	a++;
}
else
{
	for(var value = array[0], i = 0;
		i < array.length
		&& isEven.call(value) !== false;
		value = array[++i])
	{}
}

var a = 3;
a++;
;*/

 testData.push(;

var array = [
	{
		a:4
	},
	{
		a:2
	},
	{
		a: 3
	},
];

function isEven()
{
	return this.a % 2 == 0;
}

if(array == null)
{
	var a = 3;
	a++;
}
else
{
	for(var value = array[0], i = 0;
		i < array.length
		&& isEven.call(value) !== false;
		value = array[++i])
	{}
}

var a = 3;
a++;
; 
);
/*********** Test: 59  ************/
/*;
var a = {
	test: function()
	{
		this.b = function()
		{
			return 3;
			
			Math.E + 1;
		};
		
		Math.E + 1;
	}
};

var b = new a.test();

b.b();
;*/

 testData.push(;
var a = {
	test: function()
	{
		this.b = function()
		{
			return 3;
			
			Math.E + 1;
		};
		
		Math.E + 1;
	}
};

var b = new a.test();

b.b();
; 
);
/*********** Test: 60  ************/
/*;
var ua = "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16";

ua = ua.toLowerCase();

var rwebkit = /(webkit)[ \/]([\w.]+)/;
var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

var match = rwebkit.exec(ua)
	|| ropera.exec(ua)
	|| ua.indexOf("compatible") < 0
	&& rmozilla.exec(ua)
	|| [];
	
var a = {
	webkit: function()
	{
		return Math.E;
	}
}

a[match[1]]();
;*/

 testData.push(;
var ua = "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16";

ua = ua.toLowerCase();

var rwebkit = /(webkit)[ \/]([\w.]+)/;
var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

var match = rwebkit.exec(ua)
	|| ropera.exec(ua)
	|| ua.indexOf("compatible") < 0
	&& rmozilla.exec(ua)
	|| [];
	
var a = {
	webkit: function()
	{
		return Math.E;
	}
}

a[match[1]]();
; 
);
/*********** Test: 61  ************/
/*;
	var div = document.createElement("div");
	div.style.display = "none";
	div.innerHTML = " <link/><table></table><a href='/a' style='color:red'>a</a><input type='checkbox'/>";
	var a = div.getElementsByTagName("a")[0]; 
	
	var obj = {};
	obj.color = function()
	{
		return Math.E + 1;
	};
	
	var c = a.getAttribute("style");
	
	var splited = c.split(":");
	
	var functionName = splited[0];
	
	obj[functionName]();
;*/

 testData.push(;
	var div = document.createElement("div");
	div.style.display = "none";
	div.innerHTML = " <link/><table></table><a href='/a' style='color:red'>a</a><input type='checkbox'/>";
	var a = div.getElementsByTagName("a")[0]; 
	
	var obj = {};
	obj.color = function()
	{
		return Math.E + 1;
	};
	
	var c = a.getAttribute("style");
	
	var splited = c.split(":");
	
	var functionName = splited[0];
	
	obj[functionName]();
; 
);
/*********** Test: 62  ************/
/*;
	var obj0 = {
		test: function()
		{
			return 0;
		}
	};
	
	var obj1 = {
		test: function()
		{
			return 1;
		}
	};
	
	var obj2 = {
		test: function()
		{
			return 2;
		}
	};
	
	var array = [obj0, obj1, obj2];
	
	var a = 1;
	
	a += 1;
	
	array[a].test();
;*/

 testData.push(;
	var obj0 = {
		test: function()
		{
			return 0;
		}
	};
	
	var obj1 = {
		test: function()
		{
			return 1;
		}
	};
	
	var obj2 = {
		test: function()
		{
			return 2;
		}
	};
	
	var array = [obj0, obj1, obj2];
	
	var a = 1;
	
	a += 1;
	
	array[a].test();
; 
);
/*********** Test: 63  ************/
/*;
var obj = {
	abb: function()
	{
		return 3;
	},
	ab: function()
	{
		return 4;
	},
	"3": function()
	{
		return 5;
	},
	"9": function()
	{	
		return 6;
	}
};
var myRe = /ab*/g;
var str = "abbcdefabh";
var myArray = myRe.exec(str);
while (
		myArray != null
	  )
{
  obj[myArray[0]]();
  obj[myRe.lastIndex]();
  myArray = myRe.exec(str);
}

Math.E + 1;
;*/

 testData.push(;
var obj = {
	abb: function()
	{
		return 3;
	},
	ab: function()
	{
		return 4;
	},
	"3": function()
	{
		return 5;
	},
	"9": function()
	{	
		return 6;
	}
};
var myRe = /ab*/g;
var str = "abbcdefabh";
var myArray = myRe.exec(str);
while (
		myArray != null
	  )
{
  obj[myArray[0]]();
  obj[myRe.lastIndex]();
  myArray = myRe.exec(str);
}

Math.E + 1;
; 
);
/*********** Test: 64  ************/
/*;
	var obj = {
		testDiv: function()
		{
			return 4;
		}
	};
	
	var regEx = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/;
	
	var selector = "#testDiv";
	
	match = regEx.exec(selector);
	
	obj[match[2]]();
	
	Math.E + 1;
;*/

 testData.push(;
	var obj = {
		testDiv: function()
		{
			return 4;
		}
	};
	
	var regEx = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/;
	
	var selector = "#testDiv";
	
	match = regEx.exec(selector);
	
	obj[match[2]]();
	
	Math.E + 1;
; 
);
/*********** Test: 65  ************/
/*;
	var a = null;
	var b = {
		test: function()
		{
			return 4;
		}
	};
	
	(a
	|| b).test();
	
	Math.E + 1;
;*/

 testData.push(;
	var a = null;
	var b = {
		test: function()
		{
			return 4;
		}
	};
	
	(a
	|| b).test();
	
	Math.E + 1;
; 
);
/*********** Test: 66  ************/
/*;
function create(n)
{
  var k = n;
  var nj;
  var j;
  
  do
  {
      	nj = k;
	    do
	    {
	    	j = k - nj;
	    }
	    while(--nj);
  }
  while( --n);
	
  return 2;
};

create(2);
;*/

 testData.push(;
function create(n)
{
  var k = n;
  var nj;
  var j;
  
  do
  {
      	nj = k;
	    do
	    {
	    	j = k - nj;
	    }
	    while(--nj);
  }
  while( --n);
	
  return 2;
};

create(2);
; 
);
/*********** Test: 67  ************/
/*;
function test1()
{
	return 3;
}

function test2()
{
	return 4;
}

var a = (test1, test2);

a();

test1(), test2();

Math.E + 1;
;*/

 testData.push(;
function test1()
{
	return 3;
}

function test2()
{
	return 4;
}

var a = (test1, test2);

a();

test1(), test2();

Math.E + 1;
; 
);
/*********** Test: 68  ************/
/*;
var sum = 0;
for(var i = 0; 
	i < 3; 
	i++)
{
	for(var j = 0; 
		j < 2; 
		j++)
	{
		sum += j;
	}
}

sum = sum + 1;
;*/

 testData.push(;
var sum = 0;
for(var i = 0; 
	i < 3; 
	i++)
{
	for(var j = 0; 
		j < 2; 
		j++)
	{
		sum += j;
	}
}

sum = sum + 1;
; 
);
/*********** Test: 69  ************/
/*;
var obj = {
	a: function()
	{
		return 3;
	},
	b: function()
	{
		return 4;
	}
};


var a;

eval("a = 'b';");

obj[a]();
;*/

 testData.push(;
var obj = {
	a: function()
	{
		return 3;
	},
	b: function()
	{
		return 4;
	}
};


var a;

eval("a = 'b';");

obj[a]();
; 
);
/*********** Test: 70  ************/
/**/

 testData.push( 
 );
/*********** Test: 71  ************/
/**/

 testData.push( 
 );
/*********** Test: 72  ************/
/**/

 testData.push( 
 );
/*********** Test: 73  ************/
/*;
var a = b = {
	test: function()
	{
		return 3;
	}
};

a.test();

b.test();
;*/

 testData.push(;
var a = b = {
	test: function()
	{
		return 3;
	}
};

a.test();

b.test();
; 
);
/*********** Test: 74  ************/
/*;
function print(a)
{
	return 4;
}

var hoistedObjectLiteral_0 = {
	a: function ()
	{
		return 4;
	}
}
;
print(hoistedObjectLiteral_0);

Math.E + 1;

;*/

 testData.push(;
function print(a)
{
	return 4;
}

var hoistedObjectLiteral_0 = {
	a: function ()
	{
		return 4;
	}
}
;
print(hoistedObjectLiteral_0);

Math.E + 1;

; 
);
/*********** Test: 75  ************/
/**/

 testData.push( 
 );
var testData = [];
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

 testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":14,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":5,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"foo"},"params":[{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":14},"source":null},"type":"Identifier","name":"a"}],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":4,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":13},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":13},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":13},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},{"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":9},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":9},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":9},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":16},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":9},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":9},"source":null},"type":"Literal","value":4}},{"loc":{"start":{"line":7,"column":11},"end":{"line":7,"column":16},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":11},"end":{"line":7,"column":16},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":16},"source":null},"type":"Literal","value":5}}]},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":14},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":14},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":14},"source":null},"type":"Identifier","name":"d"},"init":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":14},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":11},"source":null},"type":"Identifier","name":"foo"},"arguments":[{"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":13},"source":null},"type":"Identifier","name":"b"}]}}]},{"loc":{"start":{"line":9,"column":9},"end":{"line":12,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"bar"},"params":[],"body":{"loc":{"start":{"line":10,"column":0},"end":{"line":11,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":11,"column":8},"end":{"line":11,"column":9},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":3},"source":null},"type":"Identifier","name":"bar"},"arguments":[]}},{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 2  ************/
/*;
function test()
{
	var a = 3;
	function test1(b)
	{
		var c = a + b;
		return c;
    }
    return test1(3);
}
test();
*/;

 testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":7},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":9},"end":{"line":10,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test"},"params":[],"body":{"loc":{"start":{"line":2,"column":0},"end":{"line":9,"column":20},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":10},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":4,"column":10},"end":{"line":8,"column":5},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test1"},"params":[{"loc":{"start":{"line":4,"column":16},"end":{"line":4,"column":17},"source":null},"type":"Identifier","name":"b"}],"body":{"loc":{"start":{"line":5,"column":1},"end":{"line":7,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":15},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":15},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":15},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":6,"column":10},"end":{"line":6,"column":15},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":6,"column":10},"end":{"line":6,"column":11},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":6,"column":14},"end":{"line":6,"column":15},"source":null},"type":"Identifier","name":"b"}}}]},{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":10},"source":null},"type":"Identifier","name":"c"}}]},"generator":false,"expression":false},{"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":19},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":11},"end":{"line":9,"column":19},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":9,"column":11},"end":{"line":9,"column":16},"source":null},"type":"Identifier","name":"test1"},"arguments":[{"loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":18},"source":null},"type":"Literal","value":3}]}}]},"generator":false,"expression":false},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":6},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":4},"source":null},"type":"Identifier","name":"test"},"arguments":[]}}]});
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

 testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":10,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":3,"column":0},"end":{"line":8,"column":10},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":10},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":5},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":10},"source":null},"type":"Literal","value":10}},"update":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":7},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":5},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":7,"column":0},"end":{"line":8,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":9},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":4},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":9},"source":null},"type":"Identifier","name":"i"}}}]}},{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 4  ************/
/*;
var sum = 0, i = 0;
while(i < 3)
{
	sum += i;
	i++;
}
;*/

 testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":8,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":18},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":0}},{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":18},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":18},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":18},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":3,"column":0},"end":{"line":6,"column":5},"source":null},"type":"WhileStatement","test":{"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":11},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":7},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":11},"source":null},"type":"Literal","value":3}},"body":{"loc":{"start":{"line":4,"column":0},"end":{"line":6,"column":5},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":4},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":9},"source":null},"type":"Identifier","name":"i"}}},{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false}}]}},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 5  ************/
/*;
var sum = 0, i = 0;
do
{
	sum += i;
	i++;
}
while(i < 3
i++;
;*/

 testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":18},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":0}},{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":18},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":18},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":18},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":3,"column":0},"end":{"line":8,"column":11},"source":null},"type":"DoWhileStatement","body":{"loc":{"start":{"line":4,"column":0},"end":{"line":6,"column":5},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":4},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":9},"source":null},"type":"Identifier","name":"i"}}},{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false}}]},"test":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":11},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":7},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":8,"column":10},"end":{"line":8,"column":11},"source":null},"type":"Literal","value":3}}},{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":3},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":3},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":1},"source":null},"type":"Identifier","name":"i"},"prefix":false}},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 6  ************/
/*;
function obj()
{
	this.a = "2";
}
var a = new obj();
;*/

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":18},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":9},"end":{"line":4,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"obj"},"params":[],"body":{"loc":{"start":{"line":2,"column":0},"end":{"line":3,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":13},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":7},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"right":{"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":13},"source":null},"type":"Literal","value":"2"}}}]},"generator":false,"expression":false},{"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":15},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":15},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":15},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":5,"column":12},"end":{"line":5,"column":15},"source":null},"type":"NewExpression","callee":{"loc":{"start":{"line":5,"column":12},"end":{"line":5,"column":15},"source":null},"type":"Identifier","name":"obj"},"arguments":[]}}]}]});
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

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":14,"column":10},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":1,"column":4},"end":{"line":11,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":1,"column":4},"end":{"line":11,"column":1},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":1,"column":10},"end":{"line":11,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":5},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":7},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":7},"source":null},"type":"Literal","value":"4"},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":7,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":4,"column":4},"end":{"line":7,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":5,"column":1},"end":{"line":6,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":8,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":2},"source":null},"type":"Identifier","name":"d"},"value":{"loc":{"start":{"line":8,"column":4},"end":{"line":10,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":3},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":9,"column":6},"end":{"line":9,"column":9},"source":null},"type":"Literal","value":"d"},"kind":"init"}]},"kind":"init"}]}}]},{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":16},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":9},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":12,"column":8},"end":{"line":12,"column":9},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":12,"column":11},"end":{"line":12,"column":16},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":12,"column":11},"end":{"line":12,"column":16},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":12,"column":15},"end":{"line":12,"column":16},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":1},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":13,"column":4},"end":{"line":13,"column":5},"source":null},"type":"Identifier","name":"b"}}},{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":14,"column":4},"end":{"line":14,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":14,"column":4},"end":{"line":14,"column":7},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false}}}]});
/*********** Test: 8  ************/
/*;
	var a = [1,2,3];
	var b = a[0] + a[1] + a[2];
;*/

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":4,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":16},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":16},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":16},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":16},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":1},{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13},"source":null},"type":"Literal","value":2},{"loc":{"start":{"line":2,"column":14},"end":{"line":2,"column":15},"source":null},"type":"Literal","value":3}]}}]},{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":27},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":27},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":27},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":27},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":20},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":10},"source":null},"type":"Identifier","name":"a"},"property":{"loc":{"start":{"line":3,"column":11},"end":{"line":3,"column":12},"source":null},"type":"Literal","value":0},"computed":true},"right":{"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":20},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":17},"source":null},"type":"Identifier","name":"a"},"property":{"loc":{"start":{"line":3,"column":18},"end":{"line":3,"column":19},"source":null},"type":"Literal","value":1},"computed":true}},"right":{"loc":{"start":{"line":3,"column":23},"end":{"line":3,"column":27},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":23},"end":{"line":3,"column":24},"source":null},"type":"Identifier","name":"a"},"property":{"loc":{"start":{"line":3,"column":25},"end":{"line":3,"column":26},"source":null},"type":"Literal","value":2},"computed":true}}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":1},"source":null},"type":"EmptyStatement"}]});
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

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":14,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":6,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":6,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":6,"column":1},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":6,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":6},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":6},"source":null},"type":"Literal","value":4},"kind":"init"},{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":11},"source":null},"type":"Property","key":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":5,"column":5},"end":{"line":5,"column":11},"source":null},"type":"Literal","value":"test"},"kind":"init"}]}}]},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":19},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":19},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":19},"source":null},"type":"Identifier","name":"propValues"},"init":{"loc":{"start":{"line":8,"column":17},"end":{"line":8,"column":19},"source":null},"type":"Literal","value":""}}]},{"loc":{"start":{"line":10,"column":0},"end":{"line":12,"column":24},"source":null},"type":"ForInStatement","left":{"loc":{"start":{"line":10,"column":4},"end":{"line":10,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":11},"source":null},"type":"Identifier","name":"key"},"init":null}]},"right":{"loc":{"start":{"line":10,"column":15},"end":{"line":10,"column":18},"source":null},"type":"Identifier","name":"obj"},"body":{"loc":{"start":{"line":11,"column":0},"end":{"line":12,"column":24},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":23},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":23},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":11},"source":null},"type":"Identifier","name":"propValues"},"right":{"loc":{"start":{"line":12,"column":15},"end":{"line":12,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":12,"column":15},"end":{"line":12,"column":18},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":{"start":{"line":12,"column":19},"end":{"line":12,"column":22},"source":null},"type":"Identifier","name":"key"},"computed":true}}}]},"each":false},{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":30,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":9},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":12},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":12},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":12},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":12},"source":null},"type":"Literal","value":true}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":14,"column":10},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":4,"column":3},"end":{"line":4,"column":11},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":4,"column":3},"end":{"line":4,"column":6},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":4,"column":3},"end":{"line":4,"column":4},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":6},"source":null},"type":"Literal","value":3}},"right":{"loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":11},"source":null},"type":"Literal","value":0}},"consequent":{"loc":{"start":{"line":5,"column":0},"end":{"line":6,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":10},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":6,"column":5},"end":{"line":6,"column":10},"source":null},"type":"Literal","value":false}}}]},"alternate":{"loc":{"start":{"line":8,"column":5},"end":{"line":14,"column":10},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":19},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":14},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":10},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":8,"column":13},"end":{"line":8,"column":14},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":8,"column":18},"end":{"line":8,"column":19},"source":null},"type":"Literal","value":1}},"consequent":{"loc":{"start":{"line":9,"column":0},"end":{"line":10,"column":9},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":10,"column":5},"end":{"line":10,"column":9},"source":null},"type":"Literal","value":true}}}]},"alternate":{"loc":{"start":{"line":13,"column":0},"end":{"line":14,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":14,"column":1},"end":{"line":14,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":14,"column":1},"end":{"line":14,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":14,"column":1},"end":{"line":14,"column":2},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":14,"column":5},"end":{"line":14,"column":9},"source":null},"type":"Literal","value":true}}}]}}},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":9},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":9},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":16,"column":8},"end":{"line":16,"column":9},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":17,"column":0},"end":{"line":19,"column":7},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":17,"column":3},"end":{"line":17,"column":9},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":17,"column":3},"end":{"line":17,"column":4},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":9},"source":null},"type":"Literal","value":3}},"consequent":{"loc":{"start":{"line":18,"column":0},"end":{"line":19,"column":7},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":6},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":2},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":6},"source":null},"type":"Literal","value":4}}}]},"alternate":null},{"loc":{"start":{"line":21,"column":0},"end":{"line":27,"column":7},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":21,"column":3},"end":{"line":21,"column":9},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":21,"column":3},"end":{"line":21,"column":4},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":21,"column":8},"end":{"line":21,"column":9},"source":null},"type":"Literal","value":3}},"consequent":{"loc":{"start":{"line":22,"column":0},"end":{"line":23,"column":7},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":6},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":2},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":23,"column":5},"end":{"line":23,"column":6},"source":null},"type":"Literal","value":4}}}]},"alternate":{"loc":{"start":{"line":26,"column":0},"end":{"line":27,"column":7},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":6},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":2},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":27,"column":5},"end":{"line":27,"column":6},"source":null},"type":"Literal","value":5}}}]}},{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":1},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":29,"column":4},"end":{"line":29,"column":5},"source":null},"type":"Literal","value":6}}},{"loc":{"start":{"line":30,"column":0},"end":{"line":30,"column":1},"source":null},"type":"EmptyStatement"}]});
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

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":10,"column":5},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":16},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":1,"column":11},"end":{"line":1,"column":16},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":1,"column":11},"end":{"line":1,"column":16},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":16},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":4},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":1},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":4},"source":null},"type":"ConditionalExpression","test":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":14},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":5},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":14},"source":null},"type":"Literal","value":0}},"consequent":{"loc":{"start":{"line":3,"column":3},"end":{"line":3,"column":8},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":3,"column":3},"end":{"line":3,"column":4},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":3,"column":7},"end":{"line":3,"column":8},"source":null},"type":"Literal","value":1}},"alternate":{"loc":{"start":{"line":4,"column":3},"end":{"line":4,"column":4},"source":null},"type":"Identifier","name":"a"}}}},{"loc":{"start":{"line":5,"column":0},"end":{"line":7,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":5,"column":0},"end":{"line":7,"column":4},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":1},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":5,"column":4},"end":{"line":7,"column":4},"source":null},"type":"ConditionalExpression","test":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":14},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":9},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":5},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":9},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":5,"column":13},"end":{"line":5,"column":14},"source":null},"type":"Literal","value":1}},"consequent":{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":8},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":4},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":6,"column":7},"end":{"line":6,"column":8},"source":null},"type":"Literal","value":1}},"alternate":{"loc":{"start":{"line":7,"column":3},"end":{"line":7,"column":4},"source":null},"type":"Identifier","name":"a"}}}},{"loc":{"start":{"line":8,"column":0},"end":{"line":10,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":0},"end":{"line":10,"column":4},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":1},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":4},"end":{"line":10,"column":4},"source":null},"type":"ConditionalExpression","test":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":14},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":9},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":5},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":9},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":8,"column":13},"end":{"line":8,"column":14},"source":null},"type":"Literal","value":1}},"consequent":{"loc":{"start":{"line":9,"column":3},"end":{"line":9,"column":4},"source":null},"type":"Literal","value":3},"alternate":{"loc":{"start":{"line":10,"column":3},"end":{"line":10,"column":4},"source":null},"type":"Literal","value":4}}}}]});
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

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":8},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":9},"end":{"line":8,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test"},"params":[{"loc":{"start":{"line":1,"column":14},"end":{"line":1,"column":15},"source":null},"type":"Identifier","name":"a"}],"body":{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":3,"column":1},"end":{"line":5,"column":16},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":12},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":7},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":7},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":3,"column":11},"end":{"line":3,"column":12},"source":null},"type":"Literal","value":0}},"consequent":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":16},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":15},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":15},"source":null},"type":"Literal","value":"even"}}]},"alternate":null},{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":13},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":13},"source":null},"type":"Literal","value":"odd"}}]},"generator":false,"expression":false},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":4},"source":null},"type":"Identifier","name":"test"},"arguments":[{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":6},"source":null},"type":"Literal","value":4}]}}]});
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

testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":12,"column":6},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":11},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":2,"column":0},"end":{"line":10,"column":10},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13},"source":null},"type":"Literal","value":9}}]},"test":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":7},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":7},"source":null},"type":"Literal","value":13}},"update":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":5,"column":0},"end":{"line":10,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":1},"end":{"line":8,"column":8},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":12},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":7},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":5},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":7},"source":null},"type":"Literal","value":4}},"right":{"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":12},"source":null},"type":"Literal","value":0}},"consequent":{"loc":{"start":{"line":7,"column":1},"end":{"line":8,"column":8},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":7},"source":null},"type":"BreakStatement","label":null}]},"alternate":null},{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":9},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":4},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":9},"source":null},"type":"Identifier","name":"i"}}}]}},{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":3},"source":null},"type":"Identifier","name":"sum"},"prefix":false}}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":19,"column":2},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":21},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":16},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":4,"column":19},"end":{"line":4,"column":21},"source":null},"type":"Literal","value":10}},"update":{"loc":{"start":{"line":4,"column":23},"end":{"line":4,"column":26},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":4,"column":23},"end":{"line":4,"column":24},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":5,"column":0},"end":{"line":19,"column":2},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":1},"end":{"line":13,"column":11},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":6,"column":5},"end":{"line":6,"column":14},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":14},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":14},"source":null},"type":"Identifier","name":"j"},"init":{"loc":{"start":{"line":6,"column":13},"end":{"line":6,"column":14},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":21},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":17},"source":null},"type":"Identifier","name":"j"},"right":{"loc":{"start":{"line":6,"column":20},"end":{"line":6,"column":21},"source":null},"type":"Literal","value":5}},"update":{"loc":{"start":{"line":6,"column":23},"end":{"line":6,"column":26},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":23},"end":{"line":6,"column":24},"source":null},"type":"Identifier","name":"j"},"prefix":false},"body":{"loc":{"start":{"line":7,"column":1},"end":{"line":13,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":8,"column":2},"end":{"line":10,"column":9},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":8,"column":5},"end":{"line":8,"column":11},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":8,"column":5},"end":{"line":8,"column":6},"source":null},"type":"Identifier","name":"j"},"right":{"loc":{"start":{"line":8,"column":10},"end":{"line":8,"column":11},"source":null},"type":"Literal","value":4}},"consequent":{"loc":{"start":{"line":9,"column":2},"end":{"line":10,"column":9},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":10,"column":3},"end":{"line":10,"column":8},"source":null},"type":"BreakStatement","label":null}]},"alternate":null},{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":10},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":10},"source":null},"type":"Identifier","name":"j"}}}]}},{"loc":{"start":{"line":16,"column":1},"end":{"line":18,"column":8},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":10},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":5},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":16,"column":9},"end":{"line":16,"column":10},"source":null},"type":"Literal","value":9}},"consequent":{"loc":{"start":{"line":17,"column":1},"end":{"line":18,"column":8},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":7},"source":null},"type":"BreakStatement","label":null}]},"alternate":null}]}},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":3},"source":null},"type":"Identifier","name":"sum"},"prefix":false}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":27,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":23,"column":2},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":5,"column":3},"end":{"line":5,"column":9},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":5,"column":3},"end":{"line":5,"column":4},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":5,"column":7},"end":{"line":5,"column":9},"source":null},"type":"Literal","value":10}},"update":{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":6},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":4},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":7,"column":0},"end":{"line":23,"column":2},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":8,"column":1},"end":{"line":17,"column":11},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":8,"column":5},"end":{"line":8,"column":14},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":14},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":14},"source":null},"type":"Identifier","name":"j"},"init":{"loc":{"start":{"line":8,"column":13},"end":{"line":8,"column":14},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":6},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":2},"source":null},"type":"Identifier","name":"j"},"right":{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":6},"source":null},"type":"Literal","value":5}},"update":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Identifier","name":"j"},"prefix":false},"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":17,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":14,"column":12},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":12,"column":5},"end":{"line":12,"column":11},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":12,"column":5},"end":{"line":12,"column":6},"source":null},"type":"Identifier","name":"j"},"right":{"loc":{"start":{"line":12,"column":10},"end":{"line":12,"column":11},"source":null},"type":"Literal","value":2}},"consequent":{"loc":{"start":{"line":13,"column":2},"end":{"line":14,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":14,"column":3},"end":{"line":14,"column":3},"source":null},"type":"ContinueStatement","label":null}]},"alternate":null},{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":10},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":17,"column":9},"end":{"line":17,"column":10},"source":null},"type":"Identifier","name":"j"}}}]}},{"loc":{"start":{"line":20,"column":1},"end":{"line":22,"column":11},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":10},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":20,"column":9},"end":{"line":20,"column":10},"source":null},"type":"Literal","value":3}},"consequent":{"loc":{"start":{"line":21,"column":1},"end":{"line":22,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":22,"column":2},"end":{"line":22,"column":2},"source":null},"type":"ContinueStatement","label":null}]},"alternate":null}]}},{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":3},"source":null},"type":"Identifier","name":"sum"},"prefix":false}},{"loc":{"start":{"line":27,"column":0},"end":{"line":27,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":22,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":18},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":18},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":18},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":18},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":19,"column":1},"source":null},"type":"SwitchStatement","discriminant":{"loc":{"start":{"line":4,"column":7},"end":{"line":4,"column":8},"source":null},"type":"Identifier","name":"a"},"cases":[{"loc":{"start":{"line":6,"column":1},"end":{"line":8,"column":7},"source":null},"type":"SwitchCase","test":{"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":7},"source":null},"type":"Literal","value":1},"consequent":[{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":11},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":11},"source":null},"type":"Literal","value":10}}},{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":7},"source":null},"type":"BreakStatement","label":null}]},{"loc":{"start":{"line":9,"column":1},"end":{"line":11,"column":7},"source":null},"type":"SwitchCase","test":{"loc":{"start":{"line":9,"column":6},"end":{"line":9,"column":7},"source":null},"type":"Literal","value":2},"consequent":[{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":11},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":10,"column":9},"end":{"line":10,"column":11},"source":null},"type":"Literal","value":20}}},{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":7},"source":null},"type":"BreakStatement","label":null}]},{"loc":{"start":{"line":12,"column":1},"end":{"line":13,"column":11},"source":null},"type":"SwitchCase","test":{"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":7},"source":null},"type":"Literal","value":3},"consequent":[{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":11},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":11},"source":null},"type":"Literal","value":30}}}]},{"loc":{"start":{"line":14,"column":1},"end":{"line":16,"column":7},"source":null},"type":"SwitchCase","test":{"loc":{"start":{"line":14,"column":6},"end":{"line":14,"column":7},"source":null},"type":"Literal","value":4},"consequent":[{"loc":{"start":{"line":15,"column":2},"end":{"line":15,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":15,"column":2},"end":{"line":15,"column":11},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":15,"column":2},"end":{"line":15,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":15,"column":9},"end":{"line":15,"column":11},"source":null},"type":"Literal","value":40}}},{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":7},"source":null},"type":"BreakStatement","label":null}]},{"loc":{"start":{"line":17,"column":1},"end":{"line":18,"column":11},"source":null},"type":"SwitchCase","test":null,"consequent":[{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":11},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":18,"column":9},"end":{"line":18,"column":11},"source":null},"type":"Literal","value":80}}}]}],"lexical":false},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":3},"source":null},"type":"Identifier","name":"sum"},"prefix":false}},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 17  ************/
/*;
var a = {
	b: 3,
	c: 4
}

var c = a.b + a.c;
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":8,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":5,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":5,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":5},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":5},"source":null},"type":"Literal","value":4},"kind":"init"}]}}]},{"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":17},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":17},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":9},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"right":{"loc":{"start":{"line":7,"column":14},"end":{"line":7,"column":17},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":7,"column":14},"end":{"line":7,"column":15},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"c"},"computed":false}}}]},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":10},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":17},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"TryStatement","block":{"loc":{"start":{"line":5,"column":1},"end":{"line":8,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":3},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":3},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":9},"source":null},"type":"Literal","value":2}}}}]},"handlers":[{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":6},"source":null},"type":"CatchClause","param":{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":8},"source":null},"type":"Identifier","name":"e"},"guard":null,"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":12,"column":8},"end":{"line":12,"column":9},"source":null},"type":"Literal","value":3}}}}]}}],"finalizer":{"loc":{"start":{"line":15,"column":1},"end":{"line":18,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":16,"column":6},"end":{"line":16,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":16,"column":6},"end":{"line":16,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":16,"column":8},"end":{"line":16,"column":9},"source":null},"type":"Literal","value":7}}}},{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":3},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":18,"column":6},"end":{"line":18,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":18,"column":6},"end":{"line":18,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":9},"source":null},"type":"Literal","value":5}}}}]}},{"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":2},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":30,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":3,"column":7},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":10},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":7},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":7},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":7},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"TryStatement","block":{"loc":{"start":{"line":5,"column":1},"end":{"line":12,"column":3},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":3},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":3},"source":null},"type":"Identifier","name":"c"},"prefix":false}},{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":11},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":3},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":10},"end":{"line":8,"column":11},"source":null},"type":"Literal","value":2}}}},{"loc":{"start":{"line":9,"column":2},"end":{"line":11,"column":7},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":11},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":6},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":9,"column":10},"end":{"line":9,"column":11},"source":null},"type":"Literal","value":3}},"consequent":{"loc":{"start":{"line":10,"column":2},"end":{"line":11,"column":7},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":11,"column":3},"end":{"line":11,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":11,"column":3},"end":{"line":11,"column":6},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":11,"column":3},"end":{"line":11,"column":4},"source":null},"type":"Identifier","name":"b"},"prefix":false}}]},"alternate":null}]},"handlers":[{"loc":{"start":{"line":14,"column":1},"end":{"line":14,"column":6},"source":null},"type":"CatchClause","param":{"loc":{"start":{"line":14,"column":7},"end":{"line":14,"column":8},"source":null},"type":"Identifier","name":"e"},"guard":null,"body":{"loc":{"start":{"line":15,"column":1},"end":{"line":20,"column":3},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":11},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":16,"column":6},"end":{"line":16,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":16,"column":6},"end":{"line":16,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":16,"column":10},"end":{"line":16,"column":11},"source":null},"type":"Literal","value":3}}}},{"loc":{"start":{"line":17,"column":2},"end":{"line":19,"column":7},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":17,"column":5},"end":{"line":17,"column":11},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":17,"column":5},"end":{"line":17,"column":6},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":17,"column":10},"end":{"line":17,"column":11},"source":null},"type":"Literal","value":3}},"consequent":{"loc":{"start":{"line":18,"column":2},"end":{"line":19,"column":7},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":3},"end":{"line":19,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":19,"column":3},"end":{"line":19,"column":6},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":19,"column":3},"end":{"line":19,"column":4},"source":null},"type":"Identifier","name":"b"},"prefix":false}}]},"alternate":null}]}}],"finalizer":{"loc":{"start":{"line":23,"column":1},"end":{"line":26,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":11},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":24,"column":6},"end":{"line":24,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":24,"column":6},"end":{"line":24,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":24,"column":10},"end":{"line":24,"column":11},"source":null},"type":"Literal","value":7}}}},{"loc":{"start":{"line":25,"column":2},"end":{"line":25,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":25,"column":2},"end":{"line":25,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":25,"column":2},"end":{"line":25,"column":3},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":26,"column":2},"end":{"line":26,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":26,"column":2},"end":{"line":26,"column":11},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":26,"column":2},"end":{"line":26,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":26,"column":6},"end":{"line":26,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":26,"column":6},"end":{"line":26,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":26,"column":10},"end":{"line":26,"column":11},"source":null},"type":"Literal","value":5}}}}]}},{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":2},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":30,"column":0},"end":{"line":30,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":10},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":17},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"TryStatement","block":{"loc":{"start":{"line":5,"column":1},"end":{"line":8,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":3},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":15},"source":null},"type":"ThrowStatement","argument":{"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":15},"source":null},"type":"Literal","value":"Error"}},{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":3},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":9},"source":null},"type":"Literal","value":2}}}}]},"handlers":[{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":6},"source":null},"type":"CatchClause","param":{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":8},"source":null},"type":"Identifier","name":"e"},"guard":null,"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":12,"column":8},"end":{"line":12,"column":9},"source":null},"type":"Literal","value":3}}}}]}}],"finalizer":{"loc":{"start":{"line":15,"column":1},"end":{"line":18,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":16,"column":6},"end":{"line":16,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":16,"column":6},"end":{"line":16,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":16,"column":8},"end":{"line":16,"column":9},"source":null},"type":"Literal","value":7}}}},{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":3},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":3},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":18,"column":6},"end":{"line":18,"column":9},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":18,"column":6},"end":{"line":18,"column":7},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":9},"source":null},"type":"Literal","value":5}}}}]}},{"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":2},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":13,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":5,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":5,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":5},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":5},"source":null},"type":"Literal","value":4},"kind":"init"}]}}]},{"loc":{"start":{"line":7,"column":0},"end":{"line":9,"column":5},"source":null},"type":"WithStatement","object":{"loc":{"start":{"line":7,"column":5},"end":{"line":7,"column":6},"source":null},"type":"Identifier","name":"a"},"body":{"loc":{"start":{"line":8,"column":0},"end":{"line":9,"column":5},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":2},"source":null},"type":"Identifier","name":"b"},"prefix":false}}]}},{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":10},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"right":{"loc":{"start":{"line":12,"column":7},"end":{"line":12,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":12,"column":7},"end":{"line":12,"column":8},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"c"},"computed":false}}},{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":21,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":6,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"throwExceptionFunction"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":5,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":9},"source":null},"type":"Identifier","name":"a"}}]},"generator":false,"expression":false},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":3},"source":null},"type":"TryStatement","block":{"loc":{"start":{"line":9,"column":0},"end":{"line":13,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":10,"column":3},"end":{"line":10,"column":12},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":12},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":12},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":10,"column":11},"end":{"line":10,"column":12},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":11,"column":3},"end":{"line":11,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":11,"column":3},"end":{"line":11,"column":6},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":11,"column":3},"end":{"line":11,"column":4},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":12,"column":3},"end":{"line":12,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":3},"end":{"line":12,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":12,"column":3},"end":{"line":12,"column":25},"source":null},"type":"Identifier","name":"throwExceptionFunction"},"arguments":[]}},{"loc":{"start":{"line":13,"column":3},"end":{"line":13,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":3},"end":{"line":13,"column":10},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":3},"end":{"line":13,"column":4},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":13,"column":7},"end":{"line":13,"column":10},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":13,"column":7},"end":{"line":13,"column":8},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":10},"source":null},"type":"Literal","value":2}}}}]},"handlers":[{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":5},"source":null},"type":"CatchClause","param":{"loc":{"start":{"line":15,"column":6},"end":{"line":15,"column":7},"source":null},"type":"Identifier","name":"e"},"guard":null,"body":{"loc":{"start":{"line":16,"column":0},"end":{"line":17,"column":6},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":3},"source":null},"type":"Identifier","name":"b"},"prefix":false}}]}}],"finalizer":null},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":7},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":1},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":7},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":20,"column":6},"end":{"line":20,"column":7},"source":null},"type":"Literal","value":1}}}},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 23  ************/
/*;
var a = (function(a)
{
	a++;
	return a;
})(2);

a = a+1;
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":6,"column":5},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":6,"column":5},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":6,"column":5},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":6,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":2,"column":9},"end":{"line":6,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":2,"column":18},"end":{"line":2,"column":19},"source":null},"type":"Identifier","name":"a"}],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":5,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":9},"source":null},"type":"Identifier","name":"a"}}]},"generator":false,"expression":false},"arguments":[{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":4},"source":null},"type":"Literal","value":2}]}}]},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":7},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":1},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":7},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":5},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":7},"source":null},"type":"Literal","value":1}}}},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":8,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":8,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":8,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":8,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":6},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":7,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":4,"column":4},"end":{"line":7,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":4,"column":13},"end":{"line":4,"column":14},"source":null},"type":"Identifier","name":"d"}],"body":{"loc":{"start":{"line":5,"column":1},"end":{"line":6,"column":13},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":12},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":12},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":10},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":12},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":6},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"c"},"computed":false},"arguments":[{"loc":{"start":{"line":10,"column":4},"end":{"line":10,"column":5},"source":null},"type":"Literal","value":4}]}},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":10,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":5},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":4,"column":4},"end":{"line":6,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":3},"source":null},"type":"Identifier","name":"d"},"value":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":5},"source":null},"type":"Literal","value":4},"kind":"init"}]},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":5},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"c"},"computed":false},"property":{"loc":null,"type":"Identifier","name":"d"},"computed":false}},{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":17,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":3,"column":0},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":5},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":5,"column":1},"end":{"line":8,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":10},"source":null},"type":"Identifier","name":"increment"},"value":{"loc":{"start":{"line":5,"column":12},"end":{"line":8,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":5,"column":21},"end":{"line":5,"column":22},"source":null},"type":"Identifier","name":"c"}],"body":{"loc":{"start":{"line":6,"column":1},"end":{"line":7,"column":15},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":14},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":14},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":10},"source":null},"type":"Identifier","name":"c"},"right":{"loc":{"start":{"line":7,"column":13},"end":{"line":7,"column":14},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":9,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":5},"source":null},"type":"Identifier","name":"getB"},"value":{"loc":{"start":{"line":9,"column":7},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":10,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":32},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":6},"end":{"line":11,"column":32},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":6},"end":{"line":11,"column":32},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":11,"column":10},"end":{"line":11,"column":32},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":11,"column":10},"end":{"line":11,"column":24},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":11,"column":10},"end":{"line":11,"column":14},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"increment"},"computed":false},"arguments":[{"loc":{"start":{"line":11,"column":25},"end":{"line":11,"column":31},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":11,"column":25},"end":{"line":11,"column":29},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false}]}}]},{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Identifier","name":"c"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"getB"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":17,"column":0},"end":{"line":17,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":22,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":6,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":5,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":14},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":14},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":14},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":4,"column":9},"end":{"line":4,"column":14},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":4,"column":9},"end":{"line":4,"column":10},"source":null},"type":"Literal","value":2},"right":{"loc":{"start":{"line":4,"column":13},"end":{"line":4,"column":14},"source":null},"type":"Literal","value":1}}}]},{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":9},"source":null},"type":"Identifier","name":"b"}}]},"generator":false,"expression":false},{"loc":{"start":{"line":8,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":8,"column":8},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":9,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":9,"column":7},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":10,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":6},"end":{"line":11,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":6},"end":{"line":11,"column":13},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":11,"column":10},"end":{"line":11,"column":13},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":11,"column":10},"end":{"line":11,"column":11},"source":null},"type":"Literal","value":3},"right":{"loc":{"start":{"line":11,"column":12},"end":{"line":11,"column":13},"source":null},"type":"Literal","value":1}}}]},{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Identifier","name":"b"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":18,"column":8},"source":null},"type":"WithStatement","object":{"loc":{"start":{"line":16,"column":5},"end":{"line":16,"column":6},"source":null},"type":"Identifier","name":"a"},"body":{"loc":{"start":{"line":17,"column":0},"end":{"line":18,"column":8},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":5},"source":null},"type":"Identifier","name":"test"},"arguments":[]}}]}},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":6},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":4},"source":null},"type":"Identifier","name":"test"},"arguments":[]}},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":12,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test1"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":11,"column":9},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":10},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":4,"column":9},"end":{"line":4,"column":10},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":6,"column":10},"end":{"line":9,"column":2},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test2"},"params":[],"body":{"loc":{"start":{"line":7,"column":1},"end":{"line":8,"column":15},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":14},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":14},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":10},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":13},"end":{"line":8,"column":14},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":6},"source":null},"type":"Identifier","name":"test2"},"arguments":[]}}]},"generator":false,"expression":false},{"loc":{"start":{"line":14,"column":9},"end":{"line":18,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test2"},"params":[],"body":{"loc":{"start":{"line":15,"column":0},"end":{"line":17,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":16,"column":1},"end":{"line":16,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":5},"end":{"line":16,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":5},"end":{"line":16,"column":10},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":16,"column":9},"end":{"line":16,"column":10},"source":null},"type":"Literal","value":4}}]},{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":13},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":13},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":9},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":17,"column":12},"end":{"line":17,"column":13},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"test1"},"arguments":[]}},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":5},"source":null},"type":"Identifier","name":"test2"},"arguments":[]}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":21,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":5,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":5,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":3},"source":null},"type":"Identifier","name":"aa"},"value":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":6},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":3},"source":null},"type":"Identifier","name":"ab"},"value":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":6},"source":null},"type":"Literal","value":4},"kind":"init"}]}}]},{"loc":{"start":{"line":7,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":7,"column":8},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":3},"source":null},"type":"Identifier","name":"bb"},"value":{"loc":{"start":{"line":8,"column":5},"end":{"line":8,"column":6},"source":null},"type":"Literal","value":5},"kind":"init"},{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":3},"source":null},"type":"Identifier","name":"bc"},"value":{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":6},"source":null},"type":"Literal","value":6},"kind":"init"},{"loc":{"start":{"line":10,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":3},"source":null},"type":"Identifier","name":"bc"},"value":{"loc":{"start":{"line":10,"column":5},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Literal","value":2}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":15},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":15},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":15},"source":null},"type":"Identifier","name":"arr"},"init":{"loc":{"start":{"line":16,"column":10},"end":{"line":16,"column":15},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":16,"column":11},"end":{"line":16,"column":12},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":16,"column":13},"end":{"line":16,"column":14},"source":null},"type":"Identifier","name":"b"}]}}]},{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":16},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":18,"column":4},"end":{"line":18,"column":16},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":18,"column":4},"end":{"line":18,"column":16},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":16},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":11},"source":null},"type":"Identifier","name":"arr"},"property":{"loc":{"start":{"line":18,"column":12},"end":{"line":18,"column":15},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":18,"column":12},"end":{"line":18,"column":13},"source":null},"type":"Literal","value":0},"right":{"loc":{"start":{"line":18,"column":14},"end":{"line":18,"column":15},"source":null},"type":"Literal","value":1}},"computed":true}}]},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":14},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":14},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":12},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":1},"source":null},"type":"Identifier","name":"c"},"property":{"loc":{"start":{"line":20,"column":2},"end":{"line":20,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":20,"column":2},"end":{"line":20,"column":5},"source":null},"type":"Literal","value":"b"},"right":{"loc":{"start":{"line":20,"column":8},"end":{"line":20,"column":11},"source":null},"type":"Literal","value":"c"}},"computed":true},"arguments":[]}},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 30  ************/
/*;
var a = 1 + 2 + 3;

var b = a * 4 * 3;

var c = b / 2 - 3;
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":17},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":17},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":13},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17},"source":null},"type":"Literal","value":3}}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":17},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":17},"source":null},"type":"BinaryExpression","operator":"*","left":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":13},"source":null},"type":"BinaryExpression","operator":"*","left":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":13},"source":null},"type":"Literal","value":4}},"right":{"loc":{"start":{"line":4,"column":16},"end":{"line":4,"column":17},"source":null},"type":"Literal","value":3}}}]},{"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":17},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":17},"source":null},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":13},"source":null},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":9},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":6,"column":12},"end":{"line":6,"column":13},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":17},"source":null},"type":"Literal","value":3}}}]},{"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":33,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"Identifier","name":"obj1"},"init":{"loc":{"start":{"line":2,"column":11},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":9,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":9,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"obj2"},"init":{"loc":{"start":{"line":9,"column":11},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":10,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":10,"column":7},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":21,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":21,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":21,"column":1},"source":null},"type":"Identifier","name":"obj3"},"init":{"loc":{"start":{"line":16,"column":11},"end":{"line":21,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":17,"column":1},"end":{"line":20,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":17,"column":7},"end":{"line":20,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":18,"column":1},"end":{"line":19,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":19,"column":9},"end":{"line":19,"column":10},"source":null},"type":"Literal","value":5}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":30},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":23,"column":4},"end":{"line":23,"column":30},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":23,"column":4},"end":{"line":23,"column":30},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":23,"column":12},"end":{"line":23,"column":30},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":23,"column":13},"end":{"line":23,"column":17},"source":null},"type":"Identifier","name":"obj1"},{"loc":{"start":{"line":23,"column":19},"end":{"line":23,"column":23},"source":null},"type":"Identifier","name":"obj2"},{"loc":{"start":{"line":23,"column":25},"end":{"line":23,"column":29},"source":null},"type":"Identifier","name":"obj3"}]}}]},{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":24,"column":4},"end":{"line":24,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":24,"column":4},"end":{"line":24,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":24,"column":10},"end":{"line":24,"column":11},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":26,"column":0},"end":{"line":31,"column":27},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":26,"column":4},"end":{"line":26,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":26,"column":8},"end":{"line":26,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":26,"column":8},"end":{"line":26,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":26,"column":12},"end":{"line":26,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":6},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":2},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":27,"column":5},"end":{"line":27,"column":6},"source":null},"type":"Literal","value":3}},"update":{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":29,"column":0},"end":{"line":31,"column":27},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":30,"column":1},"end":{"line":30,"column":27},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":30,"column":5},"end":{"line":30,"column":27},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":30,"column":5},"end":{"line":30,"column":27},"source":null},"type":"Identifier","name":"currentItem"},"init":{"loc":{"start":{"line":30,"column":19},"end":{"line":30,"column":27},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":30,"column":19},"end":{"line":30,"column":24},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":30,"column":25},"end":{"line":30,"column":26},"source":null},"type":"Identifier","name":"i"},"computed":true}}]},{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":26},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":26},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":4},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":31,"column":8},"end":{"line":31,"column":26},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":31,"column":8},"end":{"line":31,"column":24},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":31,"column":8},"end":{"line":31,"column":19},"source":null},"type":"Identifier","name":"currentItem"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}}}]}},{"loc":{"start":{"line":33,"column":0},"end":{"line":33,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 32  ************/
/*;
var a = 3;

var b = 3 + a++ +a;

a = 3;

b = 3 + ++a + a;
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":9},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":9},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":18},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":18},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":18},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":18},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":15},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9},"source":null},"type":"Literal","value":3},"right":{"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":15},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":13},"source":null},"type":"Identifier","name":"a"},"prefix":false}},"right":{"loc":{"start":{"line":4,"column":17},"end":{"line":4,"column":18},"source":null},"type":"Identifier","name":"a"}}}]},{"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":1},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":5},"source":null},"type":"Literal","value":3}}},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":15},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":1},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":15},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":5},"source":null},"type":"Literal","value":3},"right":{"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":11},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":8,"column":10},"end":{"line":8,"column":11},"source":null},"type":"Identifier","name":"a"},"prefix":true}},"right":{"loc":{"start":{"line":8,"column":14},"end":{"line":8,"column":15},"source":null},"type":"Identifier","name":"a"}}}},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":40,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":12},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":12},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":12},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":9,"column":8},"end":{"line":9,"column":12},"source":null},"type":"Literal","value":null}}]},{"loc":{"start":{"line":11,"column":0},"end":{"line":16,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":4},"end":{"line":16,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":4},"end":{"line":16,"column":1},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":11,"column":8},"end":{"line":16,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":12,"column":1},"end":{"line":15,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":12,"column":7},"end":{"line":15,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":13,"column":1},"end":{"line":14,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":14,"column":2},"end":{"line":14,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":14,"column":9},"end":{"line":14,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":18,"column":0},"end":{"line":20,"column":5},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":18,"column":4},"end":{"line":20,"column":5},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":18,"column":4},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"d"},"init":{"loc":{"start":{"line":18,"column":8},"end":{"line":20,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":18,"column":8},"end":{"line":19,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":9},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":19,"column":4},"end":{"line":19,"column":5},"source":null},"type":"Identifier","name":"b"}},"right":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"c"}}}]},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":1},"source":null},"type":"Identifier","name":"d"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":24,"column":0},"end":{"line":27,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":24,"column":0},"end":{"line":27,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":1},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":24,"column":4},"end":{"line":27,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":24,"column":4},"end":{"line":26,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":24,"column":4},"end":{"line":25,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":24,"column":4},"end":{"line":24,"column":9},"source":null},"type":"Literal","value":false},"right":{"loc":{"start":{"line":25,"column":4},"end":{"line":25,"column":5},"source":null},"type":"Identifier","name":"a"}},"right":{"loc":{"start":{"line":26,"column":4},"end":{"line":26,"column":5},"source":null},"type":"Identifier","name":"b"}},"right":{"loc":{"start":{"line":27,"column":4},"end":{"line":27,"column":5},"source":null},"type":"Identifier","name":"c"}}}},{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":1},"source":null},"type":"Identifier","name":"d"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":31,"column":0},"end":{"line":33,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":31,"column":0},"end":{"line":33,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":31,"column":0},"end":{"line":31,"column":1},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":31,"column":4},"end":{"line":33,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":31,"column":4},"end":{"line":32,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":31,"column":4},"end":{"line":31,"column":5},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":32,"column":4},"end":{"line":32,"column":5},"source":null},"type":"Identifier","name":"a"}},"right":{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":5},"source":null},"type":"Identifier","name":"b"}}}},{"loc":{"start":{"line":35,"column":0},"end":{"line":37,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":35,"column":0},"end":{"line":37,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":35,"column":0},"end":{"line":35,"column":1},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":35,"column":4},"end":{"line":37,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":35,"column":4},"end":{"line":36,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":35,"column":4},"end":{"line":35,"column":9},"source":null},"type":"Literal","value":false},"right":{"loc":{"start":{"line":36,"column":4},"end":{"line":36,"column":5},"source":null},"type":"Identifier","name":"b"}},"right":{"loc":{"start":{"line":37,"column":4},"end":{"line":37,"column":5},"source":null},"type":"Identifier","name":"c"}}}},{"loc":{"start":{"line":39,"column":0},"end":{"line":39,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":39,"column":0},"end":{"line":39,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":39,"column":0},"end":{"line":39,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":39,"column":0},"end":{"line":39,"column":1},"source":null},"type":"Identifier","name":"d"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":40,"column":0},"end":{"line":40,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":44,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":12},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":12},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":12},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":9,"column":8},"end":{"line":9,"column":12},"source":null},"type":"Literal","value":null}}]},{"loc":{"start":{"line":11,"column":0},"end":{"line":16,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":4},"end":{"line":16,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":4},"end":{"line":16,"column":1},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":11,"column":8},"end":{"line":16,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":12,"column":1},"end":{"line":15,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":12,"column":7},"end":{"line":15,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":13,"column":1},"end":{"line":14,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":14,"column":2},"end":{"line":14,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":14,"column":9},"end":{"line":14,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":18,"column":0},"end":{"line":20,"column":5},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":18,"column":4},"end":{"line":20,"column":5},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":18,"column":4},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"d"},"init":{"loc":{"start":{"line":18,"column":8},"end":{"line":20,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":18,"column":8},"end":{"line":19,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":9},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":19,"column":4},"end":{"line":19,"column":5},"source":null},"type":"Identifier","name":"b"}},"right":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":5},"source":null},"type":"Identifier","name":"c"}}}]},{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":5},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":24,"column":4},"end":{"line":24,"column":5},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":24,"column":4},"end":{"line":26,"column":5},"source":null},"type":"Identifier","name":"d"},"init":{"loc":{"start":{"line":24,"column":8},"end":{"line":26,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":24,"column":8},"end":{"line":25,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":24,"column":8},"end":{"line":24,"column":9},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":25,"column":4},"end":{"line":25,"column":5},"source":null},"type":"Identifier","name":"c"}},"right":{"loc":{"start":{"line":26,"column":4},"end":{"line":26,"column":5},"source":null},"type":"Identifier","name":"b"}}}]},{"loc":{"start":{"line":30,"column":0},"end":{"line":33,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":30,"column":0},"end":{"line":33,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":30,"column":0},"end":{"line":30,"column":1},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":30,"column":4},"end":{"line":33,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":30,"column":4},"end":{"line":32,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":30,"column":4},"end":{"line":31,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":30,"column":4},"end":{"line":30,"column":9},"source":null},"type":"Literal","value":false},"right":{"loc":{"start":{"line":31,"column":4},"end":{"line":31,"column":5},"source":null},"type":"Identifier","name":"a"}},"right":{"loc":{"start":{"line":32,"column":4},"end":{"line":32,"column":5},"source":null},"type":"Identifier","name":"b"}},"right":{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":5},"source":null},"type":"Identifier","name":"c"}}}},{"loc":{"start":{"line":35,"column":0},"end":{"line":37,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":35,"column":0},"end":{"line":37,"column":9},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":35,"column":0},"end":{"line":35,"column":1},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":35,"column":4},"end":{"line":37,"column":9},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":35,"column":4},"end":{"line":36,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":35,"column":4},"end":{"line":35,"column":5},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":36,"column":4},"end":{"line":36,"column":5},"source":null},"type":"Identifier","name":"a"}},"right":{"loc":{"start":{"line":37,"column":4},"end":{"line":37,"column":9},"source":null},"type":"Literal","value":false}}}},{"loc":{"start":{"line":39,"column":0},"end":{"line":41,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":39,"column":0},"end":{"line":41,"column":5},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":39,"column":0},"end":{"line":39,"column":1},"source":null},"type":"Identifier","name":"d"},"right":{"loc":{"start":{"line":39,"column":4},"end":{"line":41,"column":5},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":39,"column":4},"end":{"line":40,"column":8},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":39,"column":4},"end":{"line":39,"column":5},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":40,"column":4},"end":{"line":40,"column":8},"source":null},"type":"Literal","value":true}},"right":{"loc":{"start":{"line":41,"column":4},"end":{"line":41,"column":5},"source":null},"type":"Identifier","name":"c"}}}},{"loc":{"start":{"line":44,"column":0},"end":{"line":44,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":20,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":8,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":8,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":8,"column":2},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":8,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":7},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":3},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":7},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":4,"column":2},"end":{"line":7,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":6},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":4,"column":8},"end":{"line":7,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":5,"column":2},"end":{"line":6,"column":17},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":16},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":10},"end":{"line":6,"column":16},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":6,"column":10},"end":{"line":6,"column":14},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":10,"column":10},"end":{"line":13,"column":2},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test"},"params":[],"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Identifier","name":"a"}}]},"generator":false,"expression":false},{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":13},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":5},"source":null},"type":"Identifier","name":"test"},"arguments":[]},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"right":{"loc":{"start":{"line":15,"column":12},"end":{"line":15,"column":13},"source":null},"type":"Literal","value":4}}},{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":17,"column":5},"end":{"line":17,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":17,"column":5},"end":{"line":17,"column":17},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":17,"column":9},"end":{"line":17,"column":17},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":17,"column":9},"end":{"line":17,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":17,"column":9},"end":{"line":17,"column":10},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}}]},{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":2},"source":null},"type":"Identifier","name":"b"},"prefix":false}},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":16,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":1},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":4,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":4},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":3,"column":3},"end":{"line":3,"column":4},"source":null},"type":"Literal","value":4},"kind":"init"}]}}]},{"loc":{"start":{"line":6,"column":0},"end":{"line":11,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":4},"end":{"line":11,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":4},"end":{"line":11,"column":1},"source":null},"type":"Identifier","name":"test"},"init":{"loc":{"start":{"line":6,"column":12},"end":{"line":11,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":7,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":7,"column":4},"end":{"line":10,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":8,"column":1},"end":{"line":9,"column":13},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":12},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":12},"source":null},"type":"Identifier","name":"obj"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":14},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":14},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":4},"source":null},"type":"Identifier","name":"test"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"arguments":[]},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"right":{"loc":{"start":{"line":13,"column":13},"end":{"line":13,"column":14},"source":null},"type":"Literal","value":5}}},{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":5},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":3},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false}},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push();
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

 //testData.push();
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":8,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"cons"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":7,"column":2},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":7,"column":2},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":4,"column":1},"end":{"line":7,"column":2},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":7},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":5},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"right":{"loc":{"start":{"line":4,"column":10},"end":{"line":7,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":5,"column":1},"end":{"line":6,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false}}}]},"generator":false,"expression":false},{"loc":{"start":{"line":10,"column":5},"end":{"line":10,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":5},"end":{"line":10,"column":16},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":10,"column":5},"end":{"line":10,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":10,"column":5},"end":{"line":10,"column":9},"source":null},"type":"NewExpression","callee":{"loc":{"start":{"line":10,"column":5},"end":{"line":10,"column":9},"source":null},"type":"Identifier","name":"cons"},"arguments":[]},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":8,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test1"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":7,"column":2},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":7,"column":2},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":4,"column":8},"end":{"line":7,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":5,"column":1},"end":{"line":6,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false}}]},"generator":false,"expression":false},{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":9},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":5},"source":null},"type":"Identifier","name":"test1"},"arguments":[]},"arguments":[]}},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 41  ************/
/*;
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
		obj.fun();	
	})();
	
	a++;
})();
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":29,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":28,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":2,"column":1},"end":{"line":28,"column":4},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":2,"column":1},"end":{"line":28,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":27,"column":5},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":4,"column":9},"end":{"line":4,"column":10},"source":null},"type":"Literal","value":1}}]},{"loc":{"start":{"line":5,"column":1},"end":{"line":10,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":5,"column":5},"end":{"line":10,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":5,"column":5},"end":{"line":10,"column":2},"source":null},"type":"Identifier","name":"obj1"},"init":{"loc":{"start":{"line":5,"column":12},"end":{"line":10,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":6,"column":2},"end":{"line":9,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":5},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":6,"column":7},"end":{"line":9,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":7,"column":2},"end":{"line":8,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":8,"column":3},"end":{"line":8,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":8,"column":10},"end":{"line":8,"column":11},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":12,"column":1},"end":{"line":17,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":12,"column":5},"end":{"line":17,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":12,"column":5},"end":{"line":17,"column":2},"source":null},"type":"Identifier","name":"obj2"},"init":{"loc":{"start":{"line":12,"column":12},"end":{"line":17,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":13,"column":2},"end":{"line":16,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":5},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":13,"column":7},"end":{"line":16,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":14,"column":2},"end":{"line":15,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":15,"column":3},"end":{"line":15,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":15,"column":10},"end":{"line":15,"column":11},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":25},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":25},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":25},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":19,"column":13},"end":{"line":19,"column":25},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":19,"column":14},"end":{"line":19,"column":18},"source":null},"type":"Identifier","name":"obj1"},{"loc":{"start":{"line":19,"column":20},"end":{"line":19,"column":24},"source":null},"type":"Identifier","name":"obj2"}]}}]},{"loc":{"start":{"line":21,"column":2},"end":{"line":25,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":21,"column":2},"end":{"line":25,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":21,"column":2},"end":{"line":25,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":22,"column":1},"end":{"line":24,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":20},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":23,"column":6},"end":{"line":23,"column":20},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":23,"column":6},"end":{"line":23,"column":20},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":23,"column":12},"end":{"line":23,"column":20},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":23,"column":12},"end":{"line":23,"column":17},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":23,"column":18},"end":{"line":23,"column":19},"source":null},"type":"Identifier","name":"a"},"computed":true}}]},{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":11},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":5},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":null,"type":"Identifier","name":"fun"},"computed":false},"arguments":[]}}]},"generator":false,"expression":false},"arguments":[]}},{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}}]},"generator":false,"expression":false},"arguments":[]}},{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 42  ************/
/**/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":0},"source":null},"type":"Program","body":[]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":11,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":11,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":11,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":11,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":4},"source":null},"type":"Identifier","name":"own"},"value":{"loc":{"start":{"line":3,"column":6},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":7,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":7,"column":7},"end":{"line":10,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":8,"column":1},"end":{"line":9,"column":24},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":23},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":23},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":19},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":17},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":13},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"own"},"computed":false},"arguments":[]},"right":{"loc":{"start":{"line":9,"column":22},"end":{"line":9,"column":23},"source":null},"type":"Literal","value":3}}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":13,"column":0},"end":{"line":18,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":13,"column":4},"end":{"line":18,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":13,"column":4},"end":{"line":18,"column":1},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":13,"column":8},"end":{"line":18,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":14,"column":1},"end":{"line":17,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":14,"column":1},"end":{"line":14,"column":4},"source":null},"type":"Identifier","name":"own"},"value":{"loc":{"start":{"line":14,"column":6},"end":{"line":17,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":15,"column":1},"end":{"line":16,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":16,"column":9},"end":{"line":16,"column":10},"source":null},"type":"Literal","value":5}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":15},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":1},"source":null},"type":"Identifier","name":"b"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"right":{"loc":{"start":{"line":20,"column":9},"end":{"line":20,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":20,"column":9},"end":{"line":20,"column":10},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false}}},{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":9},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":7},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":2},"source":null},"type":"Identifier","name":"b"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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
y.b(); // 20 � is gotten from the prototype x;
 
delete y.a; // removed own a
y.a(); // a � is gotten from the prototype
 
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
y.e(); // also � is gotten from the prototype z
 
z.q = function() // added new property to the prototype
{
	return 4;
}; 

y.q(); // changes are available and on y
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":51,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":11,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":2,"column":0},"end":{"line":11,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":1},"source":null},"type":"Identifier","name":"x"},"right":{"loc":{"start":{"line":2,"column":4},"end":{"line":11,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":3,"column":4},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":7,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":7,"column":4},"end":{"line":10,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":8,"column":1},"end":{"line":9,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":12,"column":0},"end":{"line":21,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":0},"end":{"line":21,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":1},"source":null},"type":"Identifier","name":"y"},"right":{"loc":{"start":{"line":12,"column":4},"end":{"line":21,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":13,"column":1},"end":{"line":16,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":13,"column":4},"end":{"line":16,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":14,"column":1},"end":{"line":15,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":15,"column":2},"end":{"line":15,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":15,"column":9},"end":{"line":15,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":17,"column":1},"end":{"line":20,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":17,"column":4},"end":{"line":20,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":18,"column":1},"end":{"line":19,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":19,"column":9},"end":{"line":19,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":15},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"__proto__"},"computed":false},"right":{"loc":{"start":{"line":22,"column":14},"end":{"line":22,"column":15},"source":null},"type":"Identifier","name":"x"}}},{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"c"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":28,"column":0},"end":{"line":28,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":28,"column":0},"end":{"line":28,"column":10},"source":null},"type":"UnaryExpression","operator":"delete","argument":{"loc":{"start":{"line":28,"column":7},"end":{"line":28,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":28,"column":7},"end":{"line":28,"column":8},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"prefix":true}},{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":31,"column":0},"end":{"line":40,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":31,"column":0},"end":{"line":40,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":31,"column":0},"end":{"line":31,"column":1},"source":null},"type":"Identifier","name":"z"},"right":{"loc":{"start":{"line":31,"column":4},"end":{"line":40,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":32,"column":1},"end":{"line":35,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":32,"column":1},"end":{"line":32,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":32,"column":4},"end":{"line":35,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":33,"column":1},"end":{"line":34,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":34,"column":2},"end":{"line":34,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":34,"column":9},"end":{"line":34,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":36,"column":1},"end":{"line":39,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":36,"column":1},"end":{"line":36,"column":2},"source":null},"type":"Identifier","name":"e"},"value":{"loc":{"start":{"line":36,"column":4},"end":{"line":39,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":37,"column":1},"end":{"line":38,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":38,"column":2},"end":{"line":38,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":38,"column":9},"end":{"line":38,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":41,"column":0},"end":{"line":41,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":41,"column":0},"end":{"line":41,"column":15},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":41,"column":0},"end":{"line":41,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":41,"column":0},"end":{"line":41,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"__proto__"},"computed":false},"right":{"loc":{"start":{"line":41,"column":14},"end":{"line":41,"column":15},"source":null},"type":"Identifier","name":"z"}}},{"loc":{"start":{"line":42,"column":0},"end":{"line":42,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":42,"column":0},"end":{"line":42,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":42,"column":0},"end":{"line":42,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":42,"column":0},"end":{"line":42,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":43,"column":0},"end":{"line":43,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":43,"column":0},"end":{"line":43,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":43,"column":0},"end":{"line":43,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":43,"column":0},"end":{"line":43,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"e"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":45,"column":0},"end":{"line":48,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":45,"column":0},"end":{"line":48,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":45,"column":0},"end":{"line":45,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":45,"column":0},"end":{"line":45,"column":1},"source":null},"type":"Identifier","name":"z"},"property":{"loc":null,"type":"Identifier","name":"q"},"computed":false},"right":{"loc":{"start":{"line":45,"column":6},"end":{"line":48,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":46,"column":0},"end":{"line":47,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":47,"column":1},"end":{"line":47,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":47,"column":8},"end":{"line":47,"column":9},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false}}},{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"q"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":51,"column":0},"end":{"line":51,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":27,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":1},"source":null},"type":"Identifier","name":"x"},"right":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":3,"column":4},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":9,"column":0},"end":{"line":14,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":0},"end":{"line":14,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":1},"source":null},"type":"Identifier","name":"y"},"right":{"loc":{"start":{"line":9,"column":4},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":10,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Identifier","name":"b"},"value":{"loc":{"start":{"line":10,"column":4},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":15},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":1},"source":null},"type":"Identifier","name":"y"},"property":{"loc":null,"type":"Identifier","name":"__proto__"},"computed":false},"right":{"loc":{"start":{"line":16,"column":14},"end":{"line":16,"column":15},"source":null},"type":"Identifier","name":"x"}}},{"loc":{"start":{"line":18,"column":0},"end":{"line":23,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":0},"end":{"line":23,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":1},"source":null},"type":"Identifier","name":"z"},"right":{"loc":{"start":{"line":18,"column":4},"end":{"line":23,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":19,"column":1},"end":{"line":22,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":2},"source":null},"type":"Identifier","name":"c"},"value":{"loc":{"start":{"line":19,"column":4},"end":{"line":22,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":20,"column":1},"end":{"line":21,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":21,"column":2},"end":{"line":21,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":21,"column":9},"end":{"line":21,"column":11},"source":null},"type":"Literal","value":30}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":15},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":1},"source":null},"type":"Identifier","name":"z"},"property":{"loc":null,"type":"Identifier","name":"__proto__"},"computed":false},"right":{"loc":{"start":{"line":24,"column":14},"end":{"line":24,"column":15},"source":null},"type":"Identifier","name":"y"}}},{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":1},"source":null},"type":"Identifier","name":"z"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":27,"column":0},"end":{"line":27,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 46  ************/
/*;
function A() {}
A.prototype.x = function()
{
	return 10;
};
 
var a = new A();
a.x(); // 10 � by delegation, from the prototype
 
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
b.y(); // 100 � by delegation, from the prototype
//and there is not b.x() - because "b" has new prototype 

a.x();
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":27,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":15},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"A"},"params":[],"body":{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":14},"source":null},"type":"BlockStatement","body":[]},"generator":false,"expression":false},{"loc":{"start":{"line":3,"column":0},"end":{"line":6,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":3,"column":0},"end":{"line":6,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":1},"source":null},"type":"Identifier","name":"A"},"property":{"loc":null,"type":"Identifier","name":"prototype"},"computed":false},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"right":{"loc":{"start":{"line":3,"column":16},"end":{"line":6,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":0},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":10}}]},"generator":false,"expression":false}}},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":13},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":13},"source":null},"type":"NewExpression","callee":{"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":13},"source":null},"type":"Identifier","name":"A"},"arguments":[]}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":13,"column":0},"end":{"line":19,"column":1},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":0},"end":{"line":19,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":1},"source":null},"type":"Identifier","name":"A"},"property":{"loc":null,"type":"Identifier","name":"prototype"},"computed":false},"right":{"loc":{"start":{"line":13,"column":14},"end":{"line":19,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":14,"column":2},"end":{"line":14,"column":16},"source":null},"type":"Property","key":{"loc":{"start":{"line":14,"column":2},"end":{"line":14,"column":13},"source":null},"type":"Identifier","name":"constructor"},"value":{"loc":{"start":{"line":14,"column":15},"end":{"line":14,"column":16},"source":null},"type":"Identifier","name":"A"},"kind":"init"},{"loc":{"start":{"line":15,"column":2},"end":{"line":18,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":15,"column":2},"end":{"line":15,"column":3},"source":null},"type":"Identifier","name":"y"},"value":{"loc":{"start":{"line":15,"column":5},"end":{"line":18,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":16,"column":2},"end":{"line":17,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":17,"column":3},"end":{"line":17,"column":13},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":17,"column":10},"end":{"line":17,"column":13},"source":null},"type":"Literal","value":100}}]},"generator":false,"expression":false},"kind":"init"}]}}},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":21,"column":4},"end":{"line":21,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":21,"column":4},"end":{"line":21,"column":13},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":21,"column":12},"end":{"line":21,"column":13},"source":null},"type":"NewExpression","callee":{"loc":{"start":{"line":21,"column":12},"end":{"line":21,"column":13},"source":null},"type":"Identifier","name":"A"},"arguments":[]}}]},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Identifier","name":"b"},"property":{"loc":null,"type":"Identifier","name":"y"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":26,"column":0},"end":{"line":26,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":27,"column":0},"end":{"line":27,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":107,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":21},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":25,"column":4},"end":{"line":25,"column":21},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":25,"column":4},"end":{"line":25,"column":21},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":25,"column":16},"end":{"line":25,"column":21},"source":null},"type":"NewExpression","callee":{"loc":{"start":{"line":25,"column":16},"end":{"line":25,"column":21},"source":null},"type":"Identifier","name":"Array"},"arguments":[]}}]},{"loc":{"start":{"line":27,"column":0},"end":{"line":32,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":27,"column":4},"end":{"line":32,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":27,"column":4},"end":{"line":32,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":27,"column":8},"end":{"line":32,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":28,"column":1},"end":{"line":31,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":2},"source":null},"type":"Identifier","name":"x"},"value":{"loc":{"start":{"line":28,"column":4},"end":{"line":31,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":29,"column":1},"end":{"line":30,"column":13},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":30,"column":2},"end":{"line":30,"column":12},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":30,"column":9},"end":{"line":30,"column":12},"source":null},"type":"Literal","value":"a"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":34,"column":0},"end":{"line":39,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":34,"column":4},"end":{"line":39,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":34,"column":4},"end":{"line":39,"column":1},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":34,"column":8},"end":{"line":39,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":35,"column":1},"end":{"line":38,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":35,"column":1},"end":{"line":35,"column":2},"source":null},"type":"Identifier","name":"x"},"value":{"loc":{"start":{"line":35,"column":4},"end":{"line":38,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":36,"column":1},"end":{"line":37,"column":13},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":37,"column":2},"end":{"line":37,"column":12},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":37,"column":9},"end":{"line":37,"column":12},"source":null},"type":"Literal","value":"b"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":41,"column":0},"end":{"line":46,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":41,"column":4},"end":{"line":46,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":41,"column":4},"end":{"line":46,"column":1},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":41,"column":8},"end":{"line":46,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":42,"column":1},"end":{"line":45,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":42,"column":1},"end":{"line":42,"column":2},"source":null},"type":"Identifier","name":"x"},"value":{"loc":{"start":{"line":42,"column":4},"end":{"line":45,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":43,"column":1},"end":{"line":44,"column":13},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":44,"column":2},"end":{"line":44,"column":12},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":44,"column":9},"end":{"line":44,"column":12},"source":null},"type":"Literal","value":"c"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":48,"column":0},"end":{"line":48,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":48,"column":0},"end":{"line":48,"column":13},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":48,"column":0},"end":{"line":48,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":48,"column":0},"end":{"line":48,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"push"},"computed":false},"arguments":[{"loc":{"start":{"line":48,"column":11},"end":{"line":48,"column":12},"source":null},"type":"Identifier","name":"a"}]}},{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":13},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"push"},"computed":false},"arguments":[{"loc":{"start":{"line":49,"column":11},"end":{"line":49,"column":12},"source":null},"type":"Identifier","name":"b"}]}},{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":13},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"push"},"computed":false},"arguments":[{"loc":{"start":{"line":50,"column":11},"end":{"line":50,"column":12},"source":null},"type":"Identifier","name":"c"}]}},{"loc":{"start":{"line":52,"column":0},"end":{"line":52,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":52,"column":0},"end":{"line":52,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":52,"column":0},"end":{"line":52,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":52,"column":0},"end":{"line":52,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":52,"column":0},"end":{"line":52,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":52,"column":6},"end":{"line":52,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":53,"column":0},"end":{"line":53,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":53,"column":0},"end":{"line":53,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":53,"column":0},"end":{"line":53,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":53,"column":0},"end":{"line":53,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":53,"column":0},"end":{"line":53,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":53,"column":6},"end":{"line":53,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":54,"column":0},"end":{"line":54,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":54,"column":0},"end":{"line":54,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":54,"column":0},"end":{"line":54,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":54,"column":0},"end":{"line":54,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":54,"column":0},"end":{"line":54,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":54,"column":6},"end":{"line":54,"column":7},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":56,"column":0},"end":{"line":56,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":56,"column":0},"end":{"line":56,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":56,"column":0},"end":{"line":56,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":0},"end":{"line":56,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":0},"end":{"line":56,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":56,"column":6},"end":{"line":56,"column":22},"source":null},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":56,"column":6},"end":{"line":56,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":6},"end":{"line":56,"column":11},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false},"right":{"loc":{"start":{"line":56,"column":21},"end":{"line":56,"column":22},"source":null},"type":"Literal","value":1}},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":58,"column":0},"end":{"line":58,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":58,"column":0},"end":{"line":58,"column":11},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":58,"column":0},"end":{"line":58,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":58,"column":0},"end":{"line":58,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"pop"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":60,"column":6},"end":{"line":60,"column":22},"source":null},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":60,"column":6},"end":{"line":60,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":60,"column":6},"end":{"line":60,"column":11},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false},"right":{"loc":{"start":{"line":60,"column":21},"end":{"line":60,"column":22},"source":null},"type":"Literal","value":1}},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":62,"column":0},"end":{"line":62,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":62,"column":0},"end":{"line":62,"column":11},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":62,"column":0},"end":{"line":62,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":62,"column":0},"end":{"line":62,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"pop"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":64,"column":0},"end":{"line":64,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":64,"column":0},"end":{"line":64,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":64,"column":0},"end":{"line":64,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":64,"column":0},"end":{"line":64,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":64,"column":0},"end":{"line":64,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":64,"column":6},"end":{"line":64,"column":22},"source":null},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":64,"column":6},"end":{"line":64,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":64,"column":6},"end":{"line":64,"column":11},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false},"right":{"loc":{"start":{"line":64,"column":21},"end":{"line":64,"column":22},"source":null},"type":"Literal","value":1}},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":66,"column":0},"end":{"line":66,"column":19},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":66,"column":0},"end":{"line":66,"column":19},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":66,"column":0},"end":{"line":66,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":66,"column":0},"end":{"line":66,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"push"},"computed":false},"arguments":[{"loc":{"start":{"line":66,"column":11},"end":{"line":66,"column":12},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":66,"column":14},"end":{"line":66,"column":15},"source":null},"type":"Identifier","name":"b"},{"loc":{"start":{"line":66,"column":17},"end":{"line":66,"column":18},"source":null},"type":"Identifier","name":"c"}]}},{"loc":{"start":{"line":68,"column":0},"end":{"line":68,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":68,"column":0},"end":{"line":68,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":68,"column":0},"end":{"line":68,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":68,"column":0},"end":{"line":68,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":68,"column":0},"end":{"line":68,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":68,"column":6},"end":{"line":68,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":69,"column":0},"end":{"line":69,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":69,"column":0},"end":{"line":69,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":69,"column":0},"end":{"line":69,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":69,"column":0},"end":{"line":69,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":69,"column":0},"end":{"line":69,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":69,"column":6},"end":{"line":69,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":70,"column":0},"end":{"line":70,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":70,"column":0},"end":{"line":70,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":70,"column":0},"end":{"line":70,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":70,"column":0},"end":{"line":70,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":70,"column":0},"end":{"line":70,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":70,"column":6},"end":{"line":70,"column":7},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":72,"column":0},"end":{"line":72,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":72,"column":0},"end":{"line":72,"column":15},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":72,"column":0},"end":{"line":72,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":72,"column":0},"end":{"line":72,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"reverse"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":74,"column":0},"end":{"line":74,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":74,"column":0},"end":{"line":74,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":74,"column":0},"end":{"line":74,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":74,"column":0},"end":{"line":74,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":74,"column":0},"end":{"line":74,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":74,"column":6},"end":{"line":74,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":75,"column":0},"end":{"line":75,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":75,"column":0},"end":{"line":75,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":75,"column":0},"end":{"line":75,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":75,"column":0},"end":{"line":75,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":75,"column":0},"end":{"line":75,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":75,"column":6},"end":{"line":75,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":76,"column":0},"end":{"line":76,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":76,"column":0},"end":{"line":76,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":76,"column":0},"end":{"line":76,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":76,"column":0},"end":{"line":76,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":76,"column":0},"end":{"line":76,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":76,"column":6},"end":{"line":76,"column":7},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":78,"column":0},"end":{"line":78,"column":25},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":78,"column":4},"end":{"line":78,"column":25},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":78,"column":4},"end":{"line":78,"column":25},"source":null},"type":"Identifier","name":"first"},"init":{"loc":{"start":{"line":78,"column":12},"end":{"line":78,"column":25},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":78,"column":12},"end":{"line":78,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":78,"column":12},"end":{"line":78,"column":17},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"shift"},"computed":false},"arguments":[]}}]},{"loc":{"start":{"line":79,"column":0},"end":{"line":79,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":79,"column":0},"end":{"line":79,"column":9},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":79,"column":0},"end":{"line":79,"column":7},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":79,"column":0},"end":{"line":79,"column":5},"source":null},"type":"Identifier","name":"first"},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":81,"column":0},"end":{"line":81,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":81,"column":0},"end":{"line":81,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":81,"column":0},"end":{"line":81,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":81,"column":0},"end":{"line":81,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":81,"column":0},"end":{"line":81,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":81,"column":6},"end":{"line":81,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":82,"column":0},"end":{"line":82,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":82,"column":0},"end":{"line":82,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":82,"column":0},"end":{"line":82,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":82,"column":0},"end":{"line":82,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":82,"column":0},"end":{"line":82,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":82,"column":6},"end":{"line":82,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":84,"column":0},"end":{"line":84,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":84,"column":0},"end":{"line":84,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":84,"column":0},"end":{"line":84,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":84,"column":0},"end":{"line":84,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"unshift"},"computed":false},"arguments":[{"loc":{"start":{"line":84,"column":14},"end":{"line":84,"column":19},"source":null},"type":"Identifier","name":"first"},{"loc":{"start":{"line":84,"column":21},"end":{"line":84,"column":26},"source":null},"type":"Identifier","name":"first"}]}},{"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":86,"column":6},"end":{"line":86,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":87,"column":0},"end":{"line":87,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":87,"column":0},"end":{"line":87,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":87,"column":0},"end":{"line":87,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":87,"column":0},"end":{"line":87,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":87,"column":0},"end":{"line":87,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":87,"column":6},"end":{"line":87,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":88,"column":0},"end":{"line":88,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":88,"column":0},"end":{"line":88,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":88,"column":0},"end":{"line":88,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":88,"column":0},"end":{"line":88,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":88,"column":0},"end":{"line":88,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":88,"column":6},"end":{"line":88,"column":7},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":89,"column":0},"end":{"line":89,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":89,"column":0},"end":{"line":89,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":89,"column":0},"end":{"line":89,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":89,"column":0},"end":{"line":89,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":89,"column":0},"end":{"line":89,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":89,"column":6},"end":{"line":89,"column":7},"source":null},"type":"Literal","value":3},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":91,"column":0},"end":{"line":91,"column":25},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":91,"column":0},"end":{"line":91,"column":25},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":91,"column":0},"end":{"line":91,"column":12},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":91,"column":0},"end":{"line":91,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"splice"},"computed":false},"arguments":[{"loc":{"start":{"line":91,"column":13},"end":{"line":91,"column":14},"source":null},"type":"Literal","value":2},{"loc":{"start":{"line":91,"column":16},"end":{"line":91,"column":17},"source":null},"type":"Literal","value":0},{"loc":{"start":{"line":91,"column":19},"end":{"line":91,"column":24},"source":null},"type":"Identifier","name":"first"}]}},{"loc":{"start":{"line":93,"column":0},"end":{"line":93,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":93,"column":0},"end":{"line":93,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":93,"column":0},"end":{"line":93,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":93,"column":0},"end":{"line":93,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":93,"column":0},"end":{"line":93,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":93,"column":6},"end":{"line":93,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":94,"column":0},"end":{"line":94,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":94,"column":0},"end":{"line":94,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":94,"column":0},"end":{"line":94,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":94,"column":0},"end":{"line":94,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":94,"column":0},"end":{"line":94,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":94,"column":6},"end":{"line":94,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":95,"column":0},"end":{"line":95,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":95,"column":0},"end":{"line":95,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":95,"column":0},"end":{"line":95,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":95,"column":0},"end":{"line":95,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":95,"column":0},"end":{"line":95,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":95,"column":6},"end":{"line":95,"column":7},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":96,"column":0},"end":{"line":96,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":96,"column":0},"end":{"line":96,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":96,"column":0},"end":{"line":96,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":96,"column":0},"end":{"line":96,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":96,"column":0},"end":{"line":96,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":96,"column":6},"end":{"line":96,"column":7},"source":null},"type":"Literal","value":3},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":97,"column":0},"end":{"line":97,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":97,"column":0},"end":{"line":97,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":97,"column":0},"end":{"line":97,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":97,"column":0},"end":{"line":97,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":97,"column":0},"end":{"line":97,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":97,"column":6},"end":{"line":97,"column":7},"source":null},"type":"Literal","value":4},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":99,"column":0},"end":{"line":99,"column":32},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":99,"column":4},"end":{"line":99,"column":32},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":99,"column":4},"end":{"line":99,"column":32},"source":null},"type":"Identifier","name":"removed"},"init":{"loc":{"start":{"line":99,"column":14},"end":{"line":99,"column":32},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":99,"column":14},"end":{"line":99,"column":26},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":99,"column":14},"end":{"line":99,"column":19},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"splice"},"computed":false},"arguments":[{"loc":{"start":{"line":99,"column":27},"end":{"line":99,"column":28},"source":null},"type":"Literal","value":3},{"loc":{"start":{"line":99,"column":30},"end":{"line":99,"column":31},"source":null},"type":"Literal","value":1}]}}]},{"loc":{"start":{"line":101,"column":0},"end":{"line":101,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":101,"column":0},"end":{"line":101,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":101,"column":0},"end":{"line":101,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":101,"column":0},"end":{"line":101,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":101,"column":0},"end":{"line":101,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":101,"column":6},"end":{"line":101,"column":7},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":102,"column":0},"end":{"line":102,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":102,"column":0},"end":{"line":102,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":102,"column":0},"end":{"line":102,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":102,"column":0},"end":{"line":102,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":102,"column":0},"end":{"line":102,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":102,"column":6},"end":{"line":102,"column":7},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":103,"column":0},"end":{"line":103,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":103,"column":0},"end":{"line":103,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":103,"column":0},"end":{"line":103,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":103,"column":0},"end":{"line":103,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":103,"column":0},"end":{"line":103,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":103,"column":6},"end":{"line":103,"column":7},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":104,"column":0},"end":{"line":104,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":104,"column":0},"end":{"line":104,"column":12},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":104,"column":0},"end":{"line":104,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":104,"column":0},"end":{"line":104,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":104,"column":0},"end":{"line":104,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":104,"column":6},"end":{"line":104,"column":7},"source":null},"type":"Literal","value":3},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":106,"column":0},"end":{"line":106,"column":14},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":106,"column":0},"end":{"line":106,"column":14},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":106,"column":0},"end":{"line":106,"column":12},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":106,"column":0},"end":{"line":106,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":106,"column":0},"end":{"line":106,"column":7},"source":null},"type":"Identifier","name":"removed"},"property":{"loc":{"start":{"line":106,"column":8},"end":{"line":106,"column":9},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"x"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":107,"column":0},"end":{"line":107,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":86,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":11,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"a0"},"init":{"loc":{"start":{"line":11,"column":8},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":12,"column":8},"end":{"line":12,"column":9},"source":null},"type":"Literal","value":0},"kind":"init"},{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":13,"column":6},"end":{"line":13,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":13,"column":17},"end":{"line":13,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":13,"column":19},"end":{"line":13,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":13,"column":26},"end":{"line":13,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":26},"end":{"line":13,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":19,"column":1},"source":null},"type":"Identifier","name":"a1"},"init":{"loc":{"start":{"line":16,"column":9},"end":{"line":19,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":9},"source":null},"type":"Literal","value":1},"kind":"init"},{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":18,"column":6},"end":{"line":18,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":18,"column":17},"end":{"line":18,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":18,"column":19},"end":{"line":18,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":18,"column":26},"end":{"line":18,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":18,"column":26},"end":{"line":18,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":21,"column":0},"end":{"line":24,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":21,"column":4},"end":{"line":24,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":21,"column":4},"end":{"line":24,"column":1},"source":null},"type":"Identifier","name":"a2"},"init":{"loc":{"start":{"line":21,"column":9},"end":{"line":24,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":22,"column":8},"end":{"line":22,"column":9},"source":null},"type":"Literal","value":2},"kind":"init"},{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":23,"column":6},"end":{"line":23,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":23,"column":17},"end":{"line":23,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":23,"column":19},"end":{"line":23,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":23,"column":26},"end":{"line":23,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":23,"column":26},"end":{"line":23,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":26,"column":0},"end":{"line":29,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":26,"column":4},"end":{"line":29,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":26,"column":4},"end":{"line":29,"column":1},"source":null},"type":"Identifier","name":"a3"},"init":{"loc":{"start":{"line":26,"column":9},"end":{"line":29,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":27,"column":8},"end":{"line":27,"column":9},"source":null},"type":"Literal","value":3},"kind":"init"},{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":28,"column":6},"end":{"line":28,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":28,"column":17},"end":{"line":28,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":28,"column":19},"end":{"line":28,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":28,"column":26},"end":{"line":28,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":28,"column":26},"end":{"line":28,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":31,"column":0},"end":{"line":34,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":31,"column":4},"end":{"line":34,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":31,"column":4},"end":{"line":34,"column":1},"source":null},"type":"Identifier","name":"a4"},"init":{"loc":{"start":{"line":31,"column":9},"end":{"line":34,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":32,"column":1},"end":{"line":32,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":32,"column":1},"end":{"line":32,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":32,"column":8},"end":{"line":32,"column":9},"source":null},"type":"Literal","value":4},"kind":"init"},{"loc":{"start":{"line":33,"column":1},"end":{"line":33,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":33,"column":1},"end":{"line":33,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":33,"column":6},"end":{"line":33,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":33,"column":17},"end":{"line":33,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":33,"column":19},"end":{"line":33,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":33,"column":26},"end":{"line":33,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":33,"column":26},"end":{"line":33,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":36,"column":4},"end":{"line":39,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":36,"column":4},"end":{"line":39,"column":1},"source":null},"type":"Identifier","name":"a5"},"init":{"loc":{"start":{"line":36,"column":9},"end":{"line":39,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":37,"column":1},"end":{"line":37,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":37,"column":1},"end":{"line":37,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":37,"column":8},"end":{"line":37,"column":9},"source":null},"type":"Literal","value":5},"kind":"init"},{"loc":{"start":{"line":38,"column":1},"end":{"line":38,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":38,"column":1},"end":{"line":38,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":38,"column":6},"end":{"line":38,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":38,"column":17},"end":{"line":38,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":38,"column":19},"end":{"line":38,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":38,"column":26},"end":{"line":38,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":38,"column":26},"end":{"line":38,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":41,"column":0},"end":{"line":44,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":41,"column":4},"end":{"line":44,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":41,"column":4},"end":{"line":44,"column":1},"source":null},"type":"Identifier","name":"a6"},"init":{"loc":{"start":{"line":41,"column":9},"end":{"line":44,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":42,"column":1},"end":{"line":42,"column":9},"source":null},"type":"Property","key":{"loc":{"start":{"line":42,"column":1},"end":{"line":42,"column":6},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":42,"column":8},"end":{"line":42,"column":9},"source":null},"type":"Literal","value":6},"kind":"init"},{"loc":{"start":{"line":43,"column":1},"end":{"line":43,"column":39},"source":null},"type":"Property","key":{"loc":{"start":{"line":43,"column":1},"end":{"line":43,"column":4},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":43,"column":6},"end":{"line":43,"column":39},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":43,"column":17},"end":{"line":43,"column":37},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":43,"column":19},"end":{"line":43,"column":36},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":43,"column":26},"end":{"line":43,"column":36},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":43,"column":26},"end":{"line":43,"column":30},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":46,"column":0},"end":{"line":46,"column":32},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":46,"column":4},"end":{"line":46,"column":32},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":46,"column":4},"end":{"line":46,"column":32},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":46,"column":12},"end":{"line":46,"column":32},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":46,"column":13},"end":{"line":46,"column":15},"source":null},"type":"Identifier","name":"a0"},{"loc":{"start":{"line":46,"column":17},"end":{"line":46,"column":19},"source":null},"type":"Identifier","name":"a1"},{"loc":{"start":{"line":46,"column":21},"end":{"line":46,"column":23},"source":null},"type":"Identifier","name":"a2"},{"loc":{"start":{"line":46,"column":25},"end":{"line":46,"column":27},"source":null},"type":"Identifier","name":"a3"},{"loc":{"start":{"line":46,"column":29},"end":{"line":46,"column":31},"source":null},"type":"Identifier","name":"a4"}]}}]},{"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":48,"column":4},"end":{"line":51,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":48,"column":4},"end":{"line":51,"column":2},"source":null},"type":"Identifier","name":"evenArray"},"init":{"loc":{"start":{"line":48,"column":16},"end":{"line":51,"column":2},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":48,"column":16},"end":{"line":48,"column":28},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":48,"column":16},"end":{"line":48,"column":21},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"filter"},"computed":false},"arguments":[{"loc":{"start":{"line":48,"column":29},"end":{"line":51,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":48,"column":38},"end":{"line":48,"column":39},"source":null},"type":"Identifier","name":"a"}],"body":{"loc":{"start":{"line":49,"column":0},"end":{"line":50,"column":25},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":50,"column":1},"end":{"line":50,"column":24},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":50,"column":8},"end":{"line":50,"column":24},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":50,"column":8},"end":{"line":50,"column":19},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":50,"column":8},"end":{"line":50,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":50,"column":8},"end":{"line":50,"column":9},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false},"right":{"loc":{"start":{"line":50,"column":18},"end":{"line":50,"column":19},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":50,"column":23},"end":{"line":50,"column":24},"source":null},"type":"Literal","value":0}}}]},"generator":false,"expression":false}]}}]},{"loc":{"start":{"line":53,"column":0},"end":{"line":57,"column":20},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":53,"column":4},"end":{"line":53,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":53,"column":8},"end":{"line":53,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":53,"column":8},"end":{"line":53,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":53,"column":12},"end":{"line":53,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":54,"column":1},"end":{"line":54,"column":21},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":54,"column":1},"end":{"line":54,"column":2},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":54,"column":5},"end":{"line":54,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":54,"column":5},"end":{"line":54,"column":14},"source":null},"type":"Identifier","name":"evenArray"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false}},"update":{"loc":{"start":{"line":55,"column":1},"end":{"line":55,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":55,"column":1},"end":{"line":55,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":56,"column":0},"end":{"line":57,"column":20},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":57,"column":1},"end":{"line":57,"column":19},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":57,"column":1},"end":{"line":57,"column":19},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":57,"column":1},"end":{"line":57,"column":17},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":57,"column":1},"end":{"line":57,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":57,"column":1},"end":{"line":57,"column":10},"source":null},"type":"Identifier","name":"evenArray"},"property":{"loc":{"start":{"line":57,"column":11},"end":{"line":57,"column":12},"source":null},"type":"Identifier","name":"i"},"computed":true},"property":{"loc":null,"type":"Identifier","name":"fun"},"computed":false},"arguments":[]}}]}},{"loc":{"start":{"line":60,"column":0},"end":{"line":63,"column":2},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":60,"column":0},"end":{"line":63,"column":2},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":60,"column":0},"end":{"line":60,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"forEach"},"computed":false},"arguments":[{"loc":{"start":{"line":60,"column":14},"end":{"line":63,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":60,"column":23},"end":{"line":60,"column":30},"source":null},"type":"Identifier","name":"element"},{"loc":{"start":{"line":60,"column":32},"end":{"line":60,"column":37},"source":null},"type":"Identifier","name":"index"},{"loc":{"start":{"line":60,"column":39},"end":{"line":60,"column":44},"source":null},"type":"Identifier","name":"array"}],"body":{"loc":{"start":{"line":61,"column":0},"end":{"line":62,"column":17},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":62,"column":1},"end":{"line":62,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":62,"column":1},"end":{"line":62,"column":16},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":62,"column":1},"end":{"line":62,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":62,"column":1},"end":{"line":62,"column":8},"source":null},"type":"Identifier","name":"element"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false},"prefix":false}}]},"generator":false,"expression":false}]}},{"loc":{"start":{"line":65,"column":0},"end":{"line":65,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":65,"column":0},"end":{"line":65,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":65,"column":0},"end":{"line":65,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":65,"column":0},"end":{"line":65,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":65,"column":0},"end":{"line":65,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":65,"column":6},"end":{"line":65,"column":20},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":65,"column":6},"end":{"line":65,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":65,"column":6},"end":{"line":65,"column":11},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":65,"column":12},"end":{"line":65,"column":13},"source":null},"type":"Literal","value":2},"computed":true},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false},"computed":true},"property":{"loc":null,"type":"Identifier","name":"fun"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":67,"column":0},"end":{"line":70,"column":2},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":67,"column":0},"end":{"line":70,"column":2},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":67,"column":0},"end":{"line":67,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":67,"column":0},"end":{"line":67,"column":5},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"forEach"},"computed":false},"arguments":[{"loc":{"start":{"line":67,"column":14},"end":{"line":70,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":67,"column":23},"end":{"line":67,"column":30},"source":null},"type":"Identifier","name":"element"},{"loc":{"start":{"line":67,"column":32},"end":{"line":67,"column":37},"source":null},"type":"Identifier","name":"index"},{"loc":{"start":{"line":67,"column":39},"end":{"line":67,"column":44},"source":null},"type":"Identifier","name":"array"}],"body":{"loc":{"start":{"line":68,"column":0},"end":{"line":69,"column":17},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":69,"column":1},"end":{"line":69,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":69,"column":1},"end":{"line":69,"column":16},"source":null},"type":"UpdateExpression","operator":"--","argument":{"loc":{"start":{"line":69,"column":1},"end":{"line":69,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":69,"column":1},"end":{"line":69,"column":8},"source":null},"type":"Identifier","name":"element"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false},"prefix":false}}]},"generator":false,"expression":false}]}},{"loc":{"start":{"line":72,"column":0},"end":{"line":75,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":72,"column":4},"end":{"line":75,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":72,"column":4},"end":{"line":75,"column":2},"source":null},"type":"Identifier","name":"mappedArray"},"init":{"loc":{"start":{"line":72,"column":18},"end":{"line":75,"column":2},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":72,"column":18},"end":{"line":72,"column":27},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":72,"column":18},"end":{"line":72,"column":23},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"map"},"computed":false},"arguments":[{"loc":{"start":{"line":72,"column":28},"end":{"line":75,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":72,"column":37},"end":{"line":72,"column":44},"source":null},"type":"Identifier","name":"element"}],"body":{"loc":{"start":{"line":73,"column":0},"end":{"line":74,"column":22},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":74,"column":1},"end":{"line":74,"column":21},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":74,"column":8},"end":{"line":74,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":74,"column":8},"end":{"line":74,"column":15},"source":null},"type":"Identifier","name":"element"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}}]},"generator":false,"expression":false}]}}]},{"loc":{"start":{"line":77,"column":0},"end":{"line":84,"column":2},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":77,"column":4},"end":{"line":77,"column":9},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":77,"column":8},"end":{"line":77,"column":9},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":77,"column":8},"end":{"line":77,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":77,"column":12},"end":{"line":77,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":78,"column":1},"end":{"line":78,"column":23},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":78,"column":1},"end":{"line":78,"column":2},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":78,"column":5},"end":{"line":78,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":78,"column":5},"end":{"line":78,"column":16},"source":null},"type":"Identifier","name":"mappedArray"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false}},"update":{"loc":{"start":{"line":79,"column":1},"end":{"line":79,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":79,"column":1},"end":{"line":79,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":80,"column":0},"end":{"line":84,"column":2},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":81,"column":1},"end":{"line":83,"column":30},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":81,"column":4},"end":{"line":81,"column":26},"source":null},"type":"BinaryExpression","operator":"!=","left":{"loc":{"start":{"line":81,"column":4},"end":{"line":81,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":81,"column":4},"end":{"line":81,"column":15},"source":null},"type":"Identifier","name":"mappedArray"},"property":{"loc":{"start":{"line":81,"column":16},"end":{"line":81,"column":17},"source":null},"type":"Identifier","name":"i"},"computed":true},"right":{"loc":{"start":{"line":81,"column":22},"end":{"line":81,"column":26},"source":null},"type":"Literal","value":null}},"consequent":{"loc":{"start":{"line":82,"column":1},"end":{"line":83,"column":30},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":83,"column":2},"end":{"line":83,"column":29},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":83,"column":2},"end":{"line":83,"column":29},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":83,"column":2},"end":{"line":83,"column":27},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":83,"column":2},"end":{"line":83,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":83,"column":2},"end":{"line":83,"column":7},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":83,"column":8},"end":{"line":83,"column":22},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":83,"column":8},"end":{"line":83,"column":19},"source":null},"type":"Identifier","name":"mappedArray"},"property":{"loc":{"start":{"line":83,"column":20},"end":{"line":83,"column":21},"source":null},"type":"Identifier","name":"i"},"computed":true},"computed":true},"property":{"loc":null,"type":"Identifier","name":"fun"},"computed":false},"arguments":[]}}]},"alternate":null}]}},{"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 49  ************/
/**/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":0},"source":null},"type":"Program","body":[]});
/*********** Test: 50  ************/
/**/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":0},"source":null},"type":"Program","body":[]});
/*********** Test: 51  ************/
/**/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":0},"source":null},"type":"Program","body":[]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":38,"column":6},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":10,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":10,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":10,"column":1},"source":null},"type":"Identifier","name":"a0"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":10,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":11},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":7},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":11},"source":null},"type":"Literal","value":0},"kind":"init"},{"loc":{"start":{"line":4,"column":2},"end":{"line":9,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":5},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":4,"column":8},"end":{"line":9,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":5,"column":2},"end":{"line":8,"column":6},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":21},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":15},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":5},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":1},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":5},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":11,"column":0},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":4},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":4},"end":{"line":19,"column":1},"source":null},"type":"Identifier","name":"a1"},"init":{"loc":{"start":{"line":11,"column":9},"end":{"line":19,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":11},"source":null},"type":"Property","key":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":7},"source":null},"type":"Identifier","name":"value"},"value":{"loc":{"start":{"line":12,"column":10},"end":{"line":12,"column":11},"source":null},"type":"Literal","value":1},"kind":"init"},{"loc":{"start":{"line":13,"column":2},"end":{"line":18,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":5},"source":null},"type":"Identifier","name":"fun"},"value":{"loc":{"start":{"line":13,"column":8},"end":{"line":18,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":14,"column":2},"end":{"line":17,"column":6},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":15,"column":4},"end":{"line":15,"column":21},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":15,"column":11},"end":{"line":15,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":15,"column":11},"end":{"line":15,"column":15},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}},{"loc":{"start":{"line":17,"column":0},"end":{"line":17,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":17,"column":0},"end":{"line":17,"column":5},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":17,"column":0},"end":{"line":17,"column":1},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":17,"column":4},"end":{"line":17,"column":5},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":19},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":19},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":19},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":20,"column":12},"end":{"line":20,"column":19},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":20,"column":13},"end":{"line":20,"column":15},"source":null},"type":"Identifier","name":"a0"},{"loc":{"start":{"line":20,"column":16},"end":{"line":20,"column":18},"source":null},"type":"Identifier","name":"a1"}]}}]},{"loc":{"start":{"line":21,"column":0},"end":{"line":26,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":21,"column":4},"end":{"line":26,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":21,"column":4},"end":{"line":26,"column":2},"source":null},"type":"Identifier","name":"mappedArray"},"init":{"loc":{"start":{"line":21,"column":18},"end":{"line":26,"column":2},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":21,"column":18},"end":{"line":21,"column":27},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":21,"column":18},"end":{"line":21,"column":23},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"map"},"computed":false},"arguments":[{"loc":{"start":{"line":21,"column":28},"end":{"line":26,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":21,"column":38},"end":{"line":21,"column":45},"source":null},"type":"Identifier","name":"element"},{"loc":{"start":{"line":21,"column":46},"end":{"line":21,"column":51},"source":null},"type":"Identifier","name":"index"},{"loc":{"start":{"line":21,"column":52},"end":{"line":21,"column":57},"source":null},"type":"Identifier","name":"array"}],"body":{"loc":{"start":{"line":22,"column":0},"end":{"line":25,"column":6},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":22},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":23,"column":9},"end":{"line":23,"column":22},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":23,"column":9},"end":{"line":23,"column":16},"source":null},"type":"Identifier","name":"element"},"property":{"loc":null,"type":"Identifier","name":"value"},"computed":false}},{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":5},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":1},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":25,"column":4},"end":{"line":25,"column":5},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false}]}}]},{"loc":{"start":{"line":27,"column":0},"end":{"line":34,"column":3},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":27,"column":4},"end":{"line":27,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":27,"column":8},"end":{"line":27,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":27,"column":8},"end":{"line":27,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":27,"column":12},"end":{"line":27,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":28,"column":0},"end":{"line":28,"column":22},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":28,"column":0},"end":{"line":28,"column":1},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":28,"column":4},"end":{"line":28,"column":22},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":28,"column":4},"end":{"line":28,"column":15},"source":null},"type":"Identifier","name":"mappedArray"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false}},"update":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":3},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":29,"column":0},"end":{"line":29,"column":1},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":30,"column":0},"end":{"line":34,"column":3},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":31,"column":2},"end":{"line":33,"column":32},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":31,"column":5},"end":{"line":31,"column":34},"source":null},"type":"BinaryExpression","operator":"!=","left":{"loc":{"start":{"line":31,"column":5},"end":{"line":31,"column":26},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":31,"column":5},"end":{"line":31,"column":10},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":31,"column":11},"end":{"line":31,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":31,"column":11},"end":{"line":31,"column":22},"source":null},"type":"Identifier","name":"mappedArray"},"property":{"loc":{"start":{"line":31,"column":23},"end":{"line":31,"column":24},"source":null},"type":"Identifier","name":"i"},"computed":true},"computed":true},"right":{"loc":{"start":{"line":31,"column":30},"end":{"line":31,"column":34},"source":null},"type":"Literal","value":null}},"consequent":{"loc":{"start":{"line":32,"column":2},"end":{"line":33,"column":32},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":31},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":31},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":29},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":33,"column":4},"end":{"line":33,"column":9},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":33,"column":10},"end":{"line":33,"column":24},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":33,"column":10},"end":{"line":33,"column":21},"source":null},"type":"Identifier","name":"mappedArray"},"property":{"loc":{"start":{"line":33,"column":22},"end":{"line":33,"column":23},"source":null},"type":"Identifier","name":"i"},"computed":true},"computed":true},"property":{"loc":null,"type":"Identifier","name":"fun"},"computed":false},"arguments":[]}}]},"alternate":null}]}},{"loc":{"start":{"line":35,"column":1},"end":{"line":35,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":35,"column":1},"end":{"line":35,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":35,"column":1},"end":{"line":35,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false}},{"loc":{"start":{"line":36,"column":0},"end":{"line":36,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":38,"column":0},"end":{"line":38,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":38,"column":0},"end":{"line":38,"column":5},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":38,"column":0},"end":{"line":38,"column":1},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":38,"column":4},"end":{"line":38,"column":5},"source":null},"type":"Literal","value":1}}}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":6,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":5,"column":21},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":20},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":20},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":10},"source":null},"type":"Identifier","name":"arguments"},"property":{"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":12},"source":null},"type":"Literal","value":0},"computed":true},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":20},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":20},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":10},"source":null},"type":"Identifier","name":"arguments"},"property":{"loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":12},"source":null},"type":"Literal","value":1},"computed":true},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}}]},"generator":false,"expression":false},{"loc":{"start":{"line":8,"column":0},"end":{"line":13,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":4},"end":{"line":13,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":4},"end":{"line":13,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":8,"column":8},"end":{"line":13,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":9,"column":1},"end":{"line":12,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":9,"column":7},"end":{"line":12,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":10,"column":1},"end":{"line":11,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":11,"column":9},"end":{"line":11,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":15,"column":0},"end":{"line":20,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":15,"column":4},"end":{"line":20,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":15,"column":4},"end":{"line":20,"column":1},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":15,"column":8},"end":{"line":20,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":16,"column":1},"end":{"line":19,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":16,"column":1},"end":{"line":16,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":16,"column":6},"end":{"line":19,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":17,"column":1},"end":{"line":18,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":18,"column":9},"end":{"line":18,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":9},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":4},"source":null},"type":"Identifier","name":"test"},"arguments":[{"loc":{"start":{"line":22,"column":5},"end":{"line":22,"column":6},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":22,"column":7},"end":{"line":22,"column":8},"source":null},"type":"Identifier","name":"b"}]}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":6},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":9,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":9,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":9,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":9,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":14},"source":null},"type":"Property","key":{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":5},"source":null},"type":"Identifier","name":"sort"},"value":{"loc":{"start":{"line":7,"column":7},"end":{"line":7,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":7,"column":7},"end":{"line":7,"column":9},"source":null},"type":"ArrayExpression","elements":[]},"property":{"loc":null,"type":"Identifier","name":"sort"},"computed":false},"kind":"init"},{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":18},"source":null},"type":"Property","key":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":7},"source":null},"type":"Identifier","name":"splice"},"value":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":11},"source":null},"type":"ArrayExpression","elements":[]},"property":{"loc":null,"type":"Identifier","name":"splice"},"computed":false},"kind":"init"}]}}]},{"loc":{"start":{"line":11,"column":0},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":4},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":4},"end":{"line":19,"column":1},"source":null},"type":"Identifier","name":"test"},"init":{"loc":{"start":{"line":11,"column":11},"end":{"line":19,"column":1},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":12,"column":0},"end":{"line":18,"column":7},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":12},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":13,"column":5},"end":{"line":13,"column":12},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":13,"column":5},"end":{"line":13,"column":12},"source":null},"type":"Identifier","name":"options"},"init":null}]},{"loc":{"start":{"line":14,"column":1},"end":{"line":15,"column":8},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":14,"column":5},"end":{"line":15,"column":8},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":14,"column":5},"end":{"line":15,"column":8},"source":null},"type":"Identifier","name":"target"},"init":{"loc":{"start":{"line":14,"column":14},"end":{"line":15,"column":8},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":14,"column":14},"end":{"line":14,"column":26},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":14,"column":14},"end":{"line":14,"column":23},"source":null},"type":"Identifier","name":"arguments"},"property":{"loc":{"start":{"line":14,"column":24},"end":{"line":14,"column":25},"source":null},"type":"Literal","value":0},"computed":true},"right":{"loc":{"start":{"line":15,"column":6},"end":{"line":15,"column":8},"source":null},"type":"ObjectExpression","properties":[]}}}]},{"loc":{"start":{"line":16,"column":1},"end":{"line":16,"column":21},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":16,"column":8},"end":{"line":16,"column":21},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":16,"column":8},"end":{"line":16,"column":19},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":16,"column":8},"end":{"line":16,"column":14},"source":null},"type":"Identifier","name":"target"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":6},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":6},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":18,"column":1},"end":{"line":18,"column":2},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":18,"column":5},"end":{"line":18,"column":6},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false}}]},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":4},"source":null},"type":"Identifier","name":"test"},"arguments":[{"loc":{"start":{"line":21,"column":5},"end":{"line":21,"column":6},"source":null},"type":"Identifier","name":"a"}]}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":5},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":23,"column":4},"end":{"line":23,"column":5},"source":null},"type":"Literal","value":1}}}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":19},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":19},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":19},"source":null},"type":"Identifier","name":"target"},"init":{"loc":{"start":{"line":2,"column":14},"end":{"line":2,"column":19},"source":null},"type":"Literal","value":false}}]},{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":10},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":5,"column":1},"end":{"line":7,"column":6},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":31},"source":null},"type":"BinaryExpression","operator":"===","left":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":17},"source":null},"type":"UnaryExpression","operator":"typeof","argument":{"loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":17},"source":null},"type":"Identifier","name":"target"},"prefix":true},"right":{"loc":{"start":{"line":5,"column":22},"end":{"line":5,"column":31},"source":null},"type":"Literal","value":"boolean"}},"consequent":{"loc":{"start":{"line":6,"column":1},"end":{"line":7,"column":6},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":3},"source":null},"type":"Identifier","name":"a"},"prefix":false}}]},"alternate":null},{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":4},"source":null},"type":"UpdateExpression","operator":"--","argument":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":28,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":15,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":15,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":15,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":15,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":7,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":6},"source":null},"type":"Identifier","name":"test1"},"value":{"loc":{"start":{"line":7,"column":8},"end":{"line":10,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":8,"column":1},"end":{"line":9,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":11,"column":1},"end":{"line":14,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":6},"source":null},"type":"Identifier","name":"test2"},"value":{"loc":{"start":{"line":11,"column":8},"end":{"line":14,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":12,"column":1},"end":{"line":13,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":10},"source":null},"type":"Literal","value":5}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":17,"column":0},"end":{"line":26,"column":5},"source":null},"type":"ForInStatement","left":{"loc":{"start":{"line":17,"column":4},"end":{"line":17,"column":16},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":16},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":16},"source":null},"type":"Identifier","name":"propName"},"init":null}]},"right":{"loc":{"start":{"line":17,"column":20},"end":{"line":17,"column":21},"source":null},"type":"Identifier","name":"a"},"body":{"loc":{"start":{"line":18,"column":0},"end":{"line":26,"column":5},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":23},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":23},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":23},"source":null},"type":"Identifier","name":"prop"},"init":{"loc":{"start":{"line":19,"column":12},"end":{"line":19,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":19,"column":12},"end":{"line":19,"column":13},"source":null},"type":"Identifier","name":"a"},"property":{"loc":{"start":{"line":19,"column":14},"end":{"line":19,"column":22},"source":null},"type":"Identifier","name":"propName"},"computed":true}}]},{"loc":{"start":{"line":21,"column":1},"end":{"line":23,"column":9},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":21,"column":4},"end":{"line":21,"column":29},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":21,"column":4},"end":{"line":21,"column":15},"source":null},"type":"UnaryExpression","operator":"typeof","argument":{"loc":{"start":{"line":21,"column":11},"end":{"line":21,"column":15},"source":null},"type":"Identifier","name":"prop"},"prefix":true},"right":{"loc":{"start":{"line":21,"column":19},"end":{"line":21,"column":29},"source":null},"type":"Literal","value":"function"}},"consequent":{"loc":{"start":{"line":22,"column":1},"end":{"line":23,"column":9},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":6},"source":null},"type":"Identifier","name":"prop"},"arguments":[]}}]},"alternate":null},{"loc":{"start":{"line":26,"column":1},"end":{"line":26,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":26,"column":1},"end":{"line":26,"column":4},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":26,"column":1},"end":{"line":26,"column":2},"source":null},"type":"Literal","value":1},"right":{"loc":{"start":{"line":26,"column":3},"end":{"line":26,"column":4},"source":null},"type":"Literal","value":1}}}]},"each":false},{"loc":{"start":{"line":28,"column":0},"end":{"line":28,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":51,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"Identifier","name":"obj1"},"init":{"loc":{"start":{"line":2,"column":11},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":9,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":9,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"obj2"},"init":{"loc":{"start":{"line":9,"column":11},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":10,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":10,"column":1},"end":{"line":10,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":10,"column":7},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":11,"column":1},"end":{"line":12,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":10},"source":null},"type":"Literal","value":5}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":27,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":27,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":27,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":16,"column":8},"end":{"line":27,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":17,"column":1},"end":{"line":22,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":17,"column":7},"end":{"line":22,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":17,"column":16},"end":{"line":17,"column":17},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":17,"column":19},"end":{"line":17,"column":20},"source":null},"type":"Identifier","name":"b"}],"body":{"loc":{"start":{"line":18,"column":1},"end":{"line":21,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":10},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":3},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":20,"column":2},"end":{"line":20,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":20,"column":2},"end":{"line":20,"column":10},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":20,"column":2},"end":{"line":20,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":20,"column":2},"end":{"line":20,"column":3},"source":null},"type":"Identifier","name":"b"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":21,"column":2},"end":{"line":21,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":21,"column":9},"end":{"line":21,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":23,"column":1},"end":{"line":26,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":16},"source":null},"type":"Identifier","name":"returnSomething"},"value":{"loc":{"start":{"line":23,"column":18},"end":{"line":26,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":24,"column":1},"end":{"line":25,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":25,"column":2},"end":{"line":25,"column":13},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":25,"column":9},"end":{"line":25,"column":13},"source":null},"type":"ThisExpression"}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":29,"column":9},"end":{"line":32,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"applyTest"},"params":[{"loc":{"start":{"line":29,"column":19},"end":{"line":29,"column":20},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":29,"column":22},"end":{"line":29,"column":23},"source":null},"type":"Identifier","name":"b"}],"body":{"loc":{"start":{"line":30,"column":0},"end":{"line":31,"column":16},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":15},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":5},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[{"loc":{"start":{"line":31,"column":11},"end":{"line":31,"column":12},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":31,"column":13},"end":{"line":31,"column":14},"source":null},"type":"Identifier","name":"b"}]}}]},"generator":false,"expression":false},{"loc":{"start":{"line":34,"column":9},"end":{"line":37,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"callTest"},"params":[{"loc":{"start":{"line":34,"column":18},"end":{"line":34,"column":19},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":34,"column":20},"end":{"line":34,"column":21},"source":null},"type":"Identifier","name":"b"}],"body":{"loc":{"start":{"line":35,"column":0},"end":{"line":36,"column":16},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":36,"column":1},"end":{"line":36,"column":15},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":36,"column":1},"end":{"line":36,"column":15},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":36,"column":1},"end":{"line":36,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":36,"column":1},"end":{"line":36,"column":5},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[{"loc":{"start":{"line":36,"column":11},"end":{"line":36,"column":12},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":36,"column":13},"end":{"line":36,"column":14},"source":null},"type":"Identifier","name":"b"}]}}]},"generator":false,"expression":false},{"loc":{"start":{"line":39,"column":9},"end":{"line":42,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"callTwo"},"params":[],"body":{"loc":{"start":{"line":40,"column":0},"end":{"line":41,"column":31},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":41,"column":1},"end":{"line":41,"column":30},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":41,"column":8},"end":{"line":41,"column":30},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":41,"column":8},"end":{"line":41,"column":28},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":41,"column":8},"end":{"line":41,"column":12},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"returnSomething"},"computed":false},"arguments":[]}}]},"generator":false,"expression":false},{"loc":{"start":{"line":44,"column":0},"end":{"line":44,"column":32},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":44,"column":0},"end":{"line":44,"column":32},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":44,"column":0},"end":{"line":44,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":44,"column":0},"end":{"line":44,"column":9},"source":null},"type":"Identifier","name":"applyTest"},"property":{"loc":null,"type":"Identifier","name":"apply"},"computed":false},"arguments":[{"loc":{"start":{"line":44,"column":16},"end":{"line":44,"column":17},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":44,"column":19},"end":{"line":44,"column":31},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":44,"column":20},"end":{"line":44,"column":24},"source":null},"type":"Identifier","name":"obj1"},{"loc":{"start":{"line":44,"column":26},"end":{"line":44,"column":30},"source":null},"type":"Identifier","name":"obj2"}]}]}},{"loc":{"start":{"line":45,"column":0},"end":{"line":45,"column":28},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":45,"column":0},"end":{"line":45,"column":28},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":45,"column":0},"end":{"line":45,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":45,"column":0},"end":{"line":45,"column":8},"source":null},"type":"Identifier","name":"callTest"},"property":{"loc":null,"type":"Identifier","name":"call"},"computed":false},"arguments":[{"loc":{"start":{"line":45,"column":14},"end":{"line":45,"column":15},"source":null},"type":"Identifier","name":"a"},{"loc":{"start":{"line":45,"column":17},"end":{"line":45,"column":21},"source":null},"type":"Identifier","name":"obj1"},{"loc":{"start":{"line":45,"column":23},"end":{"line":45,"column":27},"source":null},"type":"Identifier","name":"obj2"}]}},{"loc":{"start":{"line":47,"column":0},"end":{"line":47,"column":27},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":47,"column":4},"end":{"line":47,"column":27},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":47,"column":4},"end":{"line":47,"column":27},"source":null},"type":"Identifier","name":"alias"},"init":{"loc":{"start":{"line":47,"column":12},"end":{"line":47,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":47,"column":12},"end":{"line":47,"column":24},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":47,"column":12},"end":{"line":47,"column":19},"source":null},"type":"Identifier","name":"callTwo"},"property":{"loc":null,"type":"Identifier","name":"call"},"computed":false},"arguments":[{"loc":{"start":{"line":47,"column":25},"end":{"line":47,"column":26},"source":null},"type":"Identifier","name":"a"}]}}]},{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":23},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":23},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":49,"column":0},"end":{"line":49,"column":5},"source":null},"type":"Identifier","name":"alias"},"property":{"loc":null,"type":"Identifier","name":"returnSomething"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":51,"column":0},"end":{"line":51,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":36,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":3,"column":0},"end":{"line":13,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":4},"end":{"line":13,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":4},"end":{"line":13,"column":1},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":3,"column":12},"end":{"line":13,"column":1},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":4,"column":1},"end":{"line":6,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":3},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":5},"source":null},"type":"Literal","value":4},"kind":"init"}]},{"loc":{"start":{"line":7,"column":1},"end":{"line":9,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":5},"source":null},"type":"Property","key":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":3},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":5},"source":null},"type":"Literal","value":2},"kind":"init"}]},{"loc":{"start":{"line":10,"column":1},"end":{"line":12,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":6},"source":null},"type":"Property","key":{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":3},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":11,"column":5},"end":{"line":11,"column":6},"source":null},"type":"Literal","value":3},"kind":"init"}]}]}}]},{"loc":{"start":{"line":15,"column":9},"end":{"line":18,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"isEven"},"params":[],"body":{"loc":{"start":{"line":16,"column":0},"end":{"line":17,"column":24},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":23},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":23},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":18},"source":null},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":17,"column":8},"end":{"line":17,"column":12},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"a"},"computed":false},"right":{"loc":{"start":{"line":17,"column":17},"end":{"line":17,"column":18},"source":null},"type":"Literal","value":2}},"right":{"loc":{"start":{"line":17,"column":22},"end":{"line":17,"column":23},"source":null},"type":"Literal","value":0}}}]},"generator":false,"expression":false},{"loc":{"start":{"line":20,"column":0},"end":{"line":31,"column":3},"source":null},"type":"IfStatement","test":{"loc":{"start":{"line":20,"column":3},"end":{"line":20,"column":16},"source":null},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":20,"column":3},"end":{"line":20,"column":8},"source":null},"type":"Identifier","name":"array"},"right":{"loc":{"start":{"line":20,"column":12},"end":{"line":20,"column":16},"source":null},"type":"Literal","value":null}},"consequent":{"loc":{"start":{"line":21,"column":0},"end":{"line":23,"column":5},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":22,"column":1},"end":{"line":22,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":22,"column":5},"end":{"line":22,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":22,"column":5},"end":{"line":22,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":22,"column":9},"end":{"line":22,"column":10},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":4},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":2},"source":null},"type":"Identifier","name":"a"},"prefix":false}}]},"alternate":{"loc":{"start":{"line":26,"column":0},"end":{"line":31,"column":3},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":27,"column":1},"end":{"line":31,"column":2},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":27,"column":5},"end":{"line":27,"column":32},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":27,"column":9},"end":{"line":27,"column":25},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":27,"column":9},"end":{"line":27,"column":25},"source":null},"type":"Identifier","name":"value"},"init":{"loc":{"start":{"line":27,"column":17},"end":{"line":27,"column":25},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":27,"column":17},"end":{"line":27,"column":22},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":27,"column":23},"end":{"line":27,"column":24},"source":null},"type":"Literal","value":0},"computed":true}},{"loc":{"start":{"line":27,"column":27},"end":{"line":27,"column":32},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":27,"column":27},"end":{"line":27,"column":32},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":27,"column":31},"end":{"line":27,"column":32},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":28,"column":2},"end":{"line":29,"column":33},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":18},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":3},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":28,"column":6},"end":{"line":28,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":28,"column":6},"end":{"line":28,"column":11},"source":null},"type":"Identifier","name":"array"},"property":{"loc":null,"type":"Identifier","name":"length"},"computed":false}},"right":{"loc":{"start":{"line":29,"column":5},"end":{"line":29,"column":33},"source":null},"type":"BinaryExpression","operator":"!==","left":{"loc":{"start":{"line":29,"column":5},"end":{"line":29,"column":23},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":29,"column":5},"end":{"line":29,"column":16},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":29,"column":5},"end":{"line":29,"column":11},"source":null},"type":"Identifier","name":"isEven"},"property":{"loc":null,"type":"Identifier","name":"call"},"computed":false},"arguments":[{"loc":{"start":{"line":29,"column":17},"end":{"line":29,"column":22},"source":null},"type":"Identifier","name":"value"}]},"right":{"loc":{"start":{"line":29,"column":28},"end":{"line":29,"column":33},"source":null},"type":"Literal","value":false}}},"update":{"loc":{"start":{"line":30,"column":2},"end":{"line":30,"column":20},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":30,"column":2},"end":{"line":30,"column":7},"source":null},"type":"Identifier","name":"value"},"right":{"loc":{"start":{"line":30,"column":10},"end":{"line":30,"column":20},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":30,"column":10},"end":{"line":30,"column":15},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":30,"column":16},"end":{"line":30,"column":19},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":30,"column":18},"end":{"line":30,"column":19},"source":null},"type":"Identifier","name":"i"},"prefix":true},"computed":true}},"body":{"loc":{"start":{"line":31,"column":1},"end":{"line":31,"column":2},"source":null},"type":"BlockStatement","body":[]}}]}},{"loc":{"start":{"line":34,"column":0},"end":{"line":34,"column":5},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":34,"column":4},"end":{"line":34,"column":5},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":34,"column":4},"end":{"line":34,"column":9},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":34,"column":8},"end":{"line":34,"column":9},"source":null},"type":"Literal","value":3}}]},{"loc":{"start":{"line":35,"column":0},"end":{"line":35,"column":3},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":35,"column":0},"end":{"line":35,"column":3},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":35,"column":0},"end":{"line":35,"column":1},"source":null},"type":"Identifier","name":"a"},"prefix":false}},{"loc":{"start":{"line":36,"column":0},"end":{"line":36,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":19,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":14,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":14,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":13,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":13,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":12,"column":13},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":10,"column":3},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":5,"column":2},"end":{"line":10,"column":3},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":6},"source":null},"type":"ThisExpression"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"right":{"loc":{"start":{"line":5,"column":11},"end":{"line":10,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":6,"column":2},"end":{"line":9,"column":14},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":7,"column":3},"end":{"line":7,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":7,"column":10},"end":{"line":7,"column":11},"source":null},"type":"Literal","value":3}},{"loc":{"start":{"line":9,"column":3},"end":{"line":9,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":3},"end":{"line":9,"column":13},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":9,"column":3},"end":{"line":9,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":9,"column":3},"end":{"line":9,"column":7},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":9,"column":12},"end":{"line":9,"column":13},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false}}},{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":12},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":12},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":8},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":12,"column":2},"end":{"line":12,"column":6},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":12,"column":11},"end":{"line":12,"column":12},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":18},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":18},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":18},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":16,"column":12},"end":{"line":16,"column":18},"source":null},"type":"NewExpression","callee":{"loc":{"start":{"line":16,"column":12},"end":{"line":16,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":16,"column":12},"end":{"line":16,"column":13},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}}]},{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":5},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":5},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":3},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":1},"source":null},"type":"Identifier","name":"b"},"property":{"loc":null,"type":"Identifier","name":"b"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":19,"column":0},"end":{"line":19,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":24,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":131},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":131},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":131},"source":null},"type":"Identifier","name":"ua"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":131},"source":null},"type":"Literal","value":"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16"}}]},{"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":21},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":21},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"ua"},"right":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":21},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":19},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":7},"source":null},"type":"Identifier","name":"ua"},"property":{"loc":null,"type":"Identifier","name":"toLowerCase"},"computed":false},"arguments":[]}}},{"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":37},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":37},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":37},"source":null},"type":"Identifier","name":"rwebkit"},"init":{"loc":{"start":{"line":6,"column":14},"end":{"line":6,"column":37},"source":null},"type":"Literal","value":{}}}]},{"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":49},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":49},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":49},"source":null},"type":"Identifier","name":"ropera"},"init":{"loc":{"start":{"line":7,"column":13},"end":{"line":7,"column":49},"source":null},"type":"Literal","value":{}}}]},{"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":46},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":46},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":46},"source":null},"type":"Identifier","name":"rmozilla"},"init":{"loc":{"start":{"line":8,"column":15},"end":{"line":8,"column":46},"source":null},"type":"Literal","value":{}}}]},{"loc":{"start":{"line":10,"column":0},"end":{"line":14,"column":6},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":10,"column":4},"end":{"line":14,"column":6},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":10,"column":4},"end":{"line":14,"column":6},"source":null},"type":"Identifier","name":"match"},"init":{"loc":{"start":{"line":10,"column":12},"end":{"line":14,"column":6},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":10,"column":12},"end":{"line":13,"column":21},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":10,"column":12},"end":{"line":11,"column":19},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":28},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":24},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":19},"source":null},"type":"Identifier","name":"rwebkit"},"property":{"loc":null,"type":"Identifier","name":"exec"},"computed":false},"arguments":[{"loc":{"start":{"line":10,"column":25},"end":{"line":10,"column":27},"source":null},"type":"Identifier","name":"ua"}]},"right":{"loc":{"start":{"line":11,"column":4},"end":{"line":11,"column":19},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":11,"column":4},"end":{"line":11,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":11,"column":4},"end":{"line":11,"column":10},"source":null},"type":"Identifier","name":"ropera"},"property":{"loc":null,"type":"Identifier","name":"exec"},"computed":false},"arguments":[{"loc":{"start":{"line":11,"column":16},"end":{"line":11,"column":18},"source":null},"type":"Identifier","name":"ua"}]}},"right":{"loc":{"start":{"line":12,"column":4},"end":{"line":13,"column":21},"source":null},"type":"LogicalExpression","operator":"&&","left":{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":32},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":28},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":6},"source":null},"type":"Identifier","name":"ua"},"property":{"loc":null,"type":"Identifier","name":"indexOf"},"computed":false},"arguments":[{"loc":{"start":{"line":12,"column":15},"end":{"line":12,"column":27},"source":null},"type":"Literal","value":"compatible"}]},"right":{"loc":{"start":{"line":12,"column":31},"end":{"line":12,"column":32},"source":null},"type":"Literal","value":0}},"right":{"loc":{"start":{"line":13,"column":4},"end":{"line":13,"column":21},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":13,"column":4},"end":{"line":13,"column":17},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":4},"end":{"line":13,"column":12},"source":null},"type":"Identifier","name":"rmozilla"},"property":{"loc":null,"type":"Identifier","name":"exec"},"computed":false},"arguments":[{"loc":{"start":{"line":13,"column":18},"end":{"line":13,"column":20},"source":null},"type":"Identifier","name":"ua"}]}}},"right":{"loc":{"start":{"line":14,"column":4},"end":{"line":14,"column":6},"source":null},"type":"ArrayExpression","elements":[]}}}]},{"loc":{"start":{"line":16,"column":0},"end":{"line":21,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":4},"end":{"line":21,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":4},"end":{"line":21,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":16,"column":8},"end":{"line":21,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":17,"column":1},"end":{"line":20,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":7},"source":null},"type":"Identifier","name":"webkit"},"value":{"loc":{"start":{"line":17,"column":9},"end":{"line":20,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":18,"column":1},"end":{"line":19,"column":16},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":15},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":19,"column":9},"end":{"line":19,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":19,"column":9},"end":{"line":19,"column":13},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":13},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":23,"column":2},"end":{"line":23,"column":7},"source":null},"type":"Identifier","name":"match"},"property":{"loc":{"start":{"line":23,"column":8},"end":{"line":23,"column":9},"source":null},"type":"Literal","value":1},"computed":true},"computed":true},"arguments":[]}},{"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":20,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":40},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":40},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":40},"source":null},"type":"Identifier","name":"div"},"init":{"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":40},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":33},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":19},"source":null},"type":"Identifier","name":"document"},"property":{"loc":null,"type":"Identifier","name":"createElement"},"computed":false},"arguments":[{"loc":{"start":{"line":2,"column":34},"end":{"line":2,"column":39},"source":null},"type":"Literal","value":"div"}]}}]},{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":27},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":27},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":4},"source":null},"type":"Identifier","name":"div"},"property":{"loc":null,"type":"Identifier","name":"style"},"computed":false},"property":{"loc":null,"type":"Identifier","name":"display"},"computed":false},"right":{"loc":{"start":{"line":3,"column":21},"end":{"line":3,"column":27},"source":null},"type":"Literal","value":"none"}}},{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":102},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":102},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":4},"source":null},"type":"Identifier","name":"div"},"property":{"loc":null,"type":"Identifier","name":"innerHTML"},"computed":false},"right":{"loc":{"start":{"line":4,"column":17},"end":{"line":4,"column":102},"source":null},"type":"Literal","value":" <link/><table></table><a href='/a' style='color:red'>a</a><input type='checkbox'/>"}}},{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":41},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":5,"column":5},"end":{"line":5,"column":41},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":5,"column":5},"end":{"line":5,"column":41},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":41},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":38},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":33},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":12},"source":null},"type":"Identifier","name":"div"},"property":{"loc":null,"type":"Identifier","name":"getElementsByTagName"},"computed":false},"arguments":[{"loc":{"start":{"line":5,"column":34},"end":{"line":5,"column":37},"source":null},"type":"Literal","value":"a"}]},"property":{"loc":{"start":{"line":5,"column":39},"end":{"line":5,"column":40},"source":null},"type":"Literal","value":0},"computed":true}}]},{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":5},"end":{"line":7,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":5},"end":{"line":7,"column":13},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":7,"column":11},"end":{"line":7,"column":13},"source":null},"type":"ObjectExpression","properties":[]}}]},{"loc":{"start":{"line":8,"column":1},"end":{"line":11,"column":2},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":8,"column":1},"end":{"line":11,"column":2},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":10},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":4},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":null,"type":"Identifier","name":"color"},"computed":false},"right":{"loc":{"start":{"line":8,"column":13},"end":{"line":11,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":9,"column":1},"end":{"line":10,"column":20},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":19},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":10,"column":9},"end":{"line":10,"column":19},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":10,"column":9},"end":{"line":10,"column":15},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":10,"column":9},"end":{"line":10,"column":13},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":10,"column":18},"end":{"line":10,"column":19},"source":null},"type":"Literal","value":1}}}]},"generator":false,"expression":false}}},{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":32},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":13,"column":5},"end":{"line":13,"column":32},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":13,"column":5},"end":{"line":13,"column":32},"source":null},"type":"Identifier","name":"c"},"init":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":32},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":10},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"getAttribute"},"computed":false},"arguments":[{"loc":{"start":{"line":13,"column":24},"end":{"line":13,"column":31},"source":null},"type":"Literal","value":"style"}]}}]},{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":27},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":15,"column":5},"end":{"line":15,"column":27},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":15,"column":5},"end":{"line":15,"column":27},"source":null},"type":"Identifier","name":"splited"},"init":{"loc":{"start":{"line":15,"column":15},"end":{"line":15,"column":27},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":15,"column":15},"end":{"line":15,"column":22},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":15,"column":15},"end":{"line":15,"column":16},"source":null},"type":"Identifier","name":"c"},"property":{"loc":null,"type":"Identifier","name":"split"},"computed":false},"arguments":[{"loc":{"start":{"line":15,"column":23},"end":{"line":15,"column":26},"source":null},"type":"Literal","value":":"}]}}]},{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":30},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":17,"column":5},"end":{"line":17,"column":30},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":17,"column":5},"end":{"line":17,"column":30},"source":null},"type":"Identifier","name":"functionName"},"init":{"loc":{"start":{"line":17,"column":20},"end":{"line":17,"column":30},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":17,"column":20},"end":{"line":17,"column":27},"source":null},"type":"Identifier","name":"splited"},"property":{"loc":{"start":{"line":17,"column":28},"end":{"line":17,"column":29},"source":null},"type":"Literal","value":0},"computed":true}}]},{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":20},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":20},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":18},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":19,"column":1},"end":{"line":19,"column":4},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":{"start":{"line":19,"column":5},"end":{"line":19,"column":17},"source":null},"type":"Identifier","name":"functionName"},"computed":true},"arguments":[]}},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":30,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":7,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":7,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":7,"column":2},"source":null},"type":"Identifier","name":"obj0"},"init":{"loc":{"start":{"line":2,"column":12},"end":{"line":7,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":2},"end":{"line":6,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":6},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":8},"end":{"line":6,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":2},"end":{"line":5,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":3},"end":{"line":5,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":10},"end":{"line":5,"column":11},"source":null},"type":"Literal","value":0}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":1},"end":{"line":14,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":9,"column":5},"end":{"line":14,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":9,"column":5},"end":{"line":14,"column":2},"source":null},"type":"Identifier","name":"obj1"},"init":{"loc":{"start":{"line":9,"column":12},"end":{"line":14,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":10,"column":2},"end":{"line":13,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":6},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":10,"column":8},"end":{"line":13,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":11,"column":2},"end":{"line":12,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":12,"column":3},"end":{"line":12,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":12,"column":10},"end":{"line":12,"column":11},"source":null},"type":"Literal","value":1}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":16,"column":1},"end":{"line":21,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":16,"column":5},"end":{"line":21,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":16,"column":5},"end":{"line":21,"column":2},"source":null},"type":"Identifier","name":"obj2"},"init":{"loc":{"start":{"line":16,"column":12},"end":{"line":21,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":17,"column":2},"end":{"line":20,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":6},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":17,"column":8},"end":{"line":20,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":18,"column":2},"end":{"line":19,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":19,"column":3},"end":{"line":19,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":19,"column":10},"end":{"line":19,"column":11},"source":null},"type":"Literal","value":2}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":23,"column":1},"end":{"line":23,"column":31},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":23,"column":5},"end":{"line":23,"column":31},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":23,"column":5},"end":{"line":23,"column":31},"source":null},"type":"Identifier","name":"array"},"init":{"loc":{"start":{"line":23,"column":13},"end":{"line":23,"column":31},"source":null},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":23,"column":14},"end":{"line":23,"column":18},"source":null},"type":"Identifier","name":"obj0"},{"loc":{"start":{"line":23,"column":20},"end":{"line":23,"column":24},"source":null},"type":"Identifier","name":"obj1"},{"loc":{"start":{"line":23,"column":26},"end":{"line":23,"column":30},"source":null},"type":"Identifier","name":"obj2"}]}}]},{"loc":{"start":{"line":25,"column":1},"end":{"line":25,"column":10},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":25,"column":5},"end":{"line":25,"column":10},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":25,"column":5},"end":{"line":25,"column":10},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":25,"column":9},"end":{"line":25,"column":10},"source":null},"type":"Literal","value":1}}]},{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":7},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":7},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":27,"column":1},"end":{"line":27,"column":2},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":27,"column":6},"end":{"line":27,"column":7},"source":null},"type":"Literal","value":1}}},{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":16},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":9},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":29,"column":1},"end":{"line":29,"column":6},"source":null},"type":"Identifier","name":"array"},"property":{"loc":{"start":{"line":29,"column":7},"end":{"line":29,"column":8},"source":null},"type":"Identifier","name":"a"},"computed":true},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":30,"column":0},"end":{"line":30,"column":1},"source":null},"type":"EmptyStatement"}]});
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
var myRe = /ab/g;
var str = "abbcdefabh";
var myArray = myRe.exec(str);
while (myArray != null)
{
  obj[myArray[0]]();
  obj[myRe.lastIndex]();
  myArray = myRe.exec(str);
}

Math.E + 1;
;*/

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":33,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":19,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":19,"column":1},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":19,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":4},"source":null},"type":"Identifier","name":"abb"},"value":{"loc":{"start":{"line":3,"column":6},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":7,"column":1},"end":{"line":10,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":7,"column":1},"end":{"line":7,"column":3},"source":null},"type":"Identifier","name":"ab"},"value":{"loc":{"start":{"line":7,"column":5},"end":{"line":10,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":8,"column":1},"end":{"line":9,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":11,"column":1},"end":{"line":14,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":4},"source":null},"type":"Literal","value":3},"value":{"loc":{"start":{"line":11,"column":6},"end":{"line":14,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":12,"column":1},"end":{"line":13,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":10},"source":null},"type":"Literal","value":5}}]},"generator":false,"expression":false},"kind":"init"},{"loc":{"start":{"line":15,"column":1},"end":{"line":18,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":4},"source":null},"type":"Literal","value":9},"value":{"loc":{"start":{"line":15,"column":6},"end":{"line":18,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":16,"column":1},"end":{"line":17,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":17,"column":2},"end":{"line":17,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":17,"column":9},"end":{"line":17,"column":10},"source":null},"type":"Literal","value":6}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":17},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":17},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":20,"column":4},"end":{"line":20,"column":17},"source":null},"type":"Identifier","name":"myRe"},"init":{"loc":{"start":{"line":20,"column":11},"end":{"line":20,"column":17},"source":null},"type":"Literal","value":{}}}]},{"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":22},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":21,"column":4},"end":{"line":21,"column":22},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":21,"column":4},"end":{"line":21,"column":22},"source":null},"type":"Identifier","name":"str"},"init":{"loc":{"start":{"line":21,"column":10},"end":{"line":21,"column":22},"source":null},"type":"Literal","value":"abbcdefabh"}}]},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":28},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":22,"column":4},"end":{"line":22,"column":28},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":22,"column":4},"end":{"line":22,"column":28},"source":null},"type":"Identifier","name":"myArray"},"init":{"loc":{"start":{"line":22,"column":14},"end":{"line":22,"column":28},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":22,"column":14},"end":{"line":22,"column":23},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":22,"column":14},"end":{"line":22,"column":18},"source":null},"type":"Identifier","name":"myRe"},"property":{"loc":null,"type":"Identifier","name":"exec"},"computed":false},"arguments":[{"loc":{"start":{"line":22,"column":24},"end":{"line":22,"column":27},"source":null},"type":"Identifier","name":"str"}]}}]},{"loc":{"start":{"line":23,"column":0},"end":{"line":29,"column":27},"source":null},"type":"WhileStatement","test":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":17},"source":null},"type":"BinaryExpression","operator":"!=","left":{"loc":{"start":{"line":24,"column":2},"end":{"line":24,"column":9},"source":null},"type":"Identifier","name":"myArray"},"right":{"loc":{"start":{"line":24,"column":13},"end":{"line":24,"column":17},"source":null},"type":"Literal","value":null}},"body":{"loc":{"start":{"line":26,"column":0},"end":{"line":29,"column":27},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":27,"column":2},"end":{"line":27,"column":19},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":27,"column":2},"end":{"line":27,"column":19},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":27,"column":2},"end":{"line":27,"column":17},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":27,"column":2},"end":{"line":27,"column":5},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":{"start":{"line":27,"column":6},"end":{"line":27,"column":16},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":27,"column":6},"end":{"line":27,"column":13},"source":null},"type":"Identifier","name":"myArray"},"property":{"loc":{"start":{"line":27,"column":14},"end":{"line":27,"column":15},"source":null},"type":"Literal","value":0},"computed":true},"computed":true},"arguments":[]}},{"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":23},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":23},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":5},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":{"start":{"line":28,"column":6},"end":{"line":28,"column":20},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":28,"column":6},"end":{"line":28,"column":10},"source":null},"type":"Identifier","name":"myRe"},"property":{"loc":null,"type":"Identifier","name":"lastIndex"},"computed":false},"computed":true},"arguments":[]}},{"loc":{"start":{"line":29,"column":2},"end":{"line":29,"column":26},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":29,"column":2},"end":{"line":29,"column":26},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":29,"column":2},"end":{"line":29,"column":9},"source":null},"type":"Identifier","name":"myArray"},"right":{"loc":{"start":{"line":29,"column":12},"end":{"line":29,"column":26},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":29,"column":12},"end":{"line":29,"column":21},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":29,"column":12},"end":{"line":29,"column":16},"source":null},"type":"Identifier","name":"myRe"},"property":{"loc":null,"type":"Identifier","name":"exec"},"computed":false},"arguments":[{"loc":{"start":{"line":29,"column":22},"end":{"line":29,"column":25},"source":null},"type":"Identifier","name":"str"}]}}}]}},{"loc":{"start":{"line":32,"column":0},"end":{"line":32,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":32,"column":0},"end":{"line":32,"column":10},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":32,"column":0},"end":{"line":32,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":32,"column":0},"end":{"line":32,"column":4},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":32,"column":9},"end":{"line":32,"column":10},"source":null},"type":"Literal","value":1}}},{"loc":{"start":{"line":33,"column":0},"end":{"line":33,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":18,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":7,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":7,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":7,"column":2},"source":null},"type":"Identifier","name":"obj"},"init":{"loc":{"start":{"line":2,"column":11},"end":{"line":7,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":2},"end":{"line":6,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":9},"source":null},"type":"Identifier","name":"testDiv"},"value":{"loc":{"start":{"line":3,"column":11},"end":{"line":6,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":2},"end":{"line":5,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":3},"end":{"line":5,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":10},"end":{"line":5,"column":11},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":54},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":54},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":9,"column":5},"end":{"line":9,"column":54},"source":null},"type":"Identifier","name":"regEx"},"init":{"loc":{"start":{"line":9,"column":13},"end":{"line":9,"column":54},"source":null},"type":"Literal","value":{}}}]},{"loc":{"start":{"line":11,"column":1},"end":{"line":11,"column":26},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":11,"column":5},"end":{"line":11,"column":26},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":11,"column":5},"end":{"line":11,"column":26},"source":null},"type":"Identifier","name":"selector"},"init":{"loc":{"start":{"line":11,"column":16},"end":{"line":11,"column":26},"source":null},"type":"Literal","value":"#testDiv"}}]},{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":29},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":29},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":6},"source":null},"type":"Identifier","name":"match"},"right":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":29},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":19},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":9},"end":{"line":13,"column":14},"source":null},"type":"Identifier","name":"regEx"},"property":{"loc":null,"type":"Identifier","name":"exec"},"computed":false},"arguments":[{"loc":{"start":{"line":13,"column":20},"end":{"line":13,"column":28},"source":null},"type":"Identifier","name":"selector"}]}}},{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":16},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":14},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":15,"column":1},"end":{"line":15,"column":4},"source":null},"type":"Identifier","name":"obj"},"property":{"loc":{"start":{"line":15,"column":5},"end":{"line":15,"column":13},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":15,"column":5},"end":{"line":15,"column":10},"source":null},"type":"Identifier","name":"match"},"property":{"loc":{"start":{"line":15,"column":11},"end":{"line":15,"column":12},"source":null},"type":"Literal","value":2},"computed":true},"computed":true},"arguments":[]}},{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":7},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":17,"column":1},"end":{"line":17,"column":5},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":17,"column":10},"end":{"line":17,"column":11},"source":null},"type":"Literal","value":1}}},{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":14,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":13},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":13},"source":null},"type":"Literal","value":null}}]},{"loc":{"start":{"line":3,"column":1},"end":{"line":8,"column":2},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":5},"end":{"line":8,"column":2},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":5},"end":{"line":8,"column":2},"source":null},"type":"Identifier","name":"b"},"init":{"loc":{"start":{"line":3,"column":9},"end":{"line":8,"column":2},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":4,"column":2},"end":{"line":7,"column":3},"source":null},"type":"Property","key":{"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":6},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":4,"column":8},"end":{"line":7,"column":3},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":5,"column":2},"end":{"line":6,"column":12},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":6,"column":3},"end":{"line":6,"column":11},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":6,"column":10},"end":{"line":6,"column":11},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":10,"column":2},"end":{"line":11,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":2},"end":{"line":11,"column":13},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":10,"column":2},"end":{"line":11,"column":11},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":10,"column":2},"end":{"line":11,"column":5},"source":null},"type":"LogicalExpression","operator":"||","left":{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":3},"source":null},"type":"Identifier","name":"a"},"right":{"loc":{"start":{"line":11,"column":4},"end":{"line":11,"column":5},"source":null},"type":"Identifier","name":"b"}},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":11},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":11},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":7},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":1},"end":{"line":13,"column":5},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":13,"column":10},"end":{"line":13,"column":11},"source":null},"type":"Literal","value":1}}},{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":20,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"create"},"params":[{"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17},"source":null},"type":"Identifier","name":"n"}],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":19,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":4,"column":6},"end":{"line":4,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":4,"column":6},"end":{"line":4,"column":11},"source":null},"type":"Identifier","name":"k"},"init":{"loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":11},"source":null},"type":"Identifier","name":"n"}}]},{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":8},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":5,"column":6},"end":{"line":5,"column":8},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":5,"column":6},"end":{"line":5,"column":8},"source":null},"type":"Identifier","name":"nj"},"init":null}]},{"loc":{"start":{"line":6,"column":2},"end":{"line":6,"column":7},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":7},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":7},"source":null},"type":"Identifier","name":"j"},"init":null}]},{"loc":{"start":{"line":8,"column":2},"end":{"line":17,"column":12},"source":null},"type":"DoWhileStatement","body":{"loc":{"start":{"line":9,"column":2},"end":{"line":15,"column":17},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":13},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":10,"column":7},"end":{"line":10,"column":9},"source":null},"type":"Identifier","name":"nj"},"right":{"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":13},"source":null},"type":"Identifier","name":"k"}}},{"loc":{"start":{"line":11,"column":5},"end":{"line":15,"column":15},"source":null},"type":"DoWhileStatement","body":{"loc":{"start":{"line":12,"column":5},"end":{"line":13,"column":17},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":13,"column":6},"end":{"line":13,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":6},"end":{"line":13,"column":16},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":6},"end":{"line":13,"column":7},"source":null},"type":"Identifier","name":"j"},"right":{"loc":{"start":{"line":13,"column":10},"end":{"line":13,"column":16},"source":null},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":13,"column":10},"end":{"line":13,"column":11},"source":null},"type":"Identifier","name":"k"},"right":{"loc":{"start":{"line":13,"column":14},"end":{"line":13,"column":16},"source":null},"type":"Identifier","name":"nj"}}}}]},"test":{"loc":{"start":{"line":15,"column":11},"end":{"line":15,"column":15},"source":null},"type":"UpdateExpression","operator":"--","argument":{"loc":{"start":{"line":15,"column":13},"end":{"line":15,"column":15},"source":null},"type":"Identifier","name":"nj"},"prefix":true}}]},"test":{"loc":{"start":{"line":17,"column":9},"end":{"line":17,"column":12},"source":null},"type":"UpdateExpression","operator":"--","argument":{"loc":{"start":{"line":17,"column":11},"end":{"line":17,"column":12},"source":null},"type":"Identifier","name":"n"},"prefix":true}},{"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":19,"column":9},"end":{"line":19,"column":10},"source":null},"type":"Literal","value":2}}]},"generator":false,"expression":false},{"loc":{"start":{"line":20,"column":1},"end":{"line":20,"column":2},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":9},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":9},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":22,"column":0},"end":{"line":22,"column":6},"source":null},"type":"Identifier","name":"create"},"arguments":[{"loc":{"start":{"line":22,"column":7},"end":{"line":22,"column":8},"source":null},"type":"Literal","value":2}]}},{"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":19,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":5,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test1"},"params":[],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":4,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},{"loc":{"start":{"line":7,"column":9},"end":{"line":10,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"test2"},"params":[],"body":{"loc":{"start":{"line":8,"column":0},"end":{"line":9,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":9,"column":1},"end":{"line":9,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":9,"column":8},"end":{"line":9,"column":9},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":21},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":21},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":12,"column":4},"end":{"line":12,"column":21},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":21},"source":null},"type":"SequenceExpression","expressions":[{"loc":{"start":{"line":12,"column":9},"end":{"line":12,"column":14},"source":null},"type":"Identifier","name":"test1"},{"loc":{"start":{"line":12,"column":16},"end":{"line":12,"column":21},"source":null},"type":"Identifier","name":"test2"}]}}]},{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":3},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":3},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":1},"source":null},"type":"Identifier","name":"a"},"arguments":[]}},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":16},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":16},"source":null},"type":"SequenceExpression","expressions":[{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":7},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":5},"source":null},"type":"Identifier","name":"test1"},"arguments":[]},{"loc":{"start":{"line":16,"column":9},"end":{"line":16,"column":16},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":16,"column":9},"end":{"line":16,"column":14},"source":null},"type":"Identifier","name":"test2"},"arguments":[]}]}},{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":10},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":4},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":18,"column":9},"end":{"line":18,"column":10},"source":null},"type":"Literal","value":1}}},{"loc":{"start":{"line":19,"column":0},"end":{"line":19,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":16,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":11},"source":null},"type":"Identifier","name":"sum"},"init":{"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11},"source":null},"type":"Literal","value":0}}]},{"loc":{"start":{"line":3,"column":0},"end":{"line":12,"column":2},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":13},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":13},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":13},"source":null},"type":"Identifier","name":"i"},"init":{"loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":13},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":6},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":2},"source":null},"type":"Identifier","name":"i"},"right":{"loc":{"start":{"line":4,"column":5},"end":{"line":4,"column":6},"source":null},"type":"Literal","value":3}},"update":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":4},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":5,"column":1},"end":{"line":5,"column":2},"source":null},"type":"Identifier","name":"i"},"prefix":false},"body":{"loc":{"start":{"line":6,"column":0},"end":{"line":12,"column":2},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":7,"column":1},"end":{"line":11,"column":11},"source":null},"type":"ForStatement","init":{"loc":{"start":{"line":7,"column":5},"end":{"line":7,"column":14},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":14},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":14},"source":null},"type":"Identifier","name":"j"},"init":{"loc":{"start":{"line":7,"column":13},"end":{"line":7,"column":14},"source":null},"type":"Literal","value":0}}]},"test":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":7},"source":null},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":8,"column":2},"end":{"line":8,"column":3},"source":null},"type":"Identifier","name":"j"},"right":{"loc":{"start":{"line":8,"column":6},"end":{"line":8,"column":7},"source":null},"type":"Literal","value":2}},"update":{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":5},"source":null},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":3},"source":null},"type":"Identifier","name":"j"},"prefix":false},"body":{"loc":{"start":{"line":10,"column":1},"end":{"line":11,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":10},"source":null},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":5},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":11,"column":9},"end":{"line":11,"column":10},"source":null},"type":"Identifier","name":"j"}}}]}}]}},{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":13},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":13},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":15,"column":0},"end":{"line":15,"column":3},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":15,"column":6},"end":{"line":15,"column":13},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":15,"column":6},"end":{"line":15,"column":9},"source":null},"type":"Identifier","name":"sum"},"right":{"loc":{"start":{"line":15,"column":12},"end":{"line":15,"column":13},"source":null},"type":"Literal","value":1}}}},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":1},"source":null},"type":"EmptyStatement"}]});
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
/*********** Test: 70  ************/
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

 //testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":12,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":0},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":2,"column":4},"end":{"line":7,"column":1},"source":null},"type":"Identifier","name":"a"},"init":{"loc":{"start":{"line":2,"column":8},"end":{"line":7,"column":1},"source":null},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9},"source":null},"type":"Identifier","name":"b"},"right":{"loc":{"start":{"line":2,"column":12},"end":{"line":7,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":3,"column":1},"end":{"line":6,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":3,"column":1},"end":{"line":3,"column":5},"source":null},"type":"Identifier","name":"test"},"value":{"loc":{"start":{"line":3,"column":7},"end":{"line":6,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":4,"column":1},"end":{"line":5,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":10},"source":null},"type":"Literal","value":3}}]},"generator":false,"expression":false},"kind":"init"}]}}}]},{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":1},"source":null},"type":"Identifier","name":"a"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":8},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":8},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":1},"source":null},"type":"Identifier","name":"b"},"property":{"loc":null,"type":"Identifier","name":"test"},"computed":false},"arguments":[]}},{"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":1},"source":null},"type":"EmptyStatement"}]});
/*********** Test: 71  ************/
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
//testData.push({"loc":{"start":{"line":1,"column":0},"end":{"line":18,"column":1},"source":null},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1},"source":null},"type":"EmptyStatement"},{"loc":{"start":{"line":2,"column":9},"end":{"line":5,"column":1},"source":null},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"print"},"params":[{"loc":{"start":{"line":2,"column":15},"end":{"line":2,"column":16},"source":null},"type":"Identifier","name":"a"}],"body":{"loc":{"start":{"line":3,"column":0},"end":{"line":4,"column":10},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":9},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},{"loc":{"start":{"line":7,"column":0},"end":{"line":12,"column":1},"source":null},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":7,"column":4},"end":{"line":12,"column":1},"source":null},"type":"VariableDeclarator","id":{"loc":{"start":{"line":7,"column":4},"end":{"line":12,"column":1},"source":null},"type":"Identifier","name":"hoistedObjectLiteral_0"},"init":{"loc":{"start":{"line":7,"column":29},"end":{"line":12,"column":1},"source":null},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":8,"column":1},"end":{"line":11,"column":2},"source":null},"type":"Property","key":{"loc":{"start":{"line":8,"column":1},"end":{"line":8,"column":2},"source":null},"type":"Identifier","name":"a"},"value":{"loc":{"start":{"line":8,"column":4},"end":{"line":11,"column":2},"source":null},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":9,"column":1},"end":{"line":10,"column":11},"source":null},"type":"BlockStatement","body":[{"loc":{"start":{"line":10,"column":2},"end":{"line":10,"column":10},"source":null},"type":"ReturnStatement","argument":{"loc":{"start":{"line":10,"column":9},"end":{"line":10,"column":10},"source":null},"type":"Literal","value":4}}]},"generator":false,"expression":false},"kind":"init"}]}}]},{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":29},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":29},"source":null},"type":"CallExpression","callee":{"loc":{"start":{"line":14,"column":0},"end":{"line":14,"column":5},"source":null},"type":"Identifier","name":"print"},"arguments":[{"loc":{"start":{"line":14,"column":6},"end":{"line":14,"column":28},"source":null},"type":"Identifier","name":"hoistedObjectLiteral_0"}]}},{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":10},"source":null},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":10},"source":null},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":6},"source":null},"type":"MemberExpression","object":{"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":4},"source":null},"type":"Identifier","name":"Math"},"property":{"loc":null,"type":"Identifier","name":"E"},"computed":false},"right":{"loc":{"start":{"line":16,"column":9},"end":{"line":16,"column":10},"source":null},"type":"Literal","value":1}}},{"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":1},"source":null},"type":"EmptyStatement"}]});
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 6  ************/
/*;
function obj()
{
	this.a = "2";
}

var a = new obj();
;*/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 8  ************/
/*;
	var a = [1,2,3];
	
	var b = a[0] + a[1] + a[2];
;*/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push();
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

 testData.push();
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

 testData.push();
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 17  ************/
/*;
var a = {
	b: 3,
	c: 4
}

var c = a.b + a.c;
;*/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
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

 testData.push(FBL.ns(function () { with (FBL) {
/******/

Firecrow.htmlHelper = 
{
	serializeToHtmlJSON: function(htmlDocument)
	{
		var serialized = { };
		
		var docType = this.getDocumentType(htmlDocument);
		var htmlElement = this.getHtmlElement(htmlDocument);

        var scriptPathsAndModels = Firecrow.fbHelper.getScriptsPathsAndModels();
		
		serialized.docType = docType != null ? docType.systemId :"";
		serialized.htmlElement = htmlElement != null ? this.getSimplifiedElement(htmlElement, scriptPathsAndModels) : "null";

		return serialized;
	},
	
	getDocumentType: function(htmlDocument)
	{
		return htmlDocument.childNodes[0] instanceof DocumentType
			?  htmlDocument.childNodes[0]
			:  null;
	},
	
	getHtmlElement: function(htmlDocument)
	{
		for(var i = 0; i < htmlDocument.childNodes.length; i++)
		{
			if(htmlDocument.childNodes[i] instanceof HTMLHtmlElement)
			{
				return htmlDocument.childNodes[i];
			}
		}
		
		return null;
	},
	
	getSimplifiedElement: function(rootElement, scriptPathsAndModels)
	{
        try
        {
            var elem =
            {
                type: !(rootElement instanceof Text) ? rootElement.localName : "textNode",
                attributes: this.getAttributes(rootElement),
                children: this.getChildren(rootElement, scriptPathsAndModels)
            };

            if(rootElement instanceof Text
            || rootElement instanceof HTMLScriptElement)
            {
                elem.textContent = rootElement.textContent;
            }

            if(rootElement instanceof HTMLScriptElement)
            {
                elem.pathAndModel = scriptPathsAndModels.splice(0,1)[0];
            }
            else if (rootElement instanceof HTMLStyleElement)
            {

            }
            else if (rootElement instanceof HTMLLinkElement)
            {

            }

            return elem;
        }
        catch(e)
        {
            alert("helpers.htmlHelper: Error when getting simplified:" + e);
        }
	},

    getTextNodesBeforeScriptElements: function()
    {
        var allNodes = this.getAllNodes(Firecrow.fbHelper.getCurrentPageDocument());

        var scriptPreviousTextNodesMapping =  [];
        var previousTextNodes = [];

        allNodes.forEach(function (currentNode)
        {
            if(currentNode instanceof Text)
            {
                previousTextNodes.push(currentNode);
            }

            if(currentNode instanceof HTMLScriptElement)
            {
                scriptPreviousTextNodesMapping.push
                ({
                    scriptElement: currentNode,
                    previousTextNodes: Firecrow.ValueTypeHelper.createArrayCopy(previousTextNodes)
                })
            }
        });

        return scriptPreviousTextNodesMapping;
    },

    getAllNodes: function(rootElement)
    {
        var allNodes = [];

        if(rootElement == null || rootElement.childNodes == null) { return allNodes;}

        try
        {
            for(var i = 0; i < rootElement.childNodes.length;i++)
            {
                var currentNode = rootElement.childNodes[i];
                allNodes.push(currentNode);
                Firecrow.ValueTypeHelper.pushAll(allNodes, this.getAllNodes(currentNode));
            }
        }
        catch(e) {alert("helpers.htmlHelper error when getting allNodes:" + e);}

        return allNodes;
    },
	
	getAttributes: function(element)
	{
		var attributes = [];
		
		try
		{
			if(element.attributes == null) { return attributes; }
			
			for(var i = 0; i < element.attributes.length; i++)
			{
				var currentAttribute = element.attributes[i];
				attributes.push
				(
					{
						name: currentAttribute.name,
						value: currentAttribute.nodeValue
					}
				);
			}
		}
		catch(e) { alert("Attributes" + e);}
		
		return attributes;
	},
	
	getChildren: function(rootElement, scriptPathsAndModels)
	{
		var allNodes = [];
		
		if(rootElement.childNodes == null) { return allNodes;}
		
		try
		{
			for(var i = 0; i < rootElement.childNodes.length;i++)
			{
				allNodes.push(this.getSimplifiedElement(rootElement.childNodes[i], scriptPathsAndModels));
			}
		}
		catch(e) {alert("Children:" + e);}
		
		return allNodes;
	}
};
}}););
/*********** Test: 30  ************/
/*;
var a = 1 + 2 + 3;

var b = a * 4 * 3;

var c = b / 2 - 3;
;*/

 testData.push( 
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
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

 testData.push();
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

 testData.push();
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

 testData.push();
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 41  ************/
/*;
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
		obj.fun();	
	})();
	
	a++;
})();
;*/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 42  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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
y.b(); // 20 � is gotten from the prototype x;
 
delete y.a; // removed own a
y.a(); // a � is gotten from the prototype
 
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
y.e(); // also � is gotten from the prototype z
 
z.q = function() // added new property to the prototype
{
	return 4;
}; 

y.q(); // changes are available and on y
;*/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 46  ************/
/*;
function A() {}
A.prototype.x = function()
{
	return 10;
};
 
var a = new A();
a.x(); // 10 � by delegation, from the prototype
 
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
b.y(); // 100 � by delegation, from the prototype
//and there is not b.x() - because "b" has new prototype 

a.x();
;*/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 49  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 50  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 51  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 70  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 71  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 72  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
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

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
/*********** Test: 75  ************/
/**/

 testData.push(First Test File - simple html file

One paragraph
First Cell 	Second Cell 	Third Cell
);
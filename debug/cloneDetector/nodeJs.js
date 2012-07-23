/**
 * User: Jomaras
 * Date: 23.07.12.
 * Time: 13:37
 */
var f = new Array();

function factorial (n)
{
    if (n <= 1) { return 1; }

    return factorial(n-1)*n;
}

for(var i = 0; i < 20; i++)
{
    console.log(factorial(i));
}
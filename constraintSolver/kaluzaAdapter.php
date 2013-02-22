<?php

function getConstraint()
{
    if(array_key_exists("Constraint", $_REQUEST))
    {
        return $_REQUEST["Constraint"];
    }

    return "";
}

function get

$url = 'http://aerie.cs.berkeley.edu/kaluza/run.php';
$data = array('Field3' => 'var_0xINPUT := T1 . T2; T1 == "Kal";T2 == "uza";', 'Field2' => 'VAR_0xINPUT', 'saveForm' => 'Submit');

$options = array('http' => array('method'  => 'POST','content' => http_build_query($data)));
$context  = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

?>
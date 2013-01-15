function dinosaur(fillcolor, linecolor)
{

    this.points=[
        [0,0,0],
        [-31.75,-22.61,-150.88],
        [-29.72,-33.02,-156.46],
        [-21.84,-23.88,-157.23],
        [47.50,-61.98,-72.90],
        [33.02,-77.22,-88.39],
        [29.97,-73.41,-78.74],
        [24.13,-68.83,-68.83],
        [25.40,-61.72,-60.71],
        [30.23,-53.85,-53.85],
        [48.77,-48.26,-59.18],
        [56.39,-52.58,-70.87],
        [62.48,-56.39,-88.14],
        [53.34,-66.55,-90.42],
        [43.94,-73.91,-92.71],
        [65.28,-35.56,-69.60],
        [48.26,-32.26,-48.77],
        [60.96,-20.57,-56.90],
        [71.12,-15.24,-72.64]];


    this.faces=[
        [3,2,1],
        [6,5,4],
        [7,6,4],
        [8,7,4],
        [9,8,4],
        [10,9,4],
        [11,10,4],
        [12,11,4],
        [13,12,4],
        [14,13,4],
        [5,14,4],
        [5,5,4],
        [11,12,15],
        [10,11,15],
        [16,10,15],
        [17,16,15],
        [18,17,15],
        [19,18,15],
        [20,19,15]];

    this.normals = new Array();

    for (var i=0; i<this.faces.length; i++)
    {
        this.normals[i] = [0, 0, 0];
    }

    this.center = [0, 0, 0];

    for (var i=0; i<this.points.length; i++)
    {
        this.center[0] += this.points[i][0];
        this.center[1] += this.points[i][1];
        this.center[2] += this.points[i][2];
    }

    this.distances = new Array();
    for (var i=1; i<this.points.length; i++)
    {
        this.distances[i] = 0;
    }

    this.points_number = this.points.length;
    this.center[0] = this.center[0]/(this.points_number-1);
    this.center[1] = this.center[1]/(this.points_number-1);
    this.center[2] = this.center[2]/(this.points_number-1);

    this.faces_number = this.faces.length;
    this.axis_x = [1, 0, 0];
    this.axis_y = [0, 1, 0];
    this.axis_z = [0, 0, 1];
    this.fillcolor = fillcolor;
    this.linecolor = linecolor;
}


function helicopter(fillcolor, linecolor)
{

    this.points=[
        [0,0,0],
        [-0.010000,13.150000,3.670000],
        [-0.620000,3.690000,3.670000],
        [-0.620000,-3.740000,3.670000],
        [0.580000,-3.740000,3.670000],
        [0.580000,3.690000,3.670000],
        [-0.010000,13.150000,0.000000],
        [-0.620000,3.690000,0.000000],
        [-0.620000,-3.740000,0.000000],
        [0.580000,-3.740000,0.000000],
        [0.580000,3.690000,0.000000],
        [0.000000,-3.320000,6.130000],
        [1.220000,-2.890000,6.130000],
        [1.840000,-2.020000,6.130000],
        [2.450000,-0.720000,6.130000],
        [0.610000,10.060000,6.130000],
        [-0.590000,10.060000,6.130000],
        [-2.430000,-0.720000,6.130000],
        [-1.820000,-2.020000,6.130000]];

    this.faces=[
        [1,6,7],
        [1,7,2],
        [2,7,8],
        [2,8,3],
        [3,8,9],
        [3,9,4],
        [4,9,10],
        [4,10,5],
        [5,10,6],
        [5,6,1],
        [1,2,3],
        [6,8,7],
        [1,3,4],
        [6,9,8],
        [1,4,5],
        [6,10,9],
        [11,20,21],
        [11,21,12],
        [12,21,22]];

    this.normals = new Array();

    for (var i=0; i<this.faces.length; i++)
    {
        this.normals[i] = [0, 0, 0];
    }

    this.center = [0, 0, 0];

    for (var i=0; i<this.points.length; i++)
    {
        this.center[0] += this.points[i][0];
        this.center[1] += this.points[i][1];
        this.center[2] += this.points[i][2];
    }

    this.distances = new Array();
    for (var i=1; i<this.points.length; i++)
    {
        this.distances[i] = 0;
    }

    this.points_number = this.points.length;
    this.center[0] = this.center[0]/(this.points_number-1);
    this.center[1] = this.center[1]/(this.points_number-1);
    this.center[2] = this.center[2]/(this.points_number-1);

    this.faces_number = this.faces.length;
    this.axis_x = [1, 0, 0];
    this.axis_y = [0, 1, 0];
    this.axis_z = [0, 0, 1];
    this.fillcolor = fillcolor;
    this.linecolor = linecolor;
}
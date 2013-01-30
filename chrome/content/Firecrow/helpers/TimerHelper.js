FBL.ns(function () { with (FBL) {
/*************************************************************/
Firecrow.TimerHelper =
{

};

Firecrow.TimerHelper.Timer = function(){ };

Firecrow.TimerHelper.Timer.prototype =
{
    start: function()
    {
        this.startTime = new Date();

        return this;
    },

    getElapsedTimeInSeconds: function()
    {
        if(this.startTime == null) { return -1; }

        var currentTime = new Date();

        var timeDiff = currentTime - this.startTime;

        timeDiff /= 1000; //take away ms

        return Math.round(timeDiff % 60);
    }
};
}});
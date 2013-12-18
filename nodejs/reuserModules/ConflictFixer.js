var ConflictFixer =
{
    fixConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        this._fixResourceConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixHtmlConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixJsConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixCssConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);

        return "Conflicts will be fixed";
    },

    _fixResourceConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {

    },

    _fixHtmlConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {

    },

    _fixJsConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {

    },

    _fixCssConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {

    }
};

exports.ConflictFixer = ConflictFixer;

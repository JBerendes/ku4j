cssTest.views.results = function(indicator, resultsList){
    this._indicator = $.dom(indicator);
    this._resultsList = $.dom(resultsList);
}
cssTest.views.results.prototype = {
    indicate: function(number){
        this._indicator.html(number);
        return this;
    },
    display: function(results){
        var resultsHtml = "";
        this._pass();
        results.each(function(result){
            resultsHtml += '<div class="cssTest-result-label"><div>' + result.name() + "</div>";
            resultsHtml += result.html();
            resultsHtml += "</div>";
            if(result.isFail()) this._fail();
        }, this);
        this._resultsList.html(resultsHtml);
        return this;
    },
    clear: function(){
        this._resultsList.html("");
        return this;
    },
    _pass: function(){
        this._indicator.removeClass("fail");
        this._indicator.addClass("pass");
    },
    _fail: function(){
        this._indicator.removeClass("pass");
        this._indicator.addClass("fail");
    }
}
$.ext(cssTest.views.results, $.Class);
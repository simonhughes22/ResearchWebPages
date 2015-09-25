(function ($) {
	AjaxSolr.RecommenderWidget = AjaxSolr.AbstractWidget.extend({
		afterRequest: function () {
            
          var docs = this.manager.response.response.docs;
		  this.viewModel.recommendations(map(mapData, docs));
          if(this.manager.response.interestingTerms){
              var arr = this.manager.response.interestingTerms;
              var it = [];
              for(var i = 0; i<arr.length; i+=2){
                  var term = arr[i];
                  var value = arr[i+1];
                  it.push({
                    term: term,
                    value: value
                  });
              }
              this.viewModel.interestingTerms(it);
          }
          this.callBack();
		}
	});
})(jQuery);
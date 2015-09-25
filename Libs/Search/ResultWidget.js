(function ($) {
	AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
	
		afterRequest: function () {
          var docs = this.manager.response.response.docs;
          var mapped = map(mapData, docs);
		  this.viewModel.documents(mapped);      
		  this.viewModel.numFound(this.manager.response.response.numFound);
          this.callBack();
		},
	});
})(jQuery);
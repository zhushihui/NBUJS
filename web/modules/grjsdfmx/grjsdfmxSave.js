define(function(require, exports, module) {
    var utils = require('utils');
    var bs = require('./grjsdfmxBS');

    var viewConfig = {
        initialize: function() {
        	var mode = WIS_EMAP_SERV.getModel(bs.api.pageModel, 'NBU_JS_COMPETITION_WIN_INFO_QUERY', 'form');
            $("#emapForm").emapForm({
                data: mode,
                model: 'h'
            });
            
            this.eventMap = {
                '[data-action=save]': this.save
            };
        },
        save: function(){
        	if( $("#emapForm").emapValidate('validate') ){
        		var formData = $("#emapForm").emapForm("getValue");
        		bs.save(formData).done(function(data){
    				alert("数据保存成功");
    				$('#emapdatatable').emapdatatable('reload');
    				$.bhPaperPileDialog.hide();//关闭当前弹窗
    			});
        	}
        }

    };
    return viewConfig;
});
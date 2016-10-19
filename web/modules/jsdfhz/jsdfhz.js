define(function(require, exports, module) {

	var utils = require('utils');
	var bs = require('./jsdfhzBS');
	var jsdfhzSave = require('./jsdfhzSave');
	var jsdfhzView = require('./jsdfhzView');

	var viewConfig = {
		initialize: function() {
			var view = utils.loadCompiledPage('jsdfhz');
            this.$rootElement.html(view.render({}), true);
            this.pushSubView([jsdfhzSave]);
            this.initView();

			this.eventMap = {
				"[data-action=add]": this.actionAdd,
				"[data-action=edit]": this.actionEdit,
				"[data-action=detail]": this.actionDetail,
				"[data-action=delete]": this.actionDelete,
				"[data-action=export]": this.actionExport,
				"[data-action=import]": this.actionImport,
				"[data-action=custom-column]": this.actionCustomColumn
			};
		},

		initView: function() {
            this._initAdvanceQuery();
            this._initTable();
        },

        actionAdd: function(){
        	var jsdfhzNewTpl = utils.loadCompiledPage('jsdfhzSave');
        	$.bhPaperPileDialog.show({
        		content: jsdfhzNewTpl.render({}),
        		title: "新建",
        		ready: function($header, $body, $footer){
        			jsdfhzSave.initialize();
            	}
            });
        },
        
 	   actionEdit: function(e){
        	var id = $(e.target).attr("data-x-wid");
        	var jsdfhzEditTpl = utils.loadCompiledPage('jsdfhzSave');
        	var data = WIS_EMAP_SERV.getData(bs.api.pageModel, 'jsdfhz', {CWSID:id});
        	
        	$.bhPaperPileDialog.show({
        		content: jsdfhzEditTpl.render({}),
        		title: "编辑",
        		ready: function($header, $body, $footer){
        			jsdfhzSave.initialize();
        			
        			$("#emapForm").emapForm("setValue", data.rows[0]);
        			
            	}
            });
        },
        
        actionDetail: function(e){
        	var id = $(e.target).attr("data-x-wid");
        	var jsdfhzViewTpl = utils.loadCompiledPage('jsdfhzSave');
        	var data = WIS_EMAP_SERV.getData(bs.api.pageModel, 'jsdfhz', {CWSID:id});
        	
        	$.bhPaperPileDialog.show({
        		content: jsdfhzViewTpl.render({}),
        		title: "查看",
        		ready: function($header, $body, $footer){
        			jsdfhzView.initialize(data.rows[0]);
            	}
            });
        },
        
        actionDelete: function(){
    		var row = $("#emapdatatable").emapdatatable("checkedRecords");
    		if(row.length > 0){
    			var params = row.map(function(el){
    				return {CWSID:el.CWSID, XXX:el.XXX};	//模型主键
    			});
    			bs.del(params).done(function(data){
    				alert("数据删除成功");
    				$('#emapdatatable').emapdatatable('reload');
    			});
    		}
        },
        
        actionExport: function(){
        	bs.exportData({}).done(function(data){
        	});
        },

		actionImport: function(){
        	$.emapImport({
	        	"contextPath": contextPath,
	        	"app": "nbujs",
	        	"module": "modules",
	        	"page": "jsdfhz",
	        	"action": "jsdfhz",
	        	//"tplUrl": "modules/htgl/dataModel.T_JZG_HT.xls",
	        	"preCallback": function() {
	        	},
	        	"closeCallback": function() {
	        		$('#emapdatatable').emapdatatable('reload');
	        	},
	    	});
        },
        
        actionCustomColumn: function(){
        	$('#emapdatatable').emapdatatable('selectToShowColumns');
        },
        
		_initAdvanceQuery: function() {
            var searchData = WIS_EMAP_SERV.getModel(bs.api.pageModel, 'jsdfhz', "search");
            var $query = $('#emapAdvancedQuery').emapAdvancedQuery({
                data: searchData,
                contextPath : contextPath,
                schema: true
            });
            $query.on('search', this._searchCallback);
        },

        _searchCallback: function(e, data, opts) {
            $('#emapdatatable').emapdatatable('reload', {
                querySetting: data
            });
        },

        _initTable: function() {
            var tableOptions = {
                pagePath: bs.api.pageModel,
                action: 'jsdfhz',
                height:null,
                customColumns: [{
                    colIndex: '0',
                    type: 'checkbox'
                }, {
//                    colIndex: '1',
//                    type: 'tpl',
                    column: {
                        text: '操作',
                        align: 'center',
                        cellsAlign: 'center',
                        cellsRenderer: function(row, column, value, rowData) {
                            return '<a href="javascript:void(0)" data-action="detail" data-x-wid=' + rowData.WID + '>' + '详情' + '</a>'+ 
                            ' | <a href="javascript:void(0)" data-action="edit" data-x-wid=' + rowData.WID + '>' + '编辑' + '</a>';
                        }
                    }
                }]
            };
            $('#emapdatatable').emapdatatable(tableOptions);
        }
	};

	return viewConfig;
});
define(function(require, exports, module) {

	var utils = require('utils');
	var bs = require('./grjsdfmxBS');
	var grjsdfmxSave = require('./grjsdfmxSave');
	var grjsdfmxView = require('./grjsdfmxView');

	var viewConfig = {
		initialize: function() {
			var view = utils.loadCompiledPage('grjsdfmx');
            this.$rootElement.html(view.render({}), true);
            this.pushSubView([grjsdfmxSave]);
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
        	var grjsdfmxNewTpl = utils.loadCompiledPage('grjsdfmxSave');
        	$.bhPaperPileDialog.show({
        		content: grjsdfmxNewTpl.render({}),
        		title: "新建",
        		ready: function($header, $body, $footer){
        			grjsdfmxSave.initialize();
            	}
            });
        },
        
 	   actionEdit: function(e){
        	var id = $(e.target).attr("data-x-wid");
        	var grjsdfmxEditTpl = utils.loadCompiledPage('grjsdfmxSave');
        	var data = WIS_EMAP_SERV.getData(bs.api.pageModel, 'NBU_JS_COMPETITION_WIN_INFO_QUERY', {CWSID:id});
        	
        	$.bhPaperPileDialog.show({
        		content: grjsdfmxEditTpl.render({}),
        		title: "编辑",
        		ready: function($header, $body, $footer){
        			grjsdfmxSave.initialize();
        			
        			$("#emapForm").emapForm("setValue", data.rows[0]);
        			
            	}
            });
        },
        
        actionDetail: function(e){
        	var id = $(e.target).attr("data-x-wid");
        	var grjsdfmxViewTpl = utils.loadCompiledPage('grjsdfmxSave');
        	var data = WIS_EMAP_SERV.getData(bs.api.pageModel, 'NBU_JS_COMPETITION_WIN_INFO_QUERY', {CWSID:id});
        	
        	$.bhPaperPileDialog.show({
        		content: grjsdfmxViewTpl.render({}),
        		title: "查看",
        		ready: function($header, $body, $footer){
        			grjsdfmxView.initialize(data.rows[0]);
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
	        	"page": "grjsdfmx",
	        	"action": "NBU_JS_COMPETITION_WIN_INFO_QUERY",
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
            var searchData = WIS_EMAP_SERV.getModel(bs.api.pageModel, 'NBU_JS_COMPETITION_WIN_INFO_QUERY', "search");
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
                action: 'NBU_JS_COMPETITION_WIN_INFO_QUERY',
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
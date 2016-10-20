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
        		//数据整合成list集合
        		var resultListData = this.changeData(formData);
        		//在list集合内计算获奖得分
        		resultListData = this.getScore(resultListData);
        		BH_UTILS.bhDialogSuccess({
                    title:'操作提示',
                    content:'是否进行保存操作',
                    buttons:[{text:'确认',className:'bh-btn-success',callback:function(){
                		//for循环调用保存方法保存数据
                		var isSave = false; 
                		for (var i=0;i<resultListData.length;i++){
                			bs.save(resultListData[i]).done(function(data){
                				if(data.code == "0"){//保存成功
                					isSave = true; 
                				}else{//保存失败
                					isSave = false; 
                				}
                			});
                		}
                		//显示操作结果
                		if(isSave){
                			BH_UTILS.bhDialogSuccess({
                                title:'操作提示',
                                content:'保存成功',
                                callback:function(){
                                }
                            });
        					$('#emapdatatable').emapdatatable('reload');
        					$.bhPaperPileDialog.hide();//关闭当前弹窗
                		}else{
                			BH_UTILS.bhDialogDanger({
                                title:'操作提示',
                                content:'保存失败',
                                buttons:[{text:'确认',className:'bh-btn-warning',callback:function(){}}]
                            });
                		}
                    }},{text:'取消',className:'bh-btn-warning',callback:function(){                        	
                    }}]
                });
        	}
        },
      //数据整合成list集合
        changeData :function (mapData){
        	var sidlist= mapData.STULIST.split(",");//学生SID,专业，学院
        	var xsmclist = mapData.STULIST_DISPLAY.split(",");//学生名称，学号
        	//团队人员
        	var stuListString="";
        	for (var i=0;i<xsmclist.length;i++){
        		var xsmcArray = xsmclist[i].split("-");
        		stuListString=stuListString+xsmcArray[0]+"、";
        	}
        	stuListString = stuListString.substr(0, stuListString.length-1); 
        	var listData =[];
        	for (var i=0;i<sidlist.length;i++){
        		var sidArray = sidlist[i].split("-");
        		var xsmcArray = xsmclist[i].split("-");
        		var oneVO = {'JSMC':mapData.JSMC,
        				'JSLB':mapData.JSLB_DISPLAY,
        				'JSJB':mapData.JSJB_DISPLAY,
        				'JS_DATE':mapData.JS_DATE,
        				'JSJX':mapData.JSJX_DISPLAY,
        				'XSID':sidArray[0],
        				'XSXM':xsmcArray[0],
        				'ZYMC':sidArray[1],
        				'XYMC':sidArray[2],
        				'STULIST':stuListString,
        				'ZDLSMC':mapData.ZDLSMC,
        				'SCORE':0
        				};
        		//是否团队第一人
        		if(i == 0){//是
        			oneVO['ISLEADER'] = "Y";
        		}else{//否
        			oneVO['ISLEADER'] = "N";
        		}
        		listData.push(oneVO);
        	}
        	return listData;
        },
        //在list集合内计算获奖得分
        getScore : function (listData){
        	var number =listData[0].STULIST.split("、").length;//团队人数
        	for (var i=0;i<listData.length;i++){
        		var oneVO = listData[i];
        		if(oneVO.JSJX =="一等奖" || oneVO.JSJX =="金奖" || oneVO.JSJX =="特等奖"){
        			if(oneVO.JSJB == "国家"){
        				if(oneVO.ISLEADER == "Y"){
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=3;
        					}else{
        						oneVO.SCORE=1.2;
        					}
        				}else{
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=2/(number-1);
        					}else{
        						oneVO.SCORE=0.8/(number-1);
        					}
        				}
        			}else{
        				if(oneVO.ISLEADER == "Y"){
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=1.8;
        					}else{
        						oneVO.SCORE=0.6;
        					}
        				}else{
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=1.2/(number-1);
        					}else{
        						oneVO.SCORE=0.4/(number-1);
        					}
        				}
        			}
        		}else if(oneVO.JSJX =="二等奖" || oneVO.JSJX =="银奖"){
        			if(oneVO.JSJB == "国家"){
        				if(oneVO.ISLEADER == "Y"){
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=1.8;
        					}else{
        						oneVO.SCORE=0.72;
        					}
        				}else{
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=1.2/(number-1);
        					}else{
        						oneVO.SCORE=0.48/(number-1);
        					}
        				}
        			}else{
        				if(oneVO.ISLEADER == "Y"){
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=1.08;
        					}else{
        						oneVO.SCORE=0.36;
        					}
        				}else{
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=0.72/(number-1);
        					}else{
        						oneVO.SCORE=0.24/(number-1);
        					}
        				}
        			}
        		}else if(oneVO.JSJX =="三等奖" || oneVO.JSJX =="铜奖" || oneVO.JSJX =="荣誉奖"|| (oneVO.JSJX.indexOf("Honorable")!=-1)){
        			if(oneVO.JSJB == "国家"){
        				if(oneVO.ISLEADER == "Y"){
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=1.2;
        					}else{
        						oneVO.SCORE=0.48;
        					}
        				}else{
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=0.8/(number-1);
        					}else{
        						oneVO.SCORE=0.32/(number-1);
        					}
        				}
        			}else{
        				if(oneVO.ISLEADER == "Y"){
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=0.72;
        					}else{
        						oneVO.SCORE=0.24;
        					}
        				}else{
        					if(oneVO.JSLB == "A"){
        						oneVO.SCORE=0.48/(number-1);
        					}else{
        						oneVO.SCORE=0.16/(number-1);
        					}
        				}
        			}
        		}
        	}
        	return listData;
        }
        

    };
    return viewConfig;
});
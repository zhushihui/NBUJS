define(function(require, exports, module) {

	var config = {

		/*
			业务线开发模式，转测时置false
		 */
		"DEBUG_MODE": true,

		/*
			资源服务器地址
		 */
		"RESOURCE_SERVER": "http://res.wisedu.com",

		/*
		 * 主题 blue purple
		 */
		"THEME": "purple",

		/*
			服务器端生成配置API(API_BASE_PATH目录下)
			@example "/config.do" ./mock/serverconfig.json
		 */
		"SERVER_CONFIG_API": "",

		/*
			APP默认路由
		 */
		'APP_ENTRY': "",

		/*
		 	APP标题
		 */
		"APP_TITLE": "宁波大学学生竞赛系统",

		/*
			应用底部说明文本
		 */
		"FOOTER_TEXT": "",

		/*
			需要展示的模块
		 */
		"MODULES": [
		 {            title:"个人竞赛得分明细",            route:"grjsdfmx"         }         ,{            title:"竞赛得分汇总",            route:"jsdfhz"         }         //placeHolder_module
		],

		/*
			头部配置
		 */
		"HEADER": {
			"dropMenu": [{
				"text": "角色1",
				"active": true
			}],
			"logo": "./public/images/logo.png",
			"icons": ["icon-apps"],
			"userImage": "./public/images/user.png",
			"userInfo": {
				"image": "./public/images/user.png",
				"info": [
					"工号",
					"姓名 性别",
					"学校 部门",
					"邮箱",
					"电话"
				],
				"logoutHref": "javascript:void(0);"
			}
		}
	};

	return config;

});
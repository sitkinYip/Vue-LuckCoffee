export const shop = {
	namespaced: true,
	state: {
		//轮播图
		banner: [],
		//首页左边tab选项卡
		leftab: [],
		//首页商品展示
		shops: [],
		//商品详情信息
		details: [],
		//商品详情界面的计步器
		count: 1,
		//详情页规格信息
		spe:[]

	},
	getters: {

	},
	mutations: {
		//修改轮播图
		banmod(state, data) {
			state.banner = data

		},
		//修改tab数据
		ltabmod(state, data) {
			state.leftab = data
		},
		//修改首页商品展示
		shopsmod(state, data) {
			state.shops = data
			// console.log('data==',data)
		},
		//修改详情信息
		detailsmod(state, data) {
			// console.log(data)
			state.details = data
		},
		//修改详情页选择规格信息
		spemod(state, data) {
			let title = {
				tem: data.tem_desc,
				milk: data.milk_desc,
				sugar: data.sugar_desc,
				cream: data.cream_desc
			};
			for(let i in title){
				if(data[i]==''){
					continue;
				}
				let obj={
					text:title[i],
					r:[]
				}
				let rdata=data[i].split('/')
				for(let j=0;j<rdata.length;j++){
					let obj1={
						text:rdata[j],
						is:j==0
					}
					obj.r.push(obj1);
					
				}
				state.spe.push(obj)
			}
			// console.log(state.spe)
		},
		//进入前清空规格数据，不这么做会出现再点进去内容重复
		cleanspe(state){
			state.spe=[]
		}
	},
	actions: {},
	modules: {}
}

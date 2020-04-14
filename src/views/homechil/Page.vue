<!-- //首页 -->
<template>
	<div class="box">
		<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
			<van-swipe-item v-for="(item, index) in imgurl" :key="index">
				<img :src="item.bannerImg" alt="" />
				</van-swipe-item>
		</van-swipe>
		<div class="buy">
			<!-- 左边tab选项卡 -->
			<!-- <img src="../../assets/img/com/nt.jpg" alt=""> -->
			<van-sidebar v-model="activeKey" class="lnav">
				<van-sidebar-item  class="h"
				 v-for='(item,index) in ltab' :key='index' :title="item.typeDesc" @click='swit(item.type,index)' />
				
			</van-sidebar>
			<!-- 商品列表 -->
			<div class="comm">
				<van-card v-for='(i,idx) in shopdata '
				:price="i.price" 
				:desc="i.desc" 
				:title="i.name" 
				:thumb="i.smallImg" 
				:key='idx' @click='onview(i.pid)'>
					<template #footer>
						<!-- <van-button size="mini" round class="add">+</van-button> -->
						<!-- <van-button size="mini">按钮</van-button> -->
					</template>
				</van-card>

				
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name:'page',
	data() {
		return {
			activeKey: 0, //记录侧边栏的index
		};
	},
	computed: {
		//轮播图数组
		imgurl() {
			return this.$store.state.shop.banner;
		},
		//tab选项卡数组
		ltab(){
			return this.$store.state.shop.leftab
		},
		//商品数据
		shopdata(){
			return this.$store.state.shop.shops
		}
	},
	methods: {
		//轮播图请求
		getbanner() {
			this.axios({
				method: 'GET',
				url: '/banner',
				params: {
					appkey: this.appkey
				}
			}).then(res => {
				if (res.data.code == 300) {
					
					this.$store.commit('shop/banmod', res.data.result);
					// console.log(this.imgurl)
				}
			});
		},
		//侧边栏请求
		getltab() {
			this.axios({
				method: 'GET',
				url: '/type',
				params: {
					appkey: this.appkey
				}
			}).then(res => {
				// console.log(res);
				if (res.data.code == 400) {
					let type = res.data.result;
					type.unshift({
						type: 'isHot',
						typeDesc: '最新推荐'
					});
					this.$store.commit('shop/ltabmod', type);
					// console.log(this.ltab)
				}
			});
		},
		//商品请求
		getshops(type,val){
			this.axios({
				method:'GET',
				url:'/typeProducts',
				params:{
					appkey:this.appkey,
					 key: type,
					 value:val
				}
			}).then(res=>{
				if(res.data.code==500){
					this.$store.commit('shop/shopsmod',res.data.result);
					// console.log(this.shopdata)
				}
				
			}).catch(err => {
						// console.log('err ==> ', err);
					})
		},
		swit(type,index){
			let t='type'
			
			if(index==0){
				t=type
				type=1
			}
			// console.log(this.getshops)
			// console.log(type,index)
			this.getshops(t,type)
		},
		onview(item){
			// console.log(item)
			this.$router.push({
				name:'Kaga',
				query:{
					item:item
				}
			})
		}
	},
	created() {
		this.getbanner();
		this.getltab();
		this.getshops('isHot',1)
	}
};
</script>

<style lang="less" scoped>
.box {
	width: 100%;
	height: 100%;
}

.my-swipe .van-swipe-item {
	color: #fff;
	font-size: 20px;
	// line-height: 150px;
	height: 230px;
	padding: 0;
	text-align: center;
	background-color: #ffffff;
	img {
		width: 100%;
		height: 230px;
	}
}

.buy {
	width: 100%;
	.lnav {
		float: left;
		position: sticky;
		left: 0;
	}
	.van-sidebar-item--select {
		border-color: #172194;
	}
	.h {
		padding: 10px;
	}
	.comm {
		width: calc(100% - 90px);
		float: right;
		padding-bottom: 55px;
		.add {
			color: white;
			background-color: #172194;
			font-size: 20px;
			font-weight: bold;
		}
	}
}
</style>

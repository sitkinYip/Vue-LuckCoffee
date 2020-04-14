<!-- //购物车 -->
<template>
	<div class="box">
		<!-- //管理 -->
		<van-cell title="">
			<!-- 使用 right-icon 插槽来自定义右侧图标 -->
			<template #right-icon>
				<div class="adm" @click="adms">{{ adm.con }}</div>
			</template>
		</van-cell>

		<!-- 商品列表 -->
		<van-list  :finished="isFinished" v-model="loading" finished-text="没有更多了" @load="onLoad">
			<div>
				<van-cell value="" is-link v-for="(item, index) in shoparr" :key="index">
					<template #title>
						<van-checkbox v-model="item.check" class="lie" @input="shopall"><van-image width="50" height="50" :src="item.small_img" /></van-checkbox>

						<span class="cname">{{ item.name }}</span> <br>
						<span class="cgg">{{ item.rule }}</span>
					</template>

					<span class="jibu price ">¥{{ item.price }}</span>
					<van-stepper v-model="item.count" disable-input class="jibu" @change="getvalue(item.count, item.sid)" />
					<!-- 使用 right-icon 插槽来自定义右侧图标 -->
					<template #right-icon></template>
				</van-cell>
			</div>
		</van-list>
		<!-- 结算 -->
		<van-submit-bar :price="t" button-text="结算" @submit="onSubmit" :disabled="fo" v-show="adm.is">
			<van-checkbox v-model="clochecked" @input="cloall">全选</van-checkbox>
		</van-submit-bar>
		<!-- 删除 -->
		<van-submit-bar :price="t" button-text="删除" @submit="ondel()" :disabled="fo" v-show="!adm.is">
			<van-checkbox v-model="clochecked" @input="cloall">全选</van-checkbox>
		</van-submit-bar>
	</div>
</template>

<script>
import { utils } from '../../untlis/utils.js';
export default {
	
	created() {
		
		this.getshopping();
	},
	data() {
		return {
			clochecked: false,
			dekchecked: false,
			value: 0,
			fo: true,
			adm: { con: '管理', is: true },
			// 懒加载控制数据
			loading: false,
			
			//总价格
			t: 0
		};
	},
	computed: {
		// 获取vuex的购物车数据
		shoparr() {
			return this.$store.state.user.shopping;
		},
		ShocartData(){
			return this.$store.state.user.shopcart;
		},
		isFinished(){
			return this.$store.state.user.isFinished;
		}
	},
	
	methods: {
		total() {
			this.t = 0;
			this.shoparr.forEach(v => {
				if (v.check) {
					this.t += v.count * v.price;
				}
			});

			this.t = this.t * 100;
		},
		//结算
		onSubmit() {
			let subarr=[]
			// console.log(this.shoparr);
			this.shoparr.forEach(v=>{
				if(v.check){
					subarr.push(v.sid)
				}
			})
			// console.log(subarr)
			this.$router.push({
				name:'Pay',
				query:{
					buy:subarr
				}
			})
		},

		cloall() {
			this.$store.commit('user/modshop', this.clochecked);
			this.fo = !this.clochecked;
			this.total();
		},
		shopall() {
			let index = 0;
			for (let i in this.shoparr) {
				if (this.shoparr[i].check) {
					this.fo = false;
					index++;
					// console.log(this.fo)
				} else {
					if (index == 0) {
						this.fo = true;
					}
					this.clochecked = false;
					// return
				}
			}
			if (index == this.shoparr.length) {
				this.clochecked = true;
			}

			this.total();
		},
		adms() {
			if (this.adm.is) {
				this.adm.con = '取消';
				this.adm.is = false;
			} else {
				this.adm.con = '管理';
				this.adm.is = true;
			}
		},
		//删除商品
		ondel() {
			this.getdelshop()
			this.$store.commit('user/delshop');
			if(this.shoparr.length==0){
				this.clochecked=false
				this.dekchecked=false
				this.adm.is=true
				this.adm.con='管理'
				this.total()
			}


		},
		//懒加载数据方法
		onLoad() {
			 setTimeout(() => {
			          
			          this.loading = false;
					// console.log(this.shoparr.length)
					// console.log(this.ShocartData.length)
			          if (this.shoparr.length >= this.ShocartData.length) {
			            //没有数据可加载
			             this.$store.commit('user/changeData', {key: 'isFinished', value: true});
			
			             return;
			          }
			         
			          this.$store.commit('user/loadShopcartData');
			          
			          
			        }, 1000)
		},

		// 获取购物车商品
		getshopping() {
			// console.log(utils.token)
			this.axios({
				method: 'GET',
				url: '/findAllShopcart',
				params: {
					appkey: this.appkey,
					tokenString: utils.token(this)
				}
			}).then(res => {
				if (res.data.code == 5000) {
					// console.log(res.data.result)
					this.$store.commit('user/datashop', res.data.result);
				} else {
					this.$toast('请登录！');
					this.$router.push({
						name: 'Logging'
					});
				}
			});
		},
		//修改监听
		getvalue(value, sid) {
			// console.log(value);
			// console.log(sid);
			this.axios({
				method: 'POST',
				url: '/modifyShopcartCount',
				data: {
					appkey: this.appkey,
					tokenString: utils.token(this),
					sid: sid,
					count:value
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res=>{
				// console.log(res)
				if(res.data.code!=6000){
					this.$toast('网络异常！');
				}
			})
		},
		//删除购物车网络请求方法
		getdelshop(){
			let sids=[]
			this.shoparr.forEach(v=>{
				if(v.check){
					sids.push(v.sid)
				}
			})
			// console.log(sids)
			this.axios({
				method:'POST',
				url:'/deleteShopcart',
				data:{
					appkey: this.appkey,
					    tokenString: utils.token(this),
					    sids:JSON.stringify(sids)
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res=>{
				// console.log(res)
			})

		}

	}
};
</script>

<style lang="less" scoped>
.box {
	position: relative;
	padding-bottom: 110px;
	.van-submit-bar {
		bottom: 50px;
	}

	.van-submit-bar__button--danger {
		border-radius: 0;
		background: #172194 !important;
	}
	.adm {
		color: #172194;
	}

	.lie {
		width: 100px;
		float: left;
	}

	.cname {
		font-size: 12px;
	}
	.cgg {
		font-size: 12px;
		color: #999999;
		 overflow: hidden;
		  text-overflow: ellipsis;
		  display: -webkit-box;
		  -webkit-line-clamp: 1;
		  -webkit-box-orient: vertical;
	}
	.price {
		float: left !important;
		margin-left: 20px;
		line-height: 32px;
		color: #172194;
	}

	.jibu {
		margin-top: 10px;
		float: right;
	}
}
</style>

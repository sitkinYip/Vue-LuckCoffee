<!-- 加购详情页 -->
<template>
	<div class="box">
		<!-- //图片 -->
		<div class="img"><van-image width="100%" height="100%" :src="deta.large_img" /></div>
		<!-- 详情介绍 -->
		<van-cell>
			<!-- 使用 title 插槽来自定义标题 -->
			<template #title>
				<!-- 名字 -->
				<span class="custom-title lbt">{{ deta.name }}</span>
				<!-- 收藏按钮 -->
				<span class="fr" @click="oncollect"><van-icon name="like" :color="iscoollec ? pitchc : ''" /></span>
				<!-- 糖和冷热选择 -->

				<div class="spe" v-for="(item, index) in btnarr" :key="index">
					<span>{{ item.text }}</span>
					<van-button round type="info" class="btn" v-for="(v, idx) in item.r" :color="v.is ? pitchc : unsec" :key="idx" @click="onspe(v, v.is, item.r)">
						{{ v.text }}
					</van-button>
				</div>
				<!-- <div class="spe">
					<span>糖</span>
					<van-button round type="info" class="btn" color="#999999">半糖</van-button>
					<van-button round type="info" class="btn">全糖</van-button>
				</div> -->

				<div class="brief">
					<span>商品描述</span>
					<p>{{ deta.desc }}</p>
				</div>
				<div class="num">
					<span class="mon">¥{{ deta.price * value }}</span>
					<van-stepper v-model="value" disable-input class="fr" />
				</div>
			</template>
		</van-cell>
		<van-goods-action class="jies">
			<!-- <van-goods-action-icon  /> -->
			<van-goods-action-icon icon="cart-o" text="购物车" :badge="shopval" @click='goshop'/>
			<van-goods-action-icon />
			<van-goods-action-button type="warning" text="加入购物车" color="#55aaff" @click='onshoping()' />
			<van-goods-action-button type="danger" text="立即购买" color="#172194" @click='onsub()'/>
		</van-goods-action>
	</div>
</template>

<script>
import { utils } from '../../untlis/utils.js';
export default {
	data() {
		return {
			pitchc: '#172194',
			unsec: '#999999',
			//计步器的数字
			value: 1,
			pid: this.$route.query.item,
			smallImg: '',
			shopname: '',
			price: '',
			//收藏按钮判断
			iscoollec: false,
			//cookie
			cookie: '',
			//购物车数量
			shopval:'',
			//sid购物车唯一标识
			sid:'',
			//判断是否点击立即购买
			type:''
		};
	},
	created() {
		
		this.buy=''
		let cookie = this.$cookies.get('t0') + '.' + $cookies.get('t1') + '.' + $cookies.get('t2');
		this.cookie = cookie;
		
		//查询购物车数量
		this.getshopping()
		//查询商品是否被收藏
		this.getcollect();

		this.$store.commit('shop/cleanspe');
		this.getdetails(this.pid);
		// console.log(this.deta)
	},
	methods: {
		//请求商品数据
		getdetails(pid) {
			this.axios({
				method: 'GET',
				url: '/productDetail',
				params: {
					appkey: this.appkey,
					pid: pid
				}
			}).then(res => {
				if (res.data.code == 600) {
					this.$store.commit('shop/detailsmod', res.data.result[0]);
					// console.log(res.data.result[0])
					// console.log('res=>',res.data)
					this.$store.commit('shop/spemod', res.data.result[0]);
					// console.log(res.data.result[0])
					this.smallImg = res.data.result[0].small_img;
					this.shopname = res.data.result[0].name;
					this.price = res.data.result[0].price;
					// console.log(this.price)
				}
			});
		},
		//规格切换
		onspe(data, is, i) {
			// console.log(data)

			if (is) {
				console.log('不要重复点击');
				return;
			}

			for (let key in i) {
				if (i[key].is) {
					i[key].is = false;
					break;
				}
			}

			data.is = true;
		},
		//收藏点击
		oncollect() {
			this.iscoollec = !this.iscoollec;

			if (this.iscoollec) {
				//点击收藏
				this.axios({
					method: 'POST',
					url: '/like',
					data: {
						appkey: this.appkey,
						pid: this.$route.query.item,
						smallImg: this.smallImg,
						name: this.shopname,
						price: this.price,
						tokenString: this.cookie
					},
					//在请求之前将参数序列化
					transformRequest: utils.transformRequest
				}).then(res => {
					// console.log(res);
					//未登录跳转登录
					if (res.data.code == 700) {
						this.$toast('请登录！');
						this.$router.push({
							name: 'Logging'
						});
					}
				});
			} else {
				// 取消收藏
				this.axios({
					method: 'POST',
					url: '/notlike',
					data: {
						appkey: this.appkey,
						pid: this.$route.query.item,
						tokenString: this.cookie
					},
					//在请求之前将参数序列化
					transformRequest: utils.transformRequest
				}).then(res => {
				
					// console.log(res);
				});
			}
		},
		//查询是否已被收藏
		getcollect() {
			this.axios({
				method: 'GET',
				url: '/findlike',
				params: {
					appkey: this.appkey,
					pid: this.pid,
					tokenString: this.cookie
				}
			}).then(res => {
				let arr = res.data.result;
				// console.log(res.data.result);
				for (let key in arr) {
					if (arr[key].pid == this.pid) {
						this.iscoollec = true;
						return;
					}
				}
			});
		},
		//加入购物车
		onshoping() {
			
			
			let str=[]
			let xzarr=this.btnarr
			for(let i in xzarr){
				// console.log(xzarr[i].r)
				for(let j in xzarr[i].r){
					if(xzarr[i].r[j].is){
						str.push(xzarr[i].r[j].text)
					}
				}
			}
			// console.log(str.join('/'))
			this.axios({
				method: 'POST',
				url: '/addShopcart',
				data: {
					pid: this.pid,
					count: this.value,
					rule: str.join('/'),
					appkey: this.appkey,
					tokenString: this.cookie,
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res=>{
				
				
				if (res.data.code==3000) {
					// console.log(res.data)
					if(this.type=='buy'){
						this.sid=res.data.sid
						this.$router.push({
							name:"Pay",
							query:{buy:this.sid}
						})
						return
					}
				} else{
					this.$toast('请登录！');
					this.$router.push({
						name: 'Logging'
					});
				}
				
			})
			this.shopval+=this.value
		},
		//获取购物车商品总数量
		getshopping(){
			
			this.axios({
				method: 'GET',
				url: '/shopcartCount',
				params: {
					appkey: this.appkey,
					tokenString: this.cookie,
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res=>{
				// console.log(res)
				if(res.data.code=='4000'){
					this.shopval=res.data.result
					// console.log(this.shopval)
				}
			})
			
		},
		goshop(){
			this.$router.push({
				name:'Shopping'
			})
		},
		//立即购买
		onsub(){
			this.type='buy'
			this.onshoping()
			
			
			
			
		},

		
		
	},
	computed: {
		deta() {
			return this.$store.state.shop.details;
		},
		btnarr() {
			return this.$store.state.shop.spe;
		}
		// value(){
		// 	return this.$store.state.shop.count
		// }
	}
};
</script>

<!-- //css -->
<style lang="less" scoped>
.box {
	width: 100%;
	overflow: hidden;
	position: relative;

	.lbt {
		color: #172194;
		font-size: 20px;
		// padding-bottom: 20px;
	}

	.jies {
		// bottom: 50px;
		z-index: 100000;
		// border-radius: 0;
	}
	.van-goods-action-button--last,
	.van-goods-action-button--first {
		border-radius: 0;
	}

	.brief {
		width: 100%;
		border-top: 1px solid #eeeeee;
		border-bottom: 1px solid #eeeeee;
		// background-color: #000000;
		p {
			text-indent: 2em;
			font-size: 10px;
			margin: 0;
			padding: 5px 0;
		}
	}
	.num {
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		overflow: hidden;
		padding: 5px 0;
		span {
			color: #172194;
		}
	}

	.spe {
		width: 100%;
		height: 30px;
		padding: 5px;
		// overflow: hidden;
		line-height: 30px;
		// background-color: #000000;
		&:::after {
			content: '.';
			display: block;
			height: 0;
			clear: both;
			visibility: hidden;
		}
		> span {
			float: left;
			width: 32px;
		}

		.btn {
			height: 20px;
			width: 60px;
			font-size: 12px;
			text-align: center;
			line-height: 20px;
			margin-left: 40px;
		}
	}
}

.img {
	width: 100%;
	height: 220px;
	img {
		width: 100%;
		height: 100%;
	}
}
.fr {
	float: right;
	font-size: 20px;
}
</style>

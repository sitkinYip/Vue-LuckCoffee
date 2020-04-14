<template>
	<div id="like">
		<van-nav-bar
		  title="我的收藏"
		  left-text=""
		  left-arrow
		  @click-left="onClickLeft"
		  fixed
		/>
		
		<div class="box" v-for="(item,index) in likearr" :key='index' @click="looks(item.pid)">
			<div class="img"><img :src="item.smallImg" alt="" /></div>
			<div class="img">{{item.name}}</div>
			<div class="img">
				<span class="fl">{{item.price}}</span>
				<div class="fr del" @click.stop="dellike(index,item.pid)">
					<van-icon name="delete" />
				</div>
				
			</div>
		</div>
		
	</div>
</template>

<script>
import { utils } from '../untlis/utils.js';
export default {
	created() {
		this.getlike()
	},
	computed:{
		likearr(){
			return this.$store.state.user.likearr
		}
	},
	methods: {
		//获取所有收藏
		getlike() {
			this.axios({
				method: 'GET',
				url: '/findAllLike',
				params: {
					appkey: this.appkey,
					tokenString: utils.token(this)
				}
			}).then(res=>{
				// console.log(res.data)
				if(res.data.code==2000){
					this.$store.commit('user/modelike',res.data.result)
				}else{
					this.$toast('请登录！');
					this.$router.push({
						name: 'Logging'
					});
				}
			})
		},
		//删除收藏
		dellike(i,pid){
			// 取消收藏
			this.axios({
				method: 'POST',
				url: '/notlike',
				data: {
					appkey: this.appkey,
					pid: pid,
					tokenString: utils.token(this)
				},
				//在请求之前将参数序列化
				transformRequest: utils.transformRequest
			}).then(res => {
			if(res.data.code==900){
				this.$store.commit('user/dellike',i)
			}else{
				this.$toast('网络异常！');
			}
				// console.log(res);
			});

		},
		//返回按钮
		onClickLeft(){
			this.$router.go(-1)
		},
		//商品点击
		looks(pid){
			this.$router.push({
				name:'Kaga',
				query:{
					item:pid
				}
			})
		}
		
	}
};
</script>

<style lang="less" scoped>
#like {
	padding-top: 50px;
	width: 100%;
	overflow: hidden;
	background-color: #eeeeee;
	height: calc(~'100% - 50px');
	.box {
		width: calc(~'50% - 10px');
		margin: 5px;
		background-color: #ffffff;
		padding-bottom: 5px;
		// background-color: #5555ff;
		float: left;
		overflow: hidden;
		.img {
			width: calc(~'100% - 10px');
			margin: 5px;

			img {
				width: 100%;
				height: 100%;
			}
			span {
				font-size: 16px;
				color: #172194;
			}
			.del {
				font-size: 20px;
			}
		}
	}
}

.fl {
	float: left;
}
.fr {
	float: right;
}
</style>

<template>
	<div class="box">
		<div class="top" :style="{'background-image':`url(${my.userBg})`}" @click="onbg()">
			<van-image
			  round
			  width="80px"
			  height="80px"
			  :src="my.userImg"
			  class='head'
			/>
			<div class="name">{{my.username}}</div>
			<div class="desc">{{my.desc==''?'此用户很懒，什么也没留下':my.desc}}</div>
		</div>
		<van-cell title="我的收藏" is-link to='/like'/>
		<van-cell title="个人资料" is-link to='/my'/>
		<van-cell title="地址管理" is-link to='/addres'/>
		
		<van-popup v-model="show">
			<van-uploader :after-read="afterRead" />
		</van-popup>
	</div>
	
</template>

<script>
	import { utils } from '&/utils.js';
	export default{
		created() {
			this.getmy()
		},
		data(){
			return{
				userimg:require('@/img/tx.jpg'),
				my:{
					username:'',
					userImg:'',
					userBg:'',
					desc:'',
				},
				show:false
			}
		},
		methods:{
			getmy(){
				this.axios({
					method:'GET',
					url:'/findMy',
					params:{
						appkey:this.appkey,
						tokenString: utils.token(this)
					}
				}).then(res=>{
					// console.log(res)
					if(res.data.code=='A001'){
						let data=res.data.result
						// console.log(data)
						this.my.username=data[0].nickName;
						this.my.userImg=data[0].userImg;
						this.my.userBg=data[0].userBg;
						this.my.desc=data[0].desc;
						// console.log(this.my)
					}else{
						this.$toast('请登录！');
						this.$router.push({
							name: 'Logging'
						});
					}
				})
				
			},
			onbg(){
				this.show=true
			},
			
			afterRead(file) {
			      // 此时可以自行将文件上传至服务器
			      // console.log(file);
				  let big = 1024 * 500;
				  // console.log(file.file.size);
				  // if()
				  if (file.file.size > big) {
				  	this.$toast('请上传小于500kb的图片！');
				  	return;
				  }
				  //data:image\/[A-Za-z]+;base64,
				  let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');
				  // console.log(serverBase64Img)
				  let type = file.file.type.split('/')[1];
				  // console.log(type)
				  this.getuserimg(type, serverBase64Img);
				  this.show=false
				  
			    },
				//修改背景请求方法
				getuserimg(imgType, serverBase64Img) {
					this.axios({
						method: 'POST',
						url: '/updateUserBg',
						data: {
							appkey: this.appkey,
							tokenString: utils.token(this),
							imgType,
							serverBase64Img
						},
						//在请求之前将参数序列化
						transformRequest: utils.transformRequest
					}).then(res => {
						// console.log(res)
						this.$toast(res.data.msg);
						if (res.data.code == 'I001') {
							this.getmy();
						}
					});
				},
			
			
			
		}
	}
</script>

<style lang="less" scoped>
	// @import '@/img/userbg.png';
	.top{
		width: 100%;
		height: 200px;
		// background-image: url(http://www.kangliuyong.com:10002/assets/default_bg.jpg);
		background-repeat: no-repeat;
		background-size: 100%;
		position: relative;
		.head{
			position: absolute;
			top: 50%;
			left: 20px;
			transform: translateY(-50%);
		}
		.name{
			padding: 5px 10px;
			margin-left: 5px;
			// background-color: rgba(255,255,255,.3);
			color: #fff;
			font-size: 20px;
			position: absolute;
			top: 50%;
			left: 100px;
			transform: translateY(-50%);
			// text-shadow: 0 0 24px #789654;
		}
		.desc{
			padding: 20px;
			text-align: center;
			color: #fff;
		}
	}
	
</style>

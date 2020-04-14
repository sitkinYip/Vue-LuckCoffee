<template>
	<div class="box">
		
		<van-nav-bar
		  title="提交订单"
		  left-text=""
		  left-arrow
		  @click-left="onClickLeft"
		  fixed
		/>
		
		<van-cell-group>
		  <van-cell title="选择收货地址" 
		   is-link @click='ads' v-show='isads'/>
		   <div class="addres" @click="zaddres" v-show='!isads'>
			   <div class="clearfix adcon">
				   <div class="name fl">{{adli.name}}</div>
				   <div class="num fl">{{adli.num}}</div>
				   <van-icon name="arrow" class='fr'/>
				  
			   </div>
			   <div class="xadd clearfix">
			   				   {{adli.add}}
			   </div>
			   
		   </div>
		</van-cell-group>
		<!-- 订单商品列表 -->
		<div class="comm" >
			<van-card
			v-for="(item,index) in psarr"
			:key='index'
			  :num="item.count"
			  :price="item.price"
			  :desc="item.rule"
			  :title="item.name"
			  :thumb="item.small_img"
			/>
			
			<div class="sum">
				<span class='fr'>共{{num}}件商品 合计：<b style="font-size: 20px;">{{much}}</b></span>
			</div>
		</div>
		
		<!-- 提交订单 -->
		<van-submit-bar
		  :price="much*100"
		  button-text="提交订单"
		  @submit="onSubmit"
		/>
		
		
			<van-action-sheet v-model="ad" title="选择收货地址">
			  <van-address-list
			    v-model="chosenAddressId"
			    :list="list"
			    default-tag-text="默认"
			    @add="onAdd"
			    @click-item='onsele'
			  />
			</van-action-sheet>
			
		
		
	</div>
	
</template>

<script>
	import { utils } from '../untlis/utils.js';
	export default{
		created(){
			this.psarr=[]
			this.getadd()
			let parr=[]
			// console.log(this.$route.query.buy)
			if(this.$route.query.buy instanceof Array){
				parr=this.$route.query.buy
			}else{
				parr=[this.$route.query.buy]
			}
			this.sids=parr
			this.getpay(parr)
			
		},
		data(){
			return{
				
				//控制地址选择的出现
				ad:false,
				list:[],
				chosenAddressId: '1',
				//控制选择收货地址栏的隐藏显示
				isads:true,
				//选择收货地址后页面收货信息
				adli:{name:'',num:'',add:''},
				//储存服务器返回来订单商品的数据:
				psarr:[],
				sids:[],
			}
		},
		computed:{
			much(){
				let sum=0
				this.psarr.forEach(v=>{
					sum+=v.count*v.price
				})
				// console.log(this.psarr)
				return sum
			},
			num(){
				let n=0
				this.psarr.forEach(v=>{
					n+=v.count
				})
				return n
			}
		},
		methods:{
			//返回按钮
			onClickLeft(){
				this.$router.go(-1)
			},
			//切换与显示
			ads(){
				this.ad=!this.ad
			},
			//支付页地址框
			zaddres(){
				this.ad=!this.ad
			},
			//提交订单
			onSubmit(){
				if(this.adli.name){
					this.close()
					
				}else{
					this.$toast('请选择收货地址！');
				}
				
			},
			onAdd(){
				this.$router.push({
					name:'Newadd'
				})
			},
			//选中地址时
			onsele(val){
				// console.log(val)
				this.isads=false
				this.adli.name=val.name
				this.adli.num=val.tel
				this.adli.add=val.address
				this.ad=false
			},
			//查询用户地址
			getadd(){
				this.axios({
					url:'/findAddress',
					method:'GET',
					params:{
						appkey:this.appkey,
						tokenString: utils.token(this)
					}
				}).then(res=>{
					// this.list=[]
					// console.log(res.data.result)
					if(res.data.code==20000){
						let data=res.data.result
						data.forEach(v=>{
							let obj={}
							obj.id=v.id
							obj.name=v.name
							obj.tel=v.tel
							obj.address=v.province+v.city+v.county+v.addressDetail
							obj.isDefault=v.isDefault==1
							obj.aid=v.aid
							this.list.push(obj)
							if(v.isDefault==1){
								this.chosenAddressId=v.id
							}
						})
					}
				})	  
			},
				//获取订单
				getpay(sid){
					this.axios({
						method:'GET',
						url:'/commitShopcart',
						params:{
							appkey:this.appkey,
							tokenString:utils.token(this),
							sids:JSON.stringify(sid)
						}
					}).then(res=>{
						if(res.data.code==50000){
							this.psarr=res.data.result
							// console.log(this.psarr)
						}else{
							this.$toast('请登录！');
							this.$router.push({
								name: 'Logging'
							});
						}
						// console.log(res)
					})
				},
				//立即结算
				close(){
					
					this.axios({
						method:'POST',
						url:'/pay',
						data:{
							appkey: this.appkey,
							tokenString: utils.token(this),
							sids:JSON.stringify(this.sids),
							phone:this.adli.num,
							address:this.adli.add,
							reciever:this.adli.name,
						},
						//在请求之前将参数序列化
						transformRequest: utils.transformRequest
					}).then(res=>{
						if(res.data.code==60000){
							// console.log(res.data)
							// console.log(JSON.stringify([this.sids]))
							this.$router.replace({
								name:'Order'
							})
						}
						
					})
				},
				
			
			
		}
	}
</script>

<style lang="less" scoped>
	
	.box{
		padding:70px 10px;
		.van-cell{
		color: #172194;	
		}
		.van-icon-arrow::before{
			color: #172194;	
		}
		.comm{
			overflow: hidden;
		}
		.sum{
			border-bottom: 1px #e9e9e9 solid;
			margin-bottom: 5px;
			overflow: hidden;
			padding: 10px 0;
		}
		.fr{
			float: right;
		}
		.fl{
			float: left;
		}
		
		.van-submit-bar__button--danger {
			border-radius: 0;
			background: #172194 !important;
		}
		
		/deep/.van-button--danger{
			background-color: #172194;
			border-color: #172194;
		}
		/deep/ .van-address-item .van-radio__icon--checked .van-icon{
			background-color: #172194;
			border-color: #172194;
		}
		
		.van-button--round{
			border-radius: 0;
		}
		/deep/.van-icon-edit::before{
			content: '';
		}
		/deep/.van-address-item__value{
			padding-right: 0;
		}
		.van-radio{
			padding-left: 1.17333rem;
		}
		
		.adcon{
			padding: 10px;
			font-size: 14px;
			// color: #172194;
			.num{
				padding-left: 10px;
				color: #999999;
			}
		}
		.xadd{
			padding: 5px 10px 10px;
			font-size: 14px;
			// color: #172194;
		}
		.addres{
			border: solid 1px #172194;
			// border-radius: 10px;
		}
	}
	
	.clearfix:after{
	     content:".";        
	     display:block;        
	     height:0;        
	     clear:both;        
	     visibility:hidden;        
	
	}
</style>

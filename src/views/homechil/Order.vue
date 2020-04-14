<!-- 订单 -->
<template>
	<div class="box">
		<van-tabs v-model="activeName" class='tab' @click='getclick'>
		  <van-tab title="全部" name="a" >
			  <div class="ord" v-for="(item,index) in allord" :key='index'>
			  	<div class="top">
			  		<span class="fl dark">{{item.oid}}</span>
					<van-icon name="delete" class='fr del' v-show='item.status==1?false:true' 
					@click='ondel(item.oid,item)'
					/>
			  		<span class="fr" @click="ontack(item.oid,item)">{{item.status==1?"待取":"已取"}} </span>
					
			  	</div>
			  	<van-card
				  v-for='(con,idx) in item.data'
				  :key=idx
				  :num="con.count"
				  :price="con.price"
				  :desc="con.rule"
				  :title="con.name"
				  :thumb="con.smallImg"
			  	>
			  	  
			  	  
			  	</van-card>
				<div class="foot">
					<span class="fl dark">{{item.time}}</span>
					<span class="fr">共{{item.count}}件商品，合计：<b class="size">¥{{item.total}}</b></span>
				</div>
				
			  </div>
		  </van-tab>
		  <van-tab title="待取" name="b">
			  <div class="ord" v-for="(item,index) in tomor" :key='index'>
			  	<div class="top">
			  		<span class="fl dark">{{item.oid}}</span>
			  					<van-icon name="delete" class='fr del' v-show='item.status==1?false:true'/>
			  		<span class="fr" @click="ontack(item.oid,item)">{{item.status==1?"待取":"已取"}} </span>
			  					
			  	</div>
			  	<van-card
			  				  v-for='(con,idx) in item.data'
			  				  :key=idx
			  				  :num="con.count"
			  				  :price="con.price"
			  				  :desc="con.rule"
			  				  :title="con.name"
			  				  :thumb="con.smallImg"
			  	>
			  	  
			  	  
			  	</van-card>
			  				<div class="foot">
			  					<span class="fl dark">{{item.time}}</span>
			  					<span class="fr">共{{item.count}}件商品，合计：<b class="size">¥{{item.total}}</b></span>
			  				</div>
			  				
			  </div>
		  </van-tab>
		  <van-tab title="已取" name="c">
			  <div class="ord" v-for="(item,index) in off" :key='index'>
			  	<div class="top">
			  		<span class="fl dark">{{item.oid}}</span>
			  					<van-icon name="delete" class='fr del'
								@click='ondell(item.oid,item)'
								/>
			  		<span class="fr">{{item.status==1?"待取":"已取"}} </span>
			  					
			  	</div>
			  	<van-card
			  				  v-for='(con,idx) in item.data'
			  				  :key=idx
			  				  :num="con.count"
			  				  :price="con.price"
			  				  :desc="con.rule"
			  				  :title="con.name"
			  				  :thumb="con.smallImg"
			  	>
			  	  
			  	  
			  	</van-card>
			  				<div class="foot">
			  					<span class="fl dark">{{item.time}}</span>
			  					<span class="fr">共{{item.count}}件商品，合计：<b class="size">¥{{item.total}}</b></span>
			  				</div>
			  				
			  </div>
		  </van-tab>
		</van-tabs>
		
		
	</div>
	
</template>

<script>
	import { utils } from '&/utils.js';
	export default{
		created() {
			this.getord(0)
		},
		data(){
			return{
				activeName: 'a',
				//全部数据
				allord:{},
				//待取
				tomor:{},
				//已完成
				off:{}
			}
		},
		methods:{
			//获取全部订单
			getord(i){
				this.axios({
					url:'/findOrder',
					method:'GET',
					params:{
						appkey: this.appkey,
						tokenString: utils.token(this),
						status:i,
					}
				}).then(res=>{
					// console.log(res)
					if(res.data.code==70000){
						// console.log(res.data)
						// this.allord=res.data.result
						// console.log(this.allord)
						let oobj={}
						res.data.result.forEach(v=>{
							if(oobj[v.oid]==undefined){
								let t=utils.formatDate(new Date(v.createdAt),'yyyy-MM-dd hh:mm:ss')
								oobj[v.oid]={
									oid:v.oid,
									status:v.status,
									data:[],
									count:0,
									total:0,
									time:t
								},
								res.data.result.forEach(item=>{
									if(item.oid==v.oid){
										oobj[v.oid].data.push(item)
										oobj[v.oid].count+=item.count
										oobj[v.oid].total+=item.count*item.price
									}
								})
							}
						})
						// console.log(oobj)
						this.allord=oobj
					}
					
				})
			},
			//tab切换
			getclick(){
				this.tomor={}
				this.off={}
				// this.getord(0)
				
				// console.log(this.activeName)
				for(let i in this.allord){
					if(this.allord[i].status==1){
						this.tomor[this.allord[i]]=this.allord[i]
					}
					if(this.allord[i].status==2){
						this.off[this.allord[i]]=this.allord[i]
					}
				}
				// console.log(this.tomor)
			},
			//确认收货接口
			getcf(oid){
				this.axios({
					method:'POST',
					url:'/receive',
					data:{
						appkey:this.appkey,
						tokenString:utils.token(this),
						oid,
					},
					//在请求之前将参数序列化
					transformRequest: utils.transformRequest
				}).then(res=>{
					// console.log(res)
				})
			},
			//收货点击
			ontack(oid,data){
				data.status=2
				this.$set(this.off,oid,data)
				
				this.$delete(this.tomor,data)
				this.getcf(oid)
				// console.log(this.off)
				
			},
			// 删除订单
			getdel(oid){
				this.axios({
					method:'POST',
					url:'/removeOrder',
					data:{
						appkey:this.appkey,
						tokenString:utils.token(this),
						oid,
					},
					//在请求之前将参数序列化
					transformRequest: utils.transformRequest
				}).then(res=>{
					// console.log(res)
				})
				
			},
			//删除点击事件
			ondel(oid,data){
				// this.getord(0)
				let oids=oid
				this.getdel(oid)
				this.$delete(this.off,data)
				this.$delete(this.allord,oid)
				
				// console.log(this.off)
			},
			ondell(oid,data){
				this.getdel(oid)
				// console.log(this.off)
				this.$delete(this.off,data)
				this.$delete(this.allord,oid)
				// console.log(this.off)
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.tab{
		padding-top: 5px;
	}
	.fl{
		float: left;
		padding-top: 5px;
	}
	.fr{
		float: right;
		padding-top: 5px;
	}
	.box{
		padding-bottom: 60px;
	}
	.ord{
		padding: 10px;
		.top{
			overflow: hidden;
			padding: 5px 20px;
			border-bottom: 1px solid #eeeeee;
		}
		.dark{
			color: #999999;
		}
		.size{
			font-size: 16px;
		}
	}
/deep/.van-tabs__line{
	background-color: #172194;
}
.del{
	font-size: 16px;
	padding-left: 5px;
}
.foot{
	padding-bottom: 10px;
}
	
</style>

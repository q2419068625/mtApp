<template>
  <div class="search-panel">
      <el-row class="m-header-searchbar">
          <el-col :span="3" class="left">
              <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团">
          </el-col>
          <el-col :span="15" class="center">
              <div class="wrapper">
                  <el-input @focus="focus" @blur="blur" @input="input" placeholder="搜素商家或地点" v-model="search"></el-input>
                  <button class="el-button el-button--primary"><i class="el-icon-search"></i></button>
                <dl class="hotPlace" v-if="isHotPlace">
                    <dt>热门搜索</dt>
                    <dd v-for="(item,index) in $store.state.home.hotPlace.slice(0,5)" :key="index">{{item.name}}</dd>
                </dl>
                <dl class="searchList" v-if="isSearchList">
                    <dd v-for="(item,index) in searchList" :key="index">{{item.name}}</dd>
                </dl>
              </div>
              <p class="suggset">
                  <a href="#" v-for="(item,index) in $store.state.home.hotPlace.slice(0,4)" :key="index">{{item.name}}</a>
              </p>
              <ul class="nav">
                  <li>
                      <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
                  </li>
                  <li>
                      <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
                  </li>
                  <li>
                      <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
                  </li>
                  <li>
                      <nuxt-link to="/" class="apartment">名宿/公寓</nuxt-link>
                  </li>
                  <li>
                      <nuxt-link to="/" class="business">商家入驻</nuxt-link>
                  </li>
              </ul>
          </el-col>
          <el-col :span="6" class="right">
              <ul class="security">
                  <li><i class="refund"><p class="txt">随时退</p></i></li>
                  <li><i class="single"><p class="txt">不满意免单</p></i></li>
                  <li><i class="overdue"><p class="txt">过期退</p></i></li>
              </ul>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data(){
      return{
          //搜索框内容
          search:'',
          //判断是否聚焦
          isFocus:false,
          //热门推荐
          hotPlace:[],
          //搜索推荐
          searchList:[]
      }
  },
  methods:{
      focus:function(){
          this.isFocus = true
      },
      blur:function(){
          setTimeout(() => {
              this.isFocus = false
          }, 200);
      },
      input:_.debounce(async function(){
          let self = this
          let city = self.$store.state.geo.position.city.replace('市','')
          self.isSearchList = []
          let {status,data:{top}} = await self.$axios.get('/search/top',{
              params:{
                  input:self.search,
                  city
              }
          })
          self.searchList = top.slice(0,10)
      },300)
  },
  computed:{
      isHotPlace:function(){
          return this.isFocus && !this.search.trim()
      },
      isSearchList:function(){
          return this.isFocus && this.search.trim()
      }
  }
}
</script>

<style lang="scss">
</style>
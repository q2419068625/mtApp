export default{
    dbs:'mongodb://cyh:123456@localhost:27017/blog',
    redis:{
        get host(){
            return '127.0.0.1'
        },
        get port(){
            return 6379
        }
    },
    smtp:{
        get host(){
            return 'smtp.qq.com'
        },
        get user(){
            return ''//你的邮箱号
        },
        get pass(){
            return ''//你的授权码
        },
        get code(){
            return ()=>{
                return Math.random().toString(16).slice(2,6).toUpperCase()
            }
        },
        get expire(){
            return ()=>{
                return new Date().getTime()*60*60+1000
            }
        }
    }
   
}
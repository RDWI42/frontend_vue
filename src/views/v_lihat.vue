<template>
    <div class="col-md-12">
        <div class="row" style="margin-top: 10px">
            <div class="col-md-6">
                <h4> Lihat Artikel</h4>
            </div>
        </div>
        <hr>
    </div>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-12 text-center mt-3 mb-3">
                <H4>{{ title }}</H4>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 text-center mt-3 mb-3">
                <img :src="imageUrl" alt="" class="img-fluid">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 text-center mt-3 mb-3">
                {{ content }}
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mt-4 mb-3">
                Dilihat {{ parseInt(views)+1 }} Kali
            </div>
        </div>
    </div>
    <div class="col-md-12 mt-3 mb-3 text-right">
        <button type="button" class="btn btn-danger mr-3" @click="back()">Kembali</button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            id:null,
            slug:null,
            title:'',
            content:'',
            img:'',
            views:0,
            imageUrl: null,
        }
    },
    mounted(){
        this.slug = this.$route.params.slug
        this.getDetail().then(()=>{
            this.updateViews()
        })
        
    },
    methods:{
        back (){
            this.$router.push({name:'home'})
        },
        getDetail(){
            return new Promise((resolve,reject)=>{
                this.$api.get('/artikels/'+this.slug)
                .then(response => {
                    this.title = response.data.title
                    this.content = response.data.content
                    this.img = response.data.img
                    this.views = response.data.views
                    this.id = response.data.id
                    this.imageUrl = 'http://localhost:8080/backend_CI/public/uploads/' + this.img;
                    resolve();
                })
                .catch(error => {
                    console.error(error);
                    reject()
                });
            })
        },
        updateViews(){
            let totalViews = parseInt(this.views) + 1
            const data = new FormData()
            data.append('title',this.title)
            data.append('content',this.content)
            data.append('img',this.img)
            data.append('views',totalViews)
            this.$api.post('/artikels/'+this.id, data)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
}
</script>

<style>

</style>
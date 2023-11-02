<template>
    <div class="col-md-12">
        <div class="row" style="margin-top: 10px">
            <div class="col-md-6">
                <h4>{{ slug == null ? 'Tanbah' : 'Edit' }} Data</h4>
            </div>
        </div>
        <hr>
    </div>
    <div class="col-md-12">
        <div class="form-group">
            <label>Judul</label>
            <input type="text" class="form-control" :class="{'is-invalid':alert.title}" v-model="title">
            <div class="invalid-feedback">
                {{ msg.title }}
            </div>
        </div>
        <div class="form-group">
            <label>Isi Aritkel</label>
            <textarea class="form-control" :class="{'is-invalid':alert.content}" cols="30" rows="10" v-model="content"></textarea>
            <div class="invalid-feedback">
                {{ msg.content }}
            </div>
        </div>
        <div class="form-group">
            <label>Gambar</label>
            <div class="input-group mb-3">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" accept=".jpg, .jpeg, .png"
                    @change="handleFileChange" :class="{'is-invalid':alert.img}">
                    <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                </div>
            </div>
            <img :src="imageUrl" v-if="isImageValid" alt="Preview" class="img-fluid">
            <p class="ml-3" v-if="isImageValid">{{ img }}</p>
            <div class="invalid-feedback">
                {{ msg.img }}
            </div>
        </div>
    </div>
    
    <div class="col-md-12 mt-3 mb-3 text-right">
        <button type="button" class="btn btn-danger mr-3" @click="back()">Kembali</button>
        <button type="button" class="btn btn-primary" v-if="slug == null" @click="Create()">Simpan</button>
        <button type="button" class="btn btn-primary" v-else @click="Edit()">Edit</button>
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
            file: null,
            imageUrl: null,
            alert:{
                title:false,
                content:false,
                img:false
            },
            msg:{
                title:'',
                content:'',
                img:''
            }
        }
    },
    computed: {
        isImageValid() {
            if (this.file) {
                const allowedExtensions = ["jpg", "jpeg", "png"];
                const fileExtension = this.file.name.split(".").pop().toLowerCase();
                this.img = this.file.name
                return allowedExtensions.includes(fileExtension);
            }else if(this.img != ''){
                return true
            }
            return false;
        }
    },
    mounted(){
        this.slug = this.$route.params.slug
        if(this.slug != null){
            this.getDetail()
        }
    },
    methods:{
        back (){
            this.$router.push({name:'home'})
        },
        handleFileChange(event) {
            this.file = event.target.files[0];
            this.imageUrl = URL.createObjectURL(this.file);
        },
        Create(){
            if(this.title == ''){
                this.alert.title = true;
                this.msg.title = 'Cant Be Null'
                return;
            }
            if(this.content == ''){
                this.alert.content = true;
                this.msg.content = 'Cant Be Null'
                return;
            }
            if(this.file == null){
                this.alert.img = true;
                this.msg.img = 'Please Select some pic'
                console.log(this.file)
                return;
            }
            this.uploadImage().then((namafile)=>{
                const data = new FormData()
                data.append('title',this.title)
                data.append('content',this.content)
                data.append('img',namafile)
                data.append('views',this.views)
                this.$api.post('/artikels',data)
                .then(response => {
                    alert('Data Berhasil di buat');
                    this.back()
                    console.log(response)
                })
                .catch(error => {
                    console.error(error);
                    this.alert.title = true;
                    this.msg.title = error.response.data.messages.title
                    return;
                });
            })
        },
        Edit(){
            if(this.title == ''){
                this.alert.title = true;
                this.msg.title = 'Cant Be Null'
                return;
            }
            if(this.content == ''){
                this.alert.content = true;
                this.msg.content = 'Cant Be Null'
                return;
            }
            if(this.file == null){
                const data = new FormData()
                data.append('title',this.title)
                data.append('content',this.content)
                data.append('img',this.img)
                data.append('views',this.views)
                data.append('slug',this.slug)
                this.$api.post('/artikels/'+this.id, data)
                .then(response => {
                    alert('Data Berhasil di Edit');
                    this.back()
                    console.log(response)
                })
                .catch(error => {
                    console.error(error);
                    this.alert.title = true;
                    this.msg.title = error.response.data.messages.title
                    return;
                    
                });
            }else{
                this.uploadImage().then((namafile)=>{
                    const data = new FormData()
                    data.append('title',this.title)
                    data.append('content',this.content)
                    data.append('img',namafile)
                    data.append('views',this.views)
                    data.append('slug',this.slug)
                    this.$api.post('/artikels/'+this.id, data)
                    .then(response => {
                        alert('Data Berhasil di Edit');
                        this.back()
                        console.log(response)
                    })
                    .catch(error => {
                        console.error(error);
                        this.alert.title = true;
                        this.msg.title = error.response.data.messages.title
                        return;
                    });
                })
            }
            
        },
        uploadImage() {
            return new Promise((resolve,reject)=>{
                if (this.isImageValid) {
                    const formData = new FormData();
                    formData.append('image', this.file);
                    this.$api.post('/upload-image', formData)
                    .then(response => {
                        resolve(response.data.filename)
                    })
                    .catch(error => {
                        reject()
                    });

                }
            })
        },
        getDetail(){
            this.$api.get('/artikels/'+this.slug)
                .then(response => {
                    this.title = response.data.title
                    this.content = response.data.content
                    this.img = response.data.img
                    this.views = response.data.views
                    this.id = response.data.id
                    this.imageUrl = 'http://localhost:8080/backend_CI/public/uploads/' + this.img;
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
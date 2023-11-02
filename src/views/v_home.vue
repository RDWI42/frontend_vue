<template>
    <div class="col-md-12">
        <div class="row" style="margin-top: 10px">
            <div class="col-md-6">
                <h4>List Artikel</h4>
            </div>
            <div class="col-md-6">
                <button class="btn btn-success" style="float: right; margin-right: 10px" @click="LinkTambahData()">Tambah Data</button>
            </div>
        </div>
        <hr>
    </div>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-6">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Search Data...." v-model="params.keyword">
                    <div class="input-group-append">
                        <button class="input-group-text btn btn-primary" @click="getData()">Search</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="table-responsive col-md-12">
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Judul</th>
                    <th scope="col">content</th>
                    <th scope="col">Gambar</th>
                    <th scope="col">Views</th>
                    <th scope="col">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(val,index) in items" :key="index">
                    <td>{{ params.page > 1 ? (params.take * (params.page - 1)) + index+1 : index+1 }}</td>
                    <td>{{ val.title }}</td>
                    <td>{{ val.content }}</td>
                    <td>
                        <img :src="geturlimg(val.img)" alt="Image"  class="img-fluid"/>
                    </td>
                    <td>{{ val.views }}</td>
                    <td>
                        <button class="btn btn-info" @click="LinkEditData(val.slug)">Edit</button> <br>
                        <button class="btn btn-warning" @click="LinkLihatData(val.slug)">Lihat</button> <br>
                        <button class="btn btn-danger"  @click="idDelete(val.id)"
                        data-toggle="modal" data-target="#hapus">Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-md-12">
        Total Data : {{ total }}
    </div>
    <div class="col-md-12 mt-2">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: params.page === 1 }">
                <a class="page-link" @click="goToPage(params.page - 1)" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-for="page1 in totalPages" :key="page1" :class="{ active: page1 === params.page }">
                <a class="page-link" @click="goToPage(page1)">{{ page1 }}</a>
            </li>
            <li class="page-item" :class="{ disabled: params.page === totalPages }">
                <a class="page-link" @click="goToPage(params.page + 1)" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </div>


    <div class="modal fade" id="hapus">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Hapus Data</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <input type="text" style="display: none" v-model="id_delete">
                    <h4>Apakah Anda Yakin Ingin Menghapus data ini ?</h4>
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Tidak</button>
                    <button type="button" class="btn btn-primary" @click="deleteData()" id="hapusdatabutton">Ya</button>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
export default {
    data(){
        return{
            items: [],
            total: 0,
            totalPages: 0,
            imageUrl:null,
            id_delete:null,
            params:{
                keyword: '',
                take: 5,
                page:1
            }
        }
    },
    methods:{
        goToPage(page) {
            this.params.page = page
            this.getData()
        },
        LinkTambahData(){
            this.$router.push({ name: 'tambah' })
        },
        LinkEditData(slug){
            this.$router.push({ name: 'edit', params:{slug: slug} })
        },
        LinkLihatData(slug){
            this.$router.push({ name: 'lihat', params:{slug: slug} })
        },
        getData(){
            this.$api.get('/artikels/',{params:this.params})
            .then(response => {
                this.items = response.data.data
                this.total = response.data.total
                this.totalPages = Math.ceil(this.total / this.params.take);
            })
            .catch(error => {
                console.error(error);
            });
        },
        geturlimg(img){
            return 'http://localhost:8080/backend_CI/public/uploads/' + img;
        },
        idDelete(id){
            this.id_delete = id
            console.log(this.id_delete)
        },
        deleteData(){
            this.$api.get('/deleteArtikels/'+this.id_delete)
            .then((response) => {
                this.getData()
                alert('Data Berhasil di Hapus');
                console.log("Data deleted:", response.data);
                $("#hapus").modal("hide");
            })
            .catch((error) => {
                this.getData()
                console.error("Error deleting data:", error);
                $("#hapus").modal("hide");
            });
        },
        displayImage(imageUrl) {
            this.imageUrl = imageUrl;
        },
    },
    mounted() {
        this.getData();
    }
}
</script>

<style>

</style>
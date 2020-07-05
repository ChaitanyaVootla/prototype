<template>
  <div class="home">
        <el-menu
            class="top-navbar"
            mode="horizontal"
            background-color="#0f0f0f"
            text-color="#eee"
            active-text-color="#b91d1d">
            <el-menu-item index="signIn">
                <div @click="signInClicked" v-if="!user.photoURL" class="mt-1">
                    Sign in
                </div>
                <div v-else>
                    <el-dropdown trigger="click">
                        <img :src="user.photoURL" class="user-photo"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  divided>
                                <div @click="signOutClicked">
                                    <font-awesome-icon :icon="['fas', 'sign-out-alt']"/>
                                    Sign out
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-menu-item>
        </el-menu>
        <!-- <el-row>
            <el-col :span="10">
                <ul>
                    <li v-for="video in videos" :key="video.id.S">{{video.url.S}}</li>
                </ul>
            </el-col>
            <el-col :span="10">
                <ul>
                    <li v-for="file in files" :key="file.ETag">
                        <el-button size="small" type="danger" @click="uploadFile">Delete</el-button>
                        {{file.Key}}
                    </li>
                </ul>
            </el-col>
        </el-row> -->
        <!-- <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadFile"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="info">select file</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">upload to server</el-button>
        </el-upload> -->
        <input class="upload-demo" id="s3Upload" type="file" accept="video/*"/>
        <el-button size="small" type="success" @click="uploadFile">upload to server</el-button>
        <div class="video-grid">
            <div v-for="video in files" :key="video.Key">
                <div class="video-container">
                    <video
                        :src="`https://s3-ap-southeast-1.amazonaws.com/jambalakadipamba.prototype/${video.Key}`"
                        controls loop autoplay muted/>
                    <div style="margin:1em;">
                        <span>{{video.Key.replace('prototype/', '')}}</span>
                        <el-button style="margin-left: 10px;" size="small" type="danger" @click="deleteFile(video.Key)">Delete</el-button>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
    import { signIn, firebase, signOut, db } from '../Common/firebase';
    import { getVideoById, getVideos } from '../Common/dynamodb';
    import { getFiles, uploadObject, deleteObject } from '../Common/s3';

    export default {
        name: "Home",
        data() {
            return {
                activeNavItem: '',
                videoUrl: '',
                videos: [],
                files: [],
            }
        },
        async created() {
            this.loadData();
        },
        methods: {
            async loadData() {
                const videos = await getVideos();
                this.videos = videos;

                const filesRes = await getFiles();
                this.files = filesRes?.Contents || [];
                this.files = this.files.filter(file => file.Key.split('/')[1].length);
            },
            async uploadFile() {
                const files = document.getElementById('s3Upload').files;
                const file = files[0];
                const res = await uploadObject(file);
                this.loadData();
            },
            async deleteFile(key) {
                const res = await deleteObject(key);
                this.loadData();
            },
            signInClicked() {
                signIn();
            },
            signOutClicked() {
                signOut();
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        }
    };
</script>

<style lang="less" scoped>
    .user-photo {
        height: 2em;
        width: auto;
        border-radius: 100%;
    }
    .video-grid {
        display: flex;
        flex-direction: row;
        padding: 1em;
        flex-wrap: wrap;
    }
    .s3-files {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1em;
    }
    .s3-file {
        padding: 0.5em;
    }
    .upload-demo {
        margin: 2em;
    }
    .video-container {
        display: flex;
        flex-direction: column;
        padding: 1em;
        width: 500px;
    }
    video {
        width: 500px;
        height: 250px;
        object-fit: contain;
    }
</style>